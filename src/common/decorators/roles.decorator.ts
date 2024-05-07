import { ReflectableDecorator, Reflector } from '@nestjs/core';

// <https://docs.nestjs.com/guards#setting-roles-per-handler>:
// `createDecorator`Creates a decorator that can be used to decorate classes and methods with metadata and
// can be used as a strongly-typed alternative to `@SetMetadata`

/**
 * `Roles` decorator is a function that takes a single argument of type `string[]`
 */
export const Roles: ReflectableDecorator<string[], string[]> =
  Reflector.createDecorator<string[]>();
