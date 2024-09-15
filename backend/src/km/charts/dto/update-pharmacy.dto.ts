import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { KmCharts } from '../../entity/charts.entity';

export class UpdateKMPharmacyDto extends PickType(KmCharts, ['status']) {
  @ApiProperty({ description: '차트 상태' })
  @IsInt()
  @Min(3)
  @Max(6)
  status: number;
}
