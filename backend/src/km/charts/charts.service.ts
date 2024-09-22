import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVitalSignDto } from './dto/create-vital-sign.dto';
import { DEFAULT_KM_CHART_FIND_OPTIONS } from './const/default-km-chart-find-options.const';
import { CreateKmDiagnosisDto } from './dto/create-diagnosis.dto';
import { KmCharts } from '../entity/charts.entity';
import { MCharts } from 'src/m/entity/charts.entity';
import { Orders } from 'src/orders/entity/orders.entity';

@Injectable()
export class KmChartsService {
  constructor(
    @InjectRepository(KmCharts)
    private readonly kmChartsRepository: Repository<KmCharts>,
    @InjectRepository(MCharts)
    private readonly mChartsRepository: Repository<MCharts>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
  ) {}

  async getChart(chartId: number) {
    const chart = await this.kmChartsRepository.findOne({
      where: { id: chartId },
      relations: { patient: true }, // patient 관계를 명시적으로 불러옴
    });

    if (!chart) {
      throw new NotFoundException('Chart not found');
    }

    return chart;
  }

  async createVitalSign(chartId: number, vitalSignDto: CreateVitalSignDto) {
    const chart = await this.kmChartsRepository.findOne({
      where: { id: chartId },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    return await this.kmChartsRepository.save({
      ...chart,
      ...vitalSignDto,
    });
  }

  async updateStatus(chartId: number, status: number) {
    const chart = await this.kmChartsRepository.findOne({
      where: { id: chartId },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    chart.status = status;
    await this.kmChartsRepository.save(chart);

    const order = await this.ordersRepository.findOne({
      where: { kmChart: { id: chartId } },
    });

    order.status = status;
    await this.ordersRepository.save(order);

    return chart;
  }

  async getPrediagnosis(chartId: number) {
    return await this.kmChartsRepository.findOne({
      where: { id: chartId },
      relations: {
        complaints: true,
        patient: { history: true },
      },
    });
  }

  async getPastCharts(patientId: number) {
    const charts = await this.kmChartsRepository.find({
      where: {
        patient: { id: patientId },
        status: 6,
      },
      select: ['id', 'createdAt'],
    });

    return charts;
  }

  async getVitalSignByChartNumber(chartNumber: string) {
    return await this.mChartsRepository.findOne({
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
    return await this.kmChartsRepository.find({
      where: { id: chartId },
      ...DEFAULT_KM_CHART_FIND_OPTIONS,
      relations: { complaints: true },
    });
  }

  async getHistory(chartId: number) {
    const chart = await this.kmChartsRepository.findOne({
      where: { id: chartId },
      relations: { patient: { history: true } },
    });

    return chart?.patient?.history;
  }

  async getPastChart(chartId: number) {
    return await this.kmChartsRepository.findOne({
      ...DEFAULT_KM_CHART_FIND_OPTIONS,
      where: { id: chartId },
    });
  }

  async checkChartExistsById(id: number) {
    return this.kmChartsRepository.exists({
      where: { id },
    });
  }

  async getDiagnosis(chartId: number) {
    return await this.kmChartsRepository.findOne({
      where: { id: chartId },
      relations: {
        patient: true,
        prescriptions: { medicine: true },
      },
    });
  }

  async postDiagnosis(chartId: number, diagnosisDto: CreateKmDiagnosisDto) {
    return await this.kmChartsRepository.save({
      id: chartId,
      presentIllness: diagnosisDto.presentIllness,
      impression: diagnosisDto.impression,
      treatmentNote: diagnosisDto.treatmentNote,
    });
  }

  async getVitalSign(chartId: number) {
    return await this.kmChartsRepository.findOne({
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
    return await this.kmChartsRepository.find({
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
    return await this.kmChartsRepository.findOne({
      ...DEFAULT_KM_CHART_FIND_OPTIONS,
      where: { id: chartId },
      relations: { prescriptions: { medicine: true } },
    });
  }
}
