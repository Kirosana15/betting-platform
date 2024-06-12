import { Observable } from 'rxjs';
import { EventDataRaw } from './odds.interface';

export interface IDataProvider {
  getTodaysOdds(): Promise<Observable<EventDataRaw>>;
}
