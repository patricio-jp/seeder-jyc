import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Rol, Usuario } from 'src/entities/usuarios/usuarios.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async seedUsuarios(): Promise<Usuario> {
    try {
      const file = process.cwd() + '/src/usuarios/usuarios.json';

      const data = fs.readFileSync(file, 'utf8');
      const dataUsuario = JSON.parse(data);
      const defaultUser = new Usuario();

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(dataUsuario.password, salt);

      defaultUser.apellido = dataUsuario.apellido;
      defaultUser.nombre = dataUsuario.nombre;
      defaultUser.rol = Rol.Administrador;
      defaultUser.dni = dataUsuario.dni;
      defaultUser.password = hashedPassword;
      defaultUser.fechaNacimiento = new Date(
        dataUsuario.fechaNacimiento.valueOf(),
      );
      defaultUser.fechaInicio = new Date(dataUsuario.fechaInicio.valueOf());

      return Promise.resolve(this.usuariosRepository.save(defaultUser));
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }
}
