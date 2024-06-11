import { Injectable } from '@nestjs/common';
import { FlashscoreProviderService } from './providers/flashscore.service';
import { IDataProvider } from './interfaces/baseDataProvider.interface';
import { DataProviders } from './enums/providers.enum';
import { EventDataRaw, OddsDataRaw } from './interfaces/odds.interface';

@Injectable()
export class DataSourcesService {
  private providers: Map<DataProviders, IDataProvider> = new Map();
  constructor(flashscoreService: FlashscoreProviderService) {
    this.providers.set(DataProviders.FlashscoreProvider, flashscoreService);
  }

  async getProviderData(provider: DataProviders): Promise<EventDataRaw[]> {
    const providerService = this.providers.get(provider);
    return providerService.getTodaysOdds();
  }
}
