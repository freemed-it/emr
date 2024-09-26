import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MCharts } from '../entity/charts.entity';
import { CreateVitalSignDto } from './dto/create-vital-sign.dto';
import { Orders } from 'src/orders/entity/orders.entity';
import { DEFAULT_M_CHART_FIND_OPTIONS } from './const/default-m-chart-find-options.const';
import { CreateMDiagnosisDto } from './dto/create-diagnosis.dto';
import { KmCharts } from 'src/km/entity/charts.entity';
import { generateChartNumber } from 'src/common/util/generateChartNumber.util';
import { Department } from 'src/orders/const/department.const';

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

  async getChart(chartNumber: string) {
    const chart = await this.mChartsRepository.findOne({
      where: { chartNumber },
      relations: { patient: true },
    });

    if (!chart) {
      throw new NotFoundException('Chart not found');
    }

    return chart;
  }

  async createChart(patientId: number) {
    const chartNumber = await generateChartNumber(
      Department.M,
      this.mChartsRepository,
    );
    return await this.mChartsRepository.save({
      patient: { id: patientId },
      chartNumber,
    });
  }

  async createVitalSign(chartNumber: string, vitalSignDto: CreateVitalSignDto) {
    const chart = await this.mChartsRepository.findOne({
      where: { chartNumber },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    return await this.mChartsRepository.save({
      ...chart,
      ...vitalSignDto,
    });
  }

  async updateStatus(chartNumber: string, status: number) {
    const chart = await this.mChartsRepository.findOne({
      where: { chartNumber },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    chart.status = status;
    await this.mChartsRepository.save(chart);

    const order = await this.ordersRepository.findOne({
      where: { mChart: { chartNumber } },
    });

    order.status = status;
    await this.ordersRepository.save(order);

    return chart;
  }

  async getPrediagnosis(chartNumber: string) {
    return await this.mChartsRepository.findOne({
      where: { chartNumber },
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

  async getPastChart(chartNumber: string) {
    return await this.mChartsRepository.findOne({
      ...DEFAULT_M_CHART_FIND_OPTIONS,
      where: { chartNumber },
    });
  }

  async getDiagnosis(chartNumber: string) {
    return await this.mChartsRepository.findOne({
      where: { chartNumber },
      relations: {
        patient: true,
        prescriptions: { medicine: true },
      },
    });
  }

  async postDiagnosis(chartNumber: string, diagnosisDto: CreateMDiagnosisDto) {
    const chart = await this.mChartsRepository.findOne({
      where: { chartNumber },
    });
    return await this.mChartsRepository.save({
      id: chart.id,
      presentIllness: diagnosisDto.presentIllness,
      impression: diagnosisDto.impression,
      treatmentNote: diagnosisDto.treatmentNote,
    });
  }

  async getVitalSign(chartNumber: string) {
    return await this.mChartsRepository.findOne({
      where: { chartNumber },
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

  async getPharmacy(chartNumber: string) {
    return await this.mChartsRepository.findOne({
      ...DEFAULT_M_CHART_FIND_OPTIONS,
      where: { chartNumber },
      relations: { prescriptions: { medicine: true } },
    });
  }

  async checkChartExistsByChartNumber(chartNumber: string) {
    return this.mChartsRepository.exists({
      where: { chartNumber },
    });
  }
}
