import {
  BadRequestException,
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
} from '@nestjs/common';
import { MMedicineCategoriesService } from './medicine-categories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMMedicineCategoryDto } from './dto/create-medicine-category.dto';
import { UpdateMMedicineSubCategoryDto } from './dto/update-medicine-sub-category.dto';
import { UpdateMMedicineMainCategoryDto } from './dto/update-medicine-main-category.dto';
import { MMedicinesService } from '../medicines/medicines.service';

@ApiTags('의과')
@Controller('m/medicine-categories')
export class MMedicineCategoriesController {
  constructor(
    private readonly medicineCategoriesService: MMedicineCategoriesService,
    private readonly medicinesService: MMedicinesService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '약품 분류 조회',
  })
  async getMedicineCategories() {
    return this.medicineCategoriesService.getCategories();
  }

  @Post()
  @ApiOperation({
    summary: '약품 분류 생성',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '이미 존재하는 분류입니다.',
  })
  async postMedicineCategory(
    @Body() createMedicineCategoryDto: CreateMMedicineCategoryDto,
  ) {
    return this.medicineCategoriesService.createCategory(
      createMedicineCategoryDto,
    );
  }

  @Patch('main-category')
  @ApiOperation({
    summary: '약품 대분류 수정',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '이미 존재하는 대분류입니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async patchMedicineMainCategory(
    @Query('category') category: string,
    @Body() updateMedicineMainCategoryDto: UpdateMMedicineMainCategoryDto,
  ) {
    return this.medicineCategoriesService.updateMainCategory(
      category,
      updateMedicineMainCategoryDto,
    );
  }

  @Delete('main-category')
  @ApiOperation({
    summary: '약품 대분류 삭제',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '삭제되지 않은 소분류가 존재합니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async deleteMedicineMainCategory(@Query('category') category: string) {
    return this.medicineCategoriesService.deleteMainCategory(category);
  }

  @Patch('sub-category/:categoryId')
  @ApiOperation({
    summary: '약품 소분류 수정',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async patchMedicineSubCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() updateMedicineSubCategoryDto: UpdateMMedicineSubCategoryDto,
  ) {
    return this.medicineCategoriesService.updateSubCategory(
      categoryId,
      updateMedicineSubCategoryDto,
    );
  }

  @Delete('sub-category/:categoryId')
  @ApiOperation({
    summary: '약품 소분류 삭제',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '삭제되지 않은 약품이 존재합니다.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async deleteMedicineSubCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    const idDeleted =
      await this.medicinesService.checkDeletedMedicineByCategoryId(categoryId);

    if (!idDeleted) {
      throw new BadRequestException('삭제되지 않은 약품이 존재합니다.');
    }

    return this.medicineCategoriesService.deleteSubCategory(categoryId);
  }
}
