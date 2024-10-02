import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('참여자')
@Controller('patients/:patientId/histories')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}
  @Get()
  @ApiOperation({
    summary: '참여자 과거력 조회',
  })
  async getPatientHistory(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.historiesService.getPatientHistory(patientId);
  }
}
