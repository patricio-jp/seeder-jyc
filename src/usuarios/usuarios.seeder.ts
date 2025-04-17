import { Injectable, Logger } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Injectable()
export class UsuariosSeeder {
  constructor(
    private readonly logger: Logger,
    private readonly usuariosSeederService: UsuariosService,
  ) {}

  async seed() {
    await this.run()
      .then((completed) => {
        this.logger.log('Usuarios seeded');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Error seeding usuarios', error);
        Promise.reject(error);
      });
  }

  async run() {
    const usuarios = this.usuariosSeederService.seedUsuarios();
    return usuarios
      .then((createdUsuario) => {
        this.logger.log(`Created usuario with ID: ${createdUsuario.id}`);
        return Promise.resolve(true);
      })
      .catch((error) => {
        this.logger.error('Error creating usuario', error);
        return Promise.reject(error);
      });
  }
}
