import { CondicionOperacion, EstadoOperacion } from './operaciones.entity';

export class CreateOperacionDTO {
  fecha: Date;

  _comprobante?: any;

  comprobante?: string;

  comprobante_url?: string;

  subtotal?: number;

  descuento?: number;

  total: number;

  condicion: CondicionOperacion;

  observaciones?: string;

  estado?: EstadoOperacion;
}
