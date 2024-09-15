import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patients } from './entity/patients.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MCharts } from 'src/m/entity/charts.entity';
import { KmCharts } from 'src/km/entity/charts.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { Memos } from './entity/memos.entity';
import { MemosService } from './memos/memos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patients, MCharts, KmCharts, Orders, Memos]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService, MemosService],
})
export class PatientsModule {}
