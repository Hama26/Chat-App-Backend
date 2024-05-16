import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseWithTimestamps } from './base.schema';
import { User } from './user.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat extends BaseWithTimestamps {
  @Prop({ required: true })
  message: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop([{
    type: new mongoose.Schema({
      type: { type: String, required: true }, // Reaction type (like, heart, etc.)
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    }, { _id: false })
  }])
  reactions: {
    type: string;
    user: mongoose.Types.ObjectId;
  }[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);