import { BaseModel } from 'src/common/entity/base.entity';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';
import { Patients } from 'src/patients/entity/patients.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class M_Complaints extends BaseModel {
  @ManyToOne(() => M_Charts, (chart) => chart.complaints, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  chart: M_Charts;

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
