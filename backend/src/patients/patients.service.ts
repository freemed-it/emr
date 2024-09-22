import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patients } from './entity/patients.entity';
import { MCharts } from 'src/m/entity/charts.entity';
import { KmCharts } from 'src/km/entity/charts.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Repository } from 'typeorm';
import { Orders } from 'src/orders/entity/orders.entity';
import { Department } from 'src/orders/const/department.const';
import { format } from 'date-fns';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
    @InjectRepository(MCharts)
    private mChartsRepository: Repository<MCharts>,
    @InjectRepository(KmCharts)
    private kmChartsRepository: Repository<KmCharts>,
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
  ) {}

  async createPatient(
    patientDto: CreatePatientDto,
    department: Department,
    patientId?: number,
  ) {
    const patient = await this.patientsRepository.findOne({
      where: { id: patientId },
    });

    await this.patientsRepository.save(
      patient ? { ...patient, ...patientDto } : patientDto,
    );

    const chartNumber = await this.generateChartNumber(department);
    if (!patient.name || !patient.birth) {
      throw new BadRequestException('이름과 생년월일은 필수 입력 사항입니다.');
    }
    await this.createChartAndOrder(patient, department, chartNumber);

    return patient;
  }
  private async createChartAndOrder(
    patient: Patients,
    department: Department,
    chartNumber: string,
  ) {
    const chartRepository: Repository<MCharts | KmCharts> =
      department === Department.M
        ? this.mChartsRepository
        : this.kmChartsRepository;

    const chart = await chartRepository.save({ patient, chartNumber });

    await this.ordersRepository.save({
      patient,
      department,
      chartNumber,
      ...(department === Department.M ? { mChart: chart } : { kmChart: chart }),
    });
  }

  private async generateChartNumber(department: Department) {
    const todayDate = format(new Date(), 'yyMMdd'); // 오늘 날짜 YYMMDD 형식으로
    const departmentCode = department === Department.M ? '1' : '2'; // 진료과 코드 설정
    const baseChartNumber = `${todayDate}${departmentCode}`; // 기본 차트 번호

    // 오늘 생성된 차트 중 가장 최신의 차트 번호 가져오기
    const lastChart = await this.getLastChartNumber(todayDate, departmentCode);

    let newNum = '001'; // 기본 값 001
    if (lastChart) {
      // 가장 최신의 차트 번호 마지막 두 자리를 가져와 +1
      const lastNum = parseInt(lastChart.slice(-3));
      newNum = (lastNum + 1).toString().padStart(3, '0');
    }

    return `${baseChartNumber}${newNum}`;
  }

  private async getLastChartNumber(todayDate: string, departmentCode: string) {
    const repository =
      departmentCode === '1' ? this.mChartsRepository : this.kmChartsRepository;

    const latestChart = await repository
      .createQueryBuilder('chart')
      .where('chart.chartNumber LIKE :chartNumber', {
        chartNumber: `${todayDate}${departmentCode}%`,
      })
      .orderBy('chart.chartNumber', 'DESC')
      .getOne();

    return latestChart ? latestChart.chartNumber : null;
  }

  async searchByName(name: string) {
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

  async getPatientById(id: number) {
    return this.patientsRepository.findOne({ where: { id } });
  }

  getPatientHistoryById(patientId: number) {
    return this.patientsRepository.findOne({
      where: { id: patientId },
      relations: { history: true },
    });
  }
}
