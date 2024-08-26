import { BadRequestException } from '@nestjs/common';

export const convertDosesCountByDay = (dosesCountByDay: string) => {
  switch (dosesCountByDay) {
    case 'qd(아침)':
      return 1;
    case 'qd(저녁)':
      return 1;
    case 'hs':
      return 1;
    case 'bid':
      return 2;
    case 'tid':
      return 3;
    case 'qid':
      return 4;
    default:
      throw new BadRequestException('존재하지 않는 1일 복용횟수입니다.');
  }
};
