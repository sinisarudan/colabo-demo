import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  // UseFilters,
  ForbiddenException,
  ParseIntPipe,
  DefaultValuePipe,
  ParseBoolPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { HttpExceptionFilter } from 'src/common/errors/http-exception.filter';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users') // handling route `/users`
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(['admin', 'moderator']) // `@Roles` is a custom decorator that we built to add context (roles) to the route:
  @UseGuards(RolesGuard) // allows access or not, based on role
  // @UseFilters(HttpExceptionFilter) // `HttpExceptionFilter` will be called (and transform `response`) when an error is thrown from `create` method
  create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.id) throw new ForbiddenException('no ID allowed');
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    /* <https://docs.nestjs.com/pipes#providing-defaults>:
     * `Parse*` pipes expect a parameter's value to be defined.
     * They throw an exception upon receiving `null` or `undefined` values.
     * To allow an endpoint to handle missing querystring parameter values*, we provide a default value */
    @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe)
    activeOnly: boolean = false,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number = 0,
  ) {
    return this.usersService.findAll({ page: page, activeOnly: activeOnly });
  }

  // we could also customize the error by providing instance instead of class like this:
  // @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),)id: number,
  @ApiParam({
    name: 'id',
    example: '654f4b4b949323fa41b1a7fb',
    schema: { type: 'string' },
  })
  @Get(':id')
  // `ParseIntPipe` will throw Exception `id` is not an int, like:
  // `{"message":"Validation failed (numeric string is expected)","error":"Bad Request","statusCode":400}`
  findOne(@Param('id') id: string) {
    return this.usersService.findByEmail(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // When the client calls this endpoint, the response will be: `{ "statusCode": 403, "message": "not implemented"}`
    throw new HttpException('not implemented', HttpStatus.FORBIDDEN);
    return this.usersService.remove(id);
  }
}
