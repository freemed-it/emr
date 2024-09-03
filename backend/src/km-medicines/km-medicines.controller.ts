import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { KmMedicinesService } from './km-medicines.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateKMMedicineDto } from './dto/create-km-medicine.dto';

@ApiTags('한의과')
@Controller('km/medicines')
export class KmMedicinesController {
  constructor(private readonly kmMedicinesService: KmMedicinesService) {}

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
    return await this.kmMedicinesService.createMedicine(
      createMedicineDto,
      image,
    );
  }
}
