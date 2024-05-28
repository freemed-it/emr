import { IsString, Length } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { KM_Charts } from 'src/km-charts/entity/km-charts.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class KM_Complaints extends BaseModel {
  @ManyToOne(() => KM_Charts, (chart) => chart.complaints, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  chart: KM_Charts;

  @Column({
    length: 20,
    nullable: true,
  })
  @IsString()
  category: string;

  @Column({
    length: 100,
  })
  @Length(0, 100)
  @IsString()
  cheifComplaint: string;

  @Column({
    length: 500,
    nullable: true,
  })
  @IsString()
  cheifComplaintHistory: string;
}
