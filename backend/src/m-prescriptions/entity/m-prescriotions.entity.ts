import { IsBoolean, IsInt, IsNumber, IsString } from 'class-validator';
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

  @Column('float')
  @IsNumber()
  dosesTotal: number;

  @Column({
    default: false,
  })
  @IsBoolean()
  isCompleted: boolean;

  @Column('char', {
    length: 1,
    nullable: true,
  })
  @IsString()
  bundle: string;

  @Column({
    length: 50,
    nullable: true,
  })
  @IsString()
  memo: string;
}
