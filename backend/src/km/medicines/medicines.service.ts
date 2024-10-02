import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KmMedicines } from '../entity/medicines.entity';
import { ILike, Repository } from 'typeorm';
import { CreateKMMedicineDto } from './dto/create-medicine.dto';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { PaginateKMMedicineDto } from './dto/paginate-medicine.dto';
import { CommonService } from 'src/common/common.service';
import { UpdateKMMedicineDto } from './dto/update-medicine.dto';
import { convertDosesCountByDay } from 'src/common/util/convert.util';
import { KmPrescriptions } from '../entity/prescriptions.entity';

@Injectable()
export class KmMedicinesService {
  constructor(
    @InjectRepository(KmMedicines)
    private readonly medicinesRepository: Repository<KmMedicines>,
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

  async getMedicine(id: number) {
    const medicine = await this.medicinesRepository.findOne({
      where: { id },
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

  async updateMedicine(
    id: number,
    medicineDto: UpdateKMMedicineDto,
    image: Express.Multer.File,
  ) {
    const medicine = await this.medicinesRepository.findOne({
      where: { id },
    });

    if (!medicine) {
      throw new NotFoundException();
    }

    // 사진 변경 (이미 있으면 삭제 후 업로드)
    if (!medicineDto.hasOwnProperty('image') && image) {
      if (medicine.image) {
        await this.deleteUploadedImage(medicine.image);
      }
      const imagePath = await this.uploadImage(image, medicineDto.name);
      medicineDto.image = imagePath;
    }

    // 사진 삭제
    if (medicineDto.hasOwnProperty('image') && !image && medicine.image) {
      await this.deleteUploadedImage(medicine.image);
      medicineDto.image = null;
    }

    const newMedicine = await this.medicinesRepository.preload({
      id,
      ...medicineDto,
    });

    return await this.medicinesRepository.save(newMedicine);
  }

  async deleteMedicine(id: number) {
    const medicine = await this.medicinesRepository.findOne({
      where: { id },
    });

    if (!medicine) {
      throw new NotFoundException();
    }

    await this.medicinesRepository.softDelete(id);

    if (medicine.image) {
      await this.deleteUploadedImage(medicine.image);
      await this.medicinesRepository.save({
        ...medicine,
        image: null,
      });
    }

    return id;
  }

  async updateMedicineTotalAmount(
    id: number,
    prescriptionDto: KmPrescriptions,
  ) {
    const medicine = await this.medicinesRepository.findOne({
      where: { id },
    });

    if (!medicine) {
      throw new NotFoundException();
    }

    const dosesTotal =
      prescriptionDto.doses *
      convertDosesCountByDay(prescriptionDto.dosesCountByDay) *
      prescriptionDto.dosesDay;

    return await this.medicinesRepository.save({
      id,
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

  async checkMedicineExists(id: number) {
    return this.medicinesRepository.exists({
      where: { id },
    });
  }
}
