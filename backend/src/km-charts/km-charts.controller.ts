import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { KmChartsService } from './km-charts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePrediagnosisDto } from './dto/create-prediagnosis.dto';

@ApiTags('한의과')
@Controller('km/charts')
export class KmChartsController {
  constructor(private readonly chartsService: KmChartsService) {}

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
  getPrediagnosis(@Param('chartId') chartId: number) {
    return this.chartsService.getPrediagnosis(chartId);
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
}
