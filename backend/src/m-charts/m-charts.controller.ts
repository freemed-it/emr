import { Controller, Post, Body, Param, HttpStatus, Get } from '@nestjs/common';
import { MChartsService } from './m-charts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePrediagnosisDto } from './dto/create-prediagnosis.dto';

@ApiTags('의과')
@Controller('m/charts')
export class MChartsController {
  constructor(private readonly mChartsService: MChartsService) {}

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
}
