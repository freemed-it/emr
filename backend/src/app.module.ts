import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { MMedicinesModule } from './m-medicines/m-medicines.module';
import { M_Medicines } from './m-medicines/entity/m-medicines.entity';
import { MMedicineCategoriesModule } from './m-medicine-categories/m-medicine-categories.module';
import { M_Medicine_Categories } from './m-medicine-categories/entity/m_medicine_categories.entity';
import { MChartsModule } from './m-charts/m-charts.module';
import { M_Charts } from './m-charts/entity/m-charts.entity';
import { MComplaintsModule } from './m-complaints/m-complaints.module';
import { M_Complaints } from './m-complaints/entity/m-complaints.entity';
import { MPrescriptionsModule } from './m-prescriptions/m-prescriptions.module';
import { M_Prescriptions } from './m-prescriptions/entity/m-prescriotions.entity';
import { HistoriesModule } from './patients/histories/histories.module';
import { Histories } from './patients/histories/entity/histories.entity';
import { Users } from './users/entity/users.entity';
import { UsersModule } from './users/users.module';
import { Patients } from './patients/entity/patients.entity';
import { PatientsModule } from './patients/patients.module';
import { Orders } from './orders/entity/orders.entity';
import { OrdersModule } from './orders/orders.module';
import { Memos } from './patients/memos/entity/memos.entity';
import { MemosModule } from './patients/memos/memos.module';
import { KM_Charts } from './km-charts/entity/km-charts.entity';
import { KmChartsModule } from './km-charts/km-charts.module';
import { KmComplaintsModule } from './km-complaints/km-complaints.module';
import { KmPrescriptionsModule } from './km-prescriptions/km-prescriptions.module';
import { KmMedicinesModule } from './km-medicines/km-medicines.module';
import { KM_Complaints } from './km-complaints/entity/km-complaints.entity';
import { KM_Prescriptions } from './km-prescriptions/entity/km-prescriotions.entity';
import { KM_Medicines } from './km-medicines/entity/km-medicines.entity';
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
      timezone: 'Asia/Seoul',
      entities: [
        M_Charts,
        M_Complaints,
        M_Prescriptions,
        M_Medicines,
        M_Medicine_Categories,
        Patients,
        Histories,
        Memos,
        Orders,
        Users,
        KM_Charts,
        KM_Complaints,
        KM_Prescriptions,
        KM_Medicines,
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
