import { Injectable, Logger } from '@nestjs/common';
import { VentasService } from './ventas.service';

@Injectable()
export class VentasSeeder {
  constructor(
    private readonly logger: Logger,
    private readonly ventasSeederService: VentasService,
  ) {}

  async seed() {
    await this.run()
      .then((completed) => {
        this.logger.log('Ventas seeded');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Error seeding ventas', error);
        Promise.reject(error);
      });
  }

  async run() {
    const ventas = await this.ventasSeederService.seedVentasFromJson();
    return await Promise.all(ventas)
      .then((createdVentas) => {
        this.logger.log(`Created ${createdVentas.length} ventas`);
        return Promise.resolve(true);
      })
      .catch((error) => {
        this.logger.error(error);
        return Promise.reject(error);
      });
  }
}
