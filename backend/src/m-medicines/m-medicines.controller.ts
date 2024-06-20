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

@ApiTags('의과')
@Controller('m/medicines')
export class MMedicinesController {
  constructor(private readonly mMedicinesService: MMedicinesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '약품 생성',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      '존재하지 않는 분류입니다. <small>categoryId에 해당하는 분류가 없는 경우</small>',
  })
  async postMMedicine(
    @Body() createMMedicineDto: CreateMMedicineDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.mMedicinesService.createMMedicine(
      createMMedicineDto,
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
  async deleteMMedicine(@Param('medicineId', ParseIntPipe) medicineId: number) {
    return this.mMedicinesService.deleteMedicine(medicineId);
  }
}
