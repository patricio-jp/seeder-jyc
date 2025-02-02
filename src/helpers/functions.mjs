const exceptionsToCapitalize = [
  'de',
  'del',
  'la',
  'los',
  'las',
  'y',
  'con',
  'c/',
  'semi-nuevo',
  'semi-nueva',
  'semi-automatico',
  'semi-automático',
  'semi-industrial',
];
const exceptionsToLowerCase = ['tv', 'tcl', 'lts', 'zte', 'bgh'];

function capitalizeFirstLetter(string) {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeWords(string) {
  if (string)
    return string
      .split(' ')
      .map((word, index) => {
        if (exceptionsToLowerCase.includes(word)) {
          return word.toUpperCase();
        } else {
          if (index == 0) {
            return capitalizeFirstLetter(word);
          } else {
            if (exceptionsToCapitalize.includes(word)) {
              return word;
            } else {
              return capitalizeFirstLetter(word);
            }
          }
        }
      })
      .join(' ');
}

export { capitalizeWords };
