import { DataSourcesService } from './dataSources.service';
import { Module } from '@nestjs/common';
import { FlashscoreProviderService } from './providers/flashscore.service';

@Module({
  imports: [],
  providers: [FlashscoreProviderService, DataSourcesService],
  exports: [DataSourcesService],
})
export class DataSourcesModule {}
