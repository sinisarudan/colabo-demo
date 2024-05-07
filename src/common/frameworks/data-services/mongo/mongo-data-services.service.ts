import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from './mongo-generic-repository';

import {
  KNode,
  KNodeDocument,
} from '../../../../knodes/frameworks/data-services/model/knode.model';
import { IDataServices } from '../../../../common/abstracts';
// import { KNode } from 'src/knodes/entities/knode.entity';

// <https://docs.nestjs.com/recipes/mongodb>
@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap
{
  knodes: MongoGenericRepository<KNode>;

  constructor(
    @InjectModel(KNode.name)
    private KNodeRepository: Model<KNodeDocument>,
  ) {}

  onApplicationBootstrap() {
    this.knodes = new MongoGenericRepository<KNode>(this.KNodeRepository);
  }
}
