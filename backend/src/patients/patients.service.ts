import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patients } from './entity/patients.entity';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';
import { KM_Charts } from 'src/km-charts/entity/km-charts.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Repository } from 'typeorm';
import { Orders } from 'src/orders/entity/orders.entity';
import { Department } from 'src/orders/const/department.const';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
    @InjectRepository(M_Charts)
    private mChartsRepository: Repository<M_Charts>,
    @InjectRepository(KM_Charts)
    private kmChartsRepository: Repository<KM_Charts>,
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
  ) {}

  async createPatient(
    patientDto: CreatePatientDto,
    department: Department,
    patientId?: number,
  ): Promise<Patients> {
    let patient: Patients;
    if (patientId) {
      // 재진: 기존 참여자 업데이트
      patient = await this.patientsRepository.findOne({
        where: { id: patientId },
      });
      if (!patient) {
        // 초진: 새로운 참여자 생성
        patient = this.patientsRepository.create(patientDto);
      }
      this.patientsRepository.merge(patient, patientDto);
    }
    await this.patientsRepository.save(patient);

    if (!patient.name || !patient.birth) {
      throw new BadRequestException('이름과 생년월일은 필수 입력 사항입니다.');
    }

    if (department === Department.M) {
      const mChart = this.mChartsRepository.create({
        patient,
        chartNumber: this.generateChartNumber(),
      });
      await this.mChartsRepository.save(mChart);
      const order = this.ordersRepository.create({
        patient,
        mChart,
        department,
        chartNumber: mChart.chartNumber,
      });
      await this.ordersRepository.save(order);
    } else if (department === Department.KM) {
      const kmChart = this.kmChartsRepository.create({
        patient,
        chartNumber: this.generateChartNumber(),
      });
      await this.kmChartsRepository.save(kmChart);
      const order = this.ordersRepository.create({
        patient,
        kmChart,
        department,
        chartNumber: kmChart.chartNumber,
      });
      await this.ordersRepository.save(order);
    }
    return patient;
  }

  private generateChartNumber(): string {
    let str = '';
    for (let i = 0; i < 10; i++) {
      str += Math.floor(Math.random() * 10);
    }
    return str;
  }

  async searchByName(name: string): Promise<any> {
    const patients = await this.patientsRepository.find({
      where: { name },
      select: ['id', 'firstVisit', 'name', 'birth'],
    });

    if (patients.length === 0) {
      return null; // 초진
    } else if (patients.length === 1) {
      return patients[0]; // 재진
    } else {
      return patients; // 동명이인
    }
  }

  async getPatientById(id: number): Promise<Patients> {
    return this.patientsRepository.findOne({ where: { id } });
  }
}
