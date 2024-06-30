import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { M_Prescriptions } from './entity/m-prescriotions.entity';
import { Repository } from 'typeorm';
import { CreateMPrescriptionDto } from './dto/create-m-prescription.dto';

@Injectable()
export class MPrescriptionsService {
  constructor(
    @InjectRepository(M_Prescriptions)
    private readonly mPrescriptionsRepository: Repository<M_Prescriptions>,
  ) {}

  async createMPrescription(
    chartId: number,
    prescriptionDto: CreateMPrescriptionDto,
  ) {
    const { medicineId, ...restPrescriptionDto } = prescriptionDto;

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
}
