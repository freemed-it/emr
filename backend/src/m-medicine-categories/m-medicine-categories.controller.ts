import { Controller } from '@nestjs/common';
import { MMedicineCategoriesService } from './m-medicine-categories.service';

@Controller('m-medicine-categories')
export class MMedicineCategoriesController {
  constructor(
    private readonly mMedicineCategoriesService: MMedicineCategoriesService,
  ) {}
}
