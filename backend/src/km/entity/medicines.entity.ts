import { BaseModel } from 'src/common/entity/base.entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { KmPrescriptions } from './prescriptions.entity';

@Entity('km_medicines')
export class KmMedicines extends BaseModel {
  @Column({
    length: 40,
    comment: '약품명',
  })
  name: string;

  @Column({
    length: 1000,
    nullable: true,
    comment: '적응증',
  })
  indication: string;

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
    length: 300,
    nullable: true,
    comment: '사진',
  })
  image: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => KmPrescriptions, (prescription) => prescription.medicine)
  prescriptions: KmPrescriptions[];
}
