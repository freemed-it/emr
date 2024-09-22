import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Memos } from '../entity/memos.entity';
import { CreateMemoDto } from './dto/create-memo.dto';
import { Users } from 'src/users/entity/users.entity';
import { UpdateMemoDto } from './dto/update-memo.dto';
import { Patients } from '../entity/patients.entity';

@Injectable()
export class MemosService {
  constructor(
    @InjectRepository(Memos)
    private memosRepository: Repository<Memos>,
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
  ) {}

  async createMemos(patientId: number, memoDto: CreateMemoDto, user: Users) {
    const patient = await this.patientsRepository.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    return this.memosRepository.save({
      ...memoDto,
      patient,
      writer: user.name,
    });
  }

  async updateMemos(patientId: number, memoDto: UpdateMemoDto, user: Users) {
    const memo = await this.memosRepository.findOne({
      where: { patient: { id: patientId } },
    });

    if (!memo) {
      throw new Error('Memo not found');
    }

    return this.memosRepository.save({
      ...memo,
      ...memoDto,
      writer: user.name,
    });
  }
}
