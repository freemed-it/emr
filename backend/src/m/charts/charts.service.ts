import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MCharts } from '../entity/charts.entity';
import { CreateVitalSignDto } from './dto/create-vital-sign.dto';
import { Orders } from 'src/orders/entity/orders.entity';
import { DEFAULT_M_CHART_FIND_OPTIONS } from './const/default-m-chart-find-options.const';
import { CreateMDiagnosisDto } from './dto/create-diagnosis.dto';
import { generateChartNumber } from 'src/common/util/generateChartNumber.util';
import { Department } from 'src/orders/const/department.const';

@Injectable()
export class MChartsService {
  constructor(
    @InjectRepository(MCharts)
    private readonly chartsRepository: Repository<MCharts>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
  ) {}

  async getChartByChartNumber(chartNumber: string) {
    const chart = await this.chartsRepository.findOne({
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
      this.chartsRepository,
    );
    return await this.chartsRepository.save({
      patient: { id: patientId },
      chartNumber,
    });
  }

  async createVitalSign(chartNumber: string, vitalSignDto: CreateVitalSignDto) {
    const chart = await this.chartsRepository.findOne({
      where: { chartNumber },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    return await this.chartsRepository.save({
      ...chart,
      ...vitalSignDto,
    });
  }

  async updateStatus(chartNumber: string, status: number) {
    const chart = await this.chartsRepository.findOne({
      where: { chartNumber },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    chart.status = status;
    await this.chartsRepository.save(chart);

    const order = await this.ordersRepository.findOne({
      where: { mChart: { chartNumber } },
    });

    order.status = status;
    await this.ordersRepository.save(order);

    return chart;
  }

  async getPrediagnosisByChartNumber(chartNumber: string) {
    return await this.chartsRepository.findOne({
      where: { chartNumber },
      relations: {
        complaints: true,
        patient: { history: true },
      },
    });
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

  async getPastChartByChartNumber(chartNumber: string) {
    return await this.chartsRepository.findOne({
      ...DEFAULT_M_CHART_FIND_OPTIONS,
      where: { chartNumber },
    });
  }

  async getDiagnosisByChartNumber(chartNumber: string) {
    return await this.chartsRepository.findOne({
      where: { chartNumber },
      relations: {
        patient: true,
        prescriptions: { medicine: true },
      },
    });
  }

  async createDiagnosis(id: number, diagnosisDto: CreateMDiagnosisDto) {
    return await this.chartsRepository.save({
      id,
      presentIllness: diagnosisDto.presentIllness,
      impression: diagnosisDto.impression,
      treatmentNote: diagnosisDto.treatmentNote,
    });
  }

  async getVitalSignByChartNumber(chartNumber: string) {
    return await this.chartsRepository.findOne({
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
    return await this.chartsRepository.find({
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

  async getPharmacyByChartNumber(chartNumber: string) {
    return await this.chartsRepository.findOne({
      ...DEFAULT_M_CHART_FIND_OPTIONS,
      where: { chartNumber },
      relations: { prescriptions: { medicine: true } },
    });
  }

  async checkChartExistsByChartNumber(chartNumber: string) {
    return this.chartsRepository.exists({
      where: { chartNumber },
    });
  }
}
