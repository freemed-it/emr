import { IsEnum, IsInt, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Department } from '../const/department.const';
import { Patients } from 'src/patients/entity/patients.entity';
import { MCharts } from 'src/m/entity/charts.entity';
import { KmCharts } from 'src/km/entity/charts.entity';

@Entity()
export class Orders extends BaseModel {
  @OneToOne(() => MCharts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'mChartId', referencedColumnName: 'id' })
  mChart: MCharts;

  @OneToOne(() => KmCharts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'kmChartId', referencedColumnName: 'id' })
  kmChart: KmCharts;

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
