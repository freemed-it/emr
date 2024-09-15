import { Test, TestingModule } from '@nestjs/testing';
import { MMedicinesService } from './medicines.service';

describe('MMedicinesService', () => {
  let service: MMedicinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MMedicinesService],
    }).compile();

    service = module.get<MMedicinesService>(MMedicinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
