import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { M_Medicine_Categories } from './entity/m_medicine_categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMMedicineCategoryDto } from './dto/create-m-medicine-category.dto';
import { UpdateMMedicineSubCategoryDto } from './dto/update-m-medicine-sub-category.dto';
import { UpdateMMedicineMainCategoryDto } from './dto/update-m-medicine-main-category.dto';

@Injectable()
export class MMedicineCategoriesService {
  constructor(
    @InjectRepository(M_Medicine_Categories)
    private readonly medicineCategoriesRepository: Repository<M_Medicine_Categories>,
  ) {}

  async getCategories() {
    const categories = await this.medicineCategoriesRepository.find();

    return categories.reduce(
      (acc, cur) =>
        Object.keys(acc).includes(cur.mainCategory)
          ? {
              ...acc,
              [cur.mainCategory]: [
                ...acc[cur.mainCategory],
                { id: cur.id, subCategory: cur.subCategory },
              ],
            }
          : {
              ...acc,
              [cur.mainCategory]: [
                { id: cur.id, subCategory: cur.subCategory },
              ],
            },
      {},
    );
  }

  async createCategory(categoryDto: CreateMMedicineCategoryDto) {
    const existingCategory = await this.getCategoryByName(
      categoryDto.mainCategory,
      categoryDto.subCategory,
    );

    if (existingCategory) {
      throw new BadRequestException('이미 존재하는 분류입니다.');
    }

    const category = this.medicineCategoriesRepository.create({
      ...categoryDto,
    });

    return await this.medicineCategoriesRepository.save(category);
  }

  async getCategoryByName(mainCategory: string, subCategory: string) {
    return await this.medicineCategoriesRepository.findOne({
      where: {
        mainCategory,
        subCategory,
      },
    });
  }

  async updateMainCategory(
    category: string,
    mainCategoryDto: UpdateMMedicineMainCategoryDto,
  ) {
    const categories = await this.medicineCategoriesRepository.find({
      where: { mainCategory: category },
    });

    if (categories.length === 0) {
      throw new NotFoundException();
    }

    const existingCategories = await this.medicineCategoriesRepository.find({
      where: { mainCategory: mainCategoryDto.mainCategory },
    });

    if (existingCategories.length > 0) {
      throw new BadRequestException('이미 존재하는 대분류입니다.');
    }

    for (const category of categories) {
      await this.medicineCategoriesRepository.save({
        ...category,
        mainCategory: mainCategoryDto.mainCategory,
      });
    }

    return mainCategoryDto.mainCategory;
  }

  async deleteMainCategory(category: string) {
    const categories = await this.medicineCategoriesRepository.find({
      where: { mainCategory: category },
      withDeleted: true,
    });

    if (categories.length === 0) {
      throw new NotFoundException();
    }

    const existingCategories = await this.medicineCategoriesRepository.find({
      where: { mainCategory: category },
    });

    if (existingCategories.length > 0) {
      throw new BadRequestException('삭제되지 않은 소분류가 존재합니다.');
    }

    await this.medicineCategoriesRepository.delete({
      mainCategory: category,
    });

    return category;
  }

  async updateSubCategory(
    categoryId: number,
    subCategoryDto: UpdateMMedicineSubCategoryDto,
  ) {
    const category = await this.medicineCategoriesRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException();
    }

    const newCategory = await this.medicineCategoriesRepository.preload({
      id: categoryId,
      ...subCategoryDto,
    });

    return await this.medicineCategoriesRepository.save(newCategory);
  }

  async deleteSubCategory(categoryId: number) {
    const category = await this.medicineCategoriesRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException();
    }

    await this.medicineCategoriesRepository.softDelete(categoryId);

    return categoryId;
  }

  async checkCategoryExistsById(id: number) {
    return this.medicineCategoriesRepository.exists({
      where: { id },
    });
  }
}
