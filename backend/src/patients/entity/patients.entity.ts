import { IsDate, IsEnum, IsInt, IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Orders } from 'src/orders/entity/orders.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Gender } from '../const/gender.const';
import { M_Charts } from 'src/m-charts/entity/m-charts.entity';
import { KM_Charts } from 'src/km-charts/entity/km-charts.entity';

@Entity()
export class Patients extends BaseModel {
  @Column()
  @IsDate()
  firstVisit: Date;

  @Column({
    length: 10,
  })
  @IsString()
  name: string;

  @Column('enum', {
    enum: Object.values(Gender),
  })
  @IsEnum(Gender)
  gender: Gender;

  @Column('char', {
    length: 10,
  })
  @IsString()
  birth: string;

  @Column({
    nullable: true,
  })
  @IsInt()
  height: number;

  @Column({
    nullable: true,
  })
  @IsInt()
  weight: number;

  @Column('float', {
    nullable: true,
  })
  @IsNumber()
  bmi: number;

  @Column('float', {
    nullable: true,
  })
  @IsNumber()
  smokingAmount: number;

  @Column({
    nullable: true,
  })
  @IsInt()
  smokingPeriod: number;

  @Column('float', {
    nullable: true,
  })
  @IsNumber()
  drinkingAmount: number;

  @Column({
    nullable: true,
  })
  @IsInt()
  drinkingPeriod: number;

  @OneToMany(() => Orders, (order) => order.patient)
  orders: Orders[];

  @OneToMany(() => M_Charts || KM_Charts, (chart) => chart.patient)
  charts: (M_Charts | KM_Charts)[];
}
