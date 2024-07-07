import { IsEnum } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { Department } from '../const/department.const';
import { ApiProperty } from '@nestjs/swagger';

export class PaginateTodayOrderDto extends BasePaginationDto {
  @ApiProperty({ description: '진료과' })
  @IsEnum(Department)
  department: Department;
}
