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
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MChartsService } from './m-charts.service';
import { MPrescriptionsService } from 'src/m-prescriptions/m-prescriptions.service';
import { CreatePrediagnosisDto } from './dto/create-prediagnosis.dto';
import { CreateMPrescriptionDto } from 'src/m-prescriptions/dto/create-m-prescription.dto';
import { UpdateMPharmacyDto } from './dto/update-m-pharmacy.dto';
import { CreateMDiagnosisDto } from './dto/create-m-diagnosis.dto';
import { MMedicinesService } from 'src/m-medicines/m-medicines.service';
import { OrdersService } from 'src/orders/orders.service';
import { Department } from 'src/orders/const/department.const';

@ApiTags('의과')
@Controller('m/charts')
export class MChartsController {
  constructor(
    private readonly chartsService: MChartsService,
    private readonly prescriptionsService: MPrescriptionsService,
    private readonly ordersService: OrdersService,
    private readonly medicinesService: MMedicinesService,
  ) {}

  @Post('/:chartId/prediagnosis')
  @ApiOperation({
    summary: '예진 완료',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '예진 완료되었습니다.',
  })
  async postPrediagnosis(
    @Param('chartId') chartId: number,
    @Body() prediagnosisDto: CreatePrediagnosisDto,
  ) {
    const vitalSign = await this.chartsService.createVitalSign(
      chartId,
      prediagnosisDto.vistalSign,
    );
    const complaint = await this.chartsService.createComplaint(
      chartId,
      prediagnosisDto.complaint,
    );
    const history = await this.chartsService.createHistory(
      chartId,
      prediagnosisDto.history,
    );

    await this.chartsService.updateStatus(chartId, 2);

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
    description: '예진이 조회되었습니다.',
  })
  async getPrediagnosis(@Param('chartId', ParseIntPipe) chartId: number) {
    const chart = await this.chartsService.getPrediagnosis(chartId);

    // 차트 상태에 따른 예진 데이터 처리
    switch (chart.status) {
      case 1:
        const chartNumber = await this.ordersService.checkTodayChart(
          chart.patient.id,
          Department.KM,
        );

        const vitalSign = chartNumber
          ? await this.chartsService.getVitalSignByChartNumber(chartNumber)
          : null;

        const history = await this.chartsService.getHistory(chartId);

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

  @Get('/:chartId/complaints')
  @ApiOperation({
    summary: '예진 C.C 상세 조회',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'C.C가 조회되었습니다.',
  })
  getComplaint(@Param('chartId') chartId: number) {
    return this.chartsService.getComplaint(chartId);
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
    return this.chartsService.getPastChart(chartId);
  }

  @Get(':chartId/diagnosis')
  @ApiOperation({
    summary: '본진 조회',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async getDiagnosis(@Param('chartId', ParseIntPipe) chartId: number) {
    const chart = await this.chartsService.getDiagnosis(chartId);
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

  @Post(':chartId/diagnosis')
  @ApiOperation({
    summary: '본진 완료',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async postDiagnosis(
    @Param('chartId', ParseIntPipe) chartId: number,
    @Body() diagnosisDto: CreateMDiagnosisDto,
  ) {
    const currentChart = await this.chartsService.getChart(chartId);
    if (Number(currentChart.status) < 2 || Number(currentChart.status) > 3) {
      throw new BadRequestException(
        `예진 완료(2) 혹은 조제 대기(3) 중인 차트가 아닙니다. 차트 상태를 확인해 주세요. (현재 차트 상태: ${currentChart.status})`,
      );
    }

    await this.chartsService.postDiagnosis(chartId, diagnosisDto);

    // 조제 대기 중인 차트 -> 기존 처방 삭제
    if (currentChart.status === 3) {
      await this.prescriptionsService.deletePrescriptionsByChartId(chartId);
    }

    const prescriptions = await Promise.all(
      diagnosisDto.prescriptions.map(async (prescription) => {
        const medicineExists =
          await this.medicinesService.checkMedicineExistsById(
            prescription.medicineId,
          );
        if (!medicineExists) {
          throw new NotFoundException('존재하지 않는 약품입니다.');
        }
        return this.prescriptionsService.createPrescription(
          chartId,
          prescription,
        );
      }),
    );

    const chart = await this.chartsService.updateStatus(chartId, 3);

    return {
      ...chart,
      prescriptions,
    };
  }

  @Get(':chartId/vital-sign')
  @ApiOperation({
    summary: 'V/S 전체 조회',
  })
  async getVitalSigns(@Param('chartId', ParseIntPipe) chartId: number) {
    const chartVitalSign = await this.chartsService.getVitalSign(chartId);
    const pastVitalSigns = await this.chartsService.getPastVitalSigns(
      chartVitalSign.patient.id,
    );

    return {
      now: chartVitalSign,
      past: pastVitalSigns,
    };
  }

  @Get(':chartId/pharmacy')
  @ApiOperation({
    summary: '약국 조회',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  getChartPharmacy(@Param('chartId', ParseIntPipe) chartId: number) {
    return this.chartsService.getPharmacy(chartId);
  }

  @Patch(':chartId/status')
  @ApiOperation({
    summary: '약국 차트 상태 수정',
  })
  async patchChartPharmacyStatus(
    @Param('chartId', ParseIntPipe) chartId: number,
    @Body() pharmacyDto: UpdateMPharmacyDto,
  ) {
    const currentChart = await this.chartsService.getChart(chartId);
    if (currentChart.status < 3 || currentChart.status >= 6) {
      throw new BadRequestException(
        `조제 전(< 3) 혹은 복약지도 완료(6)된 차트입니다. 차트 상태를 확인해 주세요. (현재 차트 상태: ${currentChart.status})`,
      );
    }

    // 복약지도 완료 시 약품 총량 줄이기 & 완료된 처방으로 수정
    if (pharmacyDto.status === 6) {
      const prescriptions =
        await this.prescriptionsService.getPrescriptions(chartId);
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

    return await this.chartsService.updateStatus(chartId, pharmacyDto.status);
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
  async postPrescription(
    @Param('chartId', ParseIntPipe) chartId: number,
    @Body() prescriptionDto: CreateMPrescriptionDto,
  ) {
    const chartExists = await this.chartsService.checkChartExistsById(chartId);
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
      chartId,
      prescriptionDto,
    );
  }
}
