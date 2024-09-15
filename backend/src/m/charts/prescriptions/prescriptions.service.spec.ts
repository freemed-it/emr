import { Test, TestingModule } from '@nestjs/testing';
import { MPrescriptionsService } from './prescriptions.service';

describe('MPrescriptionsService', () => {
  let service: MPrescriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MPrescriptionsService],
    }).compile();

    service = module.get<MPrescriptionsService>(MPrescriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
