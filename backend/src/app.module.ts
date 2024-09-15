import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { MMedicinesModule } from './m/medicines/medicines.module';
import { MMedicines } from './m/entity/medicines.entity';
import { MMedicineCategoriesModule } from './m/medicine-categories/medicine-categories.module';
import { MMedicineCategories } from './m/entity/medicine-categories.entity';
import { MChartsModule } from './m/charts/charts.module';
import { MCharts } from './m/entity/charts.entity';
import { MComplaintsModule } from './m/charts/complaints/complaints.module';
import { MComplaints } from './m/entity/complaints.entity';
import { MPrescriptionsModule } from './m/charts/prescriptions/prescriptions.module';
import { MPrescriptions } from './m/entity/prescriptions.entity';
import { HistoriesModule } from './patients/histories/histories.module';
import { Histories } from './patients/entity/histories.entity';
import { Users } from './users/entity/users.entity';
import { UsersModule } from './users/users.module';
import { Patients } from './patients/entity/patients.entity';
import { PatientsModule } from './patients/patients.module';
import { Orders } from './orders/entity/orders.entity';
import { OrdersModule } from './orders/orders.module';
import { Memos } from './patients/entity/memos.entity';
import { MemosModule } from './patients/memos/memos.module';
import { KmCharts } from './km/entity/charts.entity';
import { KmChartsModule } from './km/charts/charts.module';
import { KmComplaintsModule } from './km/charts/complaints/complaints.module';
import { KmPrescriptionsModule } from './km/charts/prescriptions/prescriptions.module';
import { KmMedicinesModule } from './km/medicines/medicines.module';
import { KmComplaints } from './km/entity/complaints.entity';
import { KmPrescriptions } from './km/entity/prescriptions.entity';
import { KmMedicines } from './km/entity/medicines.entity';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
} from './common/const/env-keys.const';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './auth/guard/access-token.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : process.env.NODE_ENV === 'staging'
            ? '.env.staging'
            : '.env.local',
      ],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEY]),
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      timezone: '+09:00',
      entities: [
        MCharts,
        MComplaints,
        MPrescriptions,
        MMedicines,
        MMedicineCategories,
        Patients,
        Histories,
        Memos,
        Orders,
        Users,
        KmCharts,
        KmComplaints,
        KmPrescriptions,
        KmMedicines,
      ],
      synchronize: false,
    }),
    CommonModule,
    MChartsModule,
    MComplaintsModule,
    MPrescriptionsModule,
    MMedicinesModule,
    MMedicineCategoriesModule,
    PatientsModule,
    HistoriesModule,
    MemosModule,
    OrdersModule,
    UsersModule,
    KmChartsModule,
    KmComplaintsModule,
    KmPrescriptionsModule,
    KmMedicinesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
