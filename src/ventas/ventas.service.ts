import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { DetalleVenta, Venta } from 'src/entities/operaciones/ventas.entity';
import { Producto } from 'src/entities/productos/productos.entity';
import { CondicionOperacion } from 'src/entities/operaciones/operaciones.entity';
import {
  Credito,
  EstadoCredito,
  Periodo,
} from 'src/entities/creditos/creditos.entity';
import { Cuota } from 'src/entities/cuotas/cuotas.entity';
import { Cliente } from 'src/entities/clientes/clientes.entity';
import { Carton, EstadoCarton } from 'src/entities/cartones/carton.entity';

function addMonth(date: Date): Date {
  const newDate = new Date(date.valueOf());
  newDate.setMonth(newDate.getMonth() + 1);

  // Si el nuevo mes tiene menos días que el día actual, ajusta el día
  if (newDate.getDate() < date.getDate()) {
    newDate.setDate(0); // Esto ajusta al último día del mes anterior
  }

  return newDate;
}

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>,
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
  ) {}

  async seedVentasFromJson(): Promise<Venta[]> {
    try {
      const file = process.cwd() + '/src/ventas/ventas.json';
      console.log(file);

      const data = fs.readFileSync(file, 'utf8');
      const dataVentas = JSON.parse(data);
      let ventas = [];

      for (const venta of dataVentas) {
        if (!venta.requireIntervention) {
          const nuevaVenta = new Venta();

          const cliente = await this.clientesRepository.findOneBy({
            id: venta.cliente_id,
          });
          nuevaVenta.cliente = cliente;

          nuevaVenta.fecha = venta.fecha.split('T')[0];
          nuevaVenta.comprobante = venta.comprobante;
          nuevaVenta.condicion = CondicionOperacion.CTA_CTE;
          nuevaVenta.estado = venta.estado;
          nuevaVenta.total = venta.total;

          let detalle = [];

          //console.log('Venta info: ', venta);
          //console.log('Porudcots:', venta.productos);
          //console.log(JSON.parse(venta.productos));
          for (const producto of venta.productos) {
            const productoDB = await this.productosRepository.findOneBy({
              nombre: producto.producto,
            });
            const nuevoDetalle = new DetalleVenta();
            nuevoDetalle.cantidad = producto.cantidad;
            nuevoDetalle.producto = productoDB;
            detalle = [...detalle, nuevoDetalle];
          }
          nuevaVenta.productos = detalle;

          if (venta.financiacion) {
            const financiacion = new Credito();
            financiacion.estado = venta.financiacion.estado;
            financiacion.fechaInicio = venta.financiacion.fechaInicio
              ? new Date(venta.financiacion.fechaInicio)
              : new Date(venta.fecha);
            financiacion.cantidadCuotas =
              venta.financiacion.cantidadCuotas || 1;
            financiacion.periodo = venta.financiacion.periodo || 0;
            financiacion.montoCuota = venta.financiacion.montoCuota || 0;

            const cartonCredito = new Carton();
            cartonCredito.estado = EstadoCarton.Pendiente;
            financiacion.carton = cartonCredito;

            if (
              financiacion.estado !== EstadoCredito.Pagado &&
              financiacion.estado !== EstadoCredito.Anulado
            ) {
              console.log('Credito info', venta.financiacion);
              let fechaVenc = new Date(financiacion.fechaInicio.valueOf());
              fechaVenc.setHours(fechaVenc.getHours() + 3);

              for (
                let numCuota = 1;
                numCuota <= financiacion.cantidadCuotas;
                numCuota++
              ) {
                const cuota = new Cuota();
                cuota.cuotaNro = numCuota;
                fechaVenc = new Date(fechaVenc.valueOf());

                if (numCuota !== 1) {
                  switch (financiacion.periodo) {
                    case Periodo.Mensual: {
                      fechaVenc = addMonth(fechaVenc);
                      if (
                        fechaVenc.getDate() < financiacion.fechaInicio.getDate()
                      ) {
                        fechaVenc = addMonth(fechaVenc);
                        fechaVenc.setDate(0); // Esto ajusta al último día del mes anterior
                        if (
                          fechaVenc.getDate() >
                          financiacion.fechaInicio.getDate()
                        ) {
                          fechaVenc.setDate(financiacion.fechaInicio.getDate());
                        }
                      }
                      break;
                    }
                    case Periodo.Quincenal: {
                      fechaVenc.setDate(fechaVenc.getDate() + 15);
                      if (fechaVenc.getDay() === 0) {
                        fechaVenc.setDate(fechaVenc.getDate() + 1);
                      }
                      break;
                    }
                    case Periodo.Semanal: {
                      fechaVenc.setDate(fechaVenc.getDate() + 7);
                      break;
                    }
                    default: {
                      console.error(
                        'Error con el período de las cuotas. Período inválido',
                      );
                      break;
                    }
                  }
                }

                cuota.fechaVencimiento = fechaVenc;
                cuota.montoCuota = financiacion.montoCuota;
                financiacion.cuotas = financiacion.cuotas
                  ? [...financiacion.cuotas, cuota]
                  : [cuota];
              }
            }

            nuevaVenta.financiacion = [financiacion];
          }

          ventas = [...ventas, nuevaVenta];
        }
      }

      const ventasDB = this.ventasRepository.create(ventas);

      const promises = ventasDB.map(async (venta: Venta) => {
        return Promise.resolve(this.ventasRepository.save(venta));
      });
      return Promise.all(promises);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }
}
