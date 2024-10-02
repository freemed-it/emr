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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemosService } from './memos/memos.service';
import { MChartsService } from 'src/m/charts/charts.service';
import { OrdersService } from 'src/orders/orders.service';
import { ReceiptDto } from './dto/receipt.dto';
import { KmChartsService } from 'src/km/charts/charts.service';
import { Department } from 'src/orders/const/department.const';
import { HistoriesService } from './histories/histories.service';

@ApiTags('참여자')
@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly mChartsService: MChartsService,
    private readonly kmChartsService: KmChartsService,
    private readonly memosService: MemosService,
    private readonly ordersService: OrdersService,
    private readonly historiesService: HistoriesService,
  ) {}

  @Post('/m/receipt')
  @ApiOperation({
    summary: '의과 참여자 접수',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '이름/생년월일을 입력해주세요.',
  })
  @ApiQuery({ name: 'patientId', required: false, type: Number })
  async postMPatient(
    @Body() receiptDto: ReceiptDto,
    @Query('patientId') id?: number,
  ) {
    const patient = await this.patientsService.createPatient(receiptDto, id);
    const chart = await this.mChartsService.createChart(patient.id);
    const order = await this.ordersService.createOrder(
      patient.id,
      chart.id,
      Department.M,
      chart.chartNumber,
      receiptDto,
    );

    return { patient, chart, order };
  }

  @Post('/km/receipt')
  @ApiOperation({
    summary: '한의과 참여자 접수',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '이름/생년월일을 입력해주세요.',
  })
  @ApiQuery({ name: 'patientId', required: false, type: Number })
  async postKmPatient(
    @Body() receiptDto: ReceiptDto,
    @Query('patientId') id?: number,
  ) {
    const patient = await this.patientsService.createPatient(receiptDto, id);
    const chart = await this.kmChartsService.createChart(patient.id);
    const order = await this.ordersService.createOrder(
      patient.id,
      chart.id,
      Department.KM,
      chart.chartNumber,
      receiptDto,
    );

    return { patient, chart, order };
  }

  @Get('/search')
  @ApiOperation({
    summary: '참여자 검색',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '참여자 검색 결과',
  })
  async getPatients(@Query('name') name: string) {
    return this.patientsService.searchPatients(name);
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
    return this.patientsService.getPatient(id);
  }
}
