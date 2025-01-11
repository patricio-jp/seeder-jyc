import { EstadoCliente } from './clientes.entity';
import { CreateDomicilioDTO } from '../domicilios/domicilios.dto';
import { CreateTelefonoDTO } from '../telefonos/telefonos.dto';
import { CreateZonaDTO } from '../zonas/zonas.dto';

export class CreateClienteDTO {
  dni: number;

  nombre: string;

  apellido?: string;

  fechaNacimiento?: Date;

  domicilios?: CreateDomicilioDTO[];

  telefonos?: CreateTelefonoDTO[];

  id_vendedorAsociado?: number;

  vendedorAsociadoHasta?: Date;

  id_cobradorAsociado?: number;

  id_zona: number;

  zona?: CreateZonaDTO;

  saldo?: number;

  observaciones?: string;

  estado?: EstadoCliente;
}
