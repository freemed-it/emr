import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createUser(user: CreateUserDto): Promise<CreateUserDto> {
    const accountExists = await this.usersRepository.exists({
      where: {
        account: user.account,
      },
    });

    if (accountExists) {
      throw new BadRequestException('이미 존재하는 account 입니다.');
    }

    const nameExists = await this.usersRepository.exists({
      where: {
        name: user.name,
      },
    });

    if (nameExists) {
      throw new BadRequestException('이미 존재하는 name 입니다.');
    }

    const userObject = this.usersRepository.create({
      account: user.account,
      password: await bcrypt.hash(user.password, 10),
      permission: user.permission,
      name: user.name,
    });

    const newUser = await this.usersRepository.save(userObject);

    return newUser;
  }

  async getUserWithPasswordByAccount(account: string) {
    return this.usersRepository.findOne({
      where: {
        account,
      },
      select: ['id', 'account', 'password', 'permission', 'name'],
    });
  }

  async getUserByAccount(account: string) {
    return this.usersRepository.findOne({
      where: {
        account,
      },
    });
  }
}
