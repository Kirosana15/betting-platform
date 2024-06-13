import { Module } from '@nestjs/common';
import { DataSourcesModule } from 'src/dataSources/dataSources.module';
import { DatabaseModule } from 'src/database/database.module';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [DatabaseModule, DataSourcesModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
