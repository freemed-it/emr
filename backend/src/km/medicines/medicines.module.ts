import { Module } from '@nestjs/common';
import { KmMedicinesService } from './medicines.service';
import { KmMedicinesController } from './medicines.controller';
import { KmMedicines } from '../entity/medicines.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { KmPrescriptionsService } from '../charts/prescriptions/prescriptions.service';
import { KmPrescriptions } from '../entity/prescriptions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([KmMedicines, KmPrescriptions]),
    CommonModule,
  ],
  controllers: [KmMedicinesController],
  providers: [KmMedicinesService, KmPrescriptionsService],
})
export class KmMedicinesModule {}
