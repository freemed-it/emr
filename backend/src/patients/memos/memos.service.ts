import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Memos } from '../entity/memos.entity';
import { CreateMemoDto } from './dto/create-memo.dto';
import { Users } from 'src/users/entity/users.entity';
import { UpdateMemoDto } from './dto/update-memo.dto';

@Injectable()
export class MemosService {
  constructor(
    @InjectRepository(Memos)
    private memosRepository: Repository<Memos>,
  ) {}

  async createMemos(patientId: number, memoDto: CreateMemoDto, user: Users) {
    return this.memosRepository.save({
      patient: {
        id: patientId,
      },
      ...memoDto,
      writer: user.name,
    });
  }

  async updateMemos(memoId: number, memoDto: UpdateMemoDto, user: Users) {
    const memo = await this.memosRepository.findOne({
      where: { id: memoId },
    });

    if (!memo) {
      throw new NotFoundException();
    }

    return this.memosRepository.save({
      ...memo,
      ...memoDto,
      writer: user.name,
    });
  }
}
