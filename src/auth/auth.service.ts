import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login({ name }: LoginDto) {
    let user = await this.usersService.findOne({ name });
    if (!user) user = await this.usersService.create({ name });
    return user;
  }
}
