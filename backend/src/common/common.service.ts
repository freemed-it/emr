import { Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import { FindManyOptions, LessThan, MoreThan, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { BaseModel } from './entity/base.entity';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}
  paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    if (dto.page) {
      return this.offsetPaginate(dto, repository, overrideFindOptions);
    } else {
      return this.cursorPaginate(dto, repository, overrideFindOptions);
    }
  }

  private async offsetPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    const findOptions = this.composeFindOptions<T>(dto, overrideFindOptions);
    const [data, count] = await repository.findAndCount(findOptions);

    return {
      data: data,
      meta: {
        total: count,
      },
    };
  }

  async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    const findOptions = this.composeFindOptions<T>(dto, overrideFindOptions);
    const [data, count] = await repository.findAndCount(findOptions);
    let hasNext: boolean = true;
    let cursor: number;

    if (count <= dto.take || data.length <= 0) {
      hasNext = false;
      cursor = null;
    } else {
      cursor = data[data.length - 1].id;
    }

    return {
      data: data,
      meta: {
        count: data.length,
        cursor,
        hasNext,
      },
    };
  }

  private composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto,
    overrideFindOptions: FindManyOptions<T> = {},
  ): FindManyOptions<T> {
    const { where, order, ...restOptions } = overrideFindOptions;

    return {
      where: {
        ...(dto.cursor && {
          id: dto.sort === 'ASC' ? MoreThan(dto.cursor) : LessThan(dto.cursor),
        }),
        ...where,
      },
      order: {
        createdAt: dto.sort,
        ...order,
      },
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page - 1) : null,
      ...restOptions,
    };
  }
}
