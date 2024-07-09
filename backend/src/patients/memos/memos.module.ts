import { Module } from '@nestjs/common';
import { MemosService } from './memos.service';
import { MemosController } from './memos.controller';
import { Memos } from './entity/memos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Memos])],
  controllers: [MemosController],
  providers: [MemosService],
})
export class MemosModule {}
