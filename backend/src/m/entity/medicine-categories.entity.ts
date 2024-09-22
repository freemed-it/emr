import { BaseModel } from 'src/common/entity/base.entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { MMedicines } from './medicines.entity';

@Entity('m_medicine_categories')
export class MMedicineCategories extends BaseModel {
  @Column({
    length: 30,
    comment: '대분류',
  })
  mainCategory: string;

  @Column({
    length: 50,
    comment: '소분류',
  })
  subCategory: string;

  @DeleteDateColumn({
    comment: '소분류 삭제 여부',
  })
  deletedAt: Date | null;

  @OneToMany(() => MMedicines, (medicine) => medicine.category)
  medicines: MMedicines[];
}
