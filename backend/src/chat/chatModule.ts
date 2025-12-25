import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatGateway } from './chat-gateway';
import { Message } from './messageModel';
import { User } from '../auth/userModel';
import { UserStatusService } from './userStatusService';
import { JwtModule } from '@nestjs/jwt';
import { WsJwtGuard } from './wsJwtGuard';

@Module({
  imports: [
    SequelizeModule.forFeature([Message, User]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'your-secret-key',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [
    WsJwtGuard,
    {
      provide: 'WS_GUARD',
      useClass: WsJwtGuard,
    },
    ChatGateway,
    UserStatusService,
  ],
  exports: [ChatGateway, UserStatusService]
})
export class ChatModule {}