import { Controller } from '@nestjs/common';
import { KmMedicinesService } from './km-medicines.service';

@Controller('km-medicines')
export class KmMedicinesController {
  constructor(private readonly kmMedicinesService: KmMedicinesService) {}
}
