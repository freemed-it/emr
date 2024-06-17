import { BadRequestException, Injectable } from '@nestjs/common';
import { M_Medicine_Categories } from './entity/m_medicine_categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMMedicineCategoryDto } from './dto/create-m-medicine-category.dto';

@Injectable()
export class MMedicineCategoriesService {
  constructor(
    @InjectRepository(M_Medicine_Categories)
    private readonly mMedicineCategoriesRepository: Repository<M_Medicine_Categories>,
  ) {}

  async createCategory(categoryDto: CreateMMedicineCategoryDto) {
    const existingCategory = await this.getCategoryByName(
      categoryDto.mainCategory,
      categoryDto.subCategory,
    );

    if (existingCategory) {
      throw new BadRequestException('이미 존재하는 분류입니다.');
    }

    const category = this.mMedicineCategoriesRepository.create({
      ...categoryDto,
    });

    return await this.mMedicineCategoriesRepository.save(category);
  }

  async getCategoryByName(mainCategory: string, subCategory: string) {
    return await this.mMedicineCategoriesRepository.findOne({
      where: {
        mainCategory,
        subCategory,
      },
      withDeleted: false,
    });
  }
}
