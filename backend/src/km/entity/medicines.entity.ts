import { BaseModel } from 'src/common/entity/base.entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { KmPrescriptions } from './prescriptions.entity';

@Entity('km_medicines')
export class KmMedicines extends BaseModel {
  @Column({
    length: 40,
  })
  name: string;

  @Column({
    length: 1000,
    nullable: true,
  })
  indication: string;

  @Column({
    default: 0,
  })
  stationQuantity: number;

  @Column({
    nullable: true,
  })
  officeQuantity: number;

  @Column({
    default: 0,
  })
  packaging: number;

  @Column({
    default: 0,
  })
  totalAmount: number;

  @Column({
    length: 300,
    nullable: true,
  })
  image: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => KmPrescriptions, (prescription) => prescription.medicine)
  prescriptions: KmPrescriptions[];
}
