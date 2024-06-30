import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { MPrescriptionsService } from './m-prescriptions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateMPrescriptionDto } from './dto/update-m-prescription.dto';

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
}
