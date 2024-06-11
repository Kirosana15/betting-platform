import { Module } from '@nestjs/common';
import { FlashscoreProviderService } from './providers/flashscore.service';

@Module({
  imports: [],
  providers: [FlashscoreProviderService],
})
export class DataSourcesModule {}
