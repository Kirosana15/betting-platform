import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSourcesModule } from './dataSources/dataSources.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    DataSourcesModule,
    ScheduleModule.forRoot(),
    SchedulerModule,
  ],
})
export class AppModule {}
