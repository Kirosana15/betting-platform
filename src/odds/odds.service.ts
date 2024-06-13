import { BadRequestException, Injectable } from '@nestjs/common';
import { OddsRepositoryService } from 'src/database/odds.repository';

@Injectable()
export class OddsService {
  constructor(private readonly oddsRepository: OddsRepositoryService) {}

  async getTodaysOdds(leagueName?: string) {
    return this.oddsRepository.getTodaysOdds(leagueName);
  }

  async calculateBet(
    homeBets: string[],
    drawBets: string[],
    awayBets: string[],
  ) {
    const allBets = [...homeBets, ...drawBets, ...awayBets];
    if (allBets.length === 0) {
      throw new BadRequestException('No bets were provided');
    }

    const odds = await this.oddsRepository.getManyOdds(allBets);

    const homeOdds = homeBets.map(
      (id) => odds.find((odd) => odd.id === id).home_win_odds,
    );
    const drawOdds = drawBets.map(
      (id) => odds.find((odd) => odd.id === id).draw_odds,
    );
    const awayOdds = awayBets.map(
      (id) => odds.find((odd) => odd.id === id).away_win_odds,
    );
    const allOdds = [...homeOdds, ...drawOdds, ...awayOdds];

    const totalOdds = allOdds.reduce((product, odd) => product * odd, 1);

    return { totalOdds };
  }
}
