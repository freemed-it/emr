import { Test, TestingModule } from '@nestjs/testing';
import { KmComplaintsService } from './km-complaints.service';

describe('KmComplaintsService', () => {
  let service: KmComplaintsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KmComplaintsService],
    }).compile();

    service = module.get<KmComplaintsService>(KmComplaintsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
