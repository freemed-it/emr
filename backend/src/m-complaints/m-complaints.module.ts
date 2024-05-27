import { Module } from '@nestjs/common';
import { MComplaintsService } from './m-complaints.service';
import { MComplaintsController } from './m-complaints.controller';

@Module({
  controllers: [MComplaintsController],
  providers: [MComplaintsService],
})
export class MComplaintsModule {}
