import { Injectable, OnModuleInit } from '@nestjs/common';

import { IDataServices } from '../../../../common/abstracts';
import { PrismaClient } from '@prisma/client';
import { PrismaGenericRepository } from './prisma-generic-repository';
import { KNode } from 'src/knodes/entities/knode.entity';

@Injectable()
export class PrismaDataServices
  extends PrismaClient
  implements IDataServices, OnModuleInit
{
  knodes: PrismaGenericRepository<KNode>;

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }
  onApplicationBootstrap() {
    // this.knodes = this.kNode;
    this.knodes = new PrismaGenericRepository<KNode>(this.kNode);
  }
}
