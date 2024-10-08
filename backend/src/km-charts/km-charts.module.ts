import { Module } from '@nestjs/common';
import { KmChartsService } from './km-charts.service';
import { KmChartsController } from './km-charts.controller';
import { KM_Charts } from './entity/km-charts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Histories } from 'src/patients/histories/entity/histories.entity';
import { KM_Complaints } from 'src/km-complaints/entity/km-complaints.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { KmPrescriptionsService } from 'src/km-prescriptions/km-prescriptions.service';
import { KmMedicinesService } from 'src/km-medicines/km-medicines.service';
import { KM_Prescriptions } from 'src/km-prescriptions/entity/km-prescriptions.entity';
import { KM_Medicines } from 'src/km-medicines/entity/km-medicines.entity';
import { CommonService } from 'src/common/common.service';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';
import { KmComplaintsService } from 'src/km-complaints/km-complaints.service';
import { OrdersService } from 'src/orders/orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KM_Charts,
      M_Charts,
      Histories,
      KM_Complaints,
      Orders,
      KM_Prescriptions,
      KM_Medicines,
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
