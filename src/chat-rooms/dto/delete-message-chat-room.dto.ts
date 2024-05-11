import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { ValidObjectId } from 'src/utils/validators/valid-object-id';

export class DeleteMessageChatRoomDto {
  @IsNotEmpty()
  @IsString()
  @Validate(ValidObjectId)
  chatRoomId: string;

  @IsNotEmpty()
  @IsString()
  @Validate(ValidObjectId)
  chatId: string;
}
