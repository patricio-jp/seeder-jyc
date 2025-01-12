import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from 'src/entities/clientes/clientes.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
  ) {}

  async seedClientesFromJson(): Promise<Cliente[]> {
    try {
      const file = process.cwd() + '/src/clientes/clientes.json';
      console.log(file);

      const data = fs.readFileSync(file, 'utf8');
      const dataClientes = JSON.parse(data);

      const clientes = this.clientesRepository.create(dataClientes);

      const promises = clientes.map(async (cliente: Cliente) => {
        return Promise.resolve(this.clientesRepository.save(cliente));
      });
      return Promise.all(promises);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }
}
