import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { M_Charts } from './entity/m-charts.entity';
import { CreateVitalSignDto } from './dto/create-vital-sign.dto';
import { M_Complaints } from 'src/m-complaints/entity/m-complaints.entity';
import { CreateMComplaintDto } from '../m-complaints/dto/create-m-complaint.dto';
import { CreateHistoryDto } from 'src/patients/histories/dto/create-history.dto';
import { Histories } from 'src/patients/histories/entity/histories.entity';
import { Orders } from 'src/orders/entity/orders.entity';

@Injectable()
export class MChartsService {
  constructor(
    @InjectRepository(M_Charts)
    private readonly chartsRepository: Repository<M_Charts>,
    @InjectRepository(M_Complaints)
    private readonly complaintsRepository: Repository<M_Complaints>,
    @InjectRepository(Histories)
    private readonly historiesRepository: Repository<Histories>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
  ) {}

  async createVitalSign(chartId: number, vitalSignDto: CreateVitalSignDto) {
    const vistalSign = await this.chartsRepository.findOne({
      where: { id: chartId },
    });

    if (!vistalSign) {
      throw new NotFoundException();
    }

    Object.assign(vistalSign, vitalSignDto);
    return this.chartsRepository.save(vistalSign);
  }

  async createComplaint(chartId: number, complaintDto: CreateMComplaintDto) {
    const complaint = this.complaintsRepository.create({
      ...complaintDto,
      chart: { id: chartId } as any,
    });

    return this.complaintsRepository.save(complaint);
  }

  async createHistory(chartId: number, historyDto: CreateHistoryDto) {
    const chart = await this.chartsRepository.findOne({
      where: { id: chartId },
      relations: { patient: { history: true } },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    return await this.historiesRepository.save({
      patient: {
        id: chart.patient.id,
      },
      ...chart.patient.history,
      ...historyDto,
    });
  }

  async updateStatus(chartId: number) {
    const chart = await this.chartsRepository.findOne({
      where: { id: chartId },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    chart.status = 2;
    await this.chartsRepository.save(chart);

    const orders = await this.ordersRepository.find({
      where: { mChart: { id: chartId } },
    });

    if (orders.length > 0) {
      orders.forEach((order) => {
        order.status = 2;
      });
      await this.ordersRepository.save(orders);
    }

    return chart;
  }
}
