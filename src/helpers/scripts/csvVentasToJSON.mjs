/* eslint-disable @typescript-eslint/no-require-imports */
import { readFileSync, writeFileSync } from 'fs';
import { capitalizeWords } from '../functions.mjs';

if (process.argv[2] === undefined) {
  console.log('Please provide a file to read');
  process.exit(1);
}

const file = process.argv[2];
const fileContent = readFileSync(file, 'utf-8').toString();
const lines = fileContent.split('\n');

const header = lines[0].split(';');
const data = lines.slice(1).map((line) => {
  const obj = {};

  let numProductos = 0;
  let productos = '';

  line.split(';').forEach((value, index) => {
    if (value) {
      if (header[index] === 'Fecha') {
        const [day, month, year] = value.split('/');
        obj['fecha'] = new Date(year, month - 1, day);
      }

      if (header[index] === 'IDCliente') {
        obj['cliente_id'] = Number(value);
      }

      if (header[index] === 'Nota nº') {
        obj['comprobante'] = value;
      }

      if (header[index] === 'Detalle') {
        let prods = value.replaceAll('"', '').split('//');
        numProductos = prods.length;
        productos = value.replaceAll('"', '');
      }

      if (header[index] === 'Cant. Cuotas') {
        obj['financiacion'] = {
          cantidadCuotas: Number(value),
        };
      }
      if (header[index] === 'Periodo') {
        let periodo =
          value == 'MENSUAL'
            ? 0
            : value == 'QUINCENAL'
              ? 1
              : value == 'SEMANAL'
                ? 2
                : undefined;
        obj['financiacion'] = {
          ...obj['financiacion'],
          periodo,
        };
      }
      if (header[index] === 'Importe cuota') {
        value = value.split(',')[0].replace(/[\s$,\.]/g, '');
        obj['financiacion'] = {
          ...obj['financiacion'],
          montoCuota: Number(value),
        };
      }
      if (header[index] === '1era cuota') {
        const [day, month, year] = value.split('/');
        obj['financiacion'] = {
          ...obj['financiacion'],
          fechaInicio: new Date(year, month - 1, day),
        };
      }

      obj['total'] =
        obj['financiacion']?.cantidadCuotas * obj['financiacion']?.montoCuota || 0;
      obj['condicion'] = 'CTA CTE';
      obj['estado'] = 3; // Marcar como entregado todas las ventas

      if (header[index] === 'Observaciones\r') {
        if (value.includes('TERMINÓ DE PAGAR')) {
          obj['financiacion'] = {
            ...obj['financiacion'],
            estado: 2,
          };
        } else if (
          value.includes('ANULADO') ||
          value.includes('DEVUELTO') ||
          value.includes('RETIRADO') ||
          value.includes('FALTAN DATOS') ||
          value.includes('SIN DATOS')
        ) {
          obj['financiacion'] = {
            ...obj['financiacion'],
            estado: 4,
          };
          obj['estado'] = 4; // Marcar como anulada la venta
        } else if (value !== '\r') {
          obj['observaciones'] = value;
          obj['requireIntervention'] = true;
        }
      }
    }
  });

  if (numProductos > 1) {
    let arrayProductos = productos.replaceAll('"', '').split('//');
    let objProductos = [];
    for (let i = 0; i < numProductos; i++) {
      if (arrayProductos[i].includes('(')) {
        obj['requireIntervention'] = true;
      }
      let [quantity, product] = arrayProductos[i].split(' ');
      quantity = isNaN(quantity) ? 1 : Number(quantity);
      product =
        quantity === 1
          ? arrayProductos[i]
          : arrayProductos[i]
            .split(' ')
            .slice(1)
            .toString()
            .replaceAll(',', ' ');
      //console.log('Complete line: ', arrayProductos[i]);
      //console.log(quantity, product);
      objProductos.push({
        producto: capitalizeWords(product.toLowerCase()),
        cantidad: quantity,
        precioUnitario: 0,
      });
    }
    obj['productos'] = objProductos;
  } else if (productos) {
    let [quantity, product] = productos.split(' ');
    quantity = isNaN(quantity) ? 1 : Number(quantity);
    product =
      quantity === 1
        ? productos
        : productos.split(' ').slice(1).toString().replaceAll(',', ' ');
    //console.log('Complete line: ', productos);
    //console.log(quantity, product);
    obj['productos'] = [
      {
        producto: capitalizeWords(product.toLowerCase()),
        cantidad: quantity,
        precioUnitario: 0,
      },
    ];
  }

  return obj;
});

const json = JSON.stringify(data, null, 2);
// Script will be called from project root folder
writeFileSync('./src/ventas/ventas.json', json);
