import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: '사용자 생성',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '이미 존재하는 account/name 입니다.',
  })
  async postUser(@Body() body: CreateUserDto): Promise<CreateUserDto> {
    return this.usersService.createUser(body);
  }
}
