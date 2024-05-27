import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Patients } from 'src/patients/entity/patients.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Histories extends BaseModel {
  @OneToOne(() => Patients, {
    nullable: false,
  })
  @JoinColumn({ name: 'patientId', referencedColumnName: 'id' })
  patient: Patients;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  hypertension: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  diabetesMellitus: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  hepatitisA: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  hepatitisB: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  hepatitisC: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  tuberculosis: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  heartDisease: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  adrenalDisorders: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  tumor: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  infectiousDisease: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  veneralDisease: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  otherDisease: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  foodAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  environmentAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  drugAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  substanceAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  otherAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  surgeryPeriod: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  surgeryPart: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  medicineType: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  medicinePeriod: string;
}
