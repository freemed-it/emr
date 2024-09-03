import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patients } from './entity/patients.entity';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';
import { KM_Charts } from 'src/km-charts/entity/km-charts.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Repository } from 'typeorm';
import { Orders } from 'src/orders/entity/orders.entity';
import { Department } from 'src/orders/const/department.const';
import { Memos } from './memos/entity/memos.entity';
import { UpdateMemoDto } from './memos/dto/update-memo.dto';
import { CreateMemoDto } from './memos/dto/create-memo.dto';
import { Users } from 'src/users/entity/users.entity';
import { format } from 'date-fns';

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
    @InjectRepository(Memos)
    private memosRepository: Repository<Memos>,
  ) {}

  async createPatient(
    patientDto: CreatePatientDto,
    department: Department,
    patientId?: number,
  ): Promise<Patients> {
    let patient: Patients;
    const chartNumber = await this.generateChartNumber(department);
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
        chartNumber,
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
        chartNumber,
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

  private async generateChartNumber(department: Department): Promise<string> {
    const todayDate = format(new Date(), 'yyMMdd'); // 오늘 날짜 YYMMDD 형식으로
    const departmentCode = department === Department.M ? '01' : '02'; // 진료과 코드 설정
    const baseChartNumber = `${todayDate}${departmentCode}`; // 기본 차트 번호

    // 오늘 생성된 차트 중 가장 최신의 차트 번호 가져오기
    const lastChart = await this.getLastChartNumber(todayDate, departmentCode);

    let newNum = '01'; // 기본 값 01
    if (lastChart) {
      // 가장 최신의 차트 번호 마지막 두 자리를 가져와 +1
      const lastNum = parseInt(lastChart.slice(-2));
      newNum = (lastNum + 1).toString().padStart(2, '0');
    }

    return `${baseChartNumber}${newNum}`;
  }

  private async getLastChartNumber(
    todayDate: string,
    departmentCode: string,
  ): Promise<string | null> {
    const latestChart = await this.mChartsRepository
      .createQueryBuilder('chart')
      .where('chart.chartNumber LIKE :chartNumber', {
        chartNumber: `${todayDate}${departmentCode}%`,
      })
      .orderBy('chart.chartNumber', 'DESC')
      .getOne();

    return latestChart ? latestChart.chartNumber : null;
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

  getPatientHistoryById(patientId: number) {
    return this.patientsRepository.findOne({
      where: { id: patientId },
      relations: { history: true },
    });
  }

  async createMemo(patientId: number, memoDto: CreateMemoDto, user: Users) {
    const patient = await this.patientsRepository.findOne({
      where: { id: patientId },
    });

    const memo = this.memosRepository.create({
      ...memoDto,
      patient,
      writer: user.name,
    });

    return this.memosRepository.save(memo);
  }

  async updateMemo(patientId: number, memoDto: UpdateMemoDto, user: Users) {
    const memo = await this.memosRepository.findOne({
      where: { patient: { id: patientId } },
    });

    const newMemo = this.memosRepository.create({
      ...memo,
      ...memoDto,
      writer: user.name,
    });

    return this.memosRepository.save(newMemo);
  }
}
