import { Test, TestingModule } from '@nestjs/testing';
import { MChartsService } from './m-charts.service';

describe('MChartsService', () => {
  let service: MChartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MChartsService],
    }).compile();

    service = module.get<MChartsService>(MChartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
