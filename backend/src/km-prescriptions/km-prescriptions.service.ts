import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KM_Prescriptions } from './entity/km-prescriptions.entity';
import { Repository } from 'typeorm';
import { CreateKMPrescriptionDto } from './dto/create-km-prescription.dto';
import { convertDosesCountByDay } from 'src/common/util/convert.util';
import { UpdateKMPrescriptionDto } from './dto/update-km-prescription.dto';

@Injectable()
export class KmPrescriptionsService {
  constructor(
    @InjectRepository(KM_Prescriptions)
    private readonly prescriptionsRepository: Repository<KM_Prescriptions>,
  ) {}

  async createPrescription(
    chartId: number,
    prescriptionDto: CreateKMPrescriptionDto,
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
    prescriptionDto: UpdateKMPrescriptionDto,
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

  async checkPrescriptionExistsById(id: number) {
    return this.prescriptionsRepository.exists({
      where: { id },
    });
  }
}
