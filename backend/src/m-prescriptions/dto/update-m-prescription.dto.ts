import { OmitType } from '@nestjs/swagger';
import { CreateMPrescriptionDto } from './create-m-prescription.dto';

export class UpdateMPrescriptionDto extends OmitType(CreateMPrescriptionDto, [
  'medicineId',
]) {}
