import { Controller, Post, Body, UseGuards, Request, Logger } from '@nestjs/common';
import { AuthService } from './authService';
import { RegisterDto } from './dto/register';
import { LoginDto } from './dto/login';
import { JwtAuthGuard } from './jwtAuthGuard';

@Controller('auth')
export class AuthController {
 private readonly logger = new Logger(AuthController.name);

 constructor(private authService: AuthService) {}

 @Post('register')
 async register(@Body() registerDto: RegisterDto) {
   this.logger.log(`Registration attempt for user: ${registerDto.username}`);
   return this.authService.register(registerDto);
 }

 @Post('login')
 async login(@Body() loginDto: LoginDto) {
   this.logger.log(`Login attempt for user: ${loginDto.username}`);
   return this.authService.login(loginDto);
 }

 @UseGuards(JwtAuthGuard)
 @Post('logout')
 async logout(@Request() req) {
   this.logger.log(`Logout attempt for user: ${req.user.username}`);
   return this.authService.logout(req.user.id);
 }
}