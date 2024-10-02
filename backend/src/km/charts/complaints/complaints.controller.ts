import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { KmComplaintsService } from './complaints.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('한의과')
@Controller('km/charts/:chartNumber/complaints')
export class KmComplaintsController {
  constructor(private readonly complaintsService: KmComplaintsService) {}

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
