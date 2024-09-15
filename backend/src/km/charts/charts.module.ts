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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KmCharts,
      MCharts,
      Histories,
      KmComplaints,
      Orders,
      KmPrescriptions,
      KmMedicines,
    ]),
  ],
  controllers: [KmChartsController],
  providers: [
    KmChartsService,
    KmComplaintsService,
    KmPrescriptionsService,
    KmMedicinesService,
    OrdersService,
    CommonService,
  ],
})
export class KmChartsModule {}
