import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from 'src/entities/clientes/clientes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  providers: [ClientesService],
  exports: [ClientesService],
})
export class ClientesModule {}
