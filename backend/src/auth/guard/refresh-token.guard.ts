import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info instanceof Error) {
      throw new UnauthorizedException('Refresh Token이 존재하지 않습니다.');
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
