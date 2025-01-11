import { CreateOperacionDTO } from './operaciones.dto';
import { IntersectionType } from '@nestjs/mapped-types';

class CompraInfo {
  fechaRecepcion?: Date;

  productos: DetalleCompraDTO[];
}

export class DetalleCompraDTO {
  producto_id: number;

  cantidad: number;

  costoUnitario: number;
}

export class CreateCompraDTO extends IntersectionType(
  CreateOperacionDTO,
  CompraInfo,
) {}
