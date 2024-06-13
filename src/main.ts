import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SchedulerService } from './scheduler/scheduler.service';

async function bootstrap() {
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  Logger.log(`Listening on port: ${PORT}`);
  const runFlashscoreOnInit = process.env.FLASHSCORE_RUN_ON_INIT === 'true';
  if (runFlashscoreOnInit) {
    const schedulerService = app.get<SchedulerService>(SchedulerService);
    schedulerService.getFlashscoreData();
  }
}
bootstrap();
