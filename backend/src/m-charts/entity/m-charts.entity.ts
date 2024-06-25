import { BaseModel } from 'src/common/entity/base.entity';
import { M_Complaints } from 'src/m-complaints/entity/m-complaints.entity';
import { M_Prescriptions } from 'src/m-prescriptions/entity/m-prescriotions.entity';
import { Patients } from 'src/patients/entity/patients.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class M_Charts extends BaseModel {
  @ManyToOne(() => Patients, (patient) => patient.charts, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  patient: Patients;

  @Column({
    type: 'bigint',
    unique: true,
  })
  chartNumber: string;

  @Column({
    default: 1,
  })
  status: number;

  @Column({
    nullable: true,
  })
  spO2: number;

  @Column({
    nullable: true,
  })
  heartRate: number;

  @Column('float', {
    nullable: true,
  })
  bodyTemperature: number;

  @Column({
    nullable: true,
  })
  systoleBloodPressure: number;

  @Column({
    nullable: true,
  })
  diastoleBloodPressure: number;

  @Column({
    nullable: true,
  })
  bloodGlucose: number;

  @Column({
    nullable: true,
  })
  afterMeals: number;

  @Column({
    length: 500,
    nullable: true,
  })
  impression: string;

  @Column({
    length: 500,
    nullable: true,
  })
  presentIllness: string;

  @Column({
    length: 500,
    nullable: true,
  })
  treatmentNote: string;

  @Column({
    length: 30,
    nullable: true,
  })
  vsMemo: string;

  @OneToMany(() => M_Complaints, (complaint) => complaint.chart)
  complaints: M_Complaints[];

  @OneToMany(() => M_Prescriptions, (prescription) => prescription.chart)
  prescriptions: M_Prescriptions[];
}
