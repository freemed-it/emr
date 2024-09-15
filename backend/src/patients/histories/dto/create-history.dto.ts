import { IsString } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Histories } from '../../entity/histories.entity';

export class CreateHistoryDto extends PickType(Histories, [
  'hypertension',
  'diabetesMellitus',
  'hepatitisA',
  'hepatitisB',
  'hepatitisC',
  'tuberculosis',
  'heartDisease',
  'adrenalDisorders',
  'tumor',
  'infectiousDisease',
  'veneralDisease',
  'otherDisease',
  'foodAllergy',
  'environmentAllergy',
  'drugAllergy',
  'substanceAllergy',
  'otherAllergy',
  'surgeryPeriod',
  'surgeryPart',
  'medicineType',
  'medicinePeriod',
]) {
  @ApiProperty({
    description: '고혈압',
    example: '1988~, 전부터 약을 드심',
  })
  @IsString()
  hypertension: string;

  @ApiProperty({
    description: '당뇨',
    example: '10년전부터 당뇨 치료',
  })
  @IsString()
  diabetesMellitus: string;

  @ApiProperty({
    description: 'A형 간염',
    example: '2022. 08~',
  })
  @IsString()
  hepatitisA: string;

  @ApiProperty({
    description: 'B형 간염',
    example: '2022. 08 ~, 현재는 없음',
  })
  @IsString()
  hepatitisB: string;

  @ApiProperty({
    description: 'C형 간염',
    example: '2022. 08 ~, 그전에도 간염 증상',
  })
  @IsString()
  hepatitisC: string;

  @ApiProperty({
    description: '결핵',
    example: '2020년도~ ',
  })
  @IsString()
  tuberculosis: string;

  @ApiProperty({
    description: '심질환',
    example: '2019년에 병원 치료',
  })
  @IsString()
  heartDisease: string;

  @ApiProperty({
    description: '신장 질환',
    example: '~2020 겨울',
  })
  @IsString()
  adrenalDisorders: string;

  @ApiProperty({
    description: '종양',
    example: '2021년~, 약물 복용',
  })
  @IsString()
  tumor: string;

  @ApiProperty({
    description: '감염성 질환',
    example: '아직까지 없음',
  })
  @IsString()
  infectiousDisease: string;

  @ApiProperty({
    description: '성병',
    example: '2021년 ~',
  })
  @IsString()
  veneralDisease: string;

  @ApiProperty({
    description: '기타',
    example: '기타',
  })
  @IsString()
  otherDisease: string;

  @ApiProperty({
    description: '음식 알레르기',
    example: '어릴떄부터 갑각류',
  })
  @IsString()
  foodAllergy: string;

  @ApiProperty({
    description: '환경 알레르기',
    example: '미세먼지로 인한 비염',
  })
  @IsString()
  environmentAllergy: string;

  @ApiProperty({
    description: '약물 알레르기',
    example: '2022년도~',
  })
  @IsString()
  drugAllergy: string;

  @ApiProperty({
    description: '물질 알레르기',
    example: '2019년~',
  })
  @IsString()
  substanceAllergy: string;

  @ApiProperty({
    description: '기타',
    example: '기타',
  })
  @IsString()
  otherAllergy: string;

  @ApiProperty({
    description: '수술 시기',
    example: '2020년 여름',
  })
  @IsString()
  surgeryPeriod: string;

  @ApiProperty({
    description: '수술 부위',
    example: '갈비',
  })
  @IsString()
  surgeryPart: string;

  @ApiProperty({
    description: '약물 복용 종류',
    example: '알레르기성 약물',
  })
  @IsString()
  medicineType: string;

  @ApiProperty({
    description: '약물 복용 기간',
    example: '10년~',
  })
  @IsString()
  medicinePeriod: string;
}
