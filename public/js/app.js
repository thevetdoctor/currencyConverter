// import idb from 'idb';

window.addEventListener('load', () => {
  const el = $('#target');
  // const el = $('#app');

// import index from './sw/index';
  // Compile Handlebar Templates
  const errorTemplate = Handlebars.compile($('#error-template').html());
  const ratesTemplate = Handlebars.compile($('#rates-template').html());
  const exchangeTemplate = Handlebars.compile($('#exchange-template').html());
  const historicalTemplate = Handlebars.compile($('#historical-template').html());

  // const html = ratesTemplate();
  // el.html(html);


// Router Declaration
const router = new Router({
  mode: 'history',
  page404: (path) => {
    const html = errorTemplate({
      color: 'yellow',
      title: 'Error 404 - Page NOT Found!',
      message: `The path '/${path}' does not exist on this site`,
    });
    el.html(html);
  },
});

router.add('/', () => {
  let html = ratesTemplate();
  el.html(html);
});

router.add('/exchange', () => {
  let html = exchangeTemplate();
  el.html(html);
});

router.add('/historical', () => {
  let html = historicalTemplate();
  el.html(html);
});

// Navigate app to current url
router.navigateTo(window.location.pathname);

 // Highlight Active Menu on Refresh/Page Reload
const link = $(`a[href$='${window.location.pathname}']`);
link.addClass('active');

$('a').on('click', (event) => {
  // Block browser page load
  event.preventDefault();

  // Highlight Active Menu on Click
  const target = $(event.target);
  $('.item').removeClass('active');
  target.addClass('active');

  // Navigate to clicked url
  const href = target.attr('href');
  const path = href.substr(href.lastIndexOf('/'));
  router.navigateTo(path);
});




// const Database = idb.open('ExchangeRates', 1, (upgradeDb) => {

//    const RateStore = upgradeDb.createObjectStore('rates', { keyPath: 'currencyName'});

//   RateStore.createIndex('codeIndex', 'currencyName');
// });


});


function sw(){
  if(navigator.serviceWorker){
    console.log('Browser supports service worker');

    navigator.serviceWorker.register('./sw.js').then((response) => {
      console.log('Scope:', response.scope, 'State:', response.active.state);
    })
    .catch((err) => {
      console.log('Error: serviceWorker not registered', err);
    });
  }
}
sw();

// function to perform HTTP request

function get(url){
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url);

    xhr.onload = () => {
      if(xhr.status >= 200 && xhr.status < 300){
        resolve(xhr.response, console.log('Resolved again'));
      } else {
        reject({status : `${this.status}: onload-failed`,
               statusText: xhr.statusText
             }, console.log(`${this.status}: onload-failed`));
      }
    };

    xhr.onerror = () => {

      reject({status : `${xhr.status} =>@onerror-rejectedStatus`,
               statusText: `${xhr.statusText}@onerror-rejectedStatusText`
             }
             );
    };

    xhr.send();

  });
}


// get('http://jsonplaceholder.typicode.com/users')
// .then((response) => {
//   console.log('Success'/*, response*/);

// let result = document.getElementById('result');
// let todos = JSON.parse(response);
// let output = '';
// for(let todo of todos){
//   output += `
//     <div>
//       <p> ID:${todo.id}, Name:${todo.name}
//          <span> Username:${todo.username}</span>
//          <span> Email:${todo.email}</span>
//          <span> Address: Street- ${todo.address.street}, Suite- ${todo.address.suite}, City- ${todo.address.city}, Zipcode- ${todo.address.zipcode}. Coordinates: ${todo.address.geo.lat} & ${todo.address.geo.lng}</span>
//       </p>
//     </div>
//   `;
// }

 // result.innerHTML = output;


// })
// .catch((err) => {
//   console.log('Error', err);
// })

