import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Orders } from '../entity/orders.entity';

export class CreateOrderDto extends PickType(Orders, ['waitingNumber']) {
  @ApiProperty({
    description: '대기 번호',
    example: 1,
  })
  @IsInt()
  @Min(1)
  waitingNumber: number;

  @ApiProperty({
    description: '한의과 베드 번호',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  bedNumber: number;
}
