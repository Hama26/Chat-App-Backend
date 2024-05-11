/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { isValidObjectId } from 'mongoose';

/**
 * Validate objectId
 *
 * @see https://github.com/typestack/class-validator#custom-validation-classes
 */
@ValidatorConstraint({ name: 'validObjectId', async: false })
export class ValidObjectId implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return isValidObjectId(value);
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `Invalid \`$property\`, not an ObjectId`;
  }
}
