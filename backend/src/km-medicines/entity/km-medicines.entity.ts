import { IsInt, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { KM_Prescriptions } from 'src/km-prescriptions/entity/km-prescriotions.entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';

@Entity()
export class KM_Medicines extends BaseModel {
  @Column({
    length: 40,
  })
  @IsString()
  name: string;

  @Column({
    length: 1000,
    nullable: true,
  })
  @IsString()
  indication: string;

  @Column({
    default: 0,
  })
  @IsInt()
  stationQuantity: number;

  @Column({
    nullable: true,
  })
  @IsInt()
  officeQuantity: number;

  @Column({
    default: 0,
  })
  @IsInt()
  packaging: number;

  @Column({
    default: 0,
  })
  @IsInt()
  totalAmount: number;

  @Column({
    length: 300,
    nullable: true,
  })
  @IsString()
  image: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => KM_Prescriptions, (prescription) => prescription.medicine)
  prescriptions: KM_Prescriptions[];
}
