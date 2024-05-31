import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from '../entity/users.entity';
import { IsString, Length, Matches } from 'class-validator';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';

export class CreateUserDto extends PickType(Users, [
  'account',
  'password',
  'permission',
  'name',
]) {
  @ApiProperty({
    description: '사용자 계정',
    example: 'test',
  })
  @IsString({ message: stringValidationMessage })
  @Length(4, 20, { message: lengthValidationMessage })
  account: string;

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'test123',
  })
  @IsString({ message: stringValidationMessage })
  password: string;

  @ApiProperty({
    description: '사용자 권한',
    example: '9000',
    pattern: '^[4-9]000/',
  })
  @IsString({ message: stringValidationMessage })
  @Matches(/^[4-9]000$/, {
    message: '권한은 4000~9000 형식이어야 합니다.',
  })
  permission: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '테스트',
  })
  @IsString({ message: stringValidationMessage })
  @Length(2, 20, { message: lengthValidationMessage })
  name: string;
}
