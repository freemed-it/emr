import { Injectable } from '@nestjs/common';
import { M_Charts } from './entity/m-charts.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MChartsService {
  constructor(
    @InjectRepository(M_Charts) // type orm으로부터 주입되는 레포지토리라는 것을 보여주기 위해서 애노테이션 추가, PostsModel을 주입할 거라고 입력
    private readonly mChartsRepository: Repository<M_Charts>, // Repository 타입. PostsModel을 다루는 레포지토리 선언
  ) {}

  async createTest() {
    const chart = this.mChartsRepository.create({
      chartNumber: 1,
      status: 0,
    });

    const newChart = await this.mChartsRepository.save(chart);

    return newChart;
  }
}
