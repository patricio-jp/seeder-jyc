import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from 'src/entities/operaciones/ventas.entity';
import { Producto } from 'src/entities/productos/productos.entity';
import { Cliente } from 'src/entities/clientes/clientes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, Producto, Cliente])],
  providers: [VentasService],
  exports: [VentasService],
})
export class VentasModule {}
