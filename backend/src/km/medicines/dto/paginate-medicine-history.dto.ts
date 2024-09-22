import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

export class PaginateKmMedicineHistoryDto extends OmitType(BasePaginationDto, [
  'page',
]) {
  @ApiPropertyOptional({
    description: '약품명',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    description: '적응증',
  })
  @IsString()
  @IsOptional()
  indication: string;
}
