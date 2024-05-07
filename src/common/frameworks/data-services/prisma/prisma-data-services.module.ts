import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import {
//   KNode,
//   KNodeSchema,
// } from '../../../../knodes/frameworks/data-services/model/knode.model';
import { IDataServices } from '../../../../common/abstracts';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaDataServices } from './prisma-data-services.service';

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: KNode.name, schema: KNodeSchema }]),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get<string>('MONGODB_URI'),
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  providers: [
    {
      provide: IDataServices,
      useClass: PrismaDataServices,
    },
  ],
  exports: [IDataServices],
})
export class PrismaDataServicesModule {}
