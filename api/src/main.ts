import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { env } from './config/env.config';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from './infra/logger/logger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const ALLOWED_ORIGIN = env.ALLOWED_ORIGIN?.split(',') ?? [];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    logger: WinstonModule.createLogger({
      ...loggerOptions,
    }),
  });

  app.setGlobalPrefix('/api');

  app.enableCors({
    credentials: true,
    origin: ALLOWED_ORIGIN,
  });
  app.use(express.json());
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  const port = env.PORT ?? 4000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
