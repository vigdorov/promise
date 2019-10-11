class PromiseClass {
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

