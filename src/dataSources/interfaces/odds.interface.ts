export interface OddsDataRaw {
  bookmaker: string;
  odds: number[];
}
export interface EventDataRaw {
  leagueName: string;
  startTimestamp: number;
  homeName: string;
  awayName: string;
  odds: OddsDataRaw[];
}
