import { Module } from '@nestjs/common';
import { MMedicinesService } from './medicines.service';
import { MMedicinesController } from './medicines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MMedicines } from '../entity/medicines.entity';
import { CommonModule } from 'src/common/common.module';
import { MMedicineCategories } from '../entity/medicine-categories.entity';
import { MMedicineCategoriesService } from '../medicine-categories/medicine-categories.service';
import { MPrescriptionsService } from '../charts/prescriptions/prescriptions.service';
import { MPrescriptions } from '../entity/prescriptions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MMedicines, MMedicineCategories, MPrescriptions]),
    CommonModule,
  ],
  controllers: [MMedicinesController],
  providers: [
    MMedicinesService,
    MMedicineCategoriesService,
    MPrescriptionsService,
  ],
  exports: [MMedicinesService],
})
export class MMedicinesModule {}
