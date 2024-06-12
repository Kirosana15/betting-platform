import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OddsRepositoryService } from './odds.repository';

@Module({
  providers: [PrismaService, OddsRepositoryService],
  exports: [OddsRepositoryService],
})
export class DatabaseModule {}
