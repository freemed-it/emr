import { Module } from '@nestjs/common';
import { KmPrescriptionsService } from './km-prescriptions.service';
import { KmPrescriptionsController } from './km-prescriptions.controller';
import { KM_Prescriptions } from './entity/km-prescriptions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KmMedicinesService } from 'src/km-medicines/km-medicines.service';
import { KM_Medicines } from 'src/km-medicines/entity/km-medicines.entity';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [TypeOrmModule.forFeature([KM_Prescriptions, KM_Medicines])],
  controllers: [KmPrescriptionsController],
  providers: [KmPrescriptionsService, KmMedicinesService, CommonService],
})
export class KmPrescriptionsModule {}
