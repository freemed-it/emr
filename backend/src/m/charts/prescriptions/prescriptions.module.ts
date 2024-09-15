import { Module } from '@nestjs/common';
import { MPrescriptionsService } from './prescriptions.service';
import { MPrescriptionsController } from './prescriptions.controller';
import { MPrescriptions } from '../../entity/prescriptions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MCharts } from 'src/m/entity/charts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MPrescriptions, MCharts])],
  controllers: [MPrescriptionsController],
  providers: [MPrescriptionsService],
  exports: [MPrescriptionsService],
})
export class MPrescriptionsModule {}
