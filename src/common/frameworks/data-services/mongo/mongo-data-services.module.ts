import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDataServices } from './mongo-data-services.service';
import {
  KNode,
  KNodeSchema,
} from '../../../../knodes/frameworks/data-services/model/knode.model';
import { IDataServices } from '../../../../common/abstracts';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: KNode.name, schema: KNodeSchema }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // uri: 'mongodb://db_mongo:27017/colabo',
        // uri: 'mongodb://localhost:27017/colabo',
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: IDataServices,
      useClass: MongoDataServices,
    },
  ],
  exports: [IDataServices],
})
export class MongoDataServicesModule {}
