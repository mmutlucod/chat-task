import { Column, Model, Table, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from '../auth/userModel';

@Table({
  tableName: 'messages',
  timestamps: true
})
export class Message extends Model {
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  })
  content: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  senderId: number;

  @BelongsTo(() => User, 'senderId')
  sender: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true // null for public messages
  })
  receiverId: number;

  @BelongsTo(() => User, 'receiverId')
  receiver: User;
}