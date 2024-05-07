import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/global (GET)', () => {
    // We simulate HTTP tests using the `request()` function from Supertest
    return request(app.getHttpServer())
      .get('/global')
      .expect(200)
      .expect('Hello World! Colabo');
  });
});
