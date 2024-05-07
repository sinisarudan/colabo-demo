import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! Colabo';
  }

  getDocs(): string {
    return 'Colabo NestJS API: Docs';
  }
}
