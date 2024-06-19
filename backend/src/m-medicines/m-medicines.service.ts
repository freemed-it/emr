import { BadRequestException, Injectable } from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { M_Medicines } from './entity/m-medicines.entity';
import { CreateMMedicineDto } from './dto/create-m-medicine.dto';
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { M_Medicine_Categories } from 'src/m-medicine-categories/entity/m_medicine_categories.entity';

@Injectable()
export class MMedicinesService {
  constructor(
    @InjectRepository(M_Medicines)
    private readonly mMedicinesRepository: Repository<M_Medicines>,
    @InjectRepository(M_Medicine_Categories)
    private readonly mMedicineCategoriesRepository: Repository<M_Medicine_Categories>,
    private readonly configService: ConfigService,
  ) {}

  async createMMedicine(
    mMedicineDto: CreateMMedicineDto,
    image: Express.Multer.File,
  ) {
    const category = await this.mMedicineCategoriesRepository.findOne({
      where: {
        id: mMedicineDto.categoryId,
      },
    });

    if (!category) {
      throw new BadRequestException('존재하지 않는 분류입니다.');
    }

    const { categoryId, ...restMMedicineDto } = mMedicineDto;
    const imagePath = await this.uploadImage(image, mMedicineDto.name);

    return await this.mMedicinesRepository.save({
      ...restMMedicineDto,
      image: imagePath,
      category: {
        id: categoryId,
      },
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
    const key = `${env}/m-medicines/${name}-${Date.now()}.${ext}`;

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

  async checkDeletedMMedicinesByCategoryId(categoryId: number) {
    const [, deletedMedicineCount] =
      await this.mMedicinesRepository.findAndCount({
        where: {
          category: {
            id: categoryId,
          },
          deletedAt: Not(IsNull()),
        },
        withDeleted: true,
      });

    const [, medicineCount] = await this.mMedicinesRepository.findAndCount({
      where: {
        category: {
          id: categoryId,
        },
      },
      withDeleted: true,
    });

    return deletedMedicineCount === medicineCount;
  }
}
