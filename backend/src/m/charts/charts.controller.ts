import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
  Get,
  Patch,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MChartsService } from './charts.service';
import { MPrescriptionsService } from './prescriptions/prescriptions.service';
import { CreatePrediagnosisDto } from './dto/create-prediagnosis.dto';
import { UpdateMPharmacyDto } from './dto/update-pharmacy.dto';
import { CreateMDiagnosisDto } from './dto/create-diagnosis.dto';
import { MMedicinesService } from '../medicines/medicines.service';
import { OrdersService } from 'src/orders/orders.service';
import { Department } from 'src/orders/const/department.const';
import { HistoriesService } from 'src/patients/histories/histories.service';
import { MComplaintsService } from './complaints/complaints.service';
import { KmChartsService } from 'src/km/charts/charts.service';

@ApiTags('의과')
@Controller('m/charts')
export class MChartsController {
  constructor(
    private readonly mChartsService: MChartsService,
    private readonly kmChartsService: KmChartsService,
    private readonly historiesService: HistoriesService,
    private readonly complaintsService: MComplaintsService,
    private readonly prescriptionsService: MPrescriptionsService,
    private readonly ordersService: OrdersService,
    private readonly medicinesService: MMedicinesService,
  ) {}

  @Post('/:chartNumber/prediagnosis')
  @ApiOperation({
    summary: '예진 완료',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '예진 완료되었습니다.',
  })
  async postPrediagnosis(
    @Param('chartNumber') chartNumber: string,
    @Body() prediagnosisDto: CreatePrediagnosisDto,
  ) {
    const currentChart =
      await this.mChartsService.getChartByChartNumber(chartNumber);
    const vitalSign = await this.mChartsService.createVitalSign(
      chartNumber,
      prediagnosisDto.vistalSign,
    );
    const complaint = await this.complaintsService.createComplaint(
      chartNumber,
      currentChart.patient.id,
      prediagnosisDto.complaint,
    );

    const history = await this.historiesService.createHistory(
      currentChart.patient.id,
      prediagnosisDto.history,
    );

    await this.mChartsService.updateStatus(chartNumber, 2);

    return {
      vitalSign,
      complaint,
      history,
    };
  }

  @Get('/:chartNumber/prediagnosis')
  @ApiOperation({
    summary: '예진 조회',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '예진이 조회되었습니다.',
  })
  async getPrediagnosis(@Param('chartNumber') chartNumber: string) {
    const chart =
      await this.mChartsService.getPrediagnosisByChartNumber(chartNumber);

    // 차트 상태에 따른 예진 데이터 처리
    switch (chart.status) {
      case 1:
        const chartNumber = await this.ordersService.checkTodayChart(
          chart.patient.id,
          Department.KM,
        );

        const vitalSign = chartNumber
          ? await this.kmChartsService.getVitalSignByChartNumber(chartNumber)
          : null;

        const history = await this.historiesService.getPatientHistory(
          chart.patient.id,
        );

        return vitalSign ? { vitalSign, history } : { history };

      case 2:
        return chart;

      default:
        throw new BadRequestException('유효하지 않은 차트 상태입니다.');
    }
  }

  @Get('past/:patientId')
  @ApiOperation({
    summary: '과거 차트 목록',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '과거 차트 목록이 조회되었습니다',
  })
  async getPastCharts(@Param('patientId') patientId: number) {
    return this.mChartsService.getPastCharts(patientId);
  }

  @Get('/:chartNumber')
  @ApiOperation({
    summary: '과거 차트 상세 조회',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '과거 차트 상세가 조회되었습니다.',
  })
  getPastChart(@Param('chartNumber') chartNumber: string) {
    return this.mChartsService.getPastChartByChartNumber(chartNumber);
  }

  @Get(':chartNumber/diagnosis')
  @ApiOperation({
    summary: '본진 조회',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async getDiagnosis(@Param('chartNumber') chartNumber: string) {
    const chart =
      await this.mChartsService.getDiagnosisByChartNumber(chartNumber);
    if (!chart) {
      throw new NotFoundException();
    }

    if (chart.status < 2) {
      throw new BadRequestException(
        '해당 참여자의 예진이 완료되지 않았습니다.',
      );
    } else {
      const chartNumber = await this.ordersService.checkTodayChart(
        chart.patient.id,
        Department.M,
      );

      return { ...chart, mChartNumber: chartNumber };
    }
  }

  @Post(':chartNumber/diagnosis')
  @ApiOperation({
    summary: '본진 완료',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async postDiagnosis(
    @Param('chartNumber') chartNumber: string,
    @Body() diagnosisDto: CreateMDiagnosisDto,
  ) {
    const currentChart =
      await this.mChartsService.getChartByChartNumber(chartNumber);
    if (Number(currentChart.status) < 2 || Number(currentChart.status) > 3) {
      throw new BadRequestException(
        `예진 완료(2) 혹은 조제 대기(3) 중인 차트가 아닙니다. 차트 상태를 확인해 주세요. (현재 차트 상태: ${currentChart.status})`,
      );
    }

    await this.mChartsService.createDiagnosis(currentChart.id, diagnosisDto);

    // 조제 대기 중인 차트 -> 기존 처방 삭제
    if (currentChart.status === 3) {
      await this.prescriptionsService.deletePrescriptionsByChartNumber(
        chartNumber,
      );
    }

    const prescriptions = await Promise.all(
      diagnosisDto.prescriptions.map(async (prescription) => {
        const medicineExists = await this.medicinesService.checkMedicineExists(
          prescription.medicineId,
        );
        if (!medicineExists) {
          throw new NotFoundException('존재하지 않는 약품입니다.');
        }
        return this.prescriptionsService.createPrescription(
          chartNumber,
          prescription,
        );
      }),
    );

    const chart = await this.mChartsService.updateStatus(chartNumber, 3);

    return {
      ...chart,
      prescriptions,
    };
  }

  @Get(':chartNumber/vital-sign')
  @ApiOperation({
    summary: 'V/S 전체 조회',
  })
  async getVitalSigns(@Param('chartNumber') chartNumber: string) {
    const chartVitalSign =
      await this.mChartsService.getVitalSignByChartNumber(chartNumber);
    const pastVitalSigns = await this.mChartsService.getPastVitalSigns(
      chartVitalSign.patient.id,
    );

    return {
      now: chartVitalSign,
      past: pastVitalSigns,
    };
  }

  @Get(':chartNumber/pharmacy')
  @ApiOperation({
    summary: '약국 조회',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  getChartPharmacy(@Param('chartNumber') chartNumber: string) {
    return this.mChartsService.getPharmacyByChartNumber(chartNumber);
  }

  @Patch(':chartNumber/status')
  @ApiOperation({
    summary: '약국 수정',
  })
  async patchChartPharmacyStatus(
    @Param('chartNumber') chartNumber: string,
    @Body() pharmacyDto: UpdateMPharmacyDto,
  ) {
    const currentChart =
      await this.mChartsService.getChartByChartNumber(chartNumber);
    if (currentChart.status < 3 || currentChart.status >= 6) {
      throw new BadRequestException(
        `조제 전(< 3) 혹은 복약지도 완료(6)된 차트입니다. 차트 상태를 확인해 주세요. (현재 차트 상태: ${currentChart.status})`,
      );
    }

    // 복약지도 완료 시 약품 총량 줄이기 & 완료된 처방으로 수정
    if (pharmacyDto.status === 6) {
      const prescriptions =
        await this.prescriptionsService.getPrescriptionsByChartNumber(
          chartNumber,
        );
      prescriptions.forEach(async (prescription) => {
        await this.medicinesService.updateMedicineTotalAmount(
          prescription.medicine.id,
          prescription,
        );
        return await this.prescriptionsService.updatePrescriptionIsCompleted(
          prescription.id,
        );
      });
    }

    return await this.mChartsService.updateStatus(
      chartNumber,
      pharmacyDto.status,
    );
  }
}
