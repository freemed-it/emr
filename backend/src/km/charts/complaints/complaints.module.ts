import { Module } from '@nestjs/common';
import { KmComplaintsService } from './complaints.service';
import { KmComplaintsController } from './complaints.controller';
import { KmComplaints } from '../../entity/complaints.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([KmComplaints])],
  controllers: [KmComplaintsController],
  providers: [KmComplaintsService],
})
export class KmComplaintsModule {}
