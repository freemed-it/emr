import { BaseModel } from 'src/common/entity/base.entity';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';
import { M_Medicines } from 'src/m-medicines/entity/m-medicines.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class M_Prescriptions extends BaseModel {
  @ManyToOne(() => M_Charts, (chart) => chart.prescriptions, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  chart: M_Charts;

  @ManyToOne(() => M_Medicines, (medicine) => medicine.prescriptions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  medicine: M_Medicines;

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
