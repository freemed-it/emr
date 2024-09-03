import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
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

@ApiTags('한의과')
@Controller('km/medicines')
export class KmMedicinesController {
  constructor(private readonly medicinesService: KmMedicinesService) {}

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
  async postKMMedicine(
    @Body() createMedicineDto: CreateKMMedicineDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.medicinesService.createMedicine(createMedicineDto, image);
  }
}
