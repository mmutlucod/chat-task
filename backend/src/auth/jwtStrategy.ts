import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './userModel';
import { InjectModel } from '@nestjs/sequelize';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    const secretKey = jwtConstants.secret || 'your-secret-key';
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretKey,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.userModel.findByPk(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Kullanıcı bulunamadı');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Token doğrulama hatası');
    }
  }
}