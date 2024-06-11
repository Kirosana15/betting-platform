import { FlashscoreProviderService } from './providers/flashscore.service';
import { Controller, Get, Query } from '@nestjs/common';

//TODO: Remove before merging
@Controller('sources')
export class DataSourcesController {
  constructor(private readonly flashscoreService: FlashscoreProviderService) {}

  @Get('flashscore')
  async getFlashscore(@Query('url') url: string) {
    return this.flashscoreService.getTodaysOdds();
  }
}
