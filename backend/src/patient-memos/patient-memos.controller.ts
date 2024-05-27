import { Controller } from '@nestjs/common';
import { PatientMemosService } from './patient-memos.service';

@Controller('patient-memos')
export class PatientMemosController {
  constructor(private readonly patientMemosService: PatientMemosService) {}
}
