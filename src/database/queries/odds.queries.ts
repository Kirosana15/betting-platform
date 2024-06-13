import { Prisma } from '@prisma/client';

export const GetTodaysOddsSelectQuery: Prisma.EventSelect = {
  id: true,
  league: true,
  away_team: true,
  home_team: true,
  event_date: true,
  odds: {
    select: {
      id: true,
      bookmaker: true,
      home_win_odds: true,
      draw_odds: true,
      away_win_odds: true,
      timestamp: true,
    },
    orderBy: { timestamp: 'desc' },
  },
};
