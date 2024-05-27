import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { M_Medicines } from 'src/m-medicines/entity/m-medicines.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class M_Medicine_Categories extends BaseModel {
  @Column({
    length: 30,
  })
  @IsString()
  mainCategory: string;

  @Column({
    length: 50,
  })
  @IsString()
  subCategory: string;

  @Column({
    default: false,
  })
  isDeleted: boolean;

  @OneToMany(() => M_Medicines, (medicine) => medicine.category)
  medicines: M_Medicines[];
}
