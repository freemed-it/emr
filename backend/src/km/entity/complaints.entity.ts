import { Length } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from 'src/common/entity/base.entity';
import { Patients } from 'src/patients/entity/patients.entity';
import { KmCharts } from './charts.entity';

@Entity('km_complaints')
export class KmComplaints extends BaseModel {
  @ManyToOne(() => KmCharts, (chart) => chart.complaints, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  chart: KmCharts;

  @ManyToOne(() => Patients, (patient) => patient.complaints, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  patient: Patients;

  @Column({
    length: 20,
    nullable: true,
  })
  category: string;

  @Column({
    length: 100,
  })
  @Length(0, 100)
  cheifComplaint: string;

  @Column({
    length: 500,
    nullable: true,
  })
  cheifComplaintHistory: string;
}
