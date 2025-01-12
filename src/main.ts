import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { Logger } from '@nestjs/common';
import { ClientesSeeder } from './clientes/clientes.seeder';

async function bootstrap() {
  NestFactory.create(SeederModule)
    .then((appContext) => {
      const logger = appContext.get(Logger);
      const seeder = appContext.get(ClientesSeeder);

      seeder
        .seed()
        .then(() => {
          logger.debug('Clientes seeded successfully');
        })
        .catch((error) => {
          logger.error('Error seeding Clientes');
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
