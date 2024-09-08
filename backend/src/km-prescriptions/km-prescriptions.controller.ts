import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { KmPrescriptionsService } from './km-prescriptions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateKMPrescriptionDto } from './dto/update-km-prescription.dto';
import { KmMedicinesService } from 'src/km-medicines/km-medicines.service';

@ApiTags('한의과')
@Controller('km/prescriptions')
export class KmPrescriptionsController {
  constructor(
    private readonly prescriptionsService: KmPrescriptionsService,
    private readonly medicinesService: KmMedicinesService,
  ) {}

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
  async patchPrescription(
    @Param('prescriptionId', ParseIntPipe) prescriptionId: number,
    @Body() updatePrescriptioneDto: UpdateKMPrescriptionDto,
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
      updatePrescriptioneDto,
    );
  }
}
