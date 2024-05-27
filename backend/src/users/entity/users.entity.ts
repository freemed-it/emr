import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Users extends BaseModel {
  @Column({
    length: 20,
    unique: true,
  })
  @IsString()
  account: string;

  @Column({
    length: 100,
  })
  @IsString()
  password: string;

  @Column('char', {
    length: 4,
  })
  @IsString()
  permission: string;

  @Column({
    length: 20,
    unique: true,
  })
  @IsString()
  name: string;
}
