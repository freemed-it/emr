import { Test, TestingModule } from '@nestjs/testing';
import { MMedicineCategoriesController } from './m-medicine-categories.controller';
import { MMedicineCategoriesService } from './m-medicine-categories.service';

describe('MMedicineCategoriesController', () => {
  let controller: MMedicineCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MMedicineCategoriesController],
      providers: [MMedicineCategoriesService],
    }).compile();

    controller = module.get<MMedicineCategoriesController>(
      MMedicineCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
