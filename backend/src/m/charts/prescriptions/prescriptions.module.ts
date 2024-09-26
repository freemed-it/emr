import { forwardRef, Module } from '@nestjs/common';
import { MPrescriptionsService } from './prescriptions.service';
import { MPrescriptionsController } from './prescriptions.controller';
import { MPrescriptions } from '../../entity/prescriptions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MChartsModule } from '../charts.module';
import { MMedicinesModule } from 'src/m/medicines/medicines.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MPrescriptions]),
    forwardRef(() => MChartsModule),
    forwardRef(() => MMedicinesModule),
  ],
  controllers: [MPrescriptionsController],
  providers: [MPrescriptionsService],
  exports: [MPrescriptionsService],
})
export class MPrescriptionsModule {}
