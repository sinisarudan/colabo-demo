import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { logger } from './common/middleware/logger.middleware';

async function bootstrap() {
  // generic framework creation: const app: INestApplication = await NestFactory.create(AppModule);
  const app: NestExpressApplication =
    await NestFactory.create<NestExpressApplication>(AppModule);

  // binding `ValidationPipe` at the application level, thus ensuring all endpoints are protected from receiving incorrect data.
  // this is enough to validate all the input DTOs to controllers
  // (according to their `class-validator` decorators, e.g. `@IsString`, `@IsNotEmpty`, `@IsEmail`)
  app.useGlobalPipes(new ValidationPipe());

  app.use(logger);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Colabo')
    .setDescription('The Colabo clean-architecture-nestJS API description')
    .setVersion('0.1')
    .addTag('colabo')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const APP_PORT: number = parseInt(process.env.APP_PORT ?? '3005');
  await app.listen(APP_PORT);
  console.log('Server listening on the APP_PORT: ', APP_PORT);
  console.log('process.env.MONGODB_URI', process.env.MONGODB_URI);
}
bootstrap();
