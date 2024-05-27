import { Test, TestingModule } from '@nestjs/testing';
import { KmComplaintsController } from './km-complaints.controller';
import { KmComplaintsService } from './km-complaints.service';

describe('KmComplaintsController', () => {
  let controller: KmComplaintsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KmComplaintsController],
      providers: [KmComplaintsService],
    }).compile();

    controller = module.get<KmComplaintsController>(KmComplaintsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
