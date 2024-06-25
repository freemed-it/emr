import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class BasePaginationDto {
  @ApiPropertyOptional({
    description: 'offset pagination',
  })
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiPropertyOptional({
    description: 'cursor pagination',
  })
  @IsNumber()
  @IsOptional()
  cursor: number;

  @ApiPropertyOptional({
    description: '정렬 <small>default: DESC</small>',
    enum: ['ASC', 'DESC'],
  })
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sort: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: '응답 받을 데이터 개수 <small>default: 10</small>',
  })
  @IsNumber()
  @IsOptional()
  take: number = 10;
}
