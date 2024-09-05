import { Module } from '@nestjs/common';
import { MMedicinesService } from './m-medicines.service';
import { MMedicinesController } from './m-medicines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M_Medicines } from './entity/m-medicines.entity';
import { M_Medicine_Categories } from 'src/m-medicine-categories/entity/m_medicine_categories.entity';
import { CommonModule } from 'src/common/common.module';
import { MMedicineCategoriesService } from 'src/m-medicine-categories/m-medicine-categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([M_Medicines, M_Medicine_Categories]),
    CommonModule,
  ],
  controllers: [MMedicinesController],
  providers: [MMedicinesService, MMedicineCategoriesService],
  exports: [MMedicinesService],
})
export class MMedicinesModule {}
