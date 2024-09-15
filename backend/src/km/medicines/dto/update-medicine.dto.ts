import {
  IsInt,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateKMMedicineDto } from './create-medicine.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateKMMedicineDto extends PartialType(CreateKMMedicineDto) {
  @ApiProperty({
    description: '약품명',
    example: '수정한 갈근탕연조엑스(단미엑스혼합제) S02',
  })
  @IsString()
  @Length(2, 40)
  name: string;

  @ApiProperty({
    description: '적응증',
    example:
      '감기, 몸살, 뒷목과 등이 뻣뻣하게 아픔, 머리와 얼굴이 아픈 증상, 갈증, 설사, 피부 발진, 비염, 부비동염, 급성 기관지염, 급성 후두염, 성홍열, 대장염',
    required: false,
  })
  @IsString()
  @MaxLength(1000)
  indication: string;

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
    example: 20,
  })
  @IsInt()
  @Min(0)
  officeQuantity: number;

  @ApiProperty({
    description: '포장단위',
    example: 10,
  })
  @IsInt()
  @Min(0)
  packaging: number;

  @ApiProperty({
    description: '총량',
    example: 200,
  })
  @IsInt()
  @Min(0)
  totalAmount: number;

  @ApiProperty({
    description:
      "사진 - <em>image 속성 없으면 사진 변경 안 함, image='' 빈 값으로 보내면 사진 삭제</em>",
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  image?: any;
}
