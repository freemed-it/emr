import { Test, TestingModule } from '@nestjs/testing';
import { MComplaintsController } from './m-complaints.controller';
import { MComplaintsService } from './m-complaints.service';

describe('MComplaintsController', () => {
  let controller: MComplaintsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MComplaintsController],
      providers: [MComplaintsService],
    }).compile();

    controller = module.get<MComplaintsController>(MComplaintsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
