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
    comment: '차트 상태',
  })
  status: number;

  @Column({
    nullable: true,
    comment: '산소포화도',
  })
  spO2: number;

  @Column({
    nullable: true,
    comment: '심박수',
  })
  heartRate: number;

  @Column('float', {
    nullable: true,
    comment: '체온',
  })
  bodyTemperature: number;

  @Column({
    nullable: true,
    comment: '수축기 혈압',
  })
  systoleBloodPressure: number;

  @Column({
    nullable: true,
    comment: '확장기 혈압',
  })
  diastoleBloodPressure: number;

  @Column({
    nullable: true,
    comment: '혈당',
  })
  bloodGlucose: number;

  @Column({
    nullable: true,
    comment: '식후',
  })
  afterMeals: number;

  @Column({
    length: 500,
    nullable: true,
    comment: '현병력',
  })
  presentIllness: string;

  @Column({
    length: 500,
    nullable: true,
    comment: '진단',
  })
  impression: string;

  @Column({
    length: 500,
    nullable: true,
    comment: '치료 노트',
  })
  treatmentNote: string;

  @Column({
    length: 30,
    nullable: true,
    comment: '바이탈 사인 메모',
  })
  vsMemo: string;

  @OneToMany(() => KmComplaints, (complaint) => complaint.chart)
  complaints: KmComplaints[];

  @OneToMany(() => KmPrescriptions, (prescription) => prescription.chart)
  prescriptions: KmPrescriptions[];
}
