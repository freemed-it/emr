import { BaseModel } from 'src/common/entity/base.entity';
import { Patients } from 'src/patients/entity/patients.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('patient_histories')
export class Histories extends BaseModel {
  @Column({
    length: 30,
    nullable: true,
  })
  hypertension: string;

  @Column({
    length: 30,
    nullable: true,
  })
  diabetesMellitus: string;

  @Column({
    length: 30,
    nullable: true,
  })
  hepatitisA: string;

  @Column({
    length: 30,
    nullable: true,
  })
  hepatitisB: string;

  @Column({
    length: 30,
    nullable: true,
  })
  hepatitisC: string;

  @Column({
    length: 30,
    nullable: true,
  })
  tuberculosis: string;

  @Column({
    length: 30,
    nullable: true,
  })
  heartDisease: string;

  @Column({
    length: 30,
    nullable: true,
  })
  adrenalDisorders: string;

  @Column({
    length: 30,
    nullable: true,
  })
  tumor: string;

  @Column({
    length: 30,
    nullable: true,
  })
  infectiousDisease: string;

  @Column({
    length: 30,
    nullable: true,
  })
  veneralDisease: string;

  @Column({
    length: 30,
    nullable: true,
  })
  otherDisease: string;

  @Column({
    length: 100,
    nullable: true,
  })
  foodAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  environmentAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  drugAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  substanceAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  otherAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  surgeryPeriod: string;

  @Column({
    length: 100,
    nullable: true,
  })
  surgeryPart: string;

  @Column({
    length: 100,
    nullable: true,
  })
  medicineType: string;

  @Column({
    length: 100,
    nullable: true,
  })
  medicinePeriod: string;

  @OneToOne(() => Patients, (patient) => patient.history)
  @JoinColumn({ name: 'patientId', referencedColumnName: 'id' })
  patient: Patients;
}
