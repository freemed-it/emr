import { Module } from '@nestjs/common';
import { MChartsService } from './m-charts.service';
import { MChartsController } from './m-charts.controller';
import { M_Charts } from './entity/m-charts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M_Complaints } from 'src/m-complaints/entity/m-complaints.entity';
import { MComplaintsService } from 'src/m-complaints/m-complaints.service';
import { Histories } from 'src/patients/histories/entity/histories.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { MPrescriptionsModule } from 'src/m-prescriptions/m-prescriptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([M_Charts, Histories, M_Complaints, Orders]),
    MPrescriptionsModule,
  ],
  controllers: [MChartsController],
  providers: [MChartsService, MComplaintsService],
})
export class MChartsModule {}
