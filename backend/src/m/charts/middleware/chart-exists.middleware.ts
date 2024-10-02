import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MChartsService } from '../charts.service';

@Injectable()
export class MChartExistsMiddleware implements NestMiddleware {
  constructor(private readonly chartsService: MChartsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const chartNumber = req.params.chartNumber;
    if (!chartNumber) {
      throw new BadRequestException('chartNumber 파라미터는 필수입니다.');
    }

    const exists =
      await this.chartsService.checkChartExistsByChartNumber(chartNumber);
    if (!exists) {
      throw new BadRequestException('존재하지 않는 차트입니다.');
    }

    next();
  }
}