import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MCharts } from '../entity/charts.entity';
import { CreateVitalSignDto } from './dto/create-vital-sign.dto';
import { Orders } from 'src/orders/entity/orders.entity';
import { DEFAULT_M_CHART_FIND_OPTIONS } from './const/default-m-chart-find-options.const';
import { CreateMDiagnosisDto } from './dto/create-diagnosis.dto';
import { KmCharts } from 'src/km/entity/charts.entity';

@Injectable()
export class MChartsService {
  constructor(
    @InjectRepository(MCharts)
    private readonly mChartsRepository: Repository<MCharts>,
    @InjectRepository(KmCharts)
    private readonly kmChartsRepository: Repository<KmCharts>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
  ) {}

  async getChart(chartId: number) {
    const chart = await this.mChartsRepository.findOne({
      where: { id: chartId },
      relations: { patient: true }, // patient 관계를 명시적으로 불러옴
    });

    if (!chart) {
      throw new NotFoundException('Chart not found');
    }

    return chart;
  }

  async createVitalSign(chartId: number, vitalSignDto: CreateVitalSignDto) {
    const chart = await this.mChartsRepository.findOne({
      where: { id: chartId },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    return await this.mChartsRepository.save({
      ...chart,
      ...vitalSignDto,
    });
  }

  async updateStatus(chartId: number, status: number) {
    const chart = await this.mChartsRepository.findOne({
      where: { id: chartId },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    chart.status = status;
    await this.mChartsRepository.save(chart);

    const order = await this.ordersRepository.findOne({
      where: { mChart: { id: chartId } },
    });

    order.status = status;
    await this.ordersRepository.save(order);

    return chart;
  }

  async getPrediagnosis(chartId: number) {
    return await this.mChartsRepository.findOne({
      where: { id: chartId },
      relations: {
        complaints: true,
        patient: { history: true },
      },
    });
  }

  async getPastCharts(patientId: number) {
    const charts = await this.mChartsRepository.find({
      where: {
        patient: { id: patientId },
        status: 6,
      },
      select: ['id', 'createdAt'],
    });

    return charts;
  }

  async getVitalSignByChartNumber(chartNumber: string) {
    return await this.kmChartsRepository.findOne({
      where: { chartNumber },
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

  async getComplaint(chartId: number) {
    return await this.mChartsRepository.find({
      where: { id: chartId },
      ...DEFAULT_M_CHART_FIND_OPTIONS,
      relations: { complaints: true },
    });
  }

  async getHistory(chartId: number) {
    const chart = await this.mChartsRepository.findOne({
      where: { id: chartId },
      relations: { patient: { history: true } },
    });

    return chart?.patient?.history;
  }

  async getPastChart(chartId: number) {
    return await this.mChartsRepository.findOne({
      ...DEFAULT_M_CHART_FIND_OPTIONS,
      where: { id: chartId },
    });
  }

  async getDiagnosis(chartId: number) {
    return await this.mChartsRepository.findOne({
      where: { id: chartId },
      relations: {
        patient: true,
        prescriptions: { medicine: true },
      },
    });
  }

  async postDiagnosis(chartId: number, diagnosisDto: CreateMDiagnosisDto) {
    return await this.mChartsRepository.save({
      id: chartId,
      presentIllness: diagnosisDto.presentIllness,
      impression: diagnosisDto.impression,
      treatmentNote: diagnosisDto.treatmentNote,
    });
  }

  async getVitalSign(chartId: number) {
    return await this.mChartsRepository.findOne({
      where: { id: chartId },
      relations: { patient: true },
      select: {
        id: true,
        spO2: true,
        heartRate: true,
        bodyTemperature: true,
        systoleBloodPressure: true,
        diastoleBloodPressure: true,
        bloodGlucose: true,
        afterMeals: true,
        vsMemo: true,
        createdAt: true,
        patient: { id: true },
      },
    });
  }

  async getPastVitalSigns(patientId: number) {
    return await this.mChartsRepository.find({
      where: {
        status: 6,
        patient: { id: patientId },
      },
      order: {
        createdAt: 'DESC',
      },
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

  async getPharmacy(chartId: number) {
    return await this.mChartsRepository.findOne({
      ...DEFAULT_M_CHART_FIND_OPTIONS,
      where: { id: chartId },
      relations: { prescriptions: { medicine: true } },
    });
  }

  async checkChartExistsById(id: number) {
    return this.mChartsRepository.exists({
      where: { id },
    });
  }
}
