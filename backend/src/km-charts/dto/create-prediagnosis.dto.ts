import { CreateVitalSignDto } from './create-vital-sign.dto';
import { CreateKMComplaintDto } from '../../km-complaints/dto/create-km-complaint.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateHistoryDto } from 'src/patients/histories/dto/create-history.dto';

export class CreatePrediagnosisDto {
  @ApiProperty({ type: CreateVitalSignDto })
  @ValidateNested()
  @Type(() => CreateVitalSignDto)
  vistalSign: CreateVitalSignDto;

  @ApiProperty({ type: CreateKMComplaintDto })
  @ValidateNested()
  @Type(() => CreateKMComplaintDto)
  complaint: CreateKMComplaintDto;

  @ApiProperty({ type: CreateHistoryDto })
  @ValidateNested()
  @Type(() => CreateHistoryDto)
  history: CreateHistoryDto;
}
