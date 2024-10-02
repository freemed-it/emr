import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MemosService } from './memos.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/decorator/user.decorator';
import { CreateMemoDto } from './dto/create-memo.dto';
import { Users } from 'src/users/entity/users.entity';
import { UpdateMemoDto } from './dto/update-memo.dto';

@ApiTags('참여자')
@Controller('patients/:patientId/memos')
export class MemosController {
  constructor(private readonly memosService: MemosService) {}

  @Post()
  async postMemo(
    @Param('patientId') patientId: number,
    @Body() memoDto: CreateMemoDto,
    @User() user: Users,
  ) {
    return this.memosService.createMemo(patientId, memoDto, user);
  }

  @Patch(':memoId')
  async patchMemo(
    @Param('memoId') id: number,
    @Body() memoDto: UpdateMemoDto,
    @User() user: Users,
  ) {
    return this.memosService.updateMemo(id, memoDto, user);
  }

  @Get(':memoId')
  async getMemo(@Param('memoId') id: number) {
    return this.memosService.getMemo(id);
  }
}
