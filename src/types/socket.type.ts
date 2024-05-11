import { Socket } from 'socket.io';
import { User } from 'src/schemas/user.schema';

export type TSocketUser = Pick<User, '_id' | 'name'>;

export interface ISocket extends Socket {
  data: {
    user: TSocketUser;
  };
}
