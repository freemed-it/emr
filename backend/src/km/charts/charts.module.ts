import { Module } from '@nestjs/common';
import { KmChartsService } from './charts.service';
import { KmChartsController } from './charts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Histories } from 'src/patients/entity/histories.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { CommonService } from 'src/common/common.service';
import { OrdersService } from 'src/orders/orders.service';
import { KmCharts } from '../entity/charts.entity';
import { MCharts } from 'src/m/entity/charts.entity';
import { KmComplaints } from '../entity/complaints.entity';
import { KmPrescriptions } from '../entity/prescriptions.entity';
import { KmMedicines } from '../entity/medicines.entity';
import { KmComplaintsService } from './complaints/complaints.service';
import { KmPrescriptionsService } from './prescriptions/prescriptions.service';
import { KmMedicinesService } from '../medicines/medicines.service';
import { HistoriesService } from 'src/patients/histories/histories.service';
import { MComplaints } from 'src/m/entity/complaints.entity';
import { MChartsService } from 'src/m/charts/charts.service';
import { MComplaintsService } from 'src/m/charts/complaints/complaints.service';
import { Memos } from 'src/patients/entity/memos.entity';
import { MemosService } from 'src/patients/memos/memos.service';
import { Patients } from 'src/patients/entity/patients.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KmCharts,
      MCharts,
      MComplaints,
      KmComplaints,
      Orders,
      KmPrescriptions,
      KmMedicines,
      Histories,
      Memos,
      Patients,
    ]),
  ],
  controllers: [KmChartsController],
  providers: [
    KmChartsService,
    MChartsService,
    MComplaintsService,
    KmComplaintsService,
    HistoriesService,
    KmPrescriptionsService,
    KmMedicinesService,
    OrdersService,
    CommonService,
    MemosService,
  ],
})
export class KmChartsModule {}
