import { CanActivate, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../auth/userModel';
import { Observable } from 'rxjs';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);
  private readonly JWT_SECRET = 'your-secret-key';

  constructor(
    private jwtService: JwtService,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  canActivate(
    context: any,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient();
    return this.validateToken(client);
  }

  private async validateToken(client: Socket): Promise<boolean> {
    try {
      this.logger.debug('=== TOKEN DOĞRULAMA BAŞLIYOR ===');
      
      const token = this.extractToken(client);
      
      // Token içeriğini logla
      this.logger.debug('Raw token:', token);
      
      if (!token) {
        throw new WsException('Token bulunamadı');
      }

      try {
        // Token decode edilmeye çalışılıyor
        const decoded = this.jwtService.decode(token);
        this.logger.debug('Decoded token:', decoded);

        // Token verify ediliyor
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.JWT_SECRET
        });
        
        this.logger.debug('Verified payload:', payload);

        const user = await this.userModel.findByPk(payload.sub);
        if (!user) {
          throw new WsException('Kullanıcı bulunamadı');
        }

        // Kullanıcı bilgileri socket.data'ya ekleniyor
        client.data = {
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        };

        return true;

      } catch (jwtError) {
        this.logger.error('JWT doğrulama detaylı hata:', {
          message: jwtError.message,
          name: jwtError.name,
          token: token.substring(0, 20) + '...' // Token'ın bir kısmını logla
        });
        throw new WsException('Token geçersiz');
      }

    } catch (error) {
      this.logger.error('Genel hata:', error);
      throw new WsException(error.message);
    }
  }

  private extractToken(client: Socket): string | undefined {
    this.logger.debug('Token extraction started');
    this.logger.debug('Headers:', client.handshake.headers);
    this.logger.debug('Auth:', client.handshake.auth);
    this.logger.debug('Query:', client.handshake.query);

    // Query'den token kontrolü
    if (client.handshake.query && client.handshake.query.token) {
      this.logger.debug('Token found in query');
      return String(client.handshake.query.token);
    }

    // Auth token kontrolü
    if (client.handshake.auth?.token) {
      this.logger.debug('Token found in auth');
      return client.handshake.auth.token;
    }

    // Authorization header kontrolü
    const authHeader = client.handshake.headers.authorization;
    if (authHeader) {
      this.logger.debug('Token found in authorization header');
      return authHeader.includes('Bearer ')
        ? authHeader.split('Bearer ')[1]?.trim()
        : authHeader.trim();
    }

    this.logger.debug('No token found');
    return undefined;
  }
}