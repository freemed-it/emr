import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as expressBasicAuth from 'express-basic-auth';
import {
  ENV_SWAGGER_PASSWORD_KEY,
  ENV_SWAGGER_USER_KEY,
} from './common/const/env-keys.const';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(
    ['/api/docs'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env[ENV_SWAGGER_USER_KEY]]:
          process.env[ENV_SWAGGER_PASSWORD_KEY],
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('EMR API')
    .setDescription('FREEMED EMR (Electronic Medical Record) API')
    .setVersion('2.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(parseInt(process.env.PORT, 10) || 3000);
}
bootstrap();
