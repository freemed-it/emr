import { BaseModel } from 'src/common/entity/base.entity';
import { Patients } from 'src/patients/entity/patients.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { MCharts } from './charts.entity';

@Entity()
export class MComplaints extends BaseModel {
  @ManyToOne(() => MCharts, (chart) => chart.complaints, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  chart: MCharts;

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
  cheifComplaint: string;

  @Column({
    length: 500,
    nullable: true,
  })
  cheifComplaintHistory: string;
}
