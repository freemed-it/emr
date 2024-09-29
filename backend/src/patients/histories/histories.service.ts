import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Histories } from '../entity/histories.entity';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(Histories)
    private readonly historiesRepository: Repository<Histories>,
  ) {}

  async createHistory(patientId: number, historyDto: CreateHistoryDto) {
    const history = await this.historiesRepository.findOne({
      where: { patient: { id: patientId } },
    });

    return history
      ? await this.historiesRepository.save({
          ...history,
          ...historyDto,
        })
      : await this.historiesRepository.save({
          patient: { id: patientId },
          ...historyDto,
        });
  }

  getPatientHistory(patientId: number) {
    return this.historiesRepository.findOne({
      where: { patient: { id: patientId } },
    });
  }
}
