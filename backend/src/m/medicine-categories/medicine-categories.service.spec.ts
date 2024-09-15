import { Test, TestingModule } from '@nestjs/testing';
import { MMedicineCategoriesService } from './medicine-categories.service';

describe('MMedicineCategoriesService', () => {
  let service: MMedicineCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MMedicineCategoriesService],
    }).compile();

    service = module.get<MMedicineCategoriesService>(
      MMedicineCategoriesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
