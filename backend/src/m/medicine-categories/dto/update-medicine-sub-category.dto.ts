import { ApiProperty } from '@nestjs/swagger';
import { PickType } from '@nestjs/mapped-types';
import { IsString, Length } from 'class-validator';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { CreateMMedicineCategoryDto } from './create-medicine-category.dto';

export class UpdateMMedicineSubCategoryDto extends PickType(
  CreateMMedicineCategoryDto,
  ['subCategory'],
) {
  @ApiProperty({
    description: '소분류',
    example: 'NSAIDs',
  })
  @IsString({ message: stringValidationMessage })
  @Length(2, 50, { message: lengthValidationMessage })
  subCategory: string;
}
