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
} from '@nestjs/common';
import { MMedicineCategoriesService } from './m-medicine-categories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMMedicineCategoryDto } from './dto/create-m-medicine-category.dto';
import { UpdateMMedicineSubCategoryDto } from './dto/update-m-medicine-sub-category.dto';
import { UpdateMMedicineMainCategoryDto } from './dto/update-m-medicine-main-category.dto';

@ApiTags('의과')
@Controller('m/medicine-categories')
export class MMedicineCategoriesController {
  constructor(
    private readonly mMedicineCategoriesService: MMedicineCategoriesService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '약품 분류 조회',
  })
  async getMMedicineCategories() {
    return this.mMedicineCategoriesService.getCategories();
  }

  @Post()
  @ApiOperation({
    summary: '약품 분류 생성',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '이미 존재하는 분류입니다.',
  })
  async postMMedicineCategory(
    @Body() createMMedicineCategoryDto: CreateMMedicineCategoryDto,
  ) {
    return this.mMedicineCategoriesService.createCategory(
      createMMedicineCategoryDto,
    );
  }

  @Patch('main-category')
  @ApiOperation({
    summary: '약품 대분류 수정',
  })
  async patchMMedicineMainCategory(
    @Query('category') category: string,
    @Body() updateMMedicineMainCategoryDto: UpdateMMedicineMainCategoryDto,
  ) {
    return this.mMedicineCategoriesService.updateMainCategory(
      category,
      updateMMedicineMainCategoryDto,
    );
  }

  @Delete('main-category')
  @ApiOperation({
    summary: '약품 대분류 삭제',
  })
  async deleteMMedicineMainCategory(@Query('category') category: string) {
    return this.mMedicineCategoriesService.deleteMainCategory(category);
  }

  @Patch('sub-category/:categoryId')
  @ApiOperation({
    summary: '약품 소분류 수정',
  })
  async patchMMedicineSubCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() updateMMedicineSubCategoryDto: UpdateMMedicineSubCategoryDto,
  ) {
    return this.mMedicineCategoriesService.updateSubCategory(
      categoryId,
      updateMMedicineSubCategoryDto,
    );
  }

  @Delete('sub-category/:categoryId')
  @ApiOperation({
    summary: '약품 소분류 삭제',
  })
  async deleteMMedicineSubCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.mMedicineCategoriesService.deleteSubCategory(categoryId);
  }
}
