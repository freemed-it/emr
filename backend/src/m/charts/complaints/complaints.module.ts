import { Module } from '@nestjs/common';
import { MComplaintsService } from './complaints.service';
import { MComplaintsController } from './complaints.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MCharts } from 'src/m/entity/charts.entity';
import { MChartsService } from '../charts.service';
import { MComplaints } from 'src/m/entity/complaints.entity';
import { KmComplaints } from 'src/km/entity/complaints.entity';
import { KmCharts } from 'src/km/entity/charts.entity';
import { KmComplaintsService } from 'src/km/charts/complaints/complaints.service';
import { Histories } from 'src/patients/entity/histories.entity';
import { Orders } from 'src/orders/entity/orders.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MComplaints,
      MCharts,
      KmComplaints,
      KmCharts,
      Histories,
      Orders,
    ]),
  ],
  controllers: [MComplaintsController],
  providers: [
    MComplaintsService,
    MChartsService,
    KmCharts,
    KmComplaintsService,
  ],
})
export class MComplaintsModule {}
