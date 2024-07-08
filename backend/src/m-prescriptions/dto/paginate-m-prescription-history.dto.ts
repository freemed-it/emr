import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

export class PaginateMPrescriptionHistoryDto extends OmitType(
  BasePaginationDto,
  ['page'],
) {
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
