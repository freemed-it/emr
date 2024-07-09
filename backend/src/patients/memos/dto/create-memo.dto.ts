import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { Memos } from '../entity/memos.entity';

export class CreateMemoDto extends PickType(Memos, ['memo']) {
  @ApiProperty({
    description: '메모',
    example: '주의 필요',
  })
  @IsString()
  @MaxLength(300)
  memo: string;
}
