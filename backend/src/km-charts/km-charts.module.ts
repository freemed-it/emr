import { Module } from '@nestjs/common';
import { KmChartsService } from './km-charts.service';
import { KmChartsController } from './km-charts.controller';
import { KM_Charts } from './entity/km-charts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Histories } from 'src/patients/histories/entity/histories.entity';
import { KM_Complaints } from 'src/km-complaints/entity/km-complaints.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { MComplaintsService } from 'src/m-complaints/m-complaints.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([KM_Charts, Histories, KM_Complaints, Orders]),
  ],
  controllers: [KmChartsController],
  providers: [KmChartsService, MComplaintsService],
})
export class KmChartsModule {}
