import { Test, TestingModule } from '@nestjs/testing';
import { MMedicinesController } from './medicines.controller';
import { MMedicinesService } from './medicines.service';

describe('MMedicinesController', () => {
  let controller: MMedicinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MMedicinesController],
      providers: [MMedicinesService],
    }).compile();

    controller = module.get<MMedicinesController>(MMedicinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
