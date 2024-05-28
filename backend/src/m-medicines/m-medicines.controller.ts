import { Controller } from '@nestjs/common';
import { MMedicinesService } from './m-medicines.service';

@Controller('m/medicines')
export class MMedicinesController {
  constructor(private readonly mMedicinesService: MMedicinesService) {}
}
