import { EventDataRaw } from 'src/dataSources/interfaces/odds.interface';
import { FlashscoreProviderService } from './../flashscore.service';
import * as rxjs from 'rxjs';
import { Observable, mergeMap } from 'rxjs';

export const flashscoreProviderMock = {
  getTodaysOdds: jest.fn((): Promise<Observable<EventDataRaw>> => {
    return Promise.resolve(
      rxjs.from([
        {
          leagueName: 'testLeague',
          startTimestamp: 0,
          homeName: 'testHomeTeam',
          awayName: 'testAwayTeam',
          odds: [{ bookmaker: 'testBookmaker', odds: [1, 2, 3] }],
        },
      ]),
    );
  }),
};
