import { Injectable, Logger } from '@nestjs/common';
import { ProductosService } from './productos.service';

@Injectable()
export class ProductosSeeder {
  constructor(
    private readonly logger: Logger,
    private readonly productosSeederService: ProductosService,
  ) {}

  async seed() {
    await this.run()
      .then((completed) => {
        this.logger.log('Productos seeded');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Error seeding productos', error);
        Promise.reject(error);
      });
  }

  async run() {
    const productos = await this.productosSeederService.seedVentasFromJson();
    return await Promise.all(productos)
      .then((createdProductos) => {
        this.logger.log(`Created ${createdProductos.length} productos`);
        return Promise.resolve(true);
      })
      .catch((error) => {
        this.logger.error(error);
        return Promise.reject(error);
      });
  }
}
