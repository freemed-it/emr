import { IsEnum, IsInt, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Department } from '../const/department.const';
import { Patients } from 'src/patients/entity/patients.entity';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';
import { KM_Charts } from 'src/km-charts/entity/km-charts.entity';

@Entity()
export class Orders extends BaseModel {
  @OneToOne(() => M_Charts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'mChartId', referencedColumnName: 'id' })
  mChart: M_Charts;

  @OneToOne(() => KM_Charts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'kmChartId', referencedColumnName: 'id' })
  kmChart: KM_Charts;

  @ManyToOne(() => Patients, (patient) => patient.orders, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  patient: Patients;

  @Column({
    default: 0,
  })
  @IsInt()
  waitingNumber: number;

  @Column('enum', {
    enum: Object.values(Department),
  })
  @IsEnum(Department)
  department: Department;

  @Column({
    type: 'bigint',
    unique: true,
  })
  @IsString()
  chartNumber: string;

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
  static chartNumber: number;
}
