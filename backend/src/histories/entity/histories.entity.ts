import { IsString } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { M_Complaints } from 'src/m-complaints/entity/m-complaints.entity';
import { M_Prescriptions } from 'src/m-prescriptions/entity/m-prescriotions.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Histories extends BaseModel {
  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  hypertension: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  diabetesMellitus: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  hepatitisA: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  hepatitisB: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  hepatitisC: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  tuberculosis: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  heartDisease: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  adrenalDisorders: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  tumor: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  infectiousDisease: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  veneralDisease: string;

  @Column({
    length: 30,
    nullable: true,
  })
  @IsString()
  otherDisease: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  foodAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  environmentAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  drugAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  substanceAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  otherAllergy: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  surgeryPeriod: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  surgeryPart: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  medicineType: string;

  @Column({
    length: 100,
    nullable: true,
  })
  @IsString()
  medicinePeriod: string;

  @OneToMany(() => M_Complaints, (complaint) => complaint.chart)
  complaints: M_Complaints[];

  @OneToMany(() => M_Prescriptions, (prescription) => prescription.chart)
  prescriptions: M_Prescriptions[];
}
