export const oddsRepositoryServiceMock = {
  saveFetchedOdds: jest.fn(),
  getTodaysOdds: jest.fn(),
  getManyOdds: jest.fn((odds: string[]) =>
    Promise.resolve(
      odds.map((odd) => {
        return {
          id: odd,
          event_id: '92382e7e-1b0d-4e2f-8d57-e92be22b8dde',
          bookmaker_id: '92382e7e-1b0d-4e2f-8d57-e92be22b8dde',
          bookmaker: {
            id: '92382e7e-1b0d-4e2f-8d57-e92be22b8dde',
            name: 'testBookmaker',
          },
          home_win_odds: 1,
          draw_odds: 2,
          away_win_odds: 3,
          timestamp: new Date(0),
        };
      }),
    ),
  ),
};
