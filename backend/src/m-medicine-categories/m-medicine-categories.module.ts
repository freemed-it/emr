import { Module } from '@nestjs/common';
import { MMedicineCategoriesService } from './m-medicine-categories.service';
import { MMedicineCategoriesController } from './m-medicine-categories.controller';

@Module({
  controllers: [MMedicineCategoriesController],
  providers: [MMedicineCategoriesService],
})
export class MMedicineCategoriesModule {}
