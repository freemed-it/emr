import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { MMedicineCategoriesService } from './m-medicine-categories.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMMedicineCategoryDto } from './dto/create-m-medicine-category.dto';

@ApiTags('의과')
@Controller('m/medicine-categories')
export class MMedicineCategoriesController {
  constructor(
    private readonly mMedicineCategoriesService: MMedicineCategoriesService,
  ) {}

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
}
