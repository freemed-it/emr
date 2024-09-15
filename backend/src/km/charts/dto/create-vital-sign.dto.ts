import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';
import { KmCharts } from '../../entity/charts.entity';

export class CreateVitalSignDto extends PickType(KmCharts, [
  'spO2',
  'heartRate',
  'bodyTemperature',
  'diastoleBloodPressure',
  'bloodGlucose',
  'afterMeals',
  'vsMemo',
]) {
  @ApiProperty({
    description: 'SpO2',
    example: 0,
  })
  @IsNumber()
  spO2: number;

  @ApiProperty({
    description: 'Heart Rate',
    example: 0,
  })
  @IsInt()
  heartRate: number;

  @ApiProperty({
    description: 'Body Temporature',
    example: 36.5,
  })
  @IsNumber()
  bodyTemperature: number;

  @ApiProperty({
    description: '수축기',
    example: 184,
  })
  @IsInt()
  systoleBloodPressure: number;

  @ApiProperty({
    description: '이완기',
    example: 80,
  })
  @IsInt()
  diastoleBloodPressure: number;

  @ApiProperty({
    description: '혈당',
    example: 90,
  })
  @IsInt()
  bloodGlucose: number;

  @ApiProperty({
    description: '식후',
    example: 9,
  })
  @IsInt()
  afterMeals: number;

  @ApiProperty({
    description: 'V/S 메모',
    example: '대기하실 동안 맥심커피 드심',
  })
  @IsString()
  vsMemo: string;
}
