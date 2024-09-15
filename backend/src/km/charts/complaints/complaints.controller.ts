import { Controller } from '@nestjs/common';
import { KmComplaintsService } from './complaints.service';

@Controller('km/complaints')
export class KmComplaintsController {
  constructor(private readonly kmComplaintsService: KmComplaintsService) {}
}
