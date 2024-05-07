import { Injectable } from '@nestjs/common';
// import { CreateKnodeDto } from './dto/create-knode.dto';
// import { UpdateKnodeDto } from './dto/update-knode.dto';
import { KNode } from './entities/knode.entity';
import { IDataServices } from 'src/common/abstracts';

@Injectable()
export class KnodesService {
  constructor(
    private dataServices: IDataServices,
    // private knodesFactoryService: KnodesFactoryService,
  ) {}
  create(knode: KNode) {
    return this.dataServices.knodes.create(knode);
  }

  findAll(): Promise<KNode[]> {
    return this.dataServices.knodes.getAll();
  }

  find(filter: Record<string, any>): Promise<KNode[]> {
    return this.dataServices.knodes.find(filter);
  }

  findOne(id: string): Promise<KNode | null> {
    return this.dataServices.knodes.get(id);
  }

  update(id: string, knode: Partial<KNode>) {
    return this.dataServices.knodes.update(id, knode);
  }

  delete(id: string) {
    return this.dataServices.knodes.delete(id);
  }
}
