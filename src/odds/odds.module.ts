import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { OddsController } from './odds.controller';
import { OddsService } from './odds.service';

@Module({
  imports: [DatabaseModule],
  providers: [OddsService],
  controllers: [OddsController],
})
export class OddsModule {}
