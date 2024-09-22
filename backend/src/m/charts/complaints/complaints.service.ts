import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MComplaints } from 'src/m/entity/complaints.entity';
import { CreateMComplaintDto } from './dto/create-complaint.dto';

@Injectable()
export class MComplaintsService {
  constructor(
    @InjectRepository(MComplaints)
    private readonly complaintsRepository: Repository<MComplaints>,
  ) {}

  async createComplaint(
    chartId: number,
    patientId: number,
    complaintDto: CreateMComplaintDto,
  ) {
    return await this.complaintsRepository.save({
      ...complaintDto,
      chart: { id: chartId },
      patient: { id: patientId },
    });
  }
}