import { Module } from '@nestjs/common';
import { MMedicinesService } from './m-medicines.service';
import { MMedicinesController } from './m-medicines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M_Medicines } from './entity/m-medicines.entity';
import { M_Medicine_Categories } from 'src/m-medicine-categories/entity/m_medicine_categories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([M_Medicines, M_Medicine_Categories])],
  controllers: [MMedicinesController],
  providers: [MMedicinesService],
  exports: [MMedicinesService],
})
export class MMedicinesModule {}
