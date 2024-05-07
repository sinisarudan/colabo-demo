import { IGenericRepository } from 'src/common/abstracts';
import { KNode, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
// import { KNodeDelegate } from '@prisma/client';

type ModelNode = Prisma.KNodeDelegate<DefaultArgs>;
type ModelEdge = Prisma.KEdgeDelegate<DefaultArgs>;
type ModelsAll = ModelNode | ModelEdge;
type Model = Prisma.KNodeDelegate<DefaultArgs>;

export class PrismaGenericRepository<T> implements IGenericRepository<T> {
  private _repository: ModelsAll;
  private _populateOnFind: string[];

  constructor(
    // TODO: make it generic:
    repository: ModelsAll,
    // populateOnFind: string[] = [],
  ) {
    this._repository = repository;
    // this._populateOnFind = populateOnFind;
  }

  async getAll(): Promise<T[]> {
    const many: T[] = (await (this._repository as Model).findMany()) as T[];
    return many;
    // return this._repository.find().populate(this._populateOnFind).exec();
  }

  get(id: string): Promise<T | null> {
    return (this._repository as Model).findUnique({
      where: { id },
    }) as Promise<T>;
    // TODO `populate`
    // return this._repository
    //   .findById<T>(id)
    //   .populate(this._populateOnFind)
    //   .exec() as Promise<T | null>;
  }

  async find(filter: Record<string, any>): Promise<T[]> {
    console.log(
      '[MongoGenericRepository::find] filter',
      JSON.stringify(filter, null, 4),
    );
    console.error("[PrismaGenericRepository::find] doesn't use filter yet");
    // TODO: make it find by using a `filter`
    const many: T[] = (await (this._repository as Model).findMany()) as T[];
    // const many: T[] = (await (this._repository as Model).findMany(
    //   filter
    // )) as T[];
    return many;
  }

  async create(item: T): Promise<T> {
    const input: Prisma.KNodeCreateInput = item as Prisma.KNodeCreateInput;
    const kNode: KNode = await (this._repository as Model).create({
      data: input,
    });
    return kNode as T;
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    const input: Prisma.KNodeUpdateInput = item as Prisma.KNodeUpdateInput;
    const kNode: KNode = await (this._repository as Model).update({
      where: { id },
      data: input,
    });
    return kNode as T;
    // return this._repository.findByIdAndUpdate(id, item).exec() as Promise<T>;
  }

  async delete(id: string): Promise<number> {
    const result = await (this._repository as Model).delete({ where: { id } });
    return result ? 1 : 0;
  }
}
