import { Module, DynamicModule } from '@nestjs/common';
import { PrismaDataServicesModule } from 'src/common/frameworks/data-services/prisma/prisma-data-services.module';
import { MongoDataServicesModule } from 'src/common/frameworks/data-services/mongo/mongo-data-services.module';

enum DB {
  PRISMA_MYSQL = 'prisma-mysql',
  MONGO = 'mongo',
}

@Module({})
export class DataServicesModule {
  static register(): DynamicModule {
    //TODO: provide from `.env`:
    const selectedDatabase: string = DB.MONGO;
    let selectedModule: any;

    switch (selectedDatabase) {
      case DB.PRISMA_MYSQL:
        selectedModule = PrismaDataServicesModule;
        console.log(
          '[DataServicesModule] Registering PrismaDataServicesModule',
        );
        break;
      case DB.MONGO:
        selectedModule = MongoDataServicesModule;
        console.log('[DataServicesModule] Registering MongoDataServicesModule');
        console.log(
          '[DataServicesModule] MongoDataServicesModule:,',
          MongoDataServicesModule,
        );
        break;
      default:
        throw new Error('[DataServicesModule] Invalid database selection');
    }

    const registeredModule = {
      module: DataServicesModule,
      imports: [selectedModule],
      exports: [selectedModule],
    };
    console.log(
      '[DataServicesModule] registeredModule:',
      JSON.stringify(registeredModule, null, 4),
    );
    return registeredModule;
  }
}
