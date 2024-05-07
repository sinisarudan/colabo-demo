import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// logger implemented as a middleware class:
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...', req.method);
    next();
  }
}

// logger implemented as a middleware function:
// this one is used in `main.ts` to add logging of each method being called (as a middleware intercepting each request):
// https://docs.nestjs.com/middleware:
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log('Request: ', req.method);
  next();
}
