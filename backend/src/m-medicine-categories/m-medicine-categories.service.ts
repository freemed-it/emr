import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { M_Medicine_Categories } from './entity/m_medicine_categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateMMedicineCategoryDto } from './dto/create-m-medicine-category.dto';
import { UpdateMMedicineSubCategoryDto } from './dto/update-m-medicine-sub-category.dto';
import { UpdateMMedicineMainCategoryDto } from './dto/update-m-medicine-main-category.dto';
import { M_Medicines } from 'src/m-medicines/entity/m-medicines.entity';

@Injectable()
export class MMedicineCategoriesService {
  constructor(
    @InjectRepository(M_Medicine_Categories)
    private readonly mMedicineCategoriesRepository: Repository<M_Medicine_Categories>,
    @InjectRepository(M_Medicines)
    private readonly mMedicinesRepository: Repository<M_Medicines>,
  ) {}

  async getCategories() {
    const categories = await this.mMedicineCategoriesRepository.find();

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
    });
  }

  async updateMainCategory(
    category: string,
    mainCategoryDto: UpdateMMedicineMainCategoryDto,
  ) {
    const categories = await this.mMedicineCategoriesRepository.find({
      where: {
        mainCategory: category,
      },
    });

    if (categories.length === 0) {
      throw new NotFoundException();
    }

    const existingCategories = await this.mMedicineCategoriesRepository.find({
      where: {
        mainCategory: mainCategoryDto.mainCategory,
      },
    });

    if (existingCategories.length > 0) {
      throw new BadRequestException('이미 존재하는 대분류입니다.');
    }

    for (const category of categories) {
      await this.mMedicineCategoriesRepository.save({
        ...category,
        mainCategory: mainCategoryDto.mainCategory,
      });
    }

    return mainCategoryDto.mainCategory;
  }

  async deleteMainCategory(category: string) {
    const categories = await this.mMedicineCategoriesRepository.find({
      where: {
        mainCategory: category,
      },
      withDeleted: true,
    });

    if (categories.length === 0) {
      throw new NotFoundException();
    }

    const existingCategories = await this.mMedicineCategoriesRepository.find({
      where: {
        mainCategory: category,
      },
    });

    if (existingCategories.length > 0) {
      throw new BadRequestException('삭제되지 않은 소분류가 존재합니다.');
    }

    await this.mMedicineCategoriesRepository.delete({
      mainCategory: category,
    });

    return category;
  }

  async updateSubCategory(
    categoryId: number,
    subCategoryDto: UpdateMMedicineSubCategoryDto,
  ) {
    const category = await this.mMedicineCategoriesRepository.findOne({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException();
    }

    const newCategory = await this.mMedicineCategoriesRepository.preload({
      id: categoryId,
      ...subCategoryDto,
    });

    return await this.mMedicineCategoriesRepository.save(newCategory);
  }

  async deleteSubCategory(categoryId: number) {
    const category = await this.mMedicineCategoriesRepository.findOne({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException();
    }

    const isDeleted = await this.checkDeletedMMedicinesByCategoryId(categoryId);

    if (!isDeleted) {
      throw new BadRequestException('삭제되지 않은 약품이 존재합니다.');
    }

    await this.mMedicineCategoriesRepository.softDelete(categoryId);

    return categoryId;
  }

  async checkDeletedMMedicinesByCategoryId(categoryId: number) {
    const [, deletedMedicineCount] =
      await this.mMedicinesRepository.findAndCount({
        where: {
          category: {
            id: categoryId,
          },
          deletedAt: Not(IsNull()),
        },
        withDeleted: true,
      });

    const [, medicineCount] = await this.mMedicinesRepository.findAndCount({
      where: {
        category: {
          id: categoryId,
        },
      },
      withDeleted: true,
    });

    return deletedMedicineCount === medicineCount;
  }

  async checkCategoryExistsById(id: number) {
    return this.mMedicineCategoriesRepository.exists({
      where: { id },
    });
  }
}
