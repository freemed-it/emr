import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

export class PaginateMMedicineDto extends BasePaginationDto {
  @ApiPropertyOptional({
    description: '약품 분류',
  })
  @IsNumber()
  @IsOptional()
  categoryId: number;

  @ApiPropertyOptional({
    description: '약품명',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    description: '성분명/함량',
  })
  @IsString()
  @IsOptional()
  ingredient: string;
}
