import { Controller } from '@nestjs/common';
import { MChartsService } from './m-charts.service';

@Controller('m/charts')
export class MChartsController {
  constructor(private readonly mChartsService: MChartsService) {}
}
