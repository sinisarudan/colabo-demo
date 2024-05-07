import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
/** With `@UseGuards(AuthGuard('local'))` we are using an `AuthGuard` that `@nestjs/passport` automatically provisioned for us when we extended the `passport-local` strategy.
 * Our Passport local strategy has a default name of `'local'`. We reference that name in the `@UseGuards()` decorator to associate it with code supplied by the `passport-local` package. This is used to disambiguate which strategy to invoke in case we have multiple Passport strategies in our app (each of which may provision a strategy-specific `AuthGuard`): */
export class LocalAuthGuard extends AuthGuard('local') {}
