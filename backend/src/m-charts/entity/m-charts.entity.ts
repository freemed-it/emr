import { IsInt, IsNumber, IsString } from 'class-validator';
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

  @OneToMany(() => M_Complaints, (complaint) => complaint.chart)
  complaints: M_Complaints[];

  @OneToMany(() => M_Prescriptions, (prescription) => prescription.chart)
  prescriptions: M_Prescriptions[];
}
