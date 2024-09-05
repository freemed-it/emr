import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KM_Medicines } from './entity/km-medicines.entity';
import { ILike, Repository } from 'typeorm';
import { CreateKMMedicineDto } from './dto/create-km-medicine.dto';
import { ConfigService } from '@nestjs/config';
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { PaginateKMMedicineDto } from './dto/paginate-km-medicine.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class KmMedicinesService {
  constructor(
    @InjectRepository(KM_Medicines)
    private readonly medicinesRepository: Repository<KM_Medicines>,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}

  async paginateMedicines(paginateDto: PaginateKMMedicineDto) {
    return this.commonService.paginate(paginateDto, this.medicinesRepository, {
      where: {
        ...(paginateDto.name && { name: ILike(`%${paginateDto.name}%`) }),
        ...(paginateDto.indication && {
          indication: ILike(`%${paginateDto.indication}%`),
        }),
      },
    });
  }

  async getMedicine(medicineId: number) {
    const medicine = await this.medicinesRepository.findOne({
      where: { id: medicineId },
    });

    if (!medicine) {
      throw new NotFoundException();
    }

    return medicine;
  }

  async createMedicine(
    medicineDto: CreateKMMedicineDto,
    image: Express.Multer.File,
  ) {
    const imagePath = await this.uploadImage(image, medicineDto.name);

    return await this.medicinesRepository.save({
      ...medicineDto,
      image: imagePath,
    });
  }

  async uploadImage(image: Express.Multer.File, name: string) {
    if (!image) return;

    const s3Region = this.configService.get('AWS_S3_REGION');
    const s3ImageBucket = this.configService.get('AWS_S3_IMAGE_BUCKET_NAME');
    const client = new S3Client({
      region: s3Region,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
    const ext = image.mimetype.split('/')[1];
    const key = `${env}/km-medicines/${name}-${Date.now()}.${ext}`;

    try {
      await client.send(
        new PutObjectCommand({
          Key: key,
          Body: image.buffer,
          Bucket: s3ImageBucket,
          ACL: ObjectCannedACL.public_read,
          ContentType: image.mimetype,
        }),
      );

      return `https://${s3ImageBucket}.s3.${s3Region}.amazonaws.com/${key}`;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
