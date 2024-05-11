import { ObjectId } from 'mongoose';

export class Base {
  // Auto-generated fields
  _id: ObjectId;
  __v: number;
}

export class BaseWithTimestamps extends Base {
  // Auto-generated fields when set timestamps to true
  createdAt: Date;
  updatedAt: Date;
}
