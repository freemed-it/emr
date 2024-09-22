import { Module } from '@nestjs/common';
import { MemosService } from './memos.service';
import { MemosController } from './memos.controller';
import { Memos } from '../entity/memos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patients } from '../entity/patients.entity';
import { PatientsService } from '../patients.service';
import { MCharts } from 'src/m/entity/charts.entity';
import { KmCharts } from 'src/km/entity/charts.entity';
import { Orders } from 'src/orders/entity/orders.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Memos, Patients, MCharts, KmCharts, Orders]),
  ],
  controllers: [MemosController],
  providers: [MemosService, PatientsService],
})
export class MemosModule {}
