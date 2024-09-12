import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { M_Charts } from '../entity/m-charts.entity';

export class UpdateMPharmacyDto extends PickType(M_Charts, ['status']) {
  @ApiProperty({ description: '차트 상태' })
  @IsInt()
  @Min(3)
  @Max(6)
  status: number;
}
