import { Test, TestingModule } from '@nestjs/testing';
import { PatientMemosService } from './patient-memos.service';

describe('PatientMemosService', () => {
  let service: PatientMemosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientMemosService],
    }).compile();

    service = module.get<PatientMemosService>(PatientMemosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
