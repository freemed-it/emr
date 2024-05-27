import { Test, TestingModule } from '@nestjs/testing';
import { KmMedicinesService } from './km-medicines.service';

describe('KmMedicinesService', () => {
  let service: KmMedicinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KmMedicinesService],
    }).compile();

    service = module.get<KmMedicinesService>(KmMedicinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
