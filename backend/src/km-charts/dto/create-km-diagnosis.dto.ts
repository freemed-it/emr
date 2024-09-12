import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsString, MaxLength, ValidateNested } from 'class-validator';
import { CreateKMPrescriptionDto } from 'src/km-prescriptions/dto/create-km-prescription.dto';
import { Type } from 'class-transformer';
import { KM_Charts } from '../entity/km-charts.entity';

export class CreateKMDiagnosisDto extends PickType(KM_Charts, [
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

  @ApiProperty({ type: [CreateKMPrescriptionDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateKMPrescriptionDto)
  prescriptions: CreateKMPrescriptionDto[];
}
