import { FindManyOptions } from 'typeorm';
import { MCharts } from '../../entity/charts.entity';

export const DEFAULT_M_CHART_FIND_OPTIONS: FindManyOptions<MCharts> = {
  select: {
    prescriptions: {
      id: true,
      doses: true,
      dosesCountByDay: true,
      dosesDay: true,
      dosesTotal: true,
      bundle: true,
      memo: true,
      medicine: {
        id: true,
        name: true,
        deletedAt: true,
      },
    },
  },
  relations: {
    complaints: true,
    prescriptions: {
      medicine: true,
    },
  },
  withDeleted: true,
};
