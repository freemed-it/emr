import { forwardRef, Module } from '@nestjs/common';
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
import { KmComplaintsService } from './complaints/complaints.service';
import { HistoriesService } from 'src/patients/histories/histories.service';
import { MComplaints } from 'src/m/entity/complaints.entity';
import { MChartsService } from 'src/m/charts/charts.service';
import { MComplaintsService } from 'src/m/charts/complaints/complaints.service';
import { Memos } from 'src/patients/entity/memos.entity';
import { MemosService } from 'src/patients/memos/memos.service';
import { Patients } from 'src/patients/entity/patients.entity';
import { KmPrescriptionsModule } from './prescriptions/prescriptions.module';
import { KmMedicinesModule } from '../medicines/medicines.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KmCharts,
      MCharts,
      MComplaints,
      KmComplaints,
      Orders,
      Histories,
      Memos,
      Patients,
    ]),
    forwardRef(() => KmPrescriptionsModule),
    forwardRef(() => KmMedicinesModule),
  ],
  controllers: [KmChartsController],
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
  exports: [KmChartsService],
})
export class KmChartsModule {}
