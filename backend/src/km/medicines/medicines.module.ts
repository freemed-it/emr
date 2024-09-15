import { Module } from '@nestjs/common';
import { KmMedicinesService } from './medicines.service';
import { KmMedicinesController } from './medicines.controller';
import { KmMedicines } from '../entity/medicines.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([KmMedicines]), CommonModule],
  controllers: [KmMedicinesController],
  providers: [KmMedicinesService],
})
export class KmMedicinesModule {}
