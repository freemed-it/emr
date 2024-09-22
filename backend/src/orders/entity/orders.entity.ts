import { IsEnum, IsInt, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Department } from '../const/department.const';
import { Patients } from 'src/patients/entity/patients.entity';
import { MCharts } from 'src/m/entity/charts.entity';
import { KmCharts } from 'src/km/entity/charts.entity';

@Entity('orders')
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
    comment: '대기 번호',
  })
  @IsInt()
  waitingNumber: number;

  @Column('enum', {
    enum: Object.values(Department),
    comment: '진료과',
  })
  @IsEnum(Department)
  department: Department;

  @Column({
    type: 'bigint',
    unique: true,
    comment: '차트 번호',
  })
  @IsString()
  chartNumber: string;

  @Column({
    nullable: true,
    comment: '한의과 베드 번호',
  })
  @IsInt()
  bedNumber: number;

  @Column({
    default: 1,
    comment: '차트 상태',
  })
  @IsInt()
  status: number;
}
