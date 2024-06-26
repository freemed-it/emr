import { Controller, Post, Body, Param, HttpStatus } from '@nestjs/common';
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

    await this.mChartsService.updateStatus(chartId);

    return {
      vitalSign,
      history,
      complaint,
    };
  }
}
