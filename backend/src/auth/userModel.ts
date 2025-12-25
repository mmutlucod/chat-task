import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Message } from '../chat/messageModel';

@Table
export class User extends Model {
  @Column({ unique: true })
  username: string;

  @Column
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ defaultValue: false })
  isOnline: boolean;

  @HasMany(() => Message)
  messages: Message[];
}