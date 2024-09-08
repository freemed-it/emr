import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { KmChartsService } from './km-charts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePrediagnosisDto } from './dto/create-prediagnosis.dto';
import { KmPrescriptionsService } from '../km-prescriptions/km-prescriptions.service';
import { CreateKMPrescriptionDto } from '../km-prescriptions/dto/create-km-prescription.dto';
import { KmMedicinesService } from '../km-medicines/km-medicines.service';
import { OrdersService } from '../orders/orders.service';
import { Department } from '../orders/const/department.const';

@ApiTags('한의과')
@Controller('km/charts')
export class KmChartsController {
  constructor(
    private readonly chartsService: KmChartsService,
    private readonly prescriptionsService: KmPrescriptionsService,
    private readonly ordersService: OrdersService,
    private readonly medicinesService: KmMedicinesService,
  ) {}

  @Post('/:chartId/prediagnosis')
  @ApiOperation({
    summary: '예진 완료',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '예진이 완료되었습니다.',
  })
  async createPrediagnosis(
    @Param('chartId') chartId: number,
    @Body() createPrediagnosisDto: CreatePrediagnosisDto,
  ) {
    const vitalSign = await this.chartsService.createVitalSign(
      chartId,
      createPrediagnosisDto.vistalSign,
    );
    const complaint = await this.chartsService.createComplaint(
      chartId,
      createPrediagnosisDto.complaint,
    );
    const history = await this.chartsService.createHistory(
      chartId,
      createPrediagnosisDto.history,
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
    status: HttpStatus.OK,
    description: '예진이 조회되었습니다',
  })
  async getPrediagnosis(@Param('chartId') chartId: number) {
    const chart = await this.chartsService.getPrediagnosis(chartId);

    if (chart.status === 1) {
      const chartNumber = await this.ordersService.checkTodayChart(
        chart.patient.id,
        Department.M,
      );
      const vitalSign =
        await this.chartsService.getVitalSignByChartNumber(chartNumber);
      const history = await this.chartsService.getHistory(chartId);
      if (chartNumber) {
        return { vitalSign, history };
      } else {
        return history;
      }
    } else if (chart.status === 2) {
      return chart;
    }

    throw new BadRequestException();
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
    @Body() createPrescriptionDto: CreateKMPrescriptionDto,
  ) {
    const chartExists = await this.chartsService.checkChartExistsById(chartId);
    if (!chartExists) {
      throw new NotFoundException();
    }

    const medicineExists = await this.medicinesService.checkMedicineExistsById(
      createPrescriptionDto.medicineId,
    );
    if (!medicineExists) {
      throw new NotFoundException('존재하지 않는 약품입니다.');
    }

    return await this.prescriptionsService.createPrescription(
      chartId,
      createPrescriptionDto,
    );
  }

  @Get(':chartId/pharmacy')
  @ApiOperation({
    summary: '약국 조회',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  getMChartPharmacy(@Param('chartId', ParseIntPipe) chartId: number) {
    return this.chartsService.getPharmacy(chartId);
  }
}
