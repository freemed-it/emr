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
import { KmMedicinesService } from './km-medicines.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateKMMedicineDto } from './dto/create-km-medicine.dto';
import { PaginateKMMedicineDto } from './dto/paginate-km-medicine.dto';
import { UpdateKMMedicineDto } from './dto/update-km-medicine.dto';

@ApiTags('한의과')
@Controller('km/medicines')
export class KmMedicinesController {
  constructor(private readonly medicinesService: KmMedicinesService) {}

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
  async getMedicine(@Param('medicineId', ParseIntPipe) medicineId: number) {
    return this.medicinesService.getMedicine(medicineId);
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
    @Param('medicineId', ParseIntPipe) medicineId: number,
    @Body() updateMedicineDto: UpdateKMMedicineDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
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
