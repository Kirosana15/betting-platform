import { Injectable } from '@nestjs/common';
import { OddsRepositoryService } from 'src/database/odds.repository';

@Injectable()
export class OddsService {
  constructor(private readonly oddsRepository: OddsRepositoryService) {}

  async getTodaysOdds(leagueName?: string) {
    return this.oddsRepository.getTodaysOdds(leagueName);
  }
}
