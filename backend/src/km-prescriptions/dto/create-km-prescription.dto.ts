import { PickType } from '@nestjs/mapped-types';
import { KM_Prescriptions } from '../entity/km-prescriptions.entity';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKMPrescriptionDto extends PickType(KM_Prescriptions, [
  'doses',
  'dosesCountByDay',
  'dosesDay',
  'dosesTime',
  'memo',
]) {
  @ApiProperty({
    description: '1회 투약량',
    example: 1,
  })
  @IsNumber()
  doses: number;

  @ApiProperty({
    description: '1일 복용횟수',
    example: 'tid',
  })
  @IsString()
  dosesCountByDay: string;

  @ApiProperty({
    description: '복용 일수',
    example: 5,
  })
  @IsInt()
  dosesDay: number;

  @ApiProperty({
    description: '복용 시간',
    example: '식전',
  })
  @IsString()
  dosesTime: string;

  @ApiProperty({
    description: '메모',
    example: '',
  })
  @IsString()
  @IsOptional()
  memo: string;

  @ApiProperty({
    description: '약품 ID',
    example: 1,
  })
  @IsNumber()
  medicineId: number;
}
