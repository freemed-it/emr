import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { MPrescriptionsService } from './m-prescriptions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateMPrescriptionDto } from './dto/update-m-prescription.dto';
import { PaginateMPrescriptionHistoryDto } from './dto/paginate-m-prescription-history.dto';

@ApiTags('의과')
@Controller('m/prescriptions')
export class MPrescriptionsController {
  constructor(private readonly mPrescriptionsService: MPrescriptionsService) {}

  @Patch(':prescriptionId')
  @ApiOperation({
    summary: '처방 수정',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      '존재하지 않는 약품입니다. <small>medicineId에 해당하는 약품이 없는 경우</small>',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async patchMPrescription(
    @Param('prescriptionId', ParseIntPipe) prescriptionId: number,
    @Body() updateMPrescriptioneDto: UpdateMPrescriptionDto,
  ) {
    return this.mPrescriptionsService.updatePrescription(
      prescriptionId,
      updateMPrescriptioneDto,
    );
  }

  @Delete(':prescriptionId')
  @ApiOperation({
    summary: '처방 삭제',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async deleteMPrescription(
    @Param('prescriptionId', ParseIntPipe) prescriptionId: number,
  ) {
    return this.mPrescriptionsService.deletePrescription(prescriptionId);
  }

  @Get('history/:startDate/:endDate')
  @ApiOperation({
    summary: '히스토리 조회',
    description: 'cursor pagination - cursor 쿼리 파라미터를 이용해야 합니다.',
  })
  async getMPrescriptionHistory(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Query() paginateMPrescriptionHistoryDto: PaginateMPrescriptionHistoryDto,
  ) {
    return this.mPrescriptionsService.getPaginateHistory(
      startDate,
      endDate,
      paginateMPrescriptionHistoryDto,
    );
  }
}
