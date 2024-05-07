import {
  Module,
  // NestModule,
  // MiddlewareConsumer,
  // RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
// import { LoggerMiddleware } from './common/middleware/logger.middleware';
// import { UsersController } from './users/users.controller';
import { KnodesModule } from './knodes/knodes.module';
import { DataServicesModule } from './common/services';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    TeamsModule,
    KnodesModule,
    DataServicesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
/* example for using a Middleware
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // We may restrict a middleware to a particular route (`users`)
      // .forRoutes('users');
      .forRoutes(UsersController);
    // We may further restrict a middleware to a particular request method:
    //.forRoutes({ path: 'users', method: RequestMethod.GET });
  }
}
*/
