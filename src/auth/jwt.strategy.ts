import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { ValidationPayload } from './auto-vos';

/**
 *
 * used to decide how to react on a Passport(JWT) guarded route request. If validation passes, the route will be accessed
 * @export
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      /** we are using the expedient option of supplying a symmetric secret for signing the token.
       * Other options, such as a PEM-encoded public key, may be more appropriate for production apps (see [here](https://github.com/mikenicholson/passport-jwt#configure-strategy) for more information. */
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: ValidationPayload) {
    const userToBeAddedToRequestByPassport: ValidationPayload = {
      id: payload.id,
      email: payload.email,
    };
    return userToBeAddedToRequestByPassport;
  }
}
