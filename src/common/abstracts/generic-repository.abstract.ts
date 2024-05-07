export abstract class IGenericRepository<T> {
  abstract getAll(): Promise<T[]>;

  abstract get(id: string): Promise<T | null>;

  abstract find(filter: Record<string, any>): Promise<T[]>;

  abstract create(item: T): Promise<T>;

  abstract update(id: string, item: Partial<T>): Promise<T>;

  abstract delete(id: string): Promise<number>;
}
