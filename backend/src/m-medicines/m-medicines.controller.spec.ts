import { Test, TestingModule } from '@nestjs/testing';
import { MMedicinesController } from './m-medicines.controller';
import { MMedicinesService } from './m-medicines.service';

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
