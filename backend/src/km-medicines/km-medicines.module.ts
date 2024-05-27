import { Module } from '@nestjs/common';
import { KmMedicinesService } from './km-medicines.service';
import { KmMedicinesController } from './km-medicines.controller';
import { KM_Medicines } from './entity/km-medicines.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([KM_Medicines])],
  controllers: [KmMedicinesController],
  providers: [KmMedicinesService],
})
export class KmMedicinesModule {}
