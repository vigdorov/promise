let getNeighbors = function(code) {
  let countryList = {
    'A': 'red',
    'B': undefined,
    'C': 'blue',
    'D': undefined,
    'E': 'green',
    'F': 'red'
  };
  let countryNeighborsList = {
    'A': ['B', 'F', 'E'],
    'B': ['A', 'F', 'C'],
    'C': ['B', 'F', 'D'],
    'D': ['C', 'E'],
    'E': ['A', 'F', 'D'],
    'F': ['A', 'B', 'C', 'E'],
  };
  let result = [];
  countryNeighborsList[code].forEach( (neighbor) => {
    result.push({
      code: neighbor,
      color: countryList[neighbor]
    });
  });

  return Promise.resolve(result);
};

// Promise.all и async запрещены. Только последовательный запуск одного промиса за другим.

const funcMD = (start, getFunc) => {
  const neighborhoods = getFunc(start.code);
  neighborhoods.then( res => console.log('sosedi', res));
};

const startCountry = { code: 'A', color: 'red' };

let result = funcMD( startCountry, getNeighbors );

result.then( res => console.log('Страны без цвета:', res) );
