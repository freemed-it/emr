import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { M_Prescriptions } from './entity/m-prescriotions.entity';
import { Repository } from 'typeorm';
import { CreateMPrescriptionDto } from './dto/create-m-prescription.dto';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';
import { M_Medicines } from 'src/m-medicines/entity/m-medicines.entity';
import { UpdateMPrescriptionDto } from './dto/update-m-prescription.dto';
import { PaginateMPrescriptionHistoryDto } from './dto/paginate-m-prescription-history.dto';
import { endOfDay, startOfDay } from 'date-fns';
import { convertDosesCountByDay } from 'src/common/util/convert.util';

@Injectable()
export class MPrescriptionsService {
  constructor(
    @InjectRepository(M_Charts)
    private readonly mChartsRepository: Repository<M_Charts>,
    @InjectRepository(M_Prescriptions)
    private readonly mPrescriptionsRepository: Repository<M_Prescriptions>,
    @InjectRepository(M_Medicines)
    private readonly mMedicinesRepository: Repository<M_Medicines>,
  ) {}

  async createMPrescription(
    chartId: number,
    prescriptionDto: CreateMPrescriptionDto,
  ) {
    const chart = await this.mChartsRepository.findOne({
      where: {
        id: chartId,
      },
    });

    if (!chart) {
      throw new NotFoundException();
    }

    const { medicineId, ...restPrescriptionDto } = prescriptionDto;
    const medicine = await this.mMedicinesRepository.findOne({
      where: {
        id: medicineId,
      },
    });

    if (!medicine) {
      throw new BadRequestException('존재하지 않는 약품입니다.');
    }

    return await this.mPrescriptionsRepository.save({
      ...restPrescriptionDto,
      dosesTotal:
        restPrescriptionDto.doses *
        convertDosesCountByDay(restPrescriptionDto.dosesCountByDay) *
        restPrescriptionDto.dosesDay,
      chart: {
        id: chartId,
      },
      medicine: {
        id: medicineId,
      },
    });
  }

  async updatePrescription(
    prescriptionId: number,
    updateMPrescriptioneDto: UpdateMPrescriptionDto,
  ) {
    const prescription = await this.mPrescriptionsRepository.findOne({
      where: {
        id: prescriptionId,
      },
    });

    if (!prescription) {
      throw new NotFoundException();
    }

    const medicine = await this.mMedicinesRepository.findOne({
      where: {
        id: updateMPrescriptioneDto.medicineId,
      },
    });

    if (!medicine) {
      throw new BadRequestException('존재하지 않는 약품입니다.');
    }

    return await this.mPrescriptionsRepository.save({
      id: prescriptionId,
      dosesTotal:
        updateMPrescriptioneDto.doses *
        convertDosesCountByDay(updateMPrescriptioneDto.dosesCountByDay) *
        updateMPrescriptioneDto.dosesDay,
      ...updateMPrescriptioneDto,
    });
  }

  async deletePrescription(prescriptionId: number) {
    const prescription = await this.mPrescriptionsRepository.findOne({
      where: {
        id: prescriptionId,
      },
    });

    if (!prescription) {
      throw new NotFoundException();
    }

    await this.mPrescriptionsRepository.delete(prescriptionId);

    return prescriptionId;
  }

  async deletePrescriptionsByChartId(chartId: number) {
    return await this.mPrescriptionsRepository.delete({
      chart: {
        id: chartId,
      },
    });
  }

  async getPaginateHistory(
    startDate: string,
    endDate: string,
    paginateDto: PaginateMPrescriptionHistoryDto,
  ) {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    if (start.getTime() > end.getTime()) {
      throw new BadRequestException('날짜를 올바르게 설정해주세요.');
    }

    const query = this.mPrescriptionsRepository
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
