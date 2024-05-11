import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { Types, isValidObjectId } from 'mongoose';

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`Invalid ${metadata.data}, not an ObjectId`);
    }

    return Types.ObjectId.createFromHexString(value);
  }
}
