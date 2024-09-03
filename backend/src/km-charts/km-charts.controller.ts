import { Body, Controller, HttpStatus, Param, Post } from '@nestjs/common';
import { KmChartsService } from './km-charts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePrediagnosisDto } from './dto/create-prediagnosis.dto';

@ApiTags('한의과')
@Controller('km/charts')
export class KmChartsController {
  constructor(private readonly kmChartsService: KmChartsService) {}

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
    const vitalSign = await this.kmChartsService.createVitalSign(
      chartId,
      createPrediagnosisDto.vistalSign,
    );
    const complaint = await this.kmChartsService.createComplaint(
      chartId,
      createPrediagnosisDto.complaint,
    );
    const history = await this.kmChartsService.createHistory(
      chartId,
      createPrediagnosisDto.history,
    );

    await this.kmChartsService.updateStatus(chartId, 2);

    return {
      vitalSign,
      history,
      complaint,
    };
  }
}
