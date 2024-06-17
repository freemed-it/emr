import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Gender } from '../const/gender.const';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Patients } from '../entity/patients.entity';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';

export class CreatePatientDto extends PickType(Patients, [
  'firstVisit',
  'name',
  'gender',
  'birth',
  'height',
  'weight',
  'bmi',
  'smokingAmount',
  'smokingPeriod',
  'drinkingAmount',
  'drinkingPeriod',
]) {
  @ApiProperty({
    description: '첫방문일',
    example: '2018-05-25',
  })
  @IsDate()
  firstVisit: Date;

  @ApiProperty({
    description: '이름',
    example: '홍길동',
  })
  @IsString({ message: stringValidationMessage })
  @Length(2, 10, { message: lengthValidationMessage })
  name: string;

  @ApiProperty({
    description: '성별',
    example: 'female',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: '생년월일',
    example: '2000-04-05',
  })
  @IsString({ message: stringValidationMessage })
  birth: string;

  @ApiProperty({
    description: '신장',
    example: '180',
  })
  @Min(1)
  @IsInt()
  height: number;

  @ApiProperty({
    description: '체중',
    example: '80',
  })
  @Min(1)
  @IsInt()
  weight: number;

  @ApiProperty({
    description: 'bmi',
    example: '21.3',
  })
  @IsNumber()
  bmi: number;

  @ApiProperty({
    description: '흡연량',
    example: '1',
  })
  @Min(1)
  @IsInt()
  smokingAmount: number;

  @ApiProperty({
    description: '흡연 경력',
    example: '2',
  })
  @Min(1)
  @IsInt()
  smokingPeriod: number;

  @ApiProperty({
    description: '음주량',
    example: '3',
  })
  @Min(1)
  @IsInt()
  drinkingAmount: number;

  @ApiProperty({
    description: '음주 경력',
    example: '4',
  })
  @Min(1)
  @IsInt()
  drinkingPeriod: number;
}
