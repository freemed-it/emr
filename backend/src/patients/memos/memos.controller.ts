import { Body, Controller, Param, Post } from '@nestjs/common';
import { MemosService } from './memos.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMemoDto } from './dto/create-memo.dto';
import { Users } from 'src/users/entity/users.entity';
import { User } from 'src/users/decorator/user.decorator';

@ApiTags('참여자')
@Controller('memos')
export class MemosController {
  constructor(private readonly memosService: MemosService) {}

  @Post(':patientId/memos')
  @ApiOperation({
    summary: '참여자 메모 생성',
  })
  async createMemo(
    @Param('patientId') patientId: number,
    @Body() createMemoDto: CreateMemoDto,
    @User() user: Users,
  ) {
    return this.memosService.createMemo(patientId, createMemoDto, user);
  }
}
