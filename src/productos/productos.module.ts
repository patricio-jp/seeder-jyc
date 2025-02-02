import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from 'src/entities/productos/productos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}
