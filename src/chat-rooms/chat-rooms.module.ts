import { Module } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoomsController } from './chat-rooms.controller';

@Module({
  providers: [ChatRoomsService],
  controllers: [ChatRoomsController]
})
export class ChatRoomsModule {}
