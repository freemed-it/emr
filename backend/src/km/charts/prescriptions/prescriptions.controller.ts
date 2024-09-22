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
import { KmPrescriptionsService } from './prescriptions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateKmPrescriptionDto } from './dto/update-prescription.dto';

@ApiTags('한의과')
@Controller('km/prescriptions')
export class KmPrescriptionsController {
  constructor(private readonly prescriptionsService: KmPrescriptionsService) {}

  @Patch(':prescriptionId')
  @ApiOperation({
    summary: '처방 수정',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async patchPrescription(
    @Param('prescriptionId', ParseIntPipe) prescriptionId: number,
    @Body() updatePrescriptionDto: UpdateKmPrescriptionDto,
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
