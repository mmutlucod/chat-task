// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/authModule';
import { ChatModule } from './chat/chatModule';
import { User } from './auth/userModel';
import { Message } from './chat/messageModel';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),  // Düzeltilmiş satır
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'chat',
      models: [User, Message],
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    ChatModule,
  ],
})
export class AppModule {}