import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './authController';
import { AuthService } from './authService';
import { JwtStrategy } from './jwtStrategy';
import { User } from './userModel';
import { jwtConstants } from './constants';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}