import { Module } from '@nestjs/common';
import { MChartsService } from './charts.service';
import { MChartsController } from './charts.controller';
import { MCharts } from '../entity/charts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Histories } from 'src/patients/entity/histories.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { OrdersService } from 'src/orders/orders.service';
import { CommonService } from 'src/common/common.service';
import { MComplaints } from '../entity/complaints.entity';
import { KmCharts } from 'src/km/entity/charts.entity';
import { MPrescriptionsModule } from './prescriptions/prescriptions.module';
import { MMedicinesModule } from '../medicines/medicines.module';
import { MComplaintsService } from './complaints/complaints.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MCharts,
      Histories,
      MComplaints,
      Orders,
      KmCharts,
    ]),
    MPrescriptionsModule,
    MMedicinesModule,
  ],
  controllers: [MChartsController],
  providers: [MChartsService, MComplaintsService, OrdersService, CommonService],
})
export class MChartsModule {}
