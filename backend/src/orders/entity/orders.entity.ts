import { IsEnum, IsInt } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Department } from '../const/department.const';
import { Patients } from 'src/patients/entity/patients.entity';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';
import { KM_Charts } from 'src/km-charts/entity/km-charts.entity';

@Entity()
export class Orders extends BaseModel {
  @OneToOne(() => M_Charts || KM_Charts)
  @JoinColumn({ name: 'chartId', referencedColumnName: 'id' })
  chart: M_Charts | KM_Charts;

  @ManyToOne(() => Patients, (patient) => patient.orders, {
    nullable: false,
  })
  patient: Patients;

  @Column({
    default: 0,
  })
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
