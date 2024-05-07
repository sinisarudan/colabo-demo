import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

/**
 * Team DTO (Data Transfer Object) for input of Create (POST) method
 */
export class CreateTeamDto {
  // `id` is not marked as `@ApiProperty` so will not be required, checked and documented (in swagger/openAPI) on input
  // but if we use `@nestjs/swagger` plugin in `nest-cli.json` (that automatically add properties to API),
  // then we have to use `@ApiHideProperty()` to explicitly exclude it
  @ApiHideProperty()
  id: string;

  @ApiProperty({
    example: 'TeamBest',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'rehmat.sayani@gmail.com',
    required: true,
    description: 'Team contact email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: false,
  })
  description: string;
}
