import { Controller, Post, UseGuards, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/users/decorator/user.decorator';
import { Users } from 'src/users/entity/users.entity';
import { Response } from 'express';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { BasicAuthGuard } from './guard/basic.guard';
import { ConfigService } from '@nestjs/config';
import {
  ENV_ACCESS_TOKEN_EXPIRE_SECONDS,
  ENV_REFRESH_TOKEN_EXPIRE_SECONDS,
} from 'src/common/const/env-keys.const';
import { AccessTokenGuard } from './guard/access-token.guard';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login/account')
  @Public()
  @UseGuards(BasicAuthGuard)
  @ApiOperation({
    summary: '계정 로그인',
  })
  @ApiBasicAuth()
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '존재하지 않는 사용자입니다. / 비밀번호가 틀렸습니다.',
  })
  async postLoginAccount(@User() user: Users, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.loginUser(user);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge:
        1000 * this.configService.get<number>(ENV_ACCESS_TOKEN_EXPIRE_SECONDS),
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge:
        1000 * this.configService.get<number>(ENV_REFRESH_TOKEN_EXPIRE_SECONDS),
    });
    res.send(user);
  }

  @Post('test')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: '로그인 테스트',
  })
  async postTest(@User() user: Users) {
    return user;
  }

  @Post('refresh')
  @Public()
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: '토큰 재발급',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      "(저장된) Refresh Token이 존재하지 않습니다. / (저장된) Refresh Token이 유효하지 않습니다. <small>redis 토큰 에러인 경우 '저장된~' 표시</small>",
  })
  async postRefresh(@User() user: Users, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.loginUser(user);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge:
        1000 * this.configService.get<number>(ENV_ACCESS_TOKEN_EXPIRE_SECONDS),
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge:
        1000 * this.configService.get<number>(ENV_REFRESH_TOKEN_EXPIRE_SECONDS),
    });
    res.send(user);
  }
}
