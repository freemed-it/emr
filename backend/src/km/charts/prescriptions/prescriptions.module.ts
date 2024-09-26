import { forwardRef, Module } from '@nestjs/common';
import { KmPrescriptionsService } from './prescriptions.service';
import { KmPrescriptionsController } from './prescriptions.controller';
import { KmPrescriptions } from '../../entity/prescriptions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KmMedicinesModule } from 'src/km/medicines/medicines.module';
import { KmChartsModule } from '../charts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KmPrescriptions]),
    forwardRef(() => KmChartsModule),
    forwardRef(() => KmMedicinesModule),
  ],
  controllers: [KmPrescriptionsController],
  providers: [KmPrescriptionsService],
  exports: [KmPrescriptionsService],
})
export class KmPrescriptionsModule {}
