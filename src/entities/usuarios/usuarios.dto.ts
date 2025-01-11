import { Rol } from './usuarios.entity';
import { CreateDomicilioDTO } from '../domicilios/domicilios.dto';
import { CreateTelefonoDTO } from '../telefonos/telefonos.dto';

export class CreateUsuarioDTO {
  dni: number;

  nombre: string;

  apellido: string;

  password: string;

  fechaNacimiento: Date;

  domicilios?: CreateDomicilioDTO[];

  telefonos?: CreateTelefonoDTO[];

  fechaInicio: Date;

  comision?: number;

  rol: Rol;

  saldo?: number;

  observaciones?: string;
}
