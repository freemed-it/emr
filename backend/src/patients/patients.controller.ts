import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Department } from 'src/orders/const/department.const';
import { Patients } from './entity/patients.entity';
import { User } from 'src/users/decorator/user.decorator';
import { Users } from 'src/users/entity/users.entity';
import { CreateMemoDto } from './memos/dto/create-memo.dto';
import { UpdateMemoDto } from './memos/dto/update-memo.dto';

@ApiTags('참여자')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post('/m/receipt')
  @ApiOperation({
    summary: '의과 참여자 접수',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '이름/생년월일을 입력해주세요.',
  })
  async createMPatient(
    @Body() createPatientDto: CreatePatientDto,
    @Query('patientId') patientId?: number,
  ) {
    return this.patientsService.createPatient(
      createPatientDto,
      Department.M,
      patientId,
    );
  }

  @Post('/km/receipt')
  @ApiOperation({
    summary: '한의과 참여자 접수',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '이름/생년월일을 입력해주세요.',
  })
  async createKMPatient(
    @Body() createPatientDto: CreatePatientDto,
    @Query('patientId') patientId?: number,
  ) {
    return this.patientsService.createPatient(
      createPatientDto,
      Department.KM,
      patientId,
    );
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
    summary: '참여자 상세 조회',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '참여자 상세 조회',
  })
  async getPatient(@Param('patientId', ParseIntPipe) id: number) {
    return this.patientsService.getPatientById(id);
  }

  @Get(':patientId/histories')
  @ApiOperation({
    summary: '참여자 과거력 조회',
  })
  async getPatientHistory(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.patientsService.getPatientHistoryById(patientId);
  }

  @Post(':patientId/memos')
  @ApiOperation({
    summary: '참여자 메모 생성',
  })
  async postMemo(
    @Param('patientId') patientId: number,
    @Body() createMemoDto: CreateMemoDto,
    @User() user: Users,
  ) {
    return this.patientsService.createMemo(patientId, createMemoDto, user);
  }

  @Patch(':patientId/memos')
  @ApiOperation({
    summary: '참여자 메모 수정',
  })
  async pathMemo(
    @Param('patientId') patientId: number,
    @Body() updateMemoDto: UpdateMemoDto,
    @User() user: Users,
  ) {
    return this.patientsService.updateMemo(patientId, updateMemoDto, user);
  }
}
