import { Module } from '@nestjs/common';
import { MMedicineCategoriesService } from './m-medicine-categories.service';
import { MMedicineCategoriesController } from './m-medicine-categories.controller';
import { M_Medicine_Categories } from './entity/m_medicine_categories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M_Medicines } from 'src/m-medicines/entity/m-medicines.entity';

@Module({
  imports: [TypeOrmModule.forFeature([M_Medicine_Categories, M_Medicines])],
  controllers: [MMedicineCategoriesController],
  providers: [MMedicineCategoriesService],
})
export class MMedicineCategoriesModule {}
