import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * User DTO (Data Transfer Object) for input of Update (PUT) method
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
