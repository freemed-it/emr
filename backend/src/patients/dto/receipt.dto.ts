import { IntersectionType } from '@nestjs/swagger';
import { CreatePatientDto } from './create-patient.dto';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';

export class ReceiptDto extends IntersectionType(
  CreatePatientDto,
  CreateOrderDto,
) {}
