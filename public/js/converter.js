// import idb from '../idb';

// alert('Converter script is active!');

let form = document.getElementById('form');

function get(url){
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url);

    xhr.onload = () => {
      if(xhr.status >= 200 && xhr.status < 300){
        resolve(xhr.response, console.log('Resolved in converter.js'));
      } else {
        reject({status : `${this.status}: onload-failed in converter.js`,
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




const Database = idb.open('ExchangeRates', 1, (upgradeDb) => {

   const RateStore = upgradeDb.createObjectStore('rates', { keyPath: 'code'});

  RateStore.createIndex('codeIndex', 'code');
});





let rates = {"results":
{
"USD":{"currencyName":"United States Dollar","currencySymbol":"$","id":"USD"},
"GBP":{"currencyName":"British Pound","currencySymbol":"£","id":"GBP"},
"EUR":{"currencyName":"Euro","currencySymbol":"€","id":"EUR"},
"NGN":{"currencyName":"Nigerian Naira","currencySymbol":"₦","id":"NGN"},
"CAD":{"currencyName":"Canadian Dollar","currencySymbol":"$","id":"CAD"},
"BTC":{"currencyName":"Bitcoin","currencySymbol":"BTC","id":"BTC"},
"GHS":{"currencyName":"Ghanaian Cedi","currencySymbol":"Cedi","id":"GHS"},
"AED":{"currencyName":"UAE Dirham","currencySymbol":"Dirham","id":"AED"},
"CNY":{"currencyName":"Chinese Yuan","currencySymbol":"¥","id":"CNY"},
"ZAR":{"currencyName":"South African Rand","currencySymbol":"R","id":"ZAR"},
}};


rates = rates.results;


  let currFrom = document.getElementById('handle1');
  let currTo = document.getElementById('handle2');



let count = 0;
let ratesArray = [];
let currOptions = '';

for(let rate in rates){
  count++;
if(rates[rate]['currencySymbol'] === undefined){
  rates[rate]['currencySymbol'] = 'NA';
}

  ratesArray.push(rate);



// setting the options of the select element on the DOM

currOptions += `<option id="${ rates[rate]['id'] }" value="${ rates[rate]['id'] }"> ${ rates[rate]['currencyName'] }  ( ${ rates[rate]['currencySymbol'] } )</option>`;

  }

currFrom.innerHTML = currOptions;
currTo.innerHTML = currOptions;

console.log(count);
console.log(ratesArray);




const convertBtn = document.getElementById('convertBtn');
const amount = document.getElementById('amount');
const convertedValue = document.getElementById('convertedValue');



let exchangeArray = [], exchangeRate, data, factor, factorArray = [];

  for(let x of ratesArray) {

    for(let y of ratesArray) {

  if(x === y){
    continue;
  }

let factor = x + '_' + y;


factorArray.push(factor);


// initiate the ajax call to the API

 let url = 'https://free.currencyconverterapi.com/api/v5/convert?q=[CODE]&compact=ultra';

  get(url.replace('[CODE]', factor), {mode : 'no-cors'})
  .then((response) => {
    let parsedResponse = JSON.parse(response);

    console.log(parsedResponse[factor]);
    exchangeRate = parsedResponse[factor];

    data = { code: factor, rate: exchangeRate};
    exchangeArray.push(data);

 })
  .catch((err) => {
    console.log('Error : Conversion not successful', err);
  });

  }

}



console.log(factorArray);
console.log(factorArray.length);
console.log(exchangeArray);


let equiv, equiv_value_array = [], idFrom, idTo;



// declare the function to convert on clicking submit button

const convert = (e) => {

e.preventDefault();


if(factorArray.length === exchangeArray.length) {

Database.then((db) => {
  let createRecord = db.transaction('rates', 'readwrite');
  let newRecord = createRecord.objectStore('rates');

for(let data of exchangeArray){

      newRecord.put(data);
}

  createRecord.complete;
}).then(() => {
  console.log('Record created');
});



  idFrom = `currFrom.attr['value']`;
  idTo = `currTo.attr['value']`;

  equiv = idFrom + '_' + idTo;


Database.then((db) => {
  let readRecord = db.transaction('rates').objectStore('rates').index('codeIndex');

  return readRecord.getAll();
}).then((result) => {
  console.log(result);

  for(let res of result){
    equiv_value_array.push(res);

  }
});


  for(let factor of factorArray){

    for(let equiv_value of equiv_value_array){

        if(equiv !== factor){
          continue;

        }
          console.log(equiv_value);
  }
 }


amountValue = Number(amount.value) * equiv_value;

convertedValue.innerHTML = '';

convertedValue.innerHTML = `<h3> ${currFrom.value} ${amount.value}  is equivalent to ${currTo.value} ${convertedValue.innerText} ${amountValue}</h3>`;

}

else {

convertedValue.innerHTML = '';

convertedValue.innerHTML = `<h3> Please refresh the page and try again</h3>`;

   }
}

convertBtn.addEventListener('click', convert);
