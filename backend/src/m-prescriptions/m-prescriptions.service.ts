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
      ...updateMPrescriptioneDto,
    });
  }
}
