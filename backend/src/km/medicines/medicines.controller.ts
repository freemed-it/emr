import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { KmMedicinesService } from './medicines.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateKMMedicineDto } from './dto/create-medicine.dto';
import { PaginateKMMedicineDto } from './dto/paginate-medicine.dto';
import { UpdateKMMedicineDto } from './dto/update-medicine.dto';
import { PaginateKmMedicineHistoryDto } from './dto/paginate-medicine-history.dto';
import { KmPrescriptionsService } from '../charts/prescriptions/prescriptions.service';

@ApiTags('한의과')
@Controller('km/medicines')
export class KmMedicinesController {
  constructor(
    private readonly medicinesService: KmMedicinesService,
    private readonly prescriptionsService: KmPrescriptionsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '약품 목록 조회',
    description: 'cursor pagination - cursor 쿼리 파라미터를 이용해야 합니다.',
  })
  async getMedicines(@Query() paginateMedicineDto: PaginateKMMedicineDto) {
    return this.medicinesService.paginateMedicines(paginateMedicineDto);
  }

  @Get(':medicineId')
  @ApiOperation({
    summary: '약품 상세 조회',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async getMedicine(@Param('medicineId', ParseIntPipe) id: number) {
    return this.medicinesService.getMedicine(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '약품 생성',
  })
  async postMedicine(
    @Body() createMedicineDto: CreateKMMedicineDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.medicinesService.createMedicine(createMedicineDto, image);
  }

  @Patch(':medicineId')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '약품 수정',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async patchMedicine(
    @Param('medicineId', ParseIntPipe) id: number,
    @Body() updateMedicineDto: UpdateKMMedicineDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.medicinesService.updateMedicine(id, updateMedicineDto, image);
  }

  @Delete(':medicineId')
  @ApiOperation({
    summary: '약품 삭제',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async deleteMedicine(@Param('medicineId', ParseIntPipe) id: number) {
    return this.medicinesService.deleteMedicine(id);
  }

  @Get('history/:startDate/:endDate')
  @ApiOperation({
    summary: '히스토리 조회',
    description: 'cursor pagination - cursor 쿼리 파라미터를 이용해야 합니다.',
  })
  async getPrescriptionHistory(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Query() paginateMedicineHistoryDto: PaginateKmMedicineHistoryDto,
  ) {
    return this.prescriptionsService.getPaginateHistory(
      startDate,
      endDate,
      paginateMedicineHistoryDto,
    );
  }
}
