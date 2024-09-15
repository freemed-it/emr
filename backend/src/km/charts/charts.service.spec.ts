import { Test, TestingModule } from '@nestjs/testing';
import { KmChartsService } from './charts.service';

describe('KmChartsService', () => {
  let service: KmChartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KmChartsService],
    }).compile();

    service = module.get<KmChartsService>(KmChartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
