import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { KmPrescriptionsService } from './prescriptions.service';
import { KmPrescriptionsController } from './prescriptions.controller';
import { KmPrescriptions } from '../../entity/prescriptions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KmMedicinesModule } from 'src/km/medicines/medicines.module';
import { KmChartsModule } from '../charts.module';
import { KmChartExistsMiddleware } from '../middleware/chart-exists.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([KmPrescriptions]),
    forwardRef(() => KmChartsModule),
    forwardRef(() => KmMedicinesModule),
  ],
  controllers: [KmPrescriptionsController],
  providers: [KmPrescriptionsService],
  exports: [KmPrescriptionsService],
})
export class KmPrescriptionsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(KmChartExistsMiddleware)
      .forRoutes(KmPrescriptionsController);
  }
}
