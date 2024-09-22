import { Module } from '@nestjs/common';
import { KmComplaintsService } from './complaints.service';
import { KmComplaintsController } from './complaints.controller';
import { KmComplaints } from '../../entity/complaints.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KmCharts } from 'src/km/entity/charts.entity';
import { MComplaints } from 'src/m/entity/complaints.entity';
import { MCharts } from 'src/m/entity/charts.entity';
import { MComplaintsService } from 'src/m/charts/complaints/complaints.service';
import { MChartsService } from 'src/m/charts/charts.service';
import { Histories } from 'src/patients/entity/histories.entity';
import { Orders } from 'src/orders/entity/orders.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KmComplaints,
      KmCharts,
      MComplaints,
      MCharts,
      Histories,
      Orders,
    ]),
  ],
  controllers: [KmComplaintsController],
  providers: [
    KmCharts,
    KmComplaintsService,
    MComplaintsService,
    MChartsService,
  ],
})
export class KmComplaintsModule {}
