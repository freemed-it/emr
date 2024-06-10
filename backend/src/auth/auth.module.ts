import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BasicStrategy } from './strategy/basic.strategy';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import {
  ENV_HOST_KEY,
  ENV_REDIS_PORT_KEY,
  ENV_REDIS_PASSWORD_KEY,
} from 'src/common/const/env-keys.const';
import { AccessTokenStrategy } from './strategy/access-token.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.register({}),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env[ENV_HOST_KEY],
            port: parseInt(process.env[ENV_REDIS_PORT_KEY]),
          },
          password: process.env[ENV_REDIS_PASSWORD_KEY],
        }),
      }),
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    BasicStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
