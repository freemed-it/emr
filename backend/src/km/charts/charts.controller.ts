import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { KmChartsService } from './charts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateKmPrediagnosisDto } from './dto/create-prediagnosis.dto';
import { KmPrescriptionsService } from './prescriptions/prescriptions.service';
import { CreateKmPrescriptionDto } from './prescriptions/dto/create-prescription.dto';
import { KmMedicinesService } from '../medicines/medicines.service';
import { CreateKmDiagnosisDto } from './dto/create-diagnosis.dto';
import { UpdateKMPharmacyDto } from './dto/update-pharmacy.dto';
import { OrdersService } from 'src/orders/orders.service';
import { Department } from 'src/orders/const/department.const';
import { HistoriesService } from 'src/patients/histories/histories.service';
import { KmComplaintsService } from './complaints/complaints.service';

@ApiTags('한의과')
@Controller('km/charts')
export class KmChartsController {
  constructor(
    private readonly chartsService: KmChartsService,
    private readonly historiesService: HistoriesService,
    private readonly complaintsService: KmComplaintsService,
    private readonly prescriptionsService: KmPrescriptionsService,
    private readonly ordersService: OrdersService,
    private readonly medicinesService: KmMedicinesService,
  ) {}

  @Post('/:chartNumber/prediagnosis')
  @ApiOperation({
    summary: '예진 완료',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '예진이 완료되었습니다.',
  })
  async postPrediagnosis(
    @Param('chartNumber') chartNumber: string,
    @Body() prediagnosisDto: CreateKmPrediagnosisDto,
  ) {
    const currentChart = await this.chartsService.getChart(chartNumber);

    const vitalSign = await this.chartsService.createVitalSign(
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

    await this.chartsService.updateStatus(chartNumber, 2);

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
    const chart = await this.chartsService.getPrediagnosis(chartNumber);
    switch (chart.status) {
      case 1:
        const chartNumber = await this.ordersService.checkTodayChart(
          chart.patient.id,
          Department.M,
        );

        const vitalSign = chartNumber
          ? await this.chartsService.getVitalSignByChartNumber(chartNumber)
          : null;

        const history = await this.historiesService.getHistoryByPatientId(
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
    return this.chartsService.getPastCharts(patientId);
  }

  @Get('/:chartNumber/complaints')
  @ApiOperation({
    summary: '예진 C.C 상세 조회',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'C.C가 조회되었습니다.',
  })
  getComplaint(@Param('chartNumber') chartNumber: string) {
    return this.complaintsService.getComplaint(chartNumber);
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
    return this.chartsService.getPastChart(chartNumber);
  }

  @Get(':chartNumber/diagnosis')
  @ApiOperation({
    summary: '본진 조회',
  })
  async getDiagnosis(@Param('chartNumber') chartNumber: string) {
    const chart = await this.chartsService.getDiagnosis(chartNumber);
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
    @Body() createDiagnosisDto: CreateKmDiagnosisDto,
  ) {
    const currentChart = await this.chartsService.getChart(chartNumber);
    if (Number(currentChart.status) < 2 || Number(currentChart.status) > 3) {
      throw new BadRequestException(
        `예진 완료(2) 혹은 조제 대기(3) 중인 차트가 아닙니다. 차트 상태를 확인해 주세요. (현재 차트 상태: ${currentChart.status})`,
      );
    }

    await this.chartsService.postDiagnosis(chartNumber, createDiagnosisDto);

    // 조제 대기 중인 차트 -> 기존 처방 삭제
    if (currentChart.status === 3) {
      await this.prescriptionsService.deletePrescriptionsByChartNumber(
        chartNumber,
      );
    }

    const prescriptions = await Promise.all(
      createDiagnosisDto.prescriptions.map(async (prescription) => {
        const medicineExists =
          await this.medicinesService.checkMedicineExistsById(
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

    const chart = await this.chartsService.updateStatus(chartNumber, 3);

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
    const chartVitalSign = await this.chartsService.getVitalSign(chartNumber);
    const pastVitalSigns = await this.chartsService.getPastVitalSigns(
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
  getChartPharmacy(@Param('chartNumber') chartNumber: string) {
    return this.chartsService.getPharmacy(chartNumber);
  }

  @Patch(':chartNumber/status')
  @ApiOperation({
    summary: '약국 차트 상태 수정',
  })
  async patchChartPharmacyStatus(
    @Param('chartNumber') chartNumber: string,
    @Body() pharmacyDto: UpdateKMPharmacyDto,
  ) {
    const currentChart = await this.chartsService.getChart(chartNumber);
    if (currentChart.status < 3 || currentChart.status >= 6) {
      throw new BadRequestException(
        `조제 전(< 3) 혹은 복약지도 완료(6)된 차트입니다. 차트 상태를 확인해 주세요. (현재 차트 상태: ${currentChart.status})`,
      );
    }

    // 복약지도 완료 시 약품 총량 줄이기 & 완료된 처방으로 수정
    if (pharmacyDto.status === 6) {
      const prescriptions =
        await this.prescriptionsService.getPrescriptions(chartNumber);
      prescriptions.forEach(async (prescription) => {
        await this.medicinesService.updateMedicineTotalAmount(
          prescription.medicine.id,
          prescription,
        );
        await this.prescriptionsService.updatePrescriptionIsCompleted(
          prescription.id,
        );
      });
    }

    return await this.chartsService.updateStatus(
      chartNumber,
      pharmacyDto.status,
    );
  }

  @Post(':chartNumber/prescriptions')
  @ApiOperation({
    summary: '처방 생성',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      '존재하지 않는 약품입니다. <small>medicineId에 해당하는 약품이 없는 경우</small>',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async postPrescription(
    @Param('chartNumber') chartNumber: string,
    @Body() prescriptionDto: CreateKmPrescriptionDto,
  ) {
    const chartExists =
      await this.chartsService.checkChartExistsByNumber(chartNumber);
    if (!chartExists) {
      throw new NotFoundException();
    }

    const medicineExists = await this.medicinesService.checkMedicineExistsById(
      prescriptionDto.medicineId,
    );
    if (!medicineExists) {
      throw new NotFoundException('존재하지 않는 약품입니다.');
    }

    return await this.prescriptionsService.createPrescription(
      chartNumber,
      prescriptionDto,
    );
  }

  @Get(':chartNumber/pharmacy')
  @ApiOperation({
    summary: '약국 조회',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  getMChartPharmacy(@Param('chartNumber') chartNumber: string) {
    return this.chartsService.getPharmacy(chartNumber);
  }
}
