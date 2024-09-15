import { Module } from '@nestjs/common';
import { MComplaintsService } from './complaints.service';
import { MComplaintsController } from './complaints.controller';

@Module({
  controllers: [MComplaintsController],
  providers: [MComplaintsService],
})
export class MComplaintsModule {}
