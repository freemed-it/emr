import { BaseModel } from 'src/common/entity/base.entity';
import { KmComplaints } from 'src/km/entity/complaints.entity';
import { KmPrescriptions } from 'src/km/entity/prescriptions.entity';
import { Patients } from 'src/patients/entity/patients.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('km_charts')
export class KmCharts extends BaseModel {
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

  @OneToMany(() => KmComplaints, (complaint) => complaint.chart)
  complaints: KmComplaints[];

  @OneToMany(() => KmPrescriptions, (prescription) => prescription.chart)
  prescriptions: KmPrescriptions[];
}
