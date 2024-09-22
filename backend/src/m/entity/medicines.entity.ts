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

  @Column({
    length: 40,
    comment: '약품명',
  })
  name: string;

  @Column({
    length: 300,
    comment: '성분명/함량',
  })
  ingredient: string;

  @Column({
    length: 1000,
    nullable: true,
    comment: '용법/용량',
  })
  dosage: string;

  @Column({
    length: 1000,
    nullable: true,
    comment: '효능/효과',
  })
  efficacy: string;

  @Column({
    default: 0,
    comment: '서울역 재고',
  })
  stationQuantity: number;

  @Column({
    nullable: true,
    comment: '사무실 재고',
  })
  officeQuantity: number;

  @Column({
    default: 0,
    comment: '포장단위',
  })
  packaging: number;

  @Column({
    default: 0,
    comment: '총량',
  })
  totalAmount: number;

  @Column({
    length: 500,
    nullable: true,
    comment: 'DUR',
  })
  dur: string;

  @Column({
    length: 10,
    nullable: true,
    comment: '약품통',
  })
  bottle: string;

  @Column({
    length: 300,
    nullable: true,
    comment: '사진',
  })
  image: string;

  @Column({
    default: false,
    comment: '처방 시 따로 표기 여부',
  })
  isExcluded: boolean;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => MPrescriptions, (prescription) => prescription.medicine)
  prescriptions: MPrescriptions[];
}
