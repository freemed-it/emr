import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { MCharts } from '../../entity/charts.entity';

export class UpdateMPharmacyDto extends PickType(MCharts, ['status']) {
  @ApiProperty({ description: '차트 상태' })
  @IsInt()
  @Min(3)
  @Max(6)
  status: number;
}
