import { UseGuards, Logger, Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './messageModel';
import { User } from '../auth/userModel';
import { UserStatusService } from './userStatusService';
import { MessageDto } from './dto/message';
import { WsException } from '@nestjs/websockets';
import { Op } from 'sequelize';
import { WsJwtGuard } from './wsJwtGuard';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true
  },
  namespace: '/chat',
  transports: ['websocket'],
  path: '/socket.io/',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  private readonly logger = new Logger(ChatGateway.name);
  
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject('WS_GUARD')
    private wsGuard: WsJwtGuard,
    private jwtService: JwtService,
    private userStatusService: UserStatusService,
    @InjectModel(Message)
    private messageModel: typeof Message,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway başlatıldı');
  }

  async handleConnection(client: Socket) {
    try {
      this.logger.debug('Yeni bağlantı başlatılıyor...');
      
      const canActivate = await this.wsGuard.canActivate({
        switchToWs: () => ({
          getClient: () => client,
        }),
      });

      if (!canActivate) {
        this.logger.error('Guard doğrulaması başarısız');
        client.disconnect();
        return;
      }

      const user = client.data?.user;
      if (!user) {
        this.logger.error('Kullanıcı bilgisi bulunamadı');
        throw new WsException('Unauthorized');
      }

      // Kullanıcıyı online yap ve veritabanını güncelle
      await this.userModel.update(
        { isOnline: true },
        { where: { id: user.id } }
      );
      await this.userStatusService.userConnected(user.id, client.id);
      
      // Online kullanıcıları getir
      const onlineUsers = await this.userModel.findAll({
        where: { 
          isOnline: true,
          id: { [Op.ne]: user.id } // Kendisi hariç
        },
        attributes: ['id', 'username', 'isOnline']
      });

      // Online kullanıcıları ve auth durumunu gönder
      client.emit('online_users', onlineUsers);
      client.emit('auth_status', { user });
      
      // Online durumu değişikliğini yayınla
      this.server.emit('user_status_change', {
        userId: user.id,
        isOnline: true
      });

      // Genel mesajları gönder
      const messages = await this.messageModel.findAll({
        where: { receiverId: null },
        limit: 50,
        order: [['createdAt', 'DESC']],
        include: [
          { 
            model: User, 
            as: 'sender', 
            attributes: ['username', 'id', 'isOnline'] 
          },
        ],
      });
      
      client.emit('previous_messages', messages.reverse());

    } catch (error) {
      this.logger.error('Bağlantı hatası:', error.message);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const user = client.data?.user;
      if (user) {
        await this.userModel.update(
          { isOnline: false },
          { where: { id: user.id } }
        );
        await this.userStatusService.userDisconnected(user.id);
        
        this.server.emit('user_status_change', {
          userId: user.id,
          isOnline: false
        });
      }
    } catch (error) {
      this.logger.error('Bağlantı kesme hatası:', error.message);
    }
  }

  @SubscribeMessage('get_private_messages')
  async getPrivateMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number }
  ) {
    try {
      const user = client.data.user;
      
      const messages = await this.messageModel.findAll({
        where: {
          [Op.or]: [
            { senderId: user.id, receiverId: data.userId },
            { senderId: data.userId, receiverId: user.id }
          ]
        },
        order: [['createdAt', 'ASC']],
        include: [
          { 
            model: User, 
            as: 'sender',
            attributes: ['username', 'id', 'isOnline']
          },
        ],
        limit: 50
      });

      client.emit('private_messages', {
        userId: data.userId,
        messages
      });
    } catch (error) {
      this.logger.error('Özel mesajları getirme hatası:', error.message);
      client.emit('error', { message: 'Özel mesajlar getirilemedi' });
    }
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() messageDto: MessageDto,
  ) {
    try {
      const user = client.data.user;
      
      const message = await this.messageModel.create({
        content: messageDto.content,
        senderId: user.id,
        receiverId: messageDto.receiverId,
      });

      const messageWithUser = await this.messageModel.findOne({
        where: { id: message.id },
        include: [
          { 
            model: User, 
            as: 'sender',
            attributes: ['username', 'id', 'isOnline']
          },
        ],
      });

      if (messageDto.receiverId) {
        // Özel mesaj ise sadece ilgili kullanıcılara gönder
        const recipientSocketId = await this.userStatusService.getSocketId(messageDto.receiverId); // getUserSocketId yerine getSocketId kullanıyoruz
        if (recipientSocketId) {
          this.server.to(recipientSocketId).emit('new_private_message', messageWithUser);
        }
        // Gönderen kişiye de ilet
        client.emit('new_private_message', messageWithUser);
      } else {
        // Genel mesaj ise herkese gönder
        this.server.emit('new_message', messageWithUser);
      }

    } catch (error) {
      this.logger.error('Mesaj gönderme hatası:', error.message);
      client.emit('error', { message: 'Mesaj gönderilemedi' });
    }
  }
}