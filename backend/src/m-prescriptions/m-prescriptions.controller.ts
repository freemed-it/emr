import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
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
  constructor(private readonly prescriptionsService: MPrescriptionsService) {}

  @Patch(':prescriptionId')
  @ApiOperation({
    summary: '처방 수정',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async patchPrescription(
    @Param('prescriptionId', ParseIntPipe) prescriptionId: number,
    @Body() updatePrescriptionDto: UpdateMPrescriptionDto,
  ) {
    const prescriptionExists =
      await this.prescriptionsService.checkPrescriptionExistsById(
        prescriptionId,
      );
    if (!prescriptionExists) {
      throw new NotFoundException();
    }

    return this.prescriptionsService.updatePrescription(
      prescriptionId,
      updatePrescriptionDto,
    );
  }

  @Delete(':prescriptionId')
  @ApiOperation({
    summary: '처방 삭제',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async deletePrescription(
    @Param('prescriptionId', ParseIntPipe) prescriptionId: number,
  ) {
    const prescriptionExists =
      await this.prescriptionsService.checkPrescriptionExistsById(
        prescriptionId,
      );
    if (!prescriptionExists) {
      throw new NotFoundException();
    }

    return this.prescriptionsService.deletePrescription(prescriptionId);
  }

  @Get('history/:startDate/:endDate')
  @ApiOperation({
    summary: '히스토리 조회',
    description: 'cursor pagination - cursor 쿼리 파라미터를 이용해야 합니다.',
  })
  async getPrescriptionHistory(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Query() paginatePrescriptionHistoryDto: PaginateMPrescriptionHistoryDto,
  ) {
    return this.prescriptionsService.getPaginateHistory(
      startDate,
      endDate,
      paginatePrescriptionHistoryDto,
    );
  }
}
