import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  EventDataRaw,
  OddsDataRaw,
} from 'src/dataSources/interfaces/odds.interface';
import { GetTodaysOddsSelectQuery } from './queries/odds.queries';

@Injectable()
export class OddsRepositoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async saveFetchedOdds(eventRaw: EventDataRaw) {
    const leaguePromise = this.prismaService.league.upsert({
      create: { name: eventRaw.leagueName },
      update: {},
      where: { name: eventRaw.leagueName },
    });
    const homeTeamPromise = this.prismaService.team.upsert({
      create: { name: eventRaw.homeName },
      update: {},
      where: { name: eventRaw.homeName },
    });
    const awayTeamPromise = this.prismaService.team.upsert({
      create: { name: eventRaw.awayName },
      update: {},
      where: { name: eventRaw.awayName },
    });
    const [league, homeTeam, awayTeam] = await Promise.all([
      leaguePromise,
      homeTeamPromise,
      awayTeamPromise,
    ]);

    const event = await this.prismaService.event.upsert({
      create: {
        league_id: league.id,
        home_team_id: homeTeam.id,
        away_team_id: awayTeam.id,
        event_date: new Date(eventRaw.startTimestamp),
      },
      update: {},
      where: {
        league_id_home_team_id_away_team_id_event_date: {
          league_id: league.id,
          home_team_id: homeTeam.id,
          away_team_id: awayTeam.id,
          event_date: new Date(eventRaw.startTimestamp),
        },
      },
    });

    const bookmakers = await Promise.all(
      eventRaw.odds.map(async (odds) =>
        this.prismaService.bookmaker.upsert({
          create: { name: odds.bookmaker },
          where: { name: odds.bookmaker },
          update: {},
        }),
      ),
    );

    const data = eventRaw.odds.map((odd) => {
      const bookmaker = bookmakers.find(
        (bookmaker) => bookmaker.name === odd.bookmaker,
      );
      return {
        bookmaker_id: bookmaker.id,
        home_win_odds: odd.odds[0],
        draw_odds: odd.odds[1],
        away_win_odds: odd.odds[2],
        event_id: event.id,
      };
    });

    const odds = await this.prismaService.betOdds.createManyAndReturn({
      data,
      include: {
        event: {
          include: {
            league: { select: { name: true } },
            home_team: { select: { name: true } },
            away_team: { select: { name: true } },
          },
        },
        bookmaker: { select: { name: true } },
      },
    });

    return Promise.all(odds);
  }

  async getTodaysOdds(leagueName?: string) {
    return this.prismaService.event.findMany({
      where: {
        AND: {
          league: { name: leagueName },
          event_date: { lt: new Date() },
        },
      },
      select: GetTodaysOddsSelectQuery,
    });
  }

  async getManyOdds(odds: string[]) {
    return this.prismaService.betOdds.findMany({
      where: { id: { in: odds } },
      include: { bookmaker: true },
    });
  }
}
