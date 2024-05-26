import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { MMedicinesModule } from './m-medicines/m-medicines.module';
import { M_Medicines } from './m-medicines/entity/m-medicines.entity';
import { MMedicineCategoriesModule } from './m-medicine-categories/m-medicine-categories.module';
import { M_Medicine_Categories } from './m-medicine-categories/entity/m_medicine_categories.entity';

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
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [M_Medicines, M_Medicine_Categories],
      synchronize: true,
    }),
    CommonModule,
    MMedicinesModule,
    MMedicineCategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
