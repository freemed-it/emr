import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KM_Charts } from './entity/km-charts.entity';
import { KM_Complaints } from 'src/km-complaints/entity/km-complaints.entity';
import { Histories } from 'src/patients/histories/entity/histories.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { Repository } from 'typeorm';
import { CreateVitalSignDto } from './dto/create-vital-sign.dto';
import { CreateKMComplaintDto } from '../km-complaints/dto/create-km-complaint.dto';
import { CreateHistoryDto } from '../patients/histories/dto/create-history.dto';
import { DEFAULT_KM_CHART_FIND_OPTIONS } from './const/default-km-chart-find-options.const';

@Injectable()
export class KmChartsService {
  constructor(
    @InjectRepository(KM_Charts)
    private readonly chartsRepository: Repository<KM_Charts>,
    @InjectRepository(KM_Complaints)
    private readonly complaintsRepository: Repository<KM_Complaints>,
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

  async createComplaint(chartId: number, complaintDto: CreateKMComplaintDto) {
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
      where: { kmChart: { id: chartId } },
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

  async getPastCharts(patientId: number) {
    const charts = await this.chartsRepository.find({
      where: {
        patient: { id: patientId },
        status: 6,
      },
      select: ['id', 'createdAt'],
    });

    return charts;
  }

  async getComplaint(chartId: number) {
    return this.complaintsRepository.find({
      where: { chart: { id: chartId } },
    });
  }

  async getPastChart(chartId: number) {
    return await this.chartsRepository.findOne({
      ...DEFAULT_KM_CHART_FIND_OPTIONS,
      where: { id: chartId },
    });
  }
}
