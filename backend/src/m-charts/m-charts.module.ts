import { Module } from '@nestjs/common';
import { MChartsService } from './m-charts.service';
import { MChartsController } from './m-charts.controller';
import { M_Charts } from './entity/m-charts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([M_Charts])],
  controllers: [MChartsController],
  providers: [MChartsService],
})
export class MChartsModule {}
