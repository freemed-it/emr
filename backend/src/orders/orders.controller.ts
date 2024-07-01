import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateOrderDto } from './dto/paginate-order.dto';

@ApiTags('참여자')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/:startDate/:endDate')
  @ApiOperation({
    summary: 'OCS 목록 조회',
    description: 'offset pagination - page 쿼리 파라미터를 이용해야 합니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '날짜를 올바르게 설정해주세요.',
  })
  getOrders(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Query() paginateOrderDto: PaginateOrderDto,
  ) {
    return this.ordersService.paginateOrders(
      startDate,
      endDate,
      paginateOrderDto,
    );
  }
}
