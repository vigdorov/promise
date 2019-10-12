class PromiseClass {
  static resolve () {
    return new PromiseClass();
  }

  constructor (asyncFunction) {
    let thenCallback = () => {};
    let catchCallback = () => {};

    asyncFunction(
      (...args) => thenCallback(...args),
      (...args) => catchCallback(...args),
    );

    this.then = (callback) => {
      thenCallback = callback;

      return this;
    };

    this.catch = (callback) => {
      catchCallback = callback;

      return this;
    };
  }
}

const userList = fetch('https://reqres.in/api/users');

const createCard = ({ email, first_name: name, avatar}) => {
  return `
  <div>
    <img src="${avatar}" alt="${name}">
    <h4>${name}</h4>
    <p>${email}</p>
  </div>
  `;
};

const generateCard = (list) => {
  const cardList = list.map( card => {
    return createCard(card);
  });
  document.body.innerHTML = cardList.join('');
};

const rating = [1, 3, 4, 5, 6, 32, 2];

userList
  .then((response) => {
    if (response.ok) {
      return response.json()
        .catch(() => response.text());
    }
    if (response.status === 401) {
      // реврешнуть токен
    }
  })
  .catch((error) => console.error(error))
  .then((response) => {
    if (typeof response === 'string') {
      return response;
    }
    return response.data;
  })
  .then((userList) => {
    throw new Error('hui s maslom');
    return userList.map( (user, i) => {
      return { ...user, rating: rating[i] };
    })
  })
  .catch((error) => {
    console.log(error);
    return [];
  })
  .then(users => {
    console.log(users);
  });


class Collection {
  constructor (array) {
    let collection = [...array];

    this.show = () => {
      console.log( collection );
      return this;
    };

    this.increaseAge = (value) => {
      collection = collection.map( item => {
        return { ...item, age: item.age + value };
      });
      return this;
    };
  }
}

const chefs = [
  { name: 'Ivan', rating: 1, age: 45},
  { name: 'Petr', rating: 8, age: 35},
  { name: 'Huert', rating: 13, age: 21},
  { name: 'Man', rating: 4, age: -3},
];

const chefCollection = new Collection(chefs);

chefCollection.show().increaseAge(5).show().show().show();

/**
 * Есть массив промисов
 * const promise = [
 *  Promise.resolve(() => 40),
 *  Promise.reject(() => 'ошибка'),
 * ];

 Нужно написать функцию, которая принимает такой массив, а возвращает промис, который когда разрешиться даст такой результат:
  [{ type: 'success', value: 40 }, {type: 'error', value: 'ошибка'}];
 */

const promiseOne = new Promise((resolve, reject) => {
  reject(456);
});

const promise = [
  Promise.resolve(40),
  Promise.reject('ошибка'),
  promiseOne
];

const returnResponse = (promiseArray) => {
  const temp = promiseArray.map( (promise) => {
    return promise
      .then((answer) => {
        return { type: 'success', value: answer };
      })
      .catch((error) => {
        return { type: 'error', value: error};
      });
  });

  return Promise.all(temp);
};

returnResponse(promise)
  .then(result => {
    console.log(result);
  });

/*

Нужно написать функцию которая принимает url и priority. Функция запускается много раз. Она должна запускать fetch для каждого url по порядку, но только если текущий приоритет выше или равен тем запросам, что сейчас выполняются. Если приоритет ниже, то запрос ждет своей очереди и выполняется, когда более высокие приоритеты закончат свою работу.
  Пример:
load('url1', 3);
load('url2', 2);
load('url3', 4);
В данном примере юрл один сразу запустиститься, второй юрл имеет меньший приоритет и попадет в очередь, третий юрл сразу запутситься. как первый и третий запрос будут выполнены, то запуститься юрл2

*/

let startProcess = [];
let waitProcess = [];
let id = 0;

const searchHighProcess = (array) => {
  return array.reduce((previous, current) => {
    return previous.priority >= current.priority ? previous : current;
  }, []);
};

const recursionStartWaitProcess = () => {
  if (!waitProcess.length) {
    return;
  }
  const highWaitProcess = searchHighProcess( waitProcess );
  waitProcess = waitProcess.filter(el => el.id !== highWaitProcess.id);
  fetch(highWaitProcess.url).then(() => {
    recursionStartWaitProcess();
  });
};

const load = (url, priority) => {
  const highProcess = searchHighProcess( startProcess );

  if (!startProcess.length || highProcess.priority <= priority) {
    const currentId = id;
    startProcess.push({
      fetch: fetch(url).then((res) => {
        startProcess = startProcess.filter( el => el.id !== currentId);
        if (!startProcess.length && waitProcess.length) {
          recursionStartWaitProcess();
          /*
          waitProcess.forEach( ( waitProc ) => {
            waitProcess = waitProcess.filter(el => el.id !== waitProc.id);
            load(waitProc.url, waitProc.priority);

          });*/
        }
        return res;
      }),
      priority,
      id
    });
  }

  if (startProcess.length && highProcess.priority > priority) {
    waitProcess.push({ url, priority, id });
  }

  id += 1;
};

load('https://reqres.in/api/users?page=2', 3);
load('https://reqres.in/api/users/2', 2);
load('https://reqres.in/api/unknown/2', 4);
load('https://reqres.in/api/unknown/1', 1);
load('https://reqres.in/api/unknown/3', 3);

// https://reqres.in/api/users?page=2
// https://reqres.in/api/unknown/2
// https://reqres.in/api/unknown/3
// https://reqres.in/api/users/2
// https://reqres.in/api/unknown/1


/*
const startProcesses = {};
const waitProcesses = {};

let id = 0;

const load = (url, priority) => {

  const successStart = Object.values(startProcesses).find(({ priority: innerPriority }) => {
    return priority >= innerPriority;
  });

  const currentId = id++;

  const startSuccessProcess = ({ url, priority }) => {
    startProcesses[currentId] = {
      method: fetch(url).then(() => {
        delete startProcess[currentId];

        let isPriorityProcess = { priority: -infinity };
        let isPriorityId;

        if (Object.values(waitProcesses).length) {
          Object.keys(waitProcesses).forEach( innerId => {
            if (isPriorityProcess.priority < waitProcesses[innerId]) {
              isPriorityProcess = waitProcesses[innerId];
              isPriorityId = innerId;
            }
          });

          delete waitProcesses[isPriorityId];

          startSuccessProcess( isPriorityProcess );
        }
      }),
      priority
    };
  }

  if (successStart) {
    startSuccessProcess({url, priority});
  } else {
    waitProcesses[currentId] = { url, priority };
  }


}*/
