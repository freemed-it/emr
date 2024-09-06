import { Module } from '@nestjs/common';
import { MPrescriptionsService } from './m-prescriptions.service';
import { MPrescriptionsController } from './m-prescriptions.controller';
import { M_Prescriptions } from './entity/m-prescriptions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';
import { M_Medicines } from 'src/m-medicines/entity/m-medicines.entity';

@Module({
  imports: [TypeOrmModule.forFeature([M_Prescriptions, M_Charts, M_Medicines])],
  controllers: [MPrescriptionsController],
  providers: [MPrescriptionsService],
  exports: [MPrescriptionsService],
})
export class MPrescriptionsModule {}
