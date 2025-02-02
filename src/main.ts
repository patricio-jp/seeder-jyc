import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { Logger } from '@nestjs/common';
import { ClientesSeeder } from './clientes/clientes.seeder';
import { VentasSeeder } from './ventas/ventas.seeder';
import { ProductosSeeder } from './productos/productos.seeder';

async function bootstrap() {
  NestFactory.create(SeederModule)
    .then((appContext) => {
      const logger = appContext.get(Logger);
      const clientesSeeder = appContext.get(ClientesSeeder);
      const productosSeeder = appContext.get(ProductosSeeder);
      const ventasSeeder = appContext.get(VentasSeeder);

      clientesSeeder
        .seed()
        .then(() => {
          logger.debug('Clientes seeded successfully');
          return productosSeeder.seed();
        })
        .then(() => {
          logger.debug('Productos seeded successfully');
          return ventasSeeder.seed();
        })
        .then(() => {
          logger.debug('Ventas seeded successfully');
        })
        .catch((error) => {
          logger.error('Error seeding data', error);
          throw error;
        })
        .finally(() => {
          appContext.close();
        });
    })
    .catch((error) => {
      throw error;
    });
}
bootstrap();
