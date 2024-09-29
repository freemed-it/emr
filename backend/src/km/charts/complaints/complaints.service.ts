import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateKmComplaintDto } from './dto/create-complaint.dto';
import { KmComplaints } from 'src/km/entity/complaints.entity';

@Injectable()
export class KmComplaintsService {
  constructor(
    @InjectRepository(KmComplaints)
    private readonly complaintsRepository: Repository<KmComplaints>,
  ) {}

  async createComplaint(
    chartNumber: string,
    patientId: number,
    complaintDto: CreateKmComplaintDto,
  ) {
    return await this.complaintsRepository.save({
      ...complaintDto,
      chart: { chartNumber },
      patient: { id: patientId },
    });
  }

  async getComplaintByChartNumber(chartNumber: string) {
    return await this.complaintsRepository.findOne({
      where: { chart: { chartNumber } },
    });
  }
}
