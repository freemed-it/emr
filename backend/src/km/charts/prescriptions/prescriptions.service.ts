import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KmPrescriptions } from '../../entity/prescriptions.entity';
import { Repository } from 'typeorm';
import { CreateKmPrescriptionDto } from './dto/create-prescription.dto';
import { convertDosesCountByDay } from 'src/common/util/convert.util';
import { UpdateKmPrescriptionDto } from './dto/update-prescription.dto';
import { PaginateKmPrescriptionHistoryDto } from './dto/paginate-prescription-history.dto';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class KmPrescriptionsService {
  constructor(
    @InjectRepository(KmPrescriptions)
    private readonly prescriptionsRepository: Repository<KmPrescriptions>,
  ) {}

  async getPrescriptions(chartId: number) {
    return await this.prescriptionsRepository.find({
      where: { chart: { id: chartId } },
      relations: { medicine: true },
    });
  }

  async createPrescription(
    chartId: number,
    prescriptionDto: CreateKmPrescriptionDto,
  ) {
    const { medicineId, ...restPrescriptionDto } = prescriptionDto;

    return await this.prescriptionsRepository.save({
      ...restPrescriptionDto,
      dosesTotal:
        restPrescriptionDto.doses *
        convertDosesCountByDay(restPrescriptionDto.dosesCountByDay) *
        restPrescriptionDto.dosesDay,
      chart: { id: chartId },
      medicine: { id: medicineId },
    });
  }

  async updatePrescription(
    prescriptionId: number,
    prescriptionDto: UpdateKmPrescriptionDto,
  ) {
    return await this.prescriptionsRepository.save({
      id: prescriptionId,
      dosesTotal:
        prescriptionDto.doses *
        convertDosesCountByDay(prescriptionDto.dosesCountByDay) *
        prescriptionDto.dosesDay,
      ...prescriptionDto,
    });
  }

  async updatePrescriptionIsCompleted(prescriptionId: number) {
    return await this.prescriptionsRepository.save({
      id: prescriptionId,
      isCompleted: true,
    });
  }

  async deletePrescription(prescriptionId: number) {
    await this.prescriptionsRepository.delete(prescriptionId);
    return prescriptionId;
  }

  async deletePrescriptionsByChartId(chartId: number) {
    return await this.prescriptionsRepository.delete({
      chart: { id: chartId },
    });
  }

  async checkPrescriptionExistsById(id: number) {
    return this.prescriptionsRepository.exists({
      where: { id },
    });
  }

  async getPaginateHistory(
    startDate: string,
    endDate: string,
    paginateDto: PaginateKmPrescriptionHistoryDto,
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
      .where('prescription.isCompleted = :isCompleted', { isCompleted: true })
      .andWhere('prescription.createdAt >= :start', { start })
      .andWhere('prescription.createdAt <= :end', { end });

    if (paginateDto.name) {
      query.andWhere('medicine.name like :name', {
        name: `%${paginateDto.name}%`,
      });
    }
    if (paginateDto.indication) {
      query.andWhere('medicine.indication like :indication', {
        indication: `%${paginateDto.indication}%`,
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
        'medicine.indication',
        'medicine.totalAmount',
        'medicine.deletedAt',
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
