import { ApiProperty, PickType } from '@nestjs/swagger';
import { M_Medicine_Categories } from '../entity/m_medicine_categories.entity';
import { IsString, Length } from 'class-validator';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';

export class UpdateMMedicineMainCategoryDto extends PickType(
  M_Medicine_Categories,
  ['mainCategory'],
) {
  @ApiProperty({
    description: '대분류',
    example: '해열, 진통, 소염제',
  })
  @IsString({ message: stringValidationMessage })
  @Length(2, 30, { message: lengthValidationMessage })
  mainCategory: string;
}
