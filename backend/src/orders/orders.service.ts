import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from './entity/orders.entity';
import { Between, In, Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginateOrderDto } from './dto/paginate-order.dto';
import { endOfDay, endOfToday, startOfDay, startOfToday } from 'date-fns';
import { PaginateTodayOrderDto } from './dto/paginate-today-order.dto';
import { Department } from './const/department.const';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    private readonly commonService: CommonService,
  ) {}

  async createOrder(
    patientId: number,
    chartId: number,
    department: Department,
    chartNumber: string,
    createOrderDto: CreateOrderDto,
  ) {
    return this.ordersRepository.save({
      patient: { id: patientId },
      chartNumber,
      department,
      ...(department === Department.M
        ? { mChart: { id: chartId } }
        : { kmChart: { id: chartId } }),
      waitingNumber: createOrderDto.waitingNumber,
      bedNumber: createOrderDto.bedNumber,
    });
  }

  async paginateOrders(
    startDate: string,
    endDate: string,
    paginateDto: PaginateOrderDto,
  ) {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    if (start.getTime() === end.getTime()) {
      end.setDate(end.getDate() + 1);
    }
    if (start.getTime() > end.getTime()) {
      throw new BadRequestException('날짜를 올바르게 설정해주세요.');
    }
    return this.commonService.paginate(paginateDto, this.ordersRepository, {
      where: {
        createdAt: Between(start, end),
        ...(paginateDto.department && {
          department: In(
            Array.isArray(paginateDto.department)
              ? paginateDto.department
              : [paginateDto.department],
          ),
        }),
        ...(paginateDto.status && {
          status: In(
            Array.isArray(paginateDto.status)
              ? paginateDto.status
              : [paginateDto.status],
          ),
        }),
        ...(paginateDto.gender && {
          patient: {
            gender: In(
              Array.isArray(paginateDto.gender)
                ? paginateDto.gender
                : [paginateDto.gender],
            ),
          },
        }),
      },
      relations: {
        patient: true,
      },
    });
  }

  async paginateTodayOrders(paginateDto: PaginateTodayOrderDto) {
    const start = startOfToday();
    const end = endOfToday();

    return this.commonService.paginate(paginateDto, this.ordersRepository, {
      where: {
        createdAt: Between(start, end),
        ...(paginateDto.department && { department: paginateDto.department }),
        ...(paginateDto.status && {
          status: In(
            Array.isArray(paginateDto.status)
              ? paginateDto.status
              : [paginateDto.status],
          ),
        }),
      },
      relations: {
        patient: true,
      },
    });
  }

  async checkTodayChart(patientId: number, department: Department) {
    const start = startOfToday();
    const end = endOfToday();

    const order = await this.ordersRepository.findOne({
      where: {
        patient: { id: patientId },
        status: 6,
        createdAt: Between(start, end),
        department: department,
      },
    });
    return order?.chartNumber;
  }
}
