import {
  Post,
  UseInterceptors,
  Controller,
  UploadedFile,
  Body,
  HttpStatus,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Get,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiConsumes,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { MMedicinesService } from './medicines.service';
import { CreateMMedicineDto } from './dto/create-medicine.dto';
import { UpdateMMedicineDto } from './dto/update-medicine.dto';
import { PaginateMMedicineDto } from './dto/paginate-medicine.dto';
import { MMedicineCategoriesService } from '../medicine-categories/medicine-categories.service';
import { PaginateMMedicineHistoryDto } from './dto/paginate-medicine-history.dto';
import { MPrescriptionsService } from '../charts/prescriptions/prescriptions.service';

@ApiTags('의과')
@Controller('m/medicines')
export class MMedicinesController {
  constructor(
    private readonly medicinesService: MMedicinesService,
    private readonly medicineCategoriesService: MMedicineCategoriesService,
    private readonly prescriptionsService: MPrescriptionsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '약품 목록 조회',
    description: 'cursor pagination - cursor 쿼리 파라미터를 이용해야 합니다.',
  })
  async getMedicines(@Query() paginateMedicineDto: PaginateMMedicineDto) {
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
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      '존재하지 않는 분류입니다. <small>categoryId에 해당하는 분류가 없는 경우</small>',
  })
  async postMedicine(
    @Body() createMedicineDto: CreateMMedicineDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const categoryExists =
      await this.medicineCategoriesService.checkCategoryExists(
        createMedicineDto.categoryId,
      );

    if (!categoryExists) {
      throw new NotFoundException('존재하지 않는 분류입니다.');
    }

    return await this.medicinesService.createMedicine(createMedicineDto, image);
  }

  @Patch(':medicineId')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '약품 수정',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      '존재하지 않는 분류입니다. <small>categoryId에 해당하는 분류가 없는 경우</small>',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async patchMedicine(
    @Param('medicineId', ParseIntPipe) id: number,
    @Body() updateMedicineDto: UpdateMMedicineDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const categoryExists =
      await this.medicineCategoriesService.checkCategoryExists(
        updateMedicineDto.categoryId,
      );

    if (!categoryExists) {
      throw new NotFoundException('존재하지 않는 분류입니다.');
    }

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
    @Query() paginateMedicineHistoryDto: PaginateMMedicineHistoryDto,
  ) {
    return this.prescriptionsService.getPaginateHistory(
      startDate,
      endDate,
      paginateMedicineHistoryDto,
    );
  }
}
