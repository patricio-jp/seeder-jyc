import { CreatePrecioDTO } from '../precios/precios.dto';

export class CreateProductoDTO {
  codigo: string;

  nombre: string;

  costos: CreatePrecioDTO[];

  precios: CreatePrecioDTO[];

  stock?: number;
}
