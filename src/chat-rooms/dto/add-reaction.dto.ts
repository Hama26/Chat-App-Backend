export class AddReactionDto {
    chatRoomId: string;
    chatId: string;
    reactionType: string; // could be 'like', 'heart', etc.
  }