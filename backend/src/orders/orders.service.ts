import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from './entity/orders.entity';
import { Between, Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { PaginateOrderDto } from './dto/paginate-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    private readonly commonService: CommonService,
  ) {}

  async paginateOrders(
    startDate: string,
    endDate: string,
    paginateDto: PaginateOrderDto,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.getTime() === end.getTime()) {
      end.setDate(end.getDate() + 1);
    }
    if (start.getTime() > end.getTime()) {
      throw new BadRequestException('날짜를 올바르게 설정해주세요.');
    }
    return this.commonService.paginate(paginateDto, this.ordersRepository, {
      where: {
        createdAt: Between(start, end),
        ...(paginateDto.department && { department: paginateDto.department }),
        ...(paginateDto.status !== undefined && { status: paginateDto.status }),
        ...(paginateDto.gender && { patient: { gender: paginateDto.gender } }),
      },
      relations: {
        patient: true,
      },
    });
  }
}
