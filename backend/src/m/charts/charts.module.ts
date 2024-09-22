import { Module } from '@nestjs/common';
import { MChartsService } from './charts.service';
import { MChartsController } from './charts.controller';
import { MCharts } from '../entity/charts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Histories } from 'src/patients/entity/histories.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { OrdersService } from 'src/orders/orders.service';
import { CommonService } from 'src/common/common.service';
import { MComplaints } from 'src/m/entity/complaints.entity';
import { KmCharts } from 'src/km/entity/charts.entity';
import { MPrescriptionsModule } from './prescriptions/prescriptions.module';
import { MMedicinesModule } from '../medicines/medicines.module';
import { MComplaintsService } from 'src/m/charts/complaints/complaints.service';
import { HistoriesService } from 'src/patients/histories/histories.service';
import { KmComplaints } from 'src/km/entity/complaints.entity';
import { KmChartsService } from 'src/km/charts/charts.service';
import { KmComplaintsService } from 'src/km/charts/complaints/complaints.service';
import { Memos } from 'src/patients/entity/memos.entity';
import { MemosService } from 'src/patients/memos/memos.service';
import { Patients } from 'src/patients/entity/patients.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KmCharts,
      MCharts,
      Orders,
      MComplaints,
      KmComplaints,
      Histories,
      Memos,
      Patients,
    ]),
    MPrescriptionsModule,
    MMedicinesModule,
  ],
  controllers: [MChartsController],
  providers: [
    KmChartsService,
    MChartsService,
    MComplaintsService,
    KmComplaintsService,
    HistoriesService,
    OrdersService,
    CommonService,
    MemosService,
  ],
})
export class MChartsModule {}
