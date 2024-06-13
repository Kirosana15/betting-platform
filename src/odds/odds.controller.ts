import { Controller, Get, ParseArrayPipe, Query } from '@nestjs/common';
import { GetTodaysOddsQueryDto } from './dto/getTodaysOdds.dto';
import { OddsService } from './odds.service';
import { CalculateBetQueryDto } from './dto/calculateBet.dto';

@Controller('odds')
export class OddsController {
  constructor(private readonly service: OddsService) {}

  @Get('')
  async getTodaysOdds(@Query() query: GetTodaysOddsQueryDto) {
    const { leagueName } = query;
    return this.service.getTodaysOdds(leagueName);
  }

  @Get('bet')
  async calculateBet(@Query() query: CalculateBetQueryDto) {
    const { homeBets = [], drawBets = [], awayBets = [] } = query;
    return this.service.calculateBet(homeBets, drawBets, awayBets);
  }
}
