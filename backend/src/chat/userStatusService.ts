import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../auth/userModel';

@Injectable()
export class UserStatusService {
  private onlineUsers: Map<number, string> = new Map();

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async userConnected(userId: number, socketId: string) {
    this.onlineUsers.set(userId, socketId);
    await this.userModel.update(
      { isOnline: true },
      { where: { id: userId } }
    );
  }

  async userDisconnected(userId: number) {
    this.onlineUsers.delete(userId);
    await this.userModel.update(
      { isOnline: false },
      { where: { id: userId } }
    );
  }

  isUserOnline(userId: number): boolean {
    return this.onlineUsers.has(userId);
  }

  getOnlineUsers(): number[] {
    return Array.from(this.onlineUsers.keys());
  }

  getSocketId(userId: number): string | undefined {
    return this.onlineUsers.get(userId);
  }
}