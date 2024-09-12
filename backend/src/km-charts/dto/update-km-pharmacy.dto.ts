import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { KM_Charts } from '../entity/km-charts.entity';

export class UpdatePharmacyDto extends PickType(KM_Charts, ['status']) {
  @ApiProperty({ description: '차트 상태' })
  @IsInt()
  @Min(3)
  @Max(6)
  status: number;
}
