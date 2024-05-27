import { Module } from '@nestjs/common';
import { PatientMemosService } from './patient-memos.service';
import { PatientMemosController } from './patient-memos.controller';
import { PatientMemos } from './entity/patient-memos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PatientMemos])],
  controllers: [PatientMemosController],
  providers: [PatientMemosService],
})
export class PatientMemosModule {}
