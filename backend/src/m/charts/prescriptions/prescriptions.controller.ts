import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { MPrescriptionsService } from './prescriptions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateMPrescriptionDto } from './dto/update-prescription.dto';

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
}
