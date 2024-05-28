import { IsInt, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { M_Medicine_Categories } from 'src/m-medicine-categories/entity/m_medicine_categories.entity';
import { M_Prescriptions } from 'src/m-prescriptions/entity/m-prescriotions.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class M_Medicines extends BaseModel {
  @ManyToOne(() => M_Medicine_Categories, (category) => category.medicines, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  category: M_Medicine_Categories;

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
  dosage: string;

  @Column({
    length: 1000,
    nullable: true,
  })
  @IsString()
  efficacy: string;

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
    length: 500,
    nullable: true,
  })
  @IsString()
  dur: string;

  @Column({
    length: 10,
    nullable: true,
  })
  @IsString()
  bottle: string;

  @Column({
    length: 300,
    nullable: true,
  })
  @IsString()
  image: string;

  @Column({
    default: false,
  })
  isExcluded: boolean;

  @Column({
    default: false,
  })
  isDeleted: boolean;

  @OneToMany(() => M_Prescriptions, (prescription) => prescription.medicine)
  prescriptions: M_Prescriptions[];
}
