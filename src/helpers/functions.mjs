const exceptionsToCapitalize = ['de', 'del', 'la', 'los', 'las', 'y'];

function capitalizeFirstLetter(string) {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeWords(string) {
  if (string)
    return string
      .split(' ')
      .map((word, index) => {
        if (index == 0) {
          return capitalizeFirstLetter(word);
        } else {
          if (exceptionsToCapitalize.includes(word)) {
            return word;
          } else {
            return capitalizeFirstLetter(word);
          }
        }
      })
      .join(' ');
}

export { capitalizeWords };
