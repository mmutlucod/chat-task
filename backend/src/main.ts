import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsJwtGuard } from './chat/wsJwtGuard';

class CustomIoAdapter extends IoAdapter {
  private readonly logger = new Logger('CustomIoAdapter');
  private readonly guard: WsJwtGuard;

  constructor(app: any, guard: WsJwtGuard) {
    super(app);
    this.guard = guard;
  }

  createIOServer(port: number, options?: any) {
    this.logger.debug('WebSocket sunucusu oluşturuluyor');

    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      allowEIO3: true,
      transports: ['websocket']
    });

    server.use(async (socket, next) => {
      try {
        this.logger.debug('Socket middleware başlatıldı');
        const context = {
          switchToWs: () => ({
            getClient: () => socket,
          }),
        };

        const canActivate = await this.guard.canActivate(context);
        if (!canActivate) {
          this.logger.error('Authentication başarısız');
          return next(new Error('Authentication failed'));
        }

        this.logger.debug('Authentication başarılı');
        next();
      } catch (err) {
        this.logger.error('Socket middleware hatası:', err);
        next(new Error('Authentication failed'));
      }
    });

    this.logger.debug('WebSocket sunucusu başarıyla oluşturuldu');
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  const logger = new Logger('Bootstrap');

  // CORS ayarları
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // WsJwtGuard instance'ı oluştur
  const wsJwtGuard = app.get(WsJwtGuard);

  // WebSocket adaptörü
  const ioAdapter = new CustomIoAdapter(app, wsJwtGuard);
  app.useWebSocketAdapter(ioAdapter);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  logger.log(`HTTP Sunucusu çalışıyor - Port: 3000`);
  logger.log(`Uygulama adresi: ${await app.getUrl()}`);
}

bootstrap();