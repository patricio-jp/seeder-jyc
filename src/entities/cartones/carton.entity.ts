import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Credito } from '../creditos/creditos.entity';
import { GrupoCartones } from './grupoCartones.entity';

export enum EstadoCarton {
  Pendiente,
  EnDudas,
  Listo,
  Separado, // Para conflictos a resolver luego de dudas
  Llevado,
  Finalizado, // Para créditos pagados/anulados (determinado por el estado del crédito)
}

@Entity('cartones')
export class Carton extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EstadoCarton,
    default: EstadoCarton.Pendiente,
  })
  estado: EstadoCarton;

  @Column('date', { nullable: true })
  fechaCarton?: Date;

  @ManyToOne(() => Credito, (credito) => credito.carton)
  credito: Credito;

  @ManyToOne(() => GrupoCartones, (grupoCartones) => grupoCartones.cartones, {
    cascade: true,
  })
  grupoCartones: GrupoCartones;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
