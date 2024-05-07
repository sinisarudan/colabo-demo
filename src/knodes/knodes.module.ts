import { Module } from '@nestjs/common';
import { KnodesService } from './knodes.service';
import { KnodesController } from './knodes.controller';
import { DataServicesModule } from 'src/common/services';
// import { IDataServices } from 'src/common/abstracts';

@Module({
  imports: [DataServicesModule.register()],
  controllers: [KnodesController],
  providers: [KnodesService],
  // providers: [KnodesService, IDataServices],
  exports: [KnodesService],
})
export class KnodesModule {}
