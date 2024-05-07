import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { KnodesService } from 'src/knodes/knodes.service';
import { AuthService, JWT_EXPIRE } from './auth.service';
import { DataServicesModule } from 'src/common/services';
import { KnodesModule } from 'src/knodes/knodes.module';
import { JwtModule, JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport.local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * - more about **authentication** with **Passport** in NestJs and the approach applied here, at https://docs.nestjs.com/recipes/passport
 * - more about @nestjs/jwt at: <https://github.com/nestjs/jwt>
 *   - it is a nest version of <https://github.com/auth0/node-jsonwebtoken>
 *   - The `JwtService` uses [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) underneath.
 */

const jwtModuleOptions: JwtModuleOptions = {
  // We're registering the JwtModule as `global` to make things easier for us. This means that we don't need to import the `JwtModule` anywhere else in our application.
  global: true,
  secret: jwtConstants.secret,
  signOptions: { expiresIn: JWT_EXPIRE },
};

console.log(
  '[AuthModule] jwtModuleOptions',
  JSON.stringify(jwtModuleOptions, null, 4),
);

@Module({
  imports: [
    UsersModule,
    KnodesModule,
    DataServicesModule.register(),
    JwtModule.register(jwtModuleOptions),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    KnodesService,
    LocalStrategy,
    JwtService,
    JwtStrategy,
    {
      // instead of making each route guarded by decorating it with `@UseGuards(JwtAuthGuard)`,
      // we are registering the `JwtAuthGuard` as a global guard -> Nest will automatically bind `JwtAuthGuard` to all endpoints:
      // and then we can use `@Public()` decorator to avoid global guarding on desired routes
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
