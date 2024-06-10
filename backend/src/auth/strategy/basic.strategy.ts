import { BasicStrategy as HttpBasicStrategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Users } from 'src/users/entity/users.entity';

@Injectable()
export class BasicStrategy extends PassportStrategy(HttpBasicStrategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(account: string, password: string): Promise<Users> {
    const loginUser = await this.authService.authenticateUser({
      account,
      password,
    });

    return loginUser;
  }
}
