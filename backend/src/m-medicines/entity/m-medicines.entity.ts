import { IsInt, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { M_Medicine_Categories } from 'src/m-medicine-categories/entity/m_medicine_categories.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class M_Medicines extends BaseModel {
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

  @ManyToOne(() => M_Medicine_Categories, (category) => category.medicines)
  category: M_Medicine_Categories;
}
