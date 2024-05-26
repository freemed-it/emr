import { Module } from '@nestjs/common';
import { MMedicinesService } from './m-medicines.service';
import { MMedicinesController } from './m-medicines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { M_Medicines } from './entity/m-medicines.entity';

@Module({
  imports: [TypeOrmModule.forFeature([M_Medicines])],
  controllers: [MMedicinesController],
  providers: [MMedicinesService],
  exports: [MMedicinesService],
})
export class MMedicinesModule {}
