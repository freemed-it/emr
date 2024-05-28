import { Controller } from '@nestjs/common';
import { MComplaintsService } from './m-complaints.service';

@Controller('m/complaints')
export class MComplaintsController {
  constructor(private readonly mComplaintsService: MComplaintsService) {}
}
