import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  Logger.log(`Listening on port: ${PORT}`);
}
bootstrap();
