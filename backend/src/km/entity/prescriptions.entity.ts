import { IsBoolean, IsInt, IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { KmCharts } from './charts.entity';
import { KmMedicines } from './medicines.entity';

@Entity()
export class KmPrescriptions extends BaseModel {
  @ManyToOne(() => KmCharts, (chart) => chart.prescriptions, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  chart: KmCharts;

  @ManyToOne(() => KmMedicines, (medicine) => medicine.prescriptions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  medicine: KmMedicines;

  @Column('float')
  @IsNumber()
  doses: number;

  @Column('char', {
    length: 10,
  })
  @IsString()
  dosesCountByDay: string;

  @Column()
  @IsInt()
  dosesDay: number;

  @Column('char', {
    length: 10,
  })
  @IsString()
  dosesTime: string;

  @Column('float')
  @IsNumber()
  dosesTotal: number;

  @Column({
    default: false,
  })
  @IsBoolean()
  isCompleted: boolean;

  @Column({
    length: 50,
    nullable: true,
  })
  @IsString()
  memo: string;
}
