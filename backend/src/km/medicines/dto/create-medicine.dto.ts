import { IsInt, IsString, Length, MaxLength, Min } from 'class-validator';
import { KmMedicines } from '../../entity/medicines.entity';
import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKMMedicineDto extends PickType(KmMedicines, [
  'name',
  'indication',
  'stationQuantity',
  'officeQuantity',
  'packaging',
  'totalAmount',
  'image',
]) {
  @ApiProperty({
    description: '약품명',
    example: '갈근탕연조엑스(단미엑스혼합제) S02',
  })
  @IsString()
  @Length(2, 40)
  name: string;

  @ApiProperty({
    description: '적응증',
    example:
      '감기, 몸살, 뒷목과 등이 뻣뻣하게 아픔, 머리와 얼굴이 아픈 증상, 갈증, 설사, 피부 발진, 비염, 부비동염, 급성 기관지염, 급성 후두염, 성홍열, 대장염',
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
    description: '사진',
    type: 'string',
    format: 'binary',
    required: false,
  })
  image: any;
}
