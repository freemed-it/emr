import { PickType } from '@nestjs/mapped-types';
import { M_Prescriptions } from '../entity/m-prescriptions.entity';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMPrescriptionDto extends PickType(M_Prescriptions, [
  'doses',
  'dosesCountByDay',
  'dosesDay',
  'bundle',
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
    description: '묶음',
    example: '',
  })
  @IsString()
  @IsOptional()
  bundle: string;

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
