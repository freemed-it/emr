import { Test, TestingModule } from '@nestjs/testing';
import { MComplaintsService } from './complaints.service';

describe('MComplaintsService', () => {
  let service: MComplaintsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MComplaintsService],
    }).compile();

    service = module.get<MComplaintsService>(MComplaintsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
