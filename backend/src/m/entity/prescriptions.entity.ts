import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MCharts } from './charts.entity';
import { MMedicines } from './medicines.entity';

@Entity('m_prescriptions')
export class MPrescriptions extends BaseModel {
  @ManyToOne(() => MCharts, (chart) => chart.prescriptions, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'chartNumber', referencedColumnName: 'chartNumber' })
  chart: MCharts;

  @ManyToOne(() => MMedicines, (medicine) => medicine.prescriptions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  medicine: MMedicines;

  @Column('float', {
    comment: '1회 투약량',
  })
  doses: number;

  @Column('char', {
    length: 10,
    comment: '1일 복용횟수',
  })
  dosesCountByDay: string;

  @Column({
    comment: '복용 일수',
  })
  dosesDay: number;

  @Column('float', {
    comment: '사용량',
  })
  dosesTotal: number;

  @Column('char', {
    length: 1,
    nullable: true,
    comment: '묶음',
  })
  bundle: string;

  @Column({
    length: 50,
    nullable: true,
    comment: '메모',
  })
  memo: string;

  @Column({
    default: false,
    comment: '복약지도 완료 여부',
  })
  isCompleted: boolean;
}
