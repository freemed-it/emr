import { Length } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from 'src/common/entity/base.entity';
import { KmCharts } from './charts.entity';

@Entity('km_complaints')
export class KmComplaints extends BaseModel {
  @ManyToOne(() => KmCharts, (chart) => chart.complaints, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'chartNumber', referencedColumnName: 'chartNumber' })
  chart: KmCharts;

  @Column({
    length: 20,
    nullable: true,
    comment: '주호소 분류',
  })
  category: string;

  @Column({
    length: 100,
    comment: '주호소',
  })
  @Length(0, 100)
  cheifComplaint: string;

  @Column({
    length: 500,
    nullable: true,
    comment: '주호소 상세 설명',
  })
  cheifComplaintHistory: string;
}
