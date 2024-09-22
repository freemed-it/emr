import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MCharts } from './charts.entity';

@Entity('m_complaints')
export class MComplaints extends BaseModel {
  @ManyToOne(() => MCharts, (chart) => chart.complaints, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'chartNumber', referencedColumnName: 'chartNumber' })
  chart: MCharts;

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
  cheifComplaint: string;

  @Column({
    length: 500,
    nullable: true,
    comment: '주호소 상세 설명',
  })
  cheifComplaintHistory: string;
}
