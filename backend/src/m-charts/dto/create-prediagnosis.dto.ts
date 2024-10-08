import { CreateVitalSignDto } from './create-vital-sign.dto';
import { CreateMComplaintDto } from '../../m-complaints/dto/create-m-complaint.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateHistoryDto } from 'src/patients/histories/dto/create-history.dto';

export class CreatePrediagnosisDto {
  @ApiProperty({ type: CreateVitalSignDto })
  @ValidateNested()
  @Type(() => CreateVitalSignDto)
  vistalSign: CreateVitalSignDto;

  @ApiProperty({ type: CreateMComplaintDto })
  @ValidateNested()
  @Type(() => CreateMComplaintDto)
  complaint: CreateMComplaintDto;

  @ApiProperty({ type: CreateHistoryDto })
  @ValidateNested()
  @Type(() => CreateHistoryDto)
  history: CreateHistoryDto;
}
