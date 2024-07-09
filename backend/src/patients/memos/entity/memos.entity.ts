import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Patients } from 'src/patients/entity/patients.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Memos extends BaseModel {
  @OneToOne(() => Patients, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'patientId', referencedColumnName: 'id' })
  patient: Patients;

  @Column({
    length: 300,
  })
  memo: string;

  @Column({
    length: 20,
  })
  @IsString()
  writer: string;
}
