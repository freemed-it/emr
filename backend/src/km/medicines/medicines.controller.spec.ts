import { Test, TestingModule } from '@nestjs/testing';
import { KmMedicinesController } from './medicines.controller';
import { KmMedicinesService } from './medicines.service';

describe('KmMedicinesController', () => {
  let controller: KmMedicinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KmMedicinesController],
      providers: [KmMedicinesService],
    }).compile();

    controller = module.get<KmMedicinesController>(KmMedicinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
