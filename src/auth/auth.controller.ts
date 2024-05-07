import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request as Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
// part of the no-passport auth version
// import { SignInDto } from './dto/sign-in.dto';
// import { AuthGuard, Public } from './auth.guard';
import { Request } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* `curl -X POST http://localhost:3000/global/auth/login -d '{"email": "sinisa.rudan@gmail.com", "password": "a12xyz!"}' -H "Content-Type: application/json"`
   * */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Express.Request) {
    if (req.user) {
      return this.authService.login(req.user as User);
    } else {
      throw new UnauthorizedException();
    }
  }

  /* part of the no-passport auth version
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
  */

  // we would use this `@UseGuards(JwtAuthGuard)` if we haven't made all the routes guarded in `AuthModule`
  @Get('profile')
  getProfile(@Req() req: Request) {
    // the `user` is added to the `Request` during JWT validation
    return (req as any).user;
  }
}
