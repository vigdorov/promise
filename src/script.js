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

const userList = new PromiseClass((resolve, reject) => {
  fetch('https://reqres.in/api/users')
    .then( r => r.json())
    .then( data => {
      resolve(data);
    });
});

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

userList
  .then((response) => {
    return response.data
  })
  .then( (data) => {
    generateCard(data);
  })
  .catch(() => {});


fetch('https://reqres.in/api/users', {
  method: 'POST',
  body: JSON.stringify({
    name: 'morpheus',
    job: 'leader'
  })
})
  .then(r => r.json())
  .then(answer => console.log(answer));
