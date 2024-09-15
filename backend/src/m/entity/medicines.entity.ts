import { BaseModel } from 'src/common/entity/base.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { MMedicineCategories } from './medicine-categories.entity';
import { MPrescriptions } from './prescriptions.entity';

@Entity('m_medicines')
export class MMedicines extends BaseModel {
  @ManyToOne(() => MMedicineCategories, (category) => category.medicines, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  category: MMedicineCategories;

  /** 약품명 */
  @Column({
    length: 40,
  })
  name: string;

  /** 성분명/함량 */
  @Column({
    length: 300,
  })
  ingredient: string;

  /** 용법/용량 */
  @Column({
    length: 1000,
    nullable: true,
  })
  dosage: string;

  /** 효능/효과 */
  @Column({
    length: 1000,
    nullable: true,
  })
  efficacy: string;

  /** 사무실 재고 */
  @Column({
    default: 0,
  })
  stationQuantity: number;

  /** 서울역 재고 */
  @Column({
    nullable: true,
  })
  officeQuantity: number;

  /** 포장단위 */
  @Column({
    default: 0,
  })
  packaging: number;

  /** 총량 */
  @Column({
    default: 0,
  })
  totalAmount: number;

  /** DUR */
  @Column({
    length: 500,
    nullable: true,
  })
  dur: string;

  /** 약품통 */
  @Column({
    length: 10,
    nullable: true,
  })
  bottle: string;

  /** 사진 */
  @Column({
    length: 300,
    nullable: true,
  })
  image: string;

  /** 처방 시 따로 표기 여부 */
  @Column({
    default: false,
  })
  isExcluded: boolean;

  /** 삭제 여부 */
  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => MPrescriptions, (prescription) => prescription.medicine)
  prescriptions: MPrescriptions[];
}
