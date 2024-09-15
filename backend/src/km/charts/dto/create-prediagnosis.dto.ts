import { CreateVitalSignDto } from './create-vital-sign.dto';
import { CreateKmComplaintDto } from '../complaints/dto/create-complaint.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateHistoryDto } from 'src/patients/histories/dto/create-history.dto';

export class CreateKmPrediagnosisDto {
  @ApiProperty({ type: CreateVitalSignDto })
  @ValidateNested()
  @Type(() => CreateVitalSignDto)
  vistalSign: CreateVitalSignDto;

  @ApiProperty({ type: CreateKmComplaintDto })
  @ValidateNested()
  @Type(() => CreateKmComplaintDto)
  complaint: CreateKmComplaintDto;

  @ApiProperty({ type: CreateHistoryDto })
  @ValidateNested()
  @Type(() => CreateHistoryDto)
  history: CreateHistoryDto;
}
