import {
    ConnectedSocket,
    MessageBody,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { SOCKET_EVENT } from '../constants/socket.constant';
  import { JoinChatRoomDto } from './dto/join-chat-room.dto';
  import { SocketUser } from 'src/utils/decorators/socket-user.decorator';
  import { ISocket, TSocketUser } from 'src/types/socket.type';
  import { ForbiddenException, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
  import { SocketID } from 'src/utils/decorators/socket-id.decorator';
  import { ChatRoomsService } from './chat-rooms.service';
  import { Server } from 'socket.io';
  import { NewMessageChatRoomDto } from './dto/new-message-chat-room.dto';
  import { DeleteMessageChatRoomDto } from './dto/delete-message-chat-room.dto';
  import { AddReactionDto } from './dto/add-reaction.dto';

  
  @WebSocketGateway({ cors: true })
  export class ChatRoomsGateway implements OnGatewayInit {
    private readonly logger = new Logger(ChatRoomsGateway.name);
  
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly chatRoomsService: ChatRoomsService) {}
  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    afterInit(server: Server) {
      this.logger.log(`${ChatRoomsGateway.name} initialized`);
    }
  
    @UsePipes(new ValidationPipe())
    @SubscribeMessage(SOCKET_EVENT.JOIN_CHAT_ROOM)
    async handleJoinChatRoom(
      @ConnectedSocket() client: ISocket,
      @SocketID() socketId: string,
      @SocketUser() user: TSocketUser,
      @MessageBody() dto: JoinChatRoomDto,
    ) {
      const { _id: userId, name: userName } = user;
      const { chatRoomId } = dto;
  
      const isAlreadyJoined = await this.chatRoomsService.isUserParticipatedInChatRoom({
        chatRoomId,
        userId,
      });
  
      if (isAlreadyJoined) {
        this.logger.warn(`User ${userName} already joined chat room ${chatRoomId}`);
        return;
      }
  
      await this.chatRoomsService.addParticipantToChatRoom({ chatRoomId, userId });
  
      const event = SOCKET_EVENT.JOINED_CHAT_ROOM;
      const payload = { chatRoomId, user };
  
      this.server.emit(event, payload);
      this.logger.log({ emit: event, payload });
    }
  

    @UsePipes(new ValidationPipe())
    @SubscribeMessage(SOCKET_EVENT.ADD_REACTION)
    async handleAddReaction(
      @ConnectedSocket() client: ISocket,
      @SocketID() socketId: string,
      @SocketUser() user: TSocketUser,
      @MessageBody() dto: AddReactionDto 
    ) {
      const { chatRoomId, chatId, reactionType } = dto;
  
      // Add reaction to the database
      await this.chatRoomsService.addReactionToChat({
        chatRoomId,
        chatId,
        userId: user._id.toString(), // Convert ObjectId to string
        reactionType,
      });
    
      // Retrieve updated reaction counts
      const reactionsCount = await this.chatRoomsService.getReactionsCount(chatId);
  
      console.log({ reactionsCount });
    
      const event = SOCKET_EVENT.REACTION_UPDATED;
      const payload = { chatRoomId, chatId, reactions: reactionsCount };
    
      // Emit updated reactions count to all clients in the chat room
      this.server.to(chatRoomId).emit(event, payload);
      this.logger.log(`Reaction added and broadcasted in room ${chatRoomId}`);
    }


    @UsePipes(new ValidationPipe())
    @SubscribeMessage(SOCKET_EVENT.NEW_MESSAGE_CHAT_ROOM)
    async handleNewMessage(
      @ConnectedSocket() client: ISocket,
      @SocketID() socketId: string,
      @SocketUser() user: TSocketUser,
      @MessageBody() dto: NewMessageChatRoomDto,
    ) {
      // console.log({ socketId, user, dto });
  
      const { _id: userId, name: userName } = user;
      const { chatRoomId, message } = dto;
  
      const isParticipant = await this.chatRoomsService.isUserParticipatedInChatRoom({
        chatRoomId,
        userId,
      });
  
      if (!isParticipant) {
        throw new ForbiddenException(`User ${userName} not participant chat room ${chatRoomId}`);
      }
  
      const chat = await this.chatRoomsService.addChatToChatRoom({ chatRoomId, userId, message });
  
      const event = SOCKET_EVENT.BROADCAST_NEW_MESSAGE_CHAT_ROOM;
      const payload = { chatRoomId, chat };
  
      this.server.emit(event, payload);
      this.logger.log({ emit: event, payload });
    }
  
    @UsePipes(new ValidationPipe())
    @SubscribeMessage(SOCKET_EVENT.DELETE_MESSAGE_CHAT_ROOM)
    async handleDeleteMessage(
      @ConnectedSocket() client: ISocket,
      @SocketID() socketId: string,
      @SocketUser() user: TSocketUser,
      @MessageBody() dto: DeleteMessageChatRoomDto,
    ) {
      const { _id: userId, name: userName } = user;
      const { chatRoomId, chatId } = dto;
  
      const isChatBelongsToUser = await this.chatRoomsService.isChatBelongsToUser({ chatId, userId });
  
      if (!isChatBelongsToUser) {
        throw new ForbiddenException(`This chat not belongs to user ${userName}`);
      }
  
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const deletedChat = await this.chatRoomsService.deleteChat(chatId);
  
      // console.log({ deletedChat });
  
      const event = SOCKET_EVENT.DELETED_MESSAGE_CHAT_ROOM;
      const payload = { chatRoomId, chatId };
  
      this.server.emit(event, payload);
      this.logger.log({ emit: event, payload });
    }
  }
  