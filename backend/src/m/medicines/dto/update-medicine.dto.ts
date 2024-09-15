import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { CreateMMedicineDto } from './create-medicine.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMMedicineDto extends PartialType(CreateMMedicineDto) {
  @ApiProperty({
    description: '약품명',
    example: '수정한 에스부펜정',
  })
  @IsString()
  @Length(2, 40)
  name: string;

  @ApiProperty({
    description: '성분명/함량',
    example: 'Dexibuprofen 400mg',
  })
  @IsString()
  @Length(2, 300)
  ingredient: string;

  @ApiProperty({
    description: '용량/용법',
    example:
      '성인 : 1회 300 mg을 1일 2~4회 경구투여.\n단, 1일 1200mg을 초과하지 않는다.',
    required: false,
  })
  @IsString()
  @MaxLength(1000)
  dosage: string;

  @ApiProperty({
    description: '효능/효과',
    example:
      '1. 만성 다발성 관절염, 류마티스관절염\n2. 관절증\n3. 강직척추염\n4. 외상 및 수술 후 통증성 부종 또는 염증\n5. 염증, 통증 및 발열을 수반하는 감염증의 치료보조',
    required: false,
  })
  @IsString()
  @MaxLength(1000)
  efficacy: string;

  @ApiProperty({
    description: '사무실 재고',
    example: 5,
    required: false,
  })
  @IsInt()
  @Min(0)
  stationQuantity: number;

  @ApiProperty({
    description: '서울역 재고',
    example: 5,
  })
  @IsInt()
  @Min(0)
  officeQuantity: number;

  @ApiProperty({
    description: '포장단위',
    example: 30,
  })
  @IsInt()
  @Min(0)
  packaging: number;

  @ApiProperty({
    description: '총량',
    example: 150,
  })
  @IsInt()
  @Min(0)
  totalAmount: number;

  @ApiProperty({
    description: 'DUR',
    example:
      '[병용금기] ketorolac\n[임부금기] 2등급\n[용량주의] 1일 최대 투여량 - 1,200mg\n[노인주의] 고령자는 중대한 위장관계 이상반응의 위험이 더 클 수 있음. 고령자는 이상반응이 나타나기 쉬우므로 소량부터 투여를 개시하고 필요한 최소량으로 투여하며, 이상반응의 발현에 특히 유의하는 등 환자의 상태를 관찰하면서 신중히 투여',
    required: false,
  })
  @IsString()
  @MaxLength(500)
  dur: string;

  @ApiProperty({
    description: '약품통',
    example: '유(21T)',
    required: false,
  })
  @IsString()
  @MaxLength(10)
  bottle: string;

  @ApiProperty({
    description:
      "사진 - <em>image 속성 없으면 사진 변경 안 함, image='' 빈 값으로 보내면 사진 삭제</em>",
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  image?: any;

  @Transform((value) => {
    return value.value == 'true' ? true : false;
  })
  @ApiProperty({
    description: '처방 시 따로 표기 여부',
    example: true,
  })
  @IsBoolean()
  isExcluded: boolean;

  @ApiProperty({
    description: '분류 ID',
    example: 1,
  })
  @IsNumber()
  categoryId: number;
}
