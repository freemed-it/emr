import { BaseModel } from 'src/common/entity/base.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Gender } from '../const/gender.const';
import { MCharts } from 'src/m/entity/charts.entity';
import { KmCharts } from 'src/km/entity/charts.entity';
import { Histories } from './histories.entity';

@Entity('patients')
export class Patients extends BaseModel {
  @Column({
    comment: '첫 방문일',
  })
  firstVisit: Date;

  @Column({
    length: 10,
    comment: '이름',
  })
  name: string;

  @Column('enum', {
    enum: Object.values(Gender),
    comment: '성별',
  })
  gender: Gender;

  @Column('char', {
    length: 10,
    comment: '생년월일',
  })
  birth: string;

  @Column({
    nullable: true,
    comment: '신장',
  })
  height: number;

  @Column({
    nullable: true,
    comment: '체중',
  })
  weight: number;

  @Column('float', {
    nullable: true,
    comment: 'BMI',
  })
  bmi: number;

  @Column('float', {
    nullable: true,
    comment: '흡연량(갑/하루 평균)',
  })
  smokingAmount: number;

  @Column({
    nullable: true,
    comment: '흡연 경력(년)',
  })
  smokingPeriod: number;

  @Column('float', {
    nullable: true,
    comment: '음주량(병/일주일 평균)',
  })
  drinkingAmount: number;

  @Column({
    nullable: true,
    comment: '음주 경력(년)',
  })
  drinkingPeriod: number;

  @OneToOne(() => Histories, (history) => history.patient)
  history: Histories;

  @OneToMany(() => Orders, (order) => order.patient)
  orders: Orders[];

  @OneToMany(() => MCharts || KmCharts, (chart) => chart.patient)
  charts: (MCharts | KmCharts)[];
}
