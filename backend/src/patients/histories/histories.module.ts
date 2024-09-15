import { Module } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { HistoriesController } from './histories.controller';
import { Histories } from '../entity/histories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Histories])],
  controllers: [HistoriesController],
  providers: [HistoriesService],
})
export class HistoriesModule {}
