import { Injectable } from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { M_Medicines } from './entity/m-medicines.entity';

@Injectable()
export class MMedicinesService {
  constructor(
    @InjectRepository(M_Medicines)
    private readonly mMedicinesRepository: Repository<M_Medicines>,
  ) {}

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
}
