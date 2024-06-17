import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Department } from 'src/orders/const/department.const';
import { Patients } from './entity/patients.entity';

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

  @Get('/search')
  @ApiOperation({
    summary: '참여자 검색',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '참여자 검색 결과',
  })
  async searchPatients(@Query('name') name: string): Promise<Patients> {
    return this.patientsService.searchByName(name);
  }

  @Get(':patientId')
  @ApiOperation({
    summary: '참여자 상세 정보',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '참여자 상세 정보 반환',
  })
  async getPatientById(@Param('patientId', ParseIntPipe) id: number) {
    return this.patientsService.findById(id);
  }
}
