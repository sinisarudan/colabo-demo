import { KNode } from 'src/knodes/entities/knode.entity';
import { IGenericRepository } from './generic-repository.abstract';

export abstract class IDataServices {
  abstract knodes: IGenericRepository<KNode>;
}
