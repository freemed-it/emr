import { Module } from '@nestjs/common';
import { MPrescriptionsService } from './m-prescriptions.service';
import { MPrescriptionsController } from './m-prescriptions.controller';
import { M_Prescriptions } from './entity/m-prescriptions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([M_Prescriptions, M_Charts])],
  controllers: [MPrescriptionsController],
  providers: [MPrescriptionsService],
  exports: [MPrescriptionsService],
})
export class MPrescriptionsModule {}
