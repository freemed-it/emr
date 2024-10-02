import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patients } from './entity/patients.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Repository } from 'typeorm';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
  ) {}

  async createPatient(patientDto: CreatePatientDto, id?: number) {
    return id
      ? await this.patientsRepository.save({
          id,
          ...patientDto,
        })
      : await this.patientsRepository.save({
          ...patientDto,
        });
  }

  async searchPatients(name: string) {
    const patients = await this.patientsRepository.find({
      where: { name },
      select: ['id', 'firstVisit', 'name', 'birth'],
    });

    return patients.length === 0
      ? null
      : patients.length === 1
        ? patients[0]
        : patients;
  }

  async getPatient(id: number) {
    return this.patientsRepository.findOne({ where: { id } });
  }
}
