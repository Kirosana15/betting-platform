import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSourcesModule } from './dataSources/dataSources.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DataSourcesModule],
})
export class AppModule {}
