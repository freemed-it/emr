import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVitalSignDto } from './dto/create-vital-sign.dto';
import { CreateKmComplaintDto } from './complaints/dto/create-complaint.dto';
import { DEFAULT_KM_CHART_FIND_OPTIONS } from './const/default-km-chart-find-options.const';
import { CreateKmDiagnosisDto } from './dto/create-diagnosis.dto';
import { KmCharts } from '../entity/charts.entity';
import { MCharts } from 'src/m/entity/charts.entity';
import { KmComplaints } from '../entity/complaints.entity';
import { Histories } from 'src/patients/entity/histories.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { CreateHistoryDto } from 'src/patients/histories/dto/create-history.dto';

@Injectable()
export class KmChartsService {
  constructor(
    @InjectRepository(KmCharts)
    private readonly kmChartsRepository: Repository<KmCharts>,
    @InjectRepository(MCharts)
    private readonly mChartsRepository: Repository<MCharts>,
    @InjectRepository(KmComplaints)
    private readonly complaintsRepository: Repository<KmComplaints>,
    @InjectRepository(Histories)
    private readonly historiesRepository: Repository<Histories>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
  ) {}

  async getChart(chartId: number) {
    const chart = await this.kmChartsRepository.findOne({
      where: { id: chartId },
    });

    if (!chart) {
      throw new NotFoundException();
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

  async createComplaint(chartId: number, complaintDto: CreateKmComplaintDto) {
    const chart = await this.kmChartsRepository.findOne({
      where: { id: chartId },
      relations: { patient: true },
    });

    if (!chart) {
      throw new NotFoundException('Chart not found');
    }

    return this.complaintsRepository.save({
      ...complaintDto,
      chart,
      patient: { id: chart.patient.id },
    });
  }

  async createHistory(chartId: number, historyDto: CreateHistoryDto) {
    const chart = await this.kmChartsRepository.findOne({
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
