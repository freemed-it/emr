import { Module } from '@nestjs/common';
import { KmComplaintsService } from './km-complaints.service';
import { KmComplaintsController } from './km-complaints.controller';
import { KM_Complaints } from './entity/km-complaints.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([KM_Complaints])],
  controllers: [KmComplaintsController],
  providers: [KmComplaintsService],
})
export class KmComplaintsModule {}
