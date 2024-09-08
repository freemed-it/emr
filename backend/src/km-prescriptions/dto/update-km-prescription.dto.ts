import { OmitType } from '@nestjs/swagger';
import { CreateKMPrescriptionDto } from './create-km-prescription.dto';

export class UpdateKMPrescriptionDto extends OmitType(CreateKMPrescriptionDto, [
  'medicineId',
]) {}
