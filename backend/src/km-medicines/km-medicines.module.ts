import { Module } from '@nestjs/common';
import { KmMedicinesService } from './km-medicines.service';
import { KmMedicinesController } from './km-medicines.controller';
import { KM_Medicines } from './entity/km-medicines.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([KM_Medicines]), CommonModule],
  controllers: [KmMedicinesController],
  providers: [KmMedicinesService],
})
export class KmMedicinesModule {}
