import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patients } from './entity/patients.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';
import { KM_Charts } from 'src/km-charts/entity/km-charts.entity';
import { Orders } from 'src/orders/entity/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, M_Charts, KM_Charts, Orders])],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
