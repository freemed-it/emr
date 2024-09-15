import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { MCharts } from './charts.entity';
import { MMedicines } from './medicines.entity';

@Entity()
export class MPrescriptions extends BaseModel {
  @ManyToOne(() => MCharts, (chart) => chart.prescriptions, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  chart: MCharts;

  @ManyToOne(() => MMedicines, (medicine) => medicine.prescriptions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  medicine: MMedicines;

  /** 1회 투약량 */
  @Column('float')
  doses: number;

  /** 1일 복용횟수 */
  @Column('char', {
    length: 10,
  })
  dosesCountByDay: string;

  /** 복용 일수 */
  @Column()
  dosesDay: number;

  /** 사용량 */
  @Column('float')
  dosesTotal: number;

  /** 묶음 */
  @Column('char', {
    length: 1,
    nullable: true,
  })
  bundle: string;

  /** 메모 */
  @Column({
    length: 50,
    nullable: true,
  })
  memo: string;

  /** 복약지도 완료 여부 */
  @Column({
    default: false,
  })
  isCompleted: boolean;
}
