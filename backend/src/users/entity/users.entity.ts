import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class Users extends BaseModel {
  @Column({ length: 20, unique: true, comment: '사용자 계정' })
  account: string;

  @Column({ length: 100, select: false, comment: '사용자 비밀번호' })
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Column('char', { length: 4, comment: '사용자 권한' })
  permission: string;

  @Column({ length: 20, unique: true, comment: '사용자 이름' })
  name: string;
}
