import { EventDataRaw } from 'src/dataSources/interfaces/odds.interface';
import { FlashscoreProviderService } from './../flashscore.service';

export const flashscoreProviderMock = {
  getTodaysOdds: (): Promise<EventDataRaw[]> => {
    return Promise.resolve([
      {
        leagueName: 'testLeague',
        startTimestamp: 0,
        homeName: 'testHomeTeam',
        awayName: 'testAwayTeam',
        odds: [{ bookmaker: 'testBookmaker', odds: [1, 2, 3] }],
      },
    ]);
  },
};
