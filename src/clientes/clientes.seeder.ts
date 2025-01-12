import { Injectable, Logger } from '@nestjs/common';
import { ClientesService } from './clientes.service';

@Injectable()
export class ClientesSeeder {
  constructor(
    private readonly logger: Logger,
    private readonly clientesSeederService: ClientesService,
  ) {}

  async seed() {
    await this.run()
      .then((completed) => {
        this.logger.log('Clientes seeded');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Error seeding clientes', error);
        Promise.reject(error);
      });
  }

  async run() {
    const clientes = await this.clientesSeederService.seedClientesFromJson();
    return await Promise.all(clientes)
      .then((createdClientes) => {
        this.logger.log(`Created ${createdClientes.length} clientes`);
        return Promise.resolve(true);
      })
      .catch((error) => {
        this.logger.error(error);
        return Promise.reject(error);
      });
  }
}
