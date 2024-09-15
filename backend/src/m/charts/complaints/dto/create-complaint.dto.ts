import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { MComplaints } from '../../../entity/complaints.entity';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';

export class CreateMComplaintDto extends PickType(MComplaints, [
  'category',
  'cheifComplaint',
  'cheifComplaintHistory',
]) {
  @ApiProperty({
    description: '대분류',
    example: 'A 특정 감염성',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'C.C',
    example: '가려움증',
  })
  @IsString()
  @Length(0, 100, { message: lengthValidationMessage })
  cheifComplaint: string;

  @ApiProperty({
    description: '상세 설명',
    example: '몸 전체가 다 가려우심',
  })
  @IsString()
  cheifComplaintHistory: string;
}
