import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Users extends BaseModel {
  @Column({ length: 20, unique: true })
  account: string;

  @Column({ length: 100 })
  password: string;

  @Column('char', { length: 4 })
  permission: string;

  @Column({ length: 20, unique: true })
  name: string;
}
