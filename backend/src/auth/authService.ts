import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './userModel';
import { RegisterDto } from './dto/register';
import { LoginDto } from './dto/login';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({
      where: {
        username: registerDto.username,
      },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userModel.create({
      ...registerDto,
      password: hashedPassword,
    });

    return this.generateToken(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await user.update({ isOnline: true });
    return this.generateToken(user);
  }

  async logout(userId: number) {
    const user = await this.userModel.findByPk(userId);
    if (user) {
      await user.update({ isOnline: false });
    }
  }

  private generateToken(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
      email: user.email,
    };
    
    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret
      }),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}
