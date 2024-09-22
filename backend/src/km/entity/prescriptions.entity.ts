import { IsBoolean, IsInt, IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { KmCharts } from './charts.entity';
import { KmMedicines } from './medicines.entity';

@Entity('km_prescriptions')
export class KmPrescriptions extends BaseModel {
  @ManyToOne(() => KmCharts, (chart) => chart.prescriptions, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'chartNumber', referencedColumnName: 'chartNumber' })
  chart: KmCharts;

  @ManyToOne(() => KmMedicines, (medicine) => medicine.prescriptions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  medicine: KmMedicines;

  @Column('float', {
    comment: '1회 투약량',
  })
  @IsNumber()
  doses: number;

  @Column('char', {
    length: 10,
    comment: '1일 복용횟수',
  })
  @IsString()
  dosesCountByDay: string;

  @Column({
    comment: '복용 일수',
  })
  @IsInt()
  dosesDay: number;

  @Column('char', {
    length: 10,
    comment: '복용 시간',
  })
  @IsString()
  dosesTime: string;

  @Column('float', {
    comment: '사용량',
  })
  @IsNumber()
  dosesTotal: number;

  @Column({
    length: 50,
    nullable: true,
    comment: '메모',
  })
  @IsString()
  memo: string;

  @Column({
    default: false,
    comment: '복약지도 완료 여부',
  })
  @IsBoolean()
  isCompleted: boolean;
}
