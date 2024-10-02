import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Patch,
} from '@nestjs/common';
import { MPrescriptionsService } from './prescriptions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateMPrescriptionDto } from './dto/update-prescription.dto';
import { CreateMPrescriptionDto } from './dto/create-prescription.dto';
import { MMedicinesService } from 'src/m/medicines/medicines.service';

@ApiTags('의과')
@Controller('m/charts/:chartNumber/prescriptions')
export class MPrescriptionsController {
  constructor(
    private readonly prescriptionsService: MPrescriptionsService,
    private readonly medicinesService: MMedicinesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '처방 생성',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      '존재하지 않는 약품입니다. <small>medicineId에 해당하는 약품이 없는 경우</small>',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async postPrescription(
    @Param('chartNumber') chartNumber: string,
    @Body() prescriptionDto: CreateMPrescriptionDto,
  ) {
    const medicineExists = await this.medicinesService.checkMedicineExists(
      prescriptionDto.medicineId,
    );
    if (!medicineExists) {
      throw new NotFoundException('존재하지 않는 약품입니다.');
    }

    return await this.prescriptionsService.createPrescription(
      chartNumber,
      prescriptionDto,
    );
  }

  @Patch(':prescriptionId')
  @ApiOperation({
    summary: '처방 수정',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async patchPrescription(
    @Param('prescriptionId', ParseIntPipe) id: number,
    @Body() updatePrescriptionDto: UpdateMPrescriptionDto,
  ) {
    const prescriptionExists =
      await this.prescriptionsService.checkPrescriptionExists(id);
    if (!prescriptionExists) {
      throw new NotFoundException();
    }

    return this.prescriptionsService.updatePrescription(
      id,
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
  async deletePrescription(@Param('prescriptionId', ParseIntPipe) id: number) {
    const prescriptionExists =
      await this.prescriptionsService.checkPrescriptionExists(id);
    if (!prescriptionExists) {
      throw new NotFoundException();
    }

    return this.prescriptionsService.deletePrescription(id);
  }
}
