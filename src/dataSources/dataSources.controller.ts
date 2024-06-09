import { FlashscoreProviderService } from './providers/flashscore.service';
import { Controller, Get } from '@nestjs/common';

//TODO: Remove before merging
@Controller('sources')
export class DataSourcesController {
  constructor(private readonly flashscoreService: FlashscoreProviderService) {}

  @Get('flashscore')
  async getFlashscore() {
    return this.flashscoreService.getTodaysMatches();
  }
}
