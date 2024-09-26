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
import { MChartsService } from 'src/m/charts/charts.service';
import { OrdersService } from 'src/orders/orders.service';
import { CommonService } from 'src/common/common.service';
import { KmChartsService } from 'src/km/charts/charts.service';
import { HistoriesService } from './histories/histories.service';
import { Histories } from './entity/histories.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patients,
      MCharts,
      KmCharts,
      Orders,
      Memos,
      Histories,
    ]),
  ],
  controllers: [PatientsController],
  providers: [
    PatientsService,
    MemosService,
    MChartsService,
    KmChartsService,
    OrdersService,
    CommonService,
    HistoriesService,
  ],
})
export class PatientsModule {}
