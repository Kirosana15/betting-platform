import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSourcesModule } from './dataSources/dataSources.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';
import { OddsModule } from './odds/odds.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

const CACHE_TTL = parseInt(process.env.CACHE_TTL || '60');

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, ttl: CACHE_TTL }),
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    DataSourcesModule,
    ScheduleModule.forRoot(),
    SchedulerModule,
    OddsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
