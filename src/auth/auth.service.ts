import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';
// old no passport auth:
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { ValidationPayload } from './auto-vos';
// import { jwtConstants } from './constants';

export const JWT_EXPIRE: string = '5m';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   *
   * returns user found by its `email` and `pass` or `null` if not found or pass not matched
   * @param {string} email
   * @param {string} pass
   * @return {*}  {(Promise<User | null>)}
   * @memberof AuthService
   */
  async validateUser(email: string, pass: string): Promise<User | null> {
    const user: User | null = await this.usersService.findByEmail(email);
    if (user && pass && user.password === pass) {
      //removing password for security reasons:
      user.password = undefined;
      return user;
    }
    return null;
  }
  
  async login(user: User) {
    const payload: ValidationPayload = {
      id: user.id as string,
      email: user.email,
    };
    //TODO: check why the `JwtModuleOptions` from `AuthModule` is lost so we have provide it again for `signAsync`
    // https://stackoverflow.com/questions/58673430/error-secretorprivatekey-must-have-a-value
    const jwtSignOptions: JwtSignOptions = {
      secret: jwtConstants.secret,
      expiresIn: JWT_EXPIRE,
    };
    const access_token: string = await this.jwtService.signAsync(
      payload,
      jwtSignOptions,
    );
    console.log('access_token', access_token);
    return {
      access_token: access_token,
    };
  }

  /** part of the no-passport auth version */
  /*
  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    console.log('[AuthService::signIn]', email, pass);
    const user: User | null = await this.usersService.findByEmail(email);
    console.log('[signIn] user', user);
    console.log('[signIn] user?.password', user?.password);
    console.log('[signIn] user.password !== pass', user?.password !== pass);
    //? TODO: use `salt` instead of password storing and comparing:
    if (!pass || !user || user.password !== pass) {
      // if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, email: user.email };
    //TODO: check why the `JwtModuleOptions` from `AuthModule` is lost so we have provide it again for `signAsync`
    // https://stackoverflow.com/questions/58673430/error-secretorprivatekey-must-have-a-value
    const jwtSignOptions: JwtSignOptions = {
      secret: jwtConstants.secret,
      expiresIn: '60s',
    };
    const access_token: string = await this.jwtService.signAsync(
      payload,
      jwtSignOptions,
    );
    console.log('access_token', access_token);
    return {
      access_token: access_token,
    };
  }
  */
}
