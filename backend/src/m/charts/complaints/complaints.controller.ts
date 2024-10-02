import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { MComplaintsService } from './complaints.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('의과')
@Controller('m/charts/:chartNumber/complaints')
export class MComplaintsController {
  constructor(private readonly complaintsService: MComplaintsService) {}

  @Get()
  @ApiOperation({
    summary: 'C.C 상세 조회',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'C.C가 조회되었습니다.',
  })
  getComplaint(@Param('chartNumber') chartNumber: string) {
    return this.complaintsService.getComplaintByChartNumber(chartNumber);
  }
}
