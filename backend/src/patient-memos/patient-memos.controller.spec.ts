import { Test, TestingModule } from '@nestjs/testing';
import { PatientMemosController } from './patient-memos.controller';
import { PatientMemosService } from './patient-memos.service';

describe('PatientMemosController', () => {
  let controller: PatientMemosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientMemosController],
      providers: [PatientMemosService],
    }).compile();

    controller = module.get<PatientMemosController>(PatientMemosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
