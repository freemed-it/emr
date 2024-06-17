import { BaseModel } from 'src/common/entity/base.entity';
import { M_Medicines } from 'src/m-medicines/entity/m-medicines.entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';

@Entity()
export class M_Medicine_Categories extends BaseModel {
  /** 대분류 */
  @Column({
    length: 30,
  })
  mainCategory: string;

  /** 소분류 */
  @Column({
    length: 50,
  })
  subCategory: string;

  /** 소분류 삭제 여부 */
  @DeleteDateColumn({ select: false })
  deletedAt: Date | null;

  @OneToMany(() => M_Medicines, (medicine) => medicine.category)
  medicines: M_Medicines[];
}
