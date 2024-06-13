import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSourcesService } from 'src/dataSources/dataSources.service';
import { DataProviders } from 'src/dataSources/enums/providers.enum';
import { OddsRepositoryService } from 'src/database/odds.repository';

const _FLASHSCORE_SCHEDULE =
  process.env.FLASHSCORE_SCHEDULE || CronExpression.EVERY_30_MINUTES;

@Injectable()
export class SchedulerService {
  constructor(
    private readonly oddsRepository: OddsRepositoryService,
    private readonly dataSources: DataSourcesService,
  ) {}

  @Cron(_FLASHSCORE_SCHEDULE)
  async getFlashscoreData() {
    const observable = await this.dataSources.getProviderData(
      DataProviders.FlashscoreProvider,
    );
    Logger.log('Starting Flashscore fetch...');
    observable.subscribe({
      next: async (event) => {
        if (event) {
          await this.oddsRepository.saveFetchedOdds(event);
        }
        return;
      },
      error: (error) => {
        Logger.error(error);
      },
      complete: () => {
        Logger.log('Flashscore fetch finished');
        return;
      },
    });
  }
}
