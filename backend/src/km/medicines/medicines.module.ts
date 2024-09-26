import { forwardRef, Module } from '@nestjs/common';
import { KmMedicinesService } from './medicines.service';
import { KmMedicinesController } from './medicines.controller';
import { KmMedicines } from '../entity/medicines.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KmPrescriptionsModule } from '../charts/prescriptions/prescriptions.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KmMedicines]),
    forwardRef(() => KmPrescriptionsModule),
    CommonModule,
  ],
  controllers: [KmMedicinesController],
  providers: [KmMedicinesService],
  exports: [KmMedicinesService],
})
export class KmMedicinesModule {}
