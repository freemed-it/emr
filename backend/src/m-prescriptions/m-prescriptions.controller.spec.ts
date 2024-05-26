import { Test, TestingModule } from '@nestjs/testing';
import { MPrescriptionsController } from './m-prescriptions.controller';
import { MPrescriptionsService } from './m-prescriptions.service';

describe('MPrescriptionsController', () => {
  let controller: MPrescriptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MPrescriptionsController],
      providers: [MPrescriptionsService],
    }).compile();

    controller = module.get<MPrescriptionsController>(MPrescriptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
