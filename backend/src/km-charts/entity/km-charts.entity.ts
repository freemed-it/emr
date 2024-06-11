import { IsInt, IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { KM_Complaints } from 'src/km-complaints/entity/km-complaints.entity';
import { KM_Prescriptions } from 'src/km-prescriptions/entity/km-prescriotions.entity';
import { Patients } from 'src/patients/entity/patients.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class KM_Charts extends BaseModel {
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
  @IsString()
  chartNumber: string;

  @Column({
    default: 1,
  })
  @IsInt()
  status: number;

  @Column({
    nullable: true,
  })
  @IsNumber()
  spO2: number;

  @Column({
    nullable: true,
  })
  @IsInt()
  heartRate: number;

  @Column('float', {
    nullable: true,
  })
  @IsNumber()
  bodyTemperature: number;

  @Column({
    nullable: true,
  })
  @IsInt()
  systoleBloodPressure: number;

  @Column({
    nullable: true,
  })
  @IsInt()
  diastoleBloodPressure: number;

  @Column({
    nullable: true,
  })
  @IsInt()
  bloodGlucose: number;

  @Column({
    nullable: true,
  })
  @IsInt()
  afterMeals: number;

  @Column({
    length: 500,
    nullable: true,
  })
  @IsString()
  impression: string;

  @Column({
    length: 500,
    nullable: true,
  })
  @IsString()
  presentIllness: string;

  @Column({
    length: 500,
    nullable: true,
  })
  @IsString()
  treatmentNote: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  vsMemo: string;

  @OneToMany(() => KM_Complaints, (complaint) => complaint.chart)
  complaints: KM_Complaints[];

  @OneToMany(() => KM_Prescriptions, (prescription) => prescription.chart)
  prescriptions: KM_Prescriptions[];
}
