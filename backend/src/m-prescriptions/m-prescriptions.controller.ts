import { Controller } from '@nestjs/common';
import { MPrescriptionsService } from './m-prescriptions.service';

@Controller('m/prescriptions')
export class MPrescriptionsController {
  constructor(private readonly mPrescriptionsService: MPrescriptionsService) {}
}
