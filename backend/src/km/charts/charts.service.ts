import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVitalSignDto } from './dto/create-vital-sign.dto';
import { DEFAULT_KM_CHART_FIND_OPTIONS } from './const/default-km-chart-find-options.const';
import { CreateKmDiagnosisDto } from './dto/create-diagnosis.dto';
import { KmCharts } from '../entity/charts.entity';
import { MCharts } from 'src/m/entity/charts.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { generateChartNumber } from 'src/common/util/generateChartNumber.util';
import { Department } from 'src/orders/const/department.const';

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

  async getChart(chartNumber: string) {
    const chart = await this.kmChartsRepository.findOne({
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
      Department.KM,
      this.kmChartsRepository,
    );
    return await this.kmChartsRepository.save({
      patient: { id: patientId },
      chartNumber,
    });
  }

  async createVitalSign(chartNumber: string, vitalSignDto: CreateVitalSignDto) {
    const chart = await this.kmChartsRepository.findOne({
      where: { chartNumber },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    return await this.kmChartsRepository.save({
      ...chart,
      ...vitalSignDto,
    });
  }

  async updateStatus(chartNumber: string, status: number) {
    const chart = await this.kmChartsRepository.findOne({
      where: { chartNumber },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    chart.status = status;
    await this.kmChartsRepository.save(chart);

    const order = await this.ordersRepository.findOne({
      where: { chartNumber },
    });

    order.status = status;
    await this.ordersRepository.save(order);

    return chart;
  }

  async getPrediagnosis(chartNumber: string) {
    return await this.kmChartsRepository.findOne({
      where: { chartNumber },
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

  async getPastChart(chartNumber: string) {
    return await this.kmChartsRepository.findOne({
      ...DEFAULT_KM_CHART_FIND_OPTIONS,
      where: { chartNumber },
    });
  }

  async checkChartExistsByNumber(chartNumber: string) {
    return this.kmChartsRepository.exists({
      where: { chartNumber },
    });
  }

  async getDiagnosis(chartNumber: string) {
    return await this.kmChartsRepository.findOne({
      where: { chartNumber },
      relations: {
        patient: true,
        prescriptions: { medicine: true },
      },
    });
  }

  async postDiagnosis(chartNumber: string, diagnosisDto: CreateKmDiagnosisDto) {
    return await this.kmChartsRepository.save({
      chartNumber,
      presentIllness: diagnosisDto.presentIllness,
      impression: diagnosisDto.impression,
      treatmentNote: diagnosisDto.treatmentNote,
    });
  }

  async getVitalSign(chartNumber: string) {
    return await this.kmChartsRepository.findOne({
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

  async getPharmacy(chartNumber: string) {
    return await this.kmChartsRepository.findOne({
      ...DEFAULT_KM_CHART_FIND_OPTIONS,
      where: { chartNumber },
      relations: { prescriptions: { medicine: true } },
    });
  }
}
