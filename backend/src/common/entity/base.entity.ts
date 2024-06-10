import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @CreateDateColumn({ select: false })
  createdAt: Date;
}
