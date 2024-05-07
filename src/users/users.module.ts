import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { KnodesService } from 'src/knodes/knodes.service';
import { KnodesModule } from 'src/knodes/knodes.module';
import { DataServicesModule } from 'src/common/services';

@Module({
  imports: [KnodesModule, DataServicesModule.register()],
  controllers: [UsersController],
  providers: [UsersService, KnodesService],
  exports: [UsersService],
})
export class UsersModule {}
