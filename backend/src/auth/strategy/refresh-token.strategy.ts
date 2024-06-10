import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_JWT_SECRET_KEY } from 'src/common/const/env-keys.const';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { Payload } from './jwt.payload';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies.refresh_token,
      ]),
      secretOrKey: configService.get<string>(ENV_JWT_SECRET_KEY),
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req: any, payload: Payload) {
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Refresh Token이 아닙니다.');
    }

    const refreshToken = req.cookies.refresh_token;
    const isTokenValid = await this.authService.isRefreshTokenValid(
      refreshToken,
      payload.id,
    );

    if (!isTokenValid) {
      throw new UnauthorizedException('Refresh Token이 유효하지 않습니다.');
    }

    const loginUser = await this.usersService.getUserByAccount(payload.account);

    if (!loginUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    return loginUser;
  }
}
