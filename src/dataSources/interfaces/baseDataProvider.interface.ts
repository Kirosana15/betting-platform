import { EventDataRaw } from './odds.interface';

export interface IDataProvider {
  getTodaysOdds(): Promise<EventDataRaw[]>;
}
