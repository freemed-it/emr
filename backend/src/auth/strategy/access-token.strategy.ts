import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_JWT_SECRET_KEY } from 'src/common/const/env-keys.const';
import { UsersService } from 'src/users/users.service';
import { Payload } from './jwt.payload';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.access_token,
      ]),
      secretOrKey: configService.get<string>(ENV_JWT_SECRET_KEY),
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Access Token이 아닙니다.');
    }

    const loginUser = await this.usersService.getUserByAccount(payload.account);

    if (!loginUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    return loginUser;
  }
}
