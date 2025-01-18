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
  let numDomicilios = 0;
  let numBarrios = 0;
  let numLocalidades = 0;
  let numTelefonos = 0;

  let domicilios = '';
  let barrios = '';
  let localidades = '';
  let telefonos = '';
  line.split(';').forEach((value, index) => {
    if (value) {
      if (
        header[index] === 'ID' ||
        header[index] === 'DNI' ||
        header[index] === 'Apellido y Nombre'
      ) {
        if (header[index] === 'Apellido y Nombre') {
          let nombreYApellido = value.replaceAll('"', '');
          if (nombreYApellido.includes(',')) {
            obj['apellido'] = capitalizeWords(
              nombreYApellido.split(',')[0].trim().toLowerCase(),
            );
            obj['nombre'] = capitalizeWords(
              nombreYApellido.split(',')[1].trim().toLowerCase(),
            );
          } else {
            obj['nombre'] = capitalizeWords(nombreYApellido.toLowerCase());
          }
          //obj['nombre'] = capitalizeWords(value.toLowerCase());
        } else {
          obj[header[index].toLowerCase()] = Number(value);
        }
      }

      if (header[index] === 'Direccion') {
        let arrayDomicilios = value.replaceAll('"', '').split('|');
        numDomicilios = arrayDomicilios.length;
        domicilios = value;
      }
      if (header[index] === 'Barrio') {
        let arrayBarrios = value.replaceAll('"', '').split('|');
        numBarrios = arrayBarrios.length;
        barrios = value;
      }
      if (header[index] === 'Localidad') {
        let arrayLocalidades = value.replaceAll('"', '').split('|');
        numLocalidades = arrayLocalidades.length;
        localidades = value;
      }

      if (header[index] === 'Telefono') {
        let arrayTelefonos = value.replaceAll('"', '').split('||');
        numTelefonos = arrayTelefonos.length;
        telefonos = value ? value : undefined;
      }

      if (header[index] === 'Apariciones') {
        let arrayApariciones = value.replaceAll('"', '').split('_');
        if (arrayApariciones.length > 1) {
          obj['apariciones'] = arrayApariciones.map((aparicion) => {
            return `${aparicion}`;
          });
        }
      }
    }
  });

  if (numDomicilios > 1 || numBarrios > 1 || numLocalidades > 1) {
    let arrayDomicilios = domicilios.replaceAll('"', '').split('|');
    let arrayBarrios = barrios.replaceAll('"', '').split('|');
    let arrayLocalidades = localidades.replaceAll('"', '').split('|');
    let cantDomicilios = Math.max(numBarrios, numLocalidades, numDomicilios);
    let objDomicilios = [];
    for (let i = 0; i < cantDomicilios; i++) {
      objDomicilios.push({
        direccion: capitalizeWords(arrayDomicilios[i]?.toLowerCase()),
        barrio: capitalizeWords(arrayBarrios[i]?.toLowerCase()),
        localidad: capitalizeWords(arrayLocalidades[i]?.toLowerCase()),
      });
    }
    obj['domicilios'] = objDomicilios;
  } else {
    if (domicilios || barrios || localidades) {
      obj['domicilios'] = [
        {
          direccion: capitalizeWords(domicilios.toLowerCase()),
          //direccion: domicilios.toLowerCase(),
          barrio: capitalizeWords(barrios.toLowerCase()),
          //barrio: barrios.toLowerCase(),
          localidad: capitalizeWords(localidades.toLowerCase()),
          //localidad: localidades.toLowerCase(),
        },
      ];
    }
  }

  if (numTelefonos > 1) {
    let arrayTelefonos = telefonos.replaceAll('"', '').split('||');
    obj['telefonos'] = arrayTelefonos.map((telefono) => {
      return {
        telefono: telefono,
      };
    });
  } else {
    obj['telefonos'] = telefonos ? [{ telefono: telefonos }] : undefined;
  }
  return obj;
});

const json = JSON.stringify(data, null, 2);
// Script will be called from project root folder
writeFileSync('./src/clientes/clientes.json', json);
