import { Module } from '@nestjs/common';
import { KmPrescriptionsService } from './prescriptions.service';
import { KmPrescriptionsController } from './prescriptions.controller';
import { KmPrescriptions } from '../../entity/prescriptions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([KmPrescriptions])],
  controllers: [KmPrescriptionsController],
  providers: [KmPrescriptionsService],
})
export class KmPrescriptionsModule {}
