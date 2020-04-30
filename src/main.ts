import 'dotenv/config'

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

const port = process.env.port || 3000
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  await app.listen(port, '0.0.0.0');
  app.useGlobalPipes(new ValidationPipe());
  Logger.log(`Listening ${process.env.APP_URL}:${port}`, 'Bootstrap')
}
bootstrap();
