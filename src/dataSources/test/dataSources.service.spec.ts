import { flashscoreProviderMock } from './../providers/mocks/flashscore.service.mock';
import { DataSourcesService } from './../dataSources.service';
import { FlashscoreProviderService } from './../providers/flashscore.service';
import { Test } from '@nestjs/testing';
import { DataProviders } from '../enums/providers.enum';

describe('DataSource service', () => {
  let dataSourcesService: DataSourcesService;
  let flashscoreService: FlashscoreProviderService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [DataSourcesService, FlashscoreProviderService],
    })
      .overrideProvider(FlashscoreProviderService)
      .useValue(flashscoreProviderMock)
      .compile();
    dataSourcesService = module.get(DataSourcesService);
    flashscoreService = module.get(FlashscoreProviderService);
  });

  it('should call appropriate service getTodaysOdds method', async () => {
    const getTodaysOddsSpy = jest.spyOn(flashscoreService, 'getTodaysOdds');
    await dataSourcesService.getProviderData(DataProviders.FlashscoreProvider);
    expect(getTodaysOddsSpy).toBeCalled();
  });
});
