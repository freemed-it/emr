import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { Department } from '../const/department.const';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from 'src/patients/const/gender.const';

export class PaginateOrderDto extends BasePaginationDto {
  @ApiPropertyOptional({ description: '진료과' })
  @IsEnum(Department)
  @IsOptional()
  department: Department;

  @ApiPropertyOptional({ description: '차트 상태' })
  @IsInt()
  @IsOptional()
  status: number;

  @ApiPropertyOptional({ description: '성별' })
  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;
}
