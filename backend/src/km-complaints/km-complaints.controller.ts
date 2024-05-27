import { Controller } from '@nestjs/common';
import { KmComplaintsService } from './km-complaints.service';

@Controller('km-complaints')
export class KmComplaintsController {
  constructor(private readonly kmComplaintsService: KmComplaintsService) {}
}
