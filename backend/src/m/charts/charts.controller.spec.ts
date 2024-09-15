import { Test, TestingModule } from '@nestjs/testing';
import { MChartsController } from './charts.controller';
import { MChartsService } from './charts.service';

describe('MChartsController', () => {
  let controller: MChartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MChartsController],
      providers: [MChartsService],
    }).compile();

    controller = module.get<MChartsController>(MChartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
