import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Department } from 'src/orders/const/department.const';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post('/m/receipt')
  @ApiOperation({
    summary: '의과 참여자 접수 생성',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '이름/생년월일을 입력해주세요.',
  })
  async createMedicalPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.createPatient(createPatientDto, Department.M);
  }

  @Post('/km/receipt')
  @ApiOperation({
    summary: '한의과 참여자 접수 생성',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '이름/생년월일을 입력해주세요.',
  })
  async createKoreanMedicalPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.createPatient(createPatientDto, Department.KM);
  }
}
