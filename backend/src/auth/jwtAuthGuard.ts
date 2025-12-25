import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    this.logger.debug(`JWT Auth denemesi - Token: ${request.headers.authorization}`);
    
    try {
      const result = super.canActivate(context);
      
      if (result instanceof Observable) {
        return result;
      }
      
      if (result instanceof Promise) {
        return result.then(value => {
          this.logger.debug('JWT doğrulama başarılı');
          return value;
        }).catch(error => {
          this.logger.error(`JWT doğrulama hatası: ${error.message}`);
          throw error;
        });
      }

      this.logger.debug('JWT doğrulama başarılı');
      return result;
      
    } catch (error) {
      this.logger.error(`JWT doğrulama hatası: ${error.message}`);
      throw error;
    }
  }
}