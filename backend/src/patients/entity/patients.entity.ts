import { BaseModel } from 'src/common/entity/base.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Gender } from '../const/gender.const';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';
import { KM_Charts } from 'src/km-charts/entity/km-charts.entity';
import { Histories } from '../histories/entity/histories.entity';

@Entity()
export class Patients extends BaseModel {
  /** 첫 방문일 */
  @Column()
  firstVisit: Date;

  /** 이름 */
  @Column({
    length: 10,
  })
  name: string;

  /** 성별 */
  @Column('enum', {
    enum: Object.values(Gender),
  })
  gender: Gender;

  /** 생년월월 */
  @Column('char', {
    length: 10,
  })
  birth: string;

  /** 신장 */
  @Column({
    nullable: true,
  })
  height: number;

  /** 체중 */
  @Column({
    nullable: true,
  })
  weight: number;

  /** BMI */
  @Column('float', {
    nullable: true,
  })
  bmi: number;

  /** 흡연량 */
  @Column('float', {
    nullable: true,
  })
  smokingAmount: number;

  /** 흡연 경력 */
  @Column({
    nullable: true,
  })
  smokingPeriod: number;

  /** 음주량 */
  @Column('float', {
    nullable: true,
  })
  drinkingAmount: number;

  /** 음주경력 */
  @Column({
    nullable: true,
  })
  drinkingPeriod: number;

  @OneToOne(() => Histories, (history) => history.patient)
  history: Histories;

  @OneToMany(() => Orders, (order) => order.patient)
  orders: Orders[];

  @OneToMany(() => M_Charts || KM_Charts, (chart) => chart.patient)
  charts: (M_Charts | KM_Charts)[];
}
