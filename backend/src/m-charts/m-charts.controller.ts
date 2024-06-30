import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
  Get,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MChartsService } from './m-charts.service';
import { MPrescriptionsService } from 'src/m-prescriptions/m-prescriptions.service';
import { CreatePrediagnosisDto } from './dto/create-prediagnosis.dto';
import { CreateMPrescriptionDto } from 'src/m-prescriptions/dto/create-m-prescription.dto';
import { UpdatePharmacyStatusDto } from './dto/update-pharmacy-status-dto';

@ApiTags('의과')
@Controller('m/charts')
export class MChartsController {
  constructor(
    private readonly mChartsService: MChartsService,
    private readonly mPrescriptionsService: MPrescriptionsService,
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
