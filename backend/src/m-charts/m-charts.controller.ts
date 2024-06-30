import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MChartsService } from './m-charts.service';
import { MPrescriptionsService } from 'src/m-prescriptions/m-prescriptions.service';
import { CreatePrediagnosisDto } from './dto/create-prediagnosis.dto';
import { CreateMPrescriptionDto } from 'src/m-prescriptions/dto/create-m-prescription.dto';

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
  getPastPrediagnosis(@Param('chartId') chartId: number) {
    return this.mChartsService.getPastPrediagnosis(chartId);
  }

  @Post(':chartId/prescriptions')
  @ApiOperation({
    summary: '처방 생성',
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
