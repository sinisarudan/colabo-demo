import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsArray } from 'class-validator';

/**
 * User DTO (Data Transfer Object) for input of Create (POST) method
 */
export class CreateUserDto {
  // `id` is not marked as `@ApiProperty` so will not be required, checked and documented (in swagger/openAPI) on input
  // but if we use `@nestjs/swagger` plugin in `nest-cli.json` (that automatically add properties to API),
  // then we have to use `@ApiHideProperty()` to explicitly exclude it
  @ApiHideProperty()
  id: string;

  // we must decorate property with `@ApiProperty`,
  // if we want it to be checked and documented (in swagger/openAPI) on input to a controller :
  @ApiProperty({
    example: 'David',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Park',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'rehmat.sayani@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: false,
  })
  bio: string;

  // https://github.com/typestack/class-validator#validating-arrays
  //here we validate that `roles` is an array (`@IsArray()` of strings (`@IsString({ each: true })`):
  @ApiProperty({
    example: ['admin'],
    required: false,
    default: [],
  })
  @IsArray()
  @IsString({ each: true })
  roles: string[];

  @ApiProperty({
    required: false,
  })
  password: string;
}
