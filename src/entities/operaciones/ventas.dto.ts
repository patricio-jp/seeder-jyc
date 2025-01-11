import { IntersectionType } from '@nestjs/mapped-types';
import { CreateCreditoDTO } from '../creditos/creditos.dto';
import { CreateOperacionDTO } from './operaciones.dto';

class VentaInfo {
  fechaEntrega?: Date;

  cliente_id: number;

  productos: DetalleVentaDTO[];

  financiacion?: CreateCreditoDTO;
}

export class DetalleVentaDTO {
  id_producto: number;

  cantidad: number;

  precioUnitario: number;
}

export class CreateVentaDTO extends IntersectionType(
  CreateOperacionDTO,
  VentaInfo,
) {}
