import { Model } from 'mongoose';
import { IGenericRepository } from 'src/common/abstracts';

export class MongoGenericRepository<T> implements IGenericRepository<T> {
  private _repository: Model<T>;
  private _populateOnFind: string[];

  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    this._repository = repository;
    this._populateOnFind = populateOnFind;
  }

  getAll(): Promise<T[]> {
    return this._repository.find().populate(this._populateOnFind).exec();
  }

  get(id: string): Promise<T | null> {
    return this._repository
      .findById<T>(id)
      .populate(this._populateOnFind)
      .exec() as Promise<T | null>;
  }

  find(filter: Record<string, any>): Promise<T[]> {
    console.log(
      '[MongoGenericRepository::find] filter',
      JSON.stringify(filter, null, 4),
    );
    return this._repository.find(filter);
  }

  create(item: T): Promise<T> {
    return this._repository.create(item);
  }

  update(id: string, item: Partial<T>): Promise<T> {
    return this._repository.findByIdAndUpdate(id, item).exec() as Promise<T>;
  }

  async delete(id: string): Promise<number> {
    const result = await this._repository.deleteOne({ _id: id });
    return result.acknowledged ? result.deletedCount : result.deletedCount;
  }
}
