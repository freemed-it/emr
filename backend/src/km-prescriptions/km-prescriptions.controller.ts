import { Controller } from '@nestjs/common';
import { KmPrescriptionsService } from './km-prescriptions.service';

@Controller('km/prescriptions')
export class KmPrescriptionsController {
  constructor(
    private readonly kmPrescriptionsService: KmPrescriptionsService,
  ) {}
}
