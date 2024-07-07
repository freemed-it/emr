import { Module } from '@nestjs/common';
import { MemosService } from './memos.service';
import { MemosController } from './memos.controller';
import { Memos } from './entity/memos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patients } from '../entity/patients.entity';
import { Users } from 'src/users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Memos, Patients, Users])],
  controllers: [MemosController],
  providers: [MemosService],
})
export class MemosModule {}
