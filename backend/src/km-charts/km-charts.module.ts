import { Module } from '@nestjs/common';
import { KmChartsService } from './km-charts.service';
import { KmChartsController } from './km-charts.controller';
import { KM_Charts } from './entity/km-charts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([KM_Charts])],
  controllers: [KmChartsController],
  providers: [KmChartsService],
})
export class KmChartsModule {}
