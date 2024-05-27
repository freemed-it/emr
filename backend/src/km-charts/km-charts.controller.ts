import { Controller } from '@nestjs/common';
import { KmChartsService } from './km-charts.service';

@Controller('km-charts')
export class KmChartsController {
  constructor(private readonly kmChartsService: KmChartsService) {}
}
