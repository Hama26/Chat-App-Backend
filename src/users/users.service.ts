import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { FilterQuery, Model, ObjectId } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await new this.userModel(createUserDto).save();
  }

  async findOneById(id: string | ObjectId): Promise<User> {
    return await this.userModel.findById(id);
  }

  async findOne(filter: FilterQuery<User>): Promise<User> {
    return await this.userModel.findOne(filter);
  }
}
