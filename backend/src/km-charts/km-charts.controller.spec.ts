import { Test, TestingModule } from '@nestjs/testing';
import { KmChartsController } from './km-charts.controller';
import { KmChartsService } from './km-charts.service';

describe('KmChartsController', () => {
  let controller: KmChartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KmChartsController],
      providers: [KmChartsService],
    }).compile();

    controller = module.get<KmChartsController>(KmChartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
