import { Test, TestingModule } from '@nestjs/testing';
import { KmPrescriptionsService } from './prescriptions.service';

describe('KmPrescriptionsService', () => {
  let service: KmPrescriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KmPrescriptionsService],
    }).compile();

    service = module.get<KmPrescriptionsService>(KmPrescriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
