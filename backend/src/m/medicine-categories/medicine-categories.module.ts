import { Module } from '@nestjs/common';
import { MMedicineCategoriesService } from './medicine-categories.service';
import { MMedicineCategoriesController } from './medicine-categories.controller';
import { MMedicineCategories } from '../entity/medicine-categories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { MMedicines } from '../entity/medicines.entity';
import { MMedicinesService } from '../medicines/medicines.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MMedicineCategories, MMedicines]),
    CommonModule,
  ],
  controllers: [MMedicineCategoriesController],
  providers: [MMedicineCategoriesService, MMedicinesService],
})
export class MMedicineCategoriesModule {}
