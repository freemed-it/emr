import { Module } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { HistoriesController } from './histories.controller';
import { Histories } from '../entity/histories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MCharts } from 'src/m/entity/charts.entity';
import { KmCharts } from 'src/km/entity/charts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Histories, MCharts, KmCharts])],
  controllers: [HistoriesController],
  providers: [HistoriesService],
})
export class HistoriesModule {}
