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

@ApiTags('의과')
@Controller('m/medicines')
export class MMedicinesController {
  constructor(private readonly mMedicinesService: MMedicinesService) {}

  @Get(':medicineId')
  @ApiOperation({
    summary: '약품 조회',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async getMMedicine(@Param('medicineId', ParseIntPipe) medicineId: number) {
    return this.mMedicinesService.getMedicine(medicineId);
  }

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
  async patchMMedicine(
    @Param('medicineId', ParseIntPipe) medicineId: number,
    @Body() updateMMedicineDto: UpdateMMedicineDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.mMedicinesService.updateMedicine(
      medicineId,
      updateMMedicineDto,
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
