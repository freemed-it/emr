import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patients } from './entity/patients.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';
import { KM_Charts } from 'src/km-charts/entity/km-charts.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { Memos } from './memos/entity/memos.entity';
import { MemosService } from './memos/memos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patients, M_Charts, KM_Charts, Orders, Memos]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService, MemosService],
})
export class PatientsModule {}
