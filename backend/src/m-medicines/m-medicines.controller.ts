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
import { MMedicinesService } from './m-medicines.service';
import { CreateMMedicineDto } from './dto/create-m-medicine.dto';
import { UpdateMMedicineDto } from './dto/update-m-medicine.dto';
import { PaginateMMedicineDto } from './dto/paginate-m-medicine.dto';
import { MMedicineCategoriesService } from 'src/m-medicine-categories/m-medicine-categories.service';

@ApiTags('의과')
@Controller('m/medicines')
export class MMedicinesController {
  constructor(
    private readonly medicinesService: MMedicinesService,
    private readonly medicineCategoriesService: MMedicineCategoriesService,
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
  async getMedicine(@Param('medicineId', ParseIntPipe) medicineId: number) {
    return this.medicinesService.getMedicine(medicineId);
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
      await this.medicineCategoriesService.checkCategoryExistsById(
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
    @Param('medicineId', ParseIntPipe) medicineId: number,
    @Body() updateMedicineDto: UpdateMMedicineDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const categoryExists =
      await this.medicineCategoriesService.checkCategoryExistsById(
        updateMedicineDto.categoryId,
      );

    if (!categoryExists) {
      throw new NotFoundException('존재하지 않는 분류입니다.');
    }

    return this.medicinesService.updateMedicine(
      medicineId,
      updateMedicineDto,
      image,
    );
  }

  @Delete(':medicineId')
  @ApiOperation({
    summary: '약품 삭제',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async deleteMedicine(@Param('medicineId', ParseIntPipe) medicineId: number) {
    return this.medicinesService.deleteMedicine(medicineId);
  }
}
