import { Test, TestingModule } from '@nestjs/testing';
import { KmPrescriptionsController } from './km-prescriptions.controller';
import { KmPrescriptionsService } from './km-prescriptions.service';

describe('KmPrescriptionsController', () => {
  let controller: KmPrescriptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KmPrescriptionsController],
      providers: [KmPrescriptionsService],
    }).compile();

    controller = module.get<KmPrescriptionsController>(
      KmPrescriptionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
