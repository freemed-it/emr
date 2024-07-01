import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const chart = await this.chartsRepository.findOne({
      where: { id: chartId },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    return await this.chartsRepository.save({
      ...chart,
      ...vitalSignDto,
    });
  }

  async createComplaint(chartId: number, complaintDto: CreateMComplaintDto) {
    const chart = await this.chartsRepository.findOne({
      where: { id: chartId },
      relations: { patient: true },
    });

    if (!chart) {
      throw new NotFoundException('Chart not found');
    }

    const complaint = this.complaintsRepository.create({
      ...complaintDto,
      chart,
      patient: { id: chart.patient.id },
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

  async updateStatus(chartId: number, status: number) {
    const chart = await this.chartsRepository.findOne({
      where: { id: chartId },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    chart.status = status;
    await this.chartsRepository.save(chart);

    const order = await this.ordersRepository.findOne({
      where: { mChart: { id: chartId } },
    });

    order.status = status;
    await this.ordersRepository.save(order);

    return chart;
  }

  async getPrediagnosis(chartId: number) {
    const chart = await this.chartsRepository.findOne({
      where: { id: chartId },
      relations: {
        complaints: true,
        patient: { history: true },
      },
    });

    if (chart.status < 2) {
      throw new BadRequestException('예진이 완료되지 않았습니다');
    }

    if (chart.status >= 2) {
      return chart;
    }
  }

  async getComplaint(chartId: number) {
    return this.complaintsRepository.find({
      where: { chart: { id: chartId } },
    });
  }

  async getPastCharts(patientId: number) {
    const charts = await this.chartsRepository.find({
      where: {
        patient: { id: patientId },
        status: 7,
      },
      select: ['id', 'createdAt'],
    });

    return charts;
  }

  async getPastPrediagnosis(chartId: number) {
    return await this.chartsRepository.find({
      where: { id: chartId },
      relations: ['complaints', 'prescriptions'], // 필요한 관계 추가
    });
  }

  async getVitalSign(chartId: number) {
    return await this.chartsRepository.findOne({
      where: { id: chartId },
      select: [
        'spO2',
        'heartRate',
        'bodyTemperature',
        'systoleBloodPressure',
        'diastoleBloodPressure',
        'bloodGlucose',
        'afterMeals',
        'vsMemo',
        'createdAt',
      ],
    });
  }
}
