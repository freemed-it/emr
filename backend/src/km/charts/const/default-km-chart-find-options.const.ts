import { FindManyOptions } from 'typeorm';
import { KmCharts } from '../../entity/charts.entity';

export const DEFAULT_KM_CHART_FIND_OPTIONS: FindManyOptions<KmCharts> = {
  select: {
    prescriptions: {
      id: true,
      doses: true,
      dosesCountByDay: true,
      dosesDay: true,
      dosesTotal: true,
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
