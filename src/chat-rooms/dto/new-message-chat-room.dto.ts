import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { ValidObjectId } from 'src/utils/validators/valid-object-id';

export class NewMessageChatRoomDto {
  @IsNotEmpty()
  @IsString()
  @Validate(ValidObjectId)
  chatRoomId: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
