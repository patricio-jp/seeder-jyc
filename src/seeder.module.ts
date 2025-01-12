import { Logger, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ClientesModule } from './clientes/clientes.module';
import { ClientesSeeder } from './clientes/clientes.seeder';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ClientesModule,
  ],
  providers: [Logger, ClientesSeeder],
})
export class SeederModule {}
