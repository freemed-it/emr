import { OmitType } from '@nestjs/swagger';
import { CreateMPrescriptionDto } from './create-prescription.dto';

export class UpdateMPrescriptionDto extends OmitType(CreateMPrescriptionDto, [
  'medicineId',
]) {}
