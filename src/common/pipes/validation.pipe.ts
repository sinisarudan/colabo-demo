import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
/**
 * Example of a Demo ValidationPipe from https://docs.nestjs.com/pipes#class-validator tutorial
 * Nest's **built-in** `ValidationPipe` offers more options than this illustration of the mechanics of a custom-built pipe.
 * Check for more details and examples on [validation and `ValidationPipe`](https://docs.nestjs.com/techniques/validation).
 * @class DemoValidationPipe
 * @implements {PipeTransform<any>}
 */
@Injectable()
export class DemoValidationPipe implements PipeTransform<any> {
  // Nest supports both synchronous and asynchronous pipes. this is async because some of the class-validator validations can be async:
  // we are using shorthand destructuring to extract the `metatype` field from an `ArgumentMetadata`:
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // skipping validation of native JS types:
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // to transform our plain JS argument object into a typed object so that we can apply validation.
    // The reason we must do this is that the incoming post body object, when deserialized from the network request, does not have any type information
    // (this is the way the underlying platform, such as Express, works).
    // `Class-validator` needs to use the validation decorators we defined in our DTO earlier,
    // so we need to perform this transformation to treat the incoming body as an appropriately decorated object, not just a plain vanilla object:
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    // since this is a validation pipe it either returns the value unchanged, or throws an exception.
    return value;
  }

  /** helper function responsible for **bypassing the validation step** when the current argument being processed is a native JavaScript type
   * (these can't have validation decorators attached, so there's no reason to run them through the validation step).
   * @returns `true` if is NOT a native JS type
   * */
  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
