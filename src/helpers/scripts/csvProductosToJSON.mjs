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
const productosVistos = new Set();
const data = lines.slice(1).map((line) => {
  let numProductos = 0;
  let productos = '';

  line.split(';').forEach((value, index) => {
    if (value) {
      if (header[index] === 'Detalle') {
        let prods = value.replaceAll('"', '').split('//');
        numProductos = prods.length;
        productos = value.replaceAll('"', '');
      }
    }
  });

  let objProductos = [];
  if (numProductos > 1) {
    let arrayProductos = productos.replaceAll('"', '').split('//');

    for (let i = 0; i < numProductos; i++) {
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

      // Verificar si el producto ya ha sido visto
      if (!productosVistos.has(product.trim())) {
        objProductos.push({
          nombre: capitalizeWords(product.trim().toLowerCase()),
          requireIntervention: arrayProductos[i].includes('(')
            ? true
            : undefined,
        });
        productosVistos.add(product.trim()); // Agregar el nombre al Set
      }
    }
  } else if (productos) {
    let [quantity, product] = productos.split(' ');
    quantity = isNaN(quantity) ? 1 : Number(quantity);
    product =
      quantity === 1
        ? productos
        : productos.split(' ').slice(1).toString().replaceAll(',', ' ');
    //console.log('Complete line: ', productos);
    //console.log(quantity, product);

    // Verificar si el producto ya ha sido visto
    if (!productosVistos.has(product.trim())) {
      objProductos.push({
        nombre: capitalizeWords(product.trim().toLowerCase()),
        requireIntervention: productos.includes('(') ? true : undefined,
      });
      productosVistos.add(product.trim()); // Agregar el nombre al Set
    }
  }
  return objProductos;
});

const json = JSON.stringify(data.flat(), null, 2);
// Script will be called from project root folder
writeFileSync('./src/productos/productos.json', json);
