import { Exclude } from 'class-transformer';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Users extends BaseModel {
  /** 사용자 게정 */
  @Column({ length: 20, unique: true })
  account: string;

  /** 사용자 비밀번호 */
  @Column({ length: 100 })
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  /** 사용자 권한 */
  @Column('char', { length: 4 })
  permission: string;

  /** 사용자 이름 */
  @Column({ length: 20, unique: true })
  name: string;
}
