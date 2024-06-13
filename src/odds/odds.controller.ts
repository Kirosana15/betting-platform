import { Controller, Get, Query } from '@nestjs/common';
import { GetTodaysOddsQueryDto } from './dto/getTodaysOdds.dto';
import { OddsService } from './odds.service';

@Controller('odds')
export class OddsController {
  constructor(private readonly service: OddsService) {}

  @Get('')
  async getTodaysOdds(@Query() query: GetTodaysOddsQueryDto) {
    const { leagueName } = query;
    return this.service.getTodaysOdds(leagueName);
  }
}
