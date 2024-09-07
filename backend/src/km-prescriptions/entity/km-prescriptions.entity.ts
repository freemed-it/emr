import { IsBoolean, IsInt, IsNumber, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { KM_Charts } from 'src/km-charts/entity/km-charts.entity';
import { KM_Medicines } from 'src/km-medicines/entity/km-medicines.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class KM_Prescriptions extends BaseModel {
  @ManyToOne(() => KM_Charts, (chart) => chart.prescriptions, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  chart: KM_Charts;

  @ManyToOne(() => KM_Medicines, (medicine) => medicine.prescriptions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  medicine: KM_Medicines;

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
