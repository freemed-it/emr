import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { M_Medicines } from './entity/m-medicines.entity';
import { CreateMMedicineDto } from './dto/create-m-medicine.dto';
import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { UpdateMMedicineDto } from './dto/update-m-medicine.dto';
import { PaginateMMedicineDto } from './dto/paginate-m-medicine.dto';
import { CommonService } from 'src/common/common.service';
import { convertDosesCountByDay } from 'src/common/util/convert.util';
import { M_Prescriptions } from 'src/m-prescriptions/entity/m-prescriotions.entity';

@Injectable()
export class MMedicinesService {
  constructor(
    @InjectRepository(M_Medicines)
    private readonly medicinesRepository: Repository<M_Medicines>,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}

  async paginateMedicines(paginateDto: PaginateMMedicineDto) {
    return this.commonService.paginate(paginateDto, this.medicinesRepository, {
      where: {
        ...(paginateDto.name && { name: ILike(`%${paginateDto.name}%`) }),
        ...(paginateDto.ingredient && {
          ingredient: ILike(`%${paginateDto.ingredient}%`),
        }),
        ...(paginateDto.categoryId && {
          category: { id: paginateDto.categoryId },
        }),
      },
      relations: { category: true },
    });
  }

  async getMedicine(medicineId: number) {
    const medicine = await this.medicinesRepository.findOne({
      where: { id: medicineId },
      relations: { category: true },
    });

    if (!medicine) {
      throw new NotFoundException();
    }

    return medicine;
  }

  async createMedicine(
    medicineDto: CreateMMedicineDto,
    image: Express.Multer.File,
  ) {
    const { categoryId, ...restMedicineDto } = medicineDto;
    const imagePath = await this.uploadImage(image, medicineDto.name);

    return await this.medicinesRepository.save({
      ...restMedicineDto,
      image: imagePath,
      category: { id: categoryId },
    });
  }

  async updateMedicine(
    medicineId: number,
    medicineDto: UpdateMMedicineDto,
    image: Express.Multer.File,
  ) {
    const medicine = await this.medicinesRepository.findOne({
      where: { id: medicineId },
    });

    if (!medicine) {
      throw new NotFoundException();
    }

    const { categoryId, ...restMedicineDto } = medicineDto;

    // 사진 변경 (이미 있으면 삭제 후 업로드)
    if (!medicineDto.hasOwnProperty('image') && image) {
      if (medicine.image) {
        await this.deleteUploadedImage(medicine.image);
      }
      const imagePath = await this.uploadImage(image, medicineDto.name);
      restMedicineDto.image = imagePath;
    }

    // 사진 삭제
    if (medicineDto.hasOwnProperty('image') && !image && medicine.image) {
      await this.deleteUploadedImage(medicine.image);
      restMedicineDto.image = null;
    }

    const newMedicine = await this.medicinesRepository.preload({
      id: medicineId,
      ...restMedicineDto,
      category: {
        id: categoryId,
      },
    });

    return await this.medicinesRepository.save(newMedicine);
  }

  async deleteMedicine(medicineId: number) {
    const medicine = await this.medicinesRepository.findOne({
      where: { id: medicineId },
    });

    if (!medicine) {
      throw new NotFoundException();
    }

    await this.medicinesRepository.softDelete(medicineId);

    if (medicine.image) {
      await this.deleteUploadedImage(medicine.image);
      await this.medicinesRepository.save({
        ...medicine,
        image: null,
      });
    }

    return medicineId;
  }

  async updateMedicineTotalAmount(
    medicineId: number,
    prescriptionDto: M_Prescriptions,
  ) {
    const medicine = await this.medicinesRepository.findOne({
      where: { id: medicineId },
    });

    if (!medicine) {
      throw new NotFoundException();
    }

    const dosesTotal =
      prescriptionDto.doses *
      convertDosesCountByDay(prescriptionDto.dosesCountByDay) *
      prescriptionDto.dosesDay;

    return await this.medicinesRepository.save({
      id: medicineId,
      totalAmount: medicine.totalAmount - dosesTotal,
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

  async deleteUploadedImage(imagePath: string) {
    const client = new S3Client({
      region: this.configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    try {
      await client.send(
        new DeleteObjectCommand({
          Key: imagePath.split('/').slice(3).join('/'),
          Bucket: this.configService.get('AWS_S3_IMAGE_BUCKET_NAME'),
        }),
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async checkDeletedMedicineByCategoryId(categoryId: number) {
    const [, deletedMedicineCount] =
      await this.medicinesRepository.findAndCount({
        where: {
          category: { id: categoryId },
          deletedAt: Not(IsNull()),
        },
        withDeleted: true,
      });

    const [, medicineCount] = await this.medicinesRepository.findAndCount({
      where: { category: { id: categoryId } },
      withDeleted: true,
    });

    return deletedMedicineCount === medicineCount;
  }
}
