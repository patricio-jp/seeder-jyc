import { EstadoCredito, Periodo } from './creditos.entity';

export class CreateCreditoDTO {
  id_venta?: number;

  fechaInicio: Date;

  fechaUltimoPago?: Date;

  anticipo?: number;

  cantidadCuotas: number;

  montoCuota: number;

  periodo: Periodo;

  estado?: EstadoCredito;
}

export class CargarPagoDTO {
  monto: number;

  fechaPago?: Date;

  nroCuota?: number;
}
