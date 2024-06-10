import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { Users } from '../entity/users.entity';

export const User = createParamDecorator(
  (data: keyof Users | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as Users;

    if (!user) {
      throw new InternalServerErrorException(
        'request에 user가 존재하지 않습니다. AccessTokenGuard가 필요합니다.',
      );
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
