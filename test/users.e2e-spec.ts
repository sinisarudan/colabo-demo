import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { UsersService } from '../src/users/users.service';
import { INestApplication } from '@nestjs/common';

describe('Users', () => {
  let app: INestApplication;
  const usersService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET users`, () => {
    // We simulate HTTP tests using the `request()` function from Supertest
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(usersService.findAll());
  });

  afterAll(async () => {
    await app.close();
  });
});
