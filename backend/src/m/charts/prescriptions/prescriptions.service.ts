import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MPrescriptions } from '../../entity/prescriptions.entity';
import { Repository } from 'typeorm';
import { CreateMPrescriptionDto } from './dto/create-prescription.dto';
import { UpdateMPrescriptionDto } from './dto/update-prescription.dto';
import { PaginateMMedicineHistoryDto } from '../../medicines/dto/paginate-medicine-history.dto';
import { endOfDay, startOfDay } from 'date-fns';
import { convertDosesCountByDay } from 'src/common/util/convert.util';

@Injectable()
export class MPrescriptionsService {
  constructor(
    @InjectRepository(MPrescriptions)
    private readonly prescriptionsRepository: Repository<MPrescriptions>,
  ) {}

  async getPrescriptionsByChartNumber(chartNumber: string) {
    return await this.prescriptionsRepository.find({
      where: { chart: { chartNumber } },
      relations: { medicine: true },
    });
  }

  async createPrescription(
    chartNumber: string,
    prescriptionDto: CreateMPrescriptionDto,
  ) {
    const { medicineId, ...restPrescriptionDto } = prescriptionDto;

    return await this.prescriptionsRepository.save({
      ...restPrescriptionDto,
      dosesTotal:
        restPrescriptionDto.doses *
        convertDosesCountByDay(restPrescriptionDto.dosesCountByDay) *
        restPrescriptionDto.dosesDay,
      chart: { chartNumber },
      medicine: { id: medicineId },
    });
  }

  async updatePrescription(
    id: number,
    prescriptionDto: UpdateMPrescriptionDto,
  ) {
    return await this.prescriptionsRepository.save({
      id,
      dosesTotal:
        prescriptionDto.doses *
        convertDosesCountByDay(prescriptionDto.dosesCountByDay) *
        prescriptionDto.dosesDay,
      ...prescriptionDto,
    });
  }

  async updatePrescriptionIsCompleted(id: number) {
    const prescription = await this.prescriptionsRepository.findOne({
      where: { id },
    });

    if (!prescription) {
      throw new NotFoundException();
    }

    return await this.prescriptionsRepository.save({
      id,
      isCompleted: true,
    });
  }

  async deletePrescription(id: number) {
    await this.prescriptionsRepository.delete(id);
    return id;
  }

  async deletePrescriptionsByChartNumber(chartNumber: string) {
    return await this.prescriptionsRepository.delete({
      chart: { chartNumber },
    });
  }

  async checkPrescriptionExists(id: number) {
    return this.prescriptionsRepository.exists({
      where: { id },
    });
  }

  async getPaginateHistory(
    startDate: string,
    endDate: string,
    paginateDto: PaginateMMedicineHistoryDto,
  ) {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    if (start.getTime() > end.getTime()) {
      throw new BadRequestException('날짜를 올바르게 설정해주세요.');
    }

    const query = this.prescriptionsRepository
      .createQueryBuilder('prescription')
      .withDeleted()
      .innerJoinAndSelect('prescription.medicine', 'medicine')
      .leftJoinAndSelect(
        'medicine.category',
        'category',
        'medicine.categoryId = category.id',
      )
      .where('prescription.isCompleted = :isCompleted', { isCompleted: true })
      .andWhere('prescription.createdAt >= :start', { start })
      .andWhere('prescription.createdAt <= :end', { end });

    if (paginateDto.name) {
      query.andWhere('medicine.name like :name', {
        name: `%${paginateDto.name}%`,
      });
    }
    if (paginateDto.ingredient) {
      query.andWhere('medicine.ingredient like :ingredient', {
        ingredient: `%${paginateDto.ingredient}%`,
      });
    }
    if (paginateDto.cursor) {
      query.andWhere('medicine.id < :cursor', { cursor: paginateDto.cursor });
    }

    query
      .select([
        'prescription.medicineId',
        'medicine.id',
        'medicine.name',
        'medicine.ingredient',
        'medicine.totalAmount',
        'medicine.deletedAt',
        'category.mainCategory',
        'category.subCategory',
        'category.deletedAt',
      ])
      .addSelect('SUM(prescription.dosesTotal) as dosesTotalSum')
      .groupBy('prescription.medicineId')
      .orderBy({ 'medicine.id': 'DESC' })
      .limit(paginateDto.take);

    const data = await query.getRawMany();
    const count = await query.getCount();
    let hasNext: boolean = true;
    let cursor: number;

    if (count <= paginateDto.take || data.length <= 0) {
      hasNext = false;
      cursor = null;
    } else {
      cursor = data[data.length - 1].medicine_id;
    }

    return {
      data: data,
      meta: {
        count: data.length,
        cursor,
        hasNext,
      },
    };
  }
}
