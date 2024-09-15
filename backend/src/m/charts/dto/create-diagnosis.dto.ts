import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MCharts } from '../../entity/charts.entity';
import { CreateMPrescriptionDto } from '../prescriptions/dto/create-prescription.dto';

export class CreateMDiagnosisDto extends PickType(MCharts, [
  'impression',
  'presentIllness',
  'treatmentNote',
]) {
  @ApiPropertyOptional({
    description: '추정 진단',
    example: '# Rt. shoulder injury',
  })
  @IsString()
  @MaxLength(1000)
  impression: string;

  @ApiPropertyOptional({
    description: '현병력',
    example: '# shoulder pain med effect (+)',
  })
  @IsString()
  @MaxLength(1000)
  presentIllness: string;

  @ApiPropertyOptional({
    description: '처방 노트',
    example: 'MM/DD med ditto',
  })
  @IsString()
  @MaxLength(1000)
  treatmentNote: string;

  @ApiProperty({ type: [CreateMPrescriptionDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateMPrescriptionDto)
  prescriptions: CreateMPrescriptionDto[];
}
