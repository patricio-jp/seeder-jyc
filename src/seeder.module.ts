import { Logger, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ClientesModule } from './clientes/clientes.module';
import { ClientesSeeder } from './clientes/clientes.seeder';
import { ConfigModule } from '@nestjs/config';
import { VentasModule } from './ventas/ventas.module';
import { VentasSeeder } from './ventas/ventas.seeder';
import { ProductosModule } from './productos/productos.module';
import { ProductosSeeder } from './productos/productos.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ClientesModule,
    ProductosModule,
    VentasModule,
  ],
  providers: [Logger, ClientesSeeder, ProductosSeeder, VentasSeeder],
})
export class SeederModule {}
