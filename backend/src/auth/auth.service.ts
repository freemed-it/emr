import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import {
  ENV_ACCESS_TOKEN_EXPIRE_SECONDS,
  ENV_JWT_SECRET_KEY,
  ENV_REFRESH_TOKEN_EXPIRE_SECONDS,
} from 'src/common/const/env-keys.const';
import { Users } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async authenticateUser(user: Pick<Users, 'account' | 'password'>) {
    const existingUser = await this.usersService.getUserWithPasswordByAccount(
      user.account,
    );

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    const isValidPassword = await compare(user.password, existingUser.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    delete existingUser.password;

    return existingUser;
  }

  async loginUser(user: Pick<Users, 'id' | 'account'>) {
    const accessToken = await this.signAccessToken(user);
    const refreshToken = await this.signRefreshToken(user);

    await this.setRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  signAccessToken(user: Pick<Users, 'id' | 'account'>) {
    const payload = {
      id: user.id,
      account: user.account,
      type: 'access',
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      expiresIn: parseInt(
        this.configService.get<string>(ENV_ACCESS_TOKEN_EXPIRE_SECONDS),
      ),
    });
  }

  signRefreshToken(user: Pick<Users, 'id'>) {
    const payload = {
      id: user.id,
      type: 'refresh',
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
      expiresIn: parseInt(
        this.configService.get<string>(ENV_REFRESH_TOKEN_EXPIRE_SECONDS),
      ),
    });
  }

  async setRefreshToken(userId: number, refreshToken: string) {
    await this.cacheManager.set(
      `refresh_token:${userId}`,
      refreshToken,
      1000 *
        parseInt(
          this.configService.get<string>(ENV_REFRESH_TOKEN_EXPIRE_SECONDS),
        ),
    );
  }

  async getRefreshToken(userId: number) {
    return await this.cacheManager.get<string>(`refresh_token:${userId}`);
  }

  async isRefreshTokenValid(refreshToken: string, userId: number) {
    const token = await this.getRefreshToken(userId);

    if (!token) {
      throw new UnauthorizedException(
        '저장된 Refresh Token이 존재하지 않습니다.',
      );
    }

    try {
      return (
        this.jwtService.verify(token, {
          secret: this.configService.get<string>(ENV_JWT_SECRET_KEY),
        }) && token === refreshToken
      );
    } catch (e) {
      throw new UnauthorizedException(
        '저장된 Refresh Token이 유효하지 않습니다.',
      );
    }
  }
}
