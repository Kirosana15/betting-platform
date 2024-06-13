import { Test } from '@nestjs/testing';
import { OddsService } from '../odds.service';
import { OddsRepositoryService } from '../../database/odds.repository';
import { DatabaseModule } from '../../database/database.module';
import { oddsRepositoryServiceMock } from '../../database/mocks/odds.repository.mock';
import { BadRequestException } from '@nestjs/common';

const homeBets = [
  'cc949b8c-5632-4469-8958-7733c3739901',
  '474d2a8a-55a8-4dd7-b57d-27925437f965',
];
const drawBets = [
  '7403d757-077d-4be3-a60b-75cc789dd66f',
  '5ec8291b-337e-4b69-8fb2-d54cf4573dbf',
];
const awayBets = [
  '2f9954df-7c55-4fec-854d-650e44c7fbce',
  '00b887a1-1f17-401d-a85c-4160f9845a6d',
  '59fc77cc-533f-4f8d-9472-a8de2c1bea6c',
];

describe('Odds service', () => {
  let oddsService: OddsService;
  let oddsRepository: OddsRepositoryService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [OddsService],
    })
      .overrideProvider(OddsRepositoryService)
      .useValue(oddsRepositoryServiceMock)
      .compile();

    oddsService = module.get(OddsService);
    oddsRepository = module.get(OddsRepositoryService);
  });

  describe('getTodaysOdds', () => {
    it('should call OddsRepositoryService.getTodaysOdds', async () => {
      const getTodaysOddsSpy = jest.spyOn(oddsRepository, 'getTodaysOdds');
      await oddsService.getTodaysOdds();
      expect(getTodaysOddsSpy).toBeCalledTimes(1);
    });

    it('should pass leagueName to OddsRepositoryService.getTodaysOdds', async () => {
      const leagueName = 'premier league';
      const getTodaysOddsSpy = jest.spyOn(oddsRepository, 'getTodaysOdds');
      await oddsService.getTodaysOdds(leagueName);
      expect(getTodaysOddsSpy).toBeCalledWith(leagueName);
    });
  });

  describe('getTodaysOdds', () => {
    it('should call OddsRepositoryService.getManyOdds', async () => {
      const getManyOddsSpy = jest.spyOn(oddsRepository, 'getManyOdds');
      await oddsService.calculateBet(homeBets);
      expect(getManyOddsSpy).toBeCalledTimes(1);
    });

    it('should pass all bets to OddsRepositoryService.getManyOdds', async () => {
      const allBets = [...homeBets, ...awayBets];
      const getManyOddsSpy = jest.spyOn(oddsRepository, 'getManyOdds');
      await oddsService.calculateBet(homeBets, [], awayBets);
      expect(getManyOddsSpy).toBeCalledWith(allBets);
    });

    it('should throw when no bets are provided', async () => {
      await expect(oddsService.calculateBet()).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw when bets from multiple bookmakers are provided', async () => {
      jest.spyOn(oddsRepository, 'getManyOdds').mockResolvedValueOnce([
        {
          id: homeBets[0],
          event_id: '92382e7e-1b0d-4e2f-8d57-e92be22b8dde',
          bookmaker_id: '92382e7e-1b0d-4e2f-8d57-e92be22b8dde',
          bookmaker: {
            id: '92382e7e-1b0d-4e2f-8d57-e92be22b8dde',
            name: 'test1',
          },
          home_win_odds: 1,
          draw_odds: 2,
          away_win_odds: 3,
          timestamp: new Date(0),
        },
        {
          id: homeBets[1],
          event_id: '92382e7e-1b0d-4e2f-8d57-e92be22b8dde',
          bookmaker_id: '675cdd23-b993-4514-84c6-d14d032cad99',
          bookmaker: {
            id: '675cdd23-b993-4514-84c6-d14d032cad99',
            name: 'test2',
          },
          home_win_odds: 1,
          draw_odds: 2,
          away_win_odds: 3,
          timestamp: new Date(0),
        },
      ]);
      await expect(oddsService.calculateBet(homeBets)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should return product of appropriate odds', async () => {
      const expectedProduct = 1 * 1 * 2 * 2 * 3 * 3 * 3;
      const { totalOdds } = await oddsService.calculateBet(
        homeBets,
        drawBets,
        awayBets,
      );
      expect(totalOdds).toBe(expectedProduct);
    });

    it('should return bookmaker', async () => {
      const { bookmaker } = await oddsService.calculateBet(
        homeBets,
        drawBets,
        awayBets,
      );
      expect(bookmaker).toBe('testBookmaker');
    });
  });
});
