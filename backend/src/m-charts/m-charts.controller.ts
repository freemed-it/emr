import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
  Get,
  ParseIntPipe,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MChartsService } from './m-charts.service';
import { MPrescriptionsService } from 'src/m-prescriptions/m-prescriptions.service';
import { CreatePrediagnosisDto } from './dto/create-prediagnosis.dto';
import { CreateMPrescriptionDto } from 'src/m-prescriptions/dto/create-m-prescription.dto';
import { UpdatePharmacyStatusDto } from './dto/update-pharmacy-status-dto';
import { CreateMDiagnosisDto } from './dto/create-m-diagnosis.dto';
import { MMedicinesService } from 'src/m-medicines/m-medicines.service';

@ApiTags('의과')
@Controller('m/charts')
export class MChartsController {
  constructor(
    private readonly mChartsService: MChartsService,
    private readonly mPrescriptionsService: MPrescriptionsService,
    private readonly mMedicineService: MMedicinesService,
  ) {}

  @Post('/:chartId/prediagnosis')
  @ApiOperation({
    summary: '예진 완료',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '예진 완료되었습니다.',
  })
  async createPrediagnosis(
    @Param('chartId') chartId: number,
    @Body() createPrediagnosisDto: CreatePrediagnosisDto,
  ) {
    const vitalSign = await this.mChartsService.createVitalSign(
      chartId,
      createPrediagnosisDto.vistalSign,
    );
    const complaint = await this.mChartsService.createComplaint(
      chartId,
      createPrediagnosisDto.complaint,
    );
    const history = await this.mChartsService.createHistory(
      chartId,
      createPrediagnosisDto.history,
    );

    await this.mChartsService.updateStatus(chartId, 2);

    return {
      vitalSign,
      history,
      complaint,
    };
  }

  @Get('/:chartId/prediagnosis')
  @ApiOperation({
    summary: '예진 조회',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '예진이 조회되었습니다',
  })
  getPrediagnosis(@Param('chartId') chartId: number) {
    return this.mChartsService.getPrediagnosis(chartId);
  }

  @Get('/:chartId/complaints')
  @ApiOperation({
    summary: '예진 C.C 상세 조회',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'C.C가 조회되었습니다.',
  })
  getComplaint(@Param('chartId') chartId: number) {
    return this.mChartsService.getComplaint(chartId);
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

  @Get('/:chartId')
  @ApiOperation({
    summary: '과거 차트 상세 조회',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '과거 차트 상세가 조회되었습니다.',
  })
  getPastChart(@Param('chartId') chartId: number) {
    return this.mChartsService.getPastChart(chartId);
  }

  @Get(':chartId/diagnosis')
  @ApiOperation({
    summary: '본진 조회',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  getDiagnosis(@Param('chartId', ParseIntPipe) chartId: number) {
    return this.mChartsService.getDiagnosis(chartId);
  }

  @Post(':chartId/diagnosis')
  @ApiOperation({
    summary: '본진 완료',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async postDiagnosis(
    @Param('chartId', ParseIntPipe) chartId: number,
    @Body() createMDiagnosisDto: CreateMDiagnosisDto,
  ) {
    const currentChart = await this.mChartsService.getChart(chartId);
    if (Number(currentChart.status) < 2 || Number(currentChart.status) > 3) {
      throw new BadRequestException(
        `예진 완료(2) 혹은 조제 대기(3) 중인 차트가 아닙니다. 차트 상태를 확인해 주세요. (현재 차트 상태: ${currentChart.status})`,
      );
    }

    const chart = await this.mChartsService.postDiagnosis(
      chartId,
      createMDiagnosisDto,
    );

    // 조제 대기 차트(이미 본진 완료)이면 기존 처방 삭제
    if (chart.status === 3) {
      await this.mPrescriptionsService.deletePrescriptionsByChartId(chartId);
    }

    const prescriptions = await Promise.all([
      ...createMDiagnosisDto.prescriptions.map((prescription) => {
        return this.mPrescriptionsService.createMPrescription(
          chartId,
          prescription,
        );
      }),
    ]);

    await this.mChartsService.updateStatus(chartId, 3);

    return {
      ...chart,
      prescriptions,
    };
  }

  @Get(':chartId/vital-sign')
  @ApiOperation({
    summary: 'V/S 조회',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  getVitalSign(@Param('chartId', ParseIntPipe) chartId: number) {
    return this.mChartsService.getVitalSign(chartId);
  }

  @Get('vital-sign/:patientId')
  @ApiOperation({
    summary: '과거 V/S 전체 조회',
  })
  getPastVitalSigns(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.mChartsService.getPastVitalSigns(patientId);
  }

  @Get('today/:patientId')
  @ApiOperation({
    summary: '금일 의과 차트 조회',
  })
  getTodayChart(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.mChartsService.getTodayChartByPatientId(patientId);
  }

  @Get(':chartId/pharmacy')
  @ApiOperation({
    summary: '약국 조회',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  getMChartPharmacy(@Param('chartId', ParseIntPipe) chartId: number) {
    return this.mChartsService.getPharmacy(chartId);
  }

  @Patch(':chartId/status')
  @ApiOperation({
    summary: '약국 차트 상태 수정',
  })
  async patchMChartPharmacyStatus(
    @Param('chartId', ParseIntPipe) chartId: number,
    @Body() updateMChartStatusDto: UpdatePharmacyStatusDto,
  ) {
    const currentChart = await this.mChartsService.getChart(chartId);
    if (currentChart.status < 3 || currentChart.status >= 6) {
      throw new BadRequestException(
        `조제 전(< 3) 혹은 복약지도 완료(6)된 차트입니다. 차트 상태를 확인해 주세요. (현재 차트 상태: ${currentChart.status})`,
      );
    }

    // 복약지도 완료 시 약품 총량 줄이기 & 완료된 처방으로 수정
    if (updateMChartStatusDto.status === 6) {
      const prescriptions =
        await this.mPrescriptionsService.getPrescriptions(chartId);
      prescriptions.map(async (prescription) => {
        await this.mMedicineService.updateMedicineTotalAmount(
          prescription.medicine.id,
          prescription,
        );
        return await this.mPrescriptionsService.updatePrescriptionIsCompleted(
          prescription.id,
        );
      });
    }

    return await this.mChartsService.updateStatus(
      chartId,
      updateMChartStatusDto.status,
    );
  }

  @Post(':chartId/prescriptions')
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
  async postMPrescription(
    @Param('chartId', ParseIntPipe) chartId: number,
    @Body() createMPrescriptionDto: CreateMPrescriptionDto,
  ) {
    return await this.mPrescriptionsService.createMPrescription(
      chartId,
      createMPrescriptionDto,
    );
  }
}
