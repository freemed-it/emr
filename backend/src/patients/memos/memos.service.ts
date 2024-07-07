import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Memos } from './entity/memos.entity';
import { Patients } from '../entity/patients.entity';
import { Repository } from 'typeorm';
import { CreateMemoDto } from './dto/create-memo.dto';
import { Users } from 'src/users/entity/users.entity';

@Injectable()
export class MemosService {
  constructor(
    @InjectRepository(Memos)
    private memosRepository: Repository<Memos>,
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
  ) {}

  async createMemo(patientId: number, memoDto: CreateMemoDto, user: Users) {
    const patient = await this.patientsRepository.findOne({
      where: { id: patientId },
    });

    const memo = this.memosRepository.create({
      ...memoDto,
      patient,
      account: user.account,
    });

    return this.memosRepository.save(memo);
  }
}
