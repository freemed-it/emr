import { IsEnum, IsInt } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Department } from '../const/department.const';
import { Patients } from 'src/patients/entity/patients.entity';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';

@Entity()
export class Orders extends BaseModel {
  @OneToOne(() => M_Charts)
  @JoinColumn({ name: 'chartId', referencedColumnName: 'id' })
  chart: M_Charts;

  @ManyToOne(() => Patients, (patient) => patient.orders, {
    nullable: false,
  })
  patient: Patients;

  @Column()
  @IsInt()
  waitingNumber: number;

  @Column({
    type: 'enum',
    enum: Object.values(Department),
  })
  @IsEnum(Department)
  department: Department;

  @Column({
    unique: true,
  })
  @IsInt()
  chartNumber: number;

  @Column({
    nullable: true,
  })
  @IsInt()
  bedNumber: number;

  @Column({
    default: 1,
  })
  @IsInt()
  status: number;
}
