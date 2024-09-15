import { OmitType } from '@nestjs/swagger';
import { CreateKmPrescriptionDto } from './create-prescription.dto';

export class UpdateKmPrescriptionDto extends OmitType(CreateKmPrescriptionDto, [
  'medicineId',
]) {}
