import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SchedulerService } from './scheduler/scheduler.service';

async function bootstrap() {
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);

  const runFlashscoreOnInit = process.env.FLASHSCORE_RUN_ON_INIT === 'true';
  if (runFlashscoreOnInit) {
    const schedulerService = app.get<SchedulerService>(SchedulerService);
    schedulerService.getFlashscoreData();
  }

  Logger.log(`Listening on port: ${PORT}`);
}
bootstrap();
