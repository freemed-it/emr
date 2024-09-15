import { BaseModel } from 'src/common/entity/base.entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { MMedicines } from './medicines.entity';

@Entity()
export class MMedicineCategories extends BaseModel {
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
  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => MMedicines, (medicine) => medicine.category)
  medicines: MMedicines[];
}
