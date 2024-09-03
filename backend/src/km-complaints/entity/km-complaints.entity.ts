import { Length } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { KM_Charts } from 'src/km-charts/entity/km-charts.entity';
import { Patients } from 'src/patients/entity/patients.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class KM_Complaints extends BaseModel {
  @ManyToOne(() => KM_Charts, (chart) => chart.complaints, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  chart: KM_Charts;

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
