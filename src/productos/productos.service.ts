import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Producto } from 'src/entities/productos/productos.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async seedVentasFromJson(): Promise<Producto[]> {
    try {
      const file = process.cwd() + '/src/productos/productos.json';
      //console.log(file);

      const data = fs.readFileSync(file, 'utf8');
      const dataProductos = JSON.parse(data);
      const productos = [];

      for (const prod of dataProductos) {
        if (!prod.requireIntervention) {
          const nuevoProd = new Producto();
          nuevoProd.nombre = prod.nombre;
          productos.push(nuevoProd);
        }
      }

      const promises = productos.map(async (producto: Producto) => {
        return Promise.resolve(this.productosRepository.save(producto));
      });
      return Promise.all(promises);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }
}
