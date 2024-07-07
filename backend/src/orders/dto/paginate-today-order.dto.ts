import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { Department } from '../const/department.const';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginateTodayOrderDto extends BasePaginationDto {
  @ApiProperty({ description: '진료과' })
  @IsEnum(Department)
  department: Department;

  @ApiPropertyOptional({ description: '차트 상태' })
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  @IsOptional()
  status: number[];
}
