import { DataSourcesController } from './dataSources.controller';
import { Module } from '@nestjs/common';
import { FlashscoreProviderService } from './providers/flashscore.service';

@Module({
  imports: [],
  //TODO: Remove before merging
  controllers: [DataSourcesController],
  providers: [FlashscoreProviderService],
})
export class DataSourcesModule {}
