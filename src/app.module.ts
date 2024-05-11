// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongoose.config-service';
import { UsersModule } from './users/users.module';
import { mongodbConfig } from './config/mongodb.config';
import { HttpLoggerMiddleware } from './utils/middlewares/http-logger.middleware';
import { AuthModule } from './auth/auth.module';
import { ChatRoomsModule } from './chat-rooms/chat-rooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, mongodbConfig],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    UsersModule,
    AuthModule,
    ChatRoomsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes('*');
  }
}
