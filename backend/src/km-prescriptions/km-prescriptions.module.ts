import { Module } from '@nestjs/common';
import { KmPrescriptionsService } from './km-prescriptions.service';
import { KmPrescriptionsController } from './km-prescriptions.controller';
import { KM_Prescriptions } from './entity/km-prescriotions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([KM_Prescriptions])],
  controllers: [KmPrescriptionsController],
  providers: [KmPrescriptionsService],
})
export class KmPrescriptionsModule {}
