import { Module } from '@nestjs/common';
import { MPrescriptionsService } from './m-prescriptions.service';
import { MPrescriptionsController } from './m-prescriptions.controller';
import { M_Prescriptions } from './entity/m-prescriotions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([M_Prescriptions])],
  controllers: [MPrescriptionsController],
  providers: [MPrescriptionsService],
  exports: [MPrescriptionsService],
})
export class MPrescriptionsModule {}
