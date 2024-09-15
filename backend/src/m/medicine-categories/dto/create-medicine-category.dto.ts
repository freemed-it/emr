import { PickType } from '@nestjs/mapped-types';
import { MMedicineCategories } from '../../entity/medicine-categories.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';

export class CreateMMedicineCategoryDto extends PickType(MMedicineCategories, [
  'mainCategory',
  'subCategory',
]) {
  @ApiProperty({
    description: '대분류',
    example: '해열, 진통, 소염제',
  })
  @IsString({ message: stringValidationMessage })
  @Length(2, 30, { message: lengthValidationMessage })
  mainCategory: string;

  @ApiProperty({
    description: '소분류',
    example: 'NSAIDs',
  })
  @IsString({ message: stringValidationMessage })
  @Length(2, 50, { message: lengthValidationMessage })
  subCategory: string;
}
