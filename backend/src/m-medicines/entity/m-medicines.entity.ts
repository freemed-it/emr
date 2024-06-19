import { BaseModel } from 'src/common/entity/base.entity';
import { M_Medicine_Categories } from 'src/m-medicine-categories/entity/m_medicine_categories.entity';
import { M_Prescriptions } from 'src/m-prescriptions/entity/m-prescriotions.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class M_Medicines extends BaseModel {
  @ManyToOne(() => M_Medicine_Categories, (category) => category.medicines, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  category: M_Medicine_Categories;

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
  @DeleteDateColumn({ select: false })
  deletedAt: Date | null;

  @OneToMany(() => M_Prescriptions, (prescription) => prescription.medicine)
  prescriptions: M_Prescriptions[];
}
