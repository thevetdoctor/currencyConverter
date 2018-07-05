const Database = idb.open('ExchangeRates', 1, (upgradeDb) => {

   const RateStore = upgradeDb.createObjectStore('rates', { keyPath: 'rate'});

  RateStore.createIndex('matchIndex', 'match');
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
  }
};

rates = rates.results;

let currFrom = document.getElementById('handle1');
let currTo = document.getElementById('handle2');
let ratesArray = [];
let currOptions = '';

for(let rate in rates){
if(rates[rate]['currencySymbol'] === undefined){
  rates[rate]['currencySymbol'] = 'NA';
}

  ratesArray.push(rate);

// setting the options of the select element on the DOM

currOptions += `<option id="${ rates[rate]['id'] }" value="${ rates[rate]['id'] }"> ${ rates[rate]['currencyName'] }  ( ${ rates[rate]['currencySymbol'] } )</option>`;

  }

currFrom.innerHTML = currOptions;
currTo.innerHTML = currOptions;

console.log(ratesArray);

const convertBtn = document.getElementById('convertBtn');
const amount = document.getElementById('amount');
const convertedValue = document.getElementById('convertedValue');

let exchangeArray = [], exchangeRate, data, factor, factorArray = [];
// let exchangeArray = [], exchangeRate, data, factor, factorArray = ['USD_AED', 'USD_GBP', 'USD_NGN'];

  for(let x of ratesArray) {

    for(let y of ratesArray) {

  if(x === y){
    continue;
  }

let factor = x + '_' + y;


factorArray.push(factor);


// initiate the ajax call to the API


 let url = 'https://free.currencyconverterapi.com/api/v5/convert?q=[CODE]&compact=ultra';

fetch(url.replace('[CODE]', factor)
              // , {mode: 'no-cors', headers: {
              // "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        // }}
        )

  .then((res) => {
    if(res.status !== 200){
      console.log('Status code: ' + res.status)
      return;
    }
    res.json().then((data) => {
      console.log(data);
      exchangeArray.push(data);

       Database.then((db) => {
          let createRecord = db.transaction('rates', 'readwrite');
          let newRecord = createRecord.objectStore('rates');

            for(let data of exchangeArray){

              for(let x in data){

                console.log(`match: ${x}, code: ${data[x]}`);

                   newRecord.put({match: `${x}`,
                                   rate: `${data[x]}`
                                 });
                    }
                  }

          createRecord.complete;
        }).then(() => {
          console.log('Record created');
        });


    })
 })
  .catch((err) => {
    console.log('Error : Conversion not successful', err);
    });

  }
}


console.log(factorArray);
console.log(factorArray.length);
console.log(exchangeArray);

// }


let equiv, equiv_match_array = [], equiv_value_array = [], amountValue = 0, idFrom, idTo, currentRate;

// declare the function to convert on clicking submit button

let count = 0;

const convert = (e) => {
e.preventDefault();

  idFrom = currFrom.value;
  idTo = currTo.value;


        Database.then((db) => {
          let readRecord = db.transaction('rates').objectStore('rates').index('matchIndex');

          return readRecord.getAll();
        }).then((result) => {
          console.log(result);

          if(result.length == 0){
            for(let res of result){
              equiv_match_array.push(res.match);
              equiv_value_array.push(res);
             }
            }
         });

        if(idFrom == idTo){

          amountValue = 1;

          convertedValue.innerHTML = '';

          convertedValue.innerHTML = `<h3> ${currFrom.value} ${amount.value}  is equivalent to ${currTo.value} ${convertedValue.innerText} ${amountValue}</h3>`;
          return;
        }

  equiv = idFrom + '_' + idTo;

  if(equiv_match_array.length !== 0){

let a = equiv_match_array.indexOf(equiv);
currentRate = equiv_value_array[a]['rate'];

console.log(a);
console.log(currentRate);

amountValue = Number(amount.value);
console.log(currentRate);
amountValue *= currentRate;

amountValue = amountValue.toFixed(2);

convertedValue.innerHTML = '';

convertedValue.innerHTML = `<h3> ${currFrom.value} ${amount.value}  is equivalent to ${currTo.value} ${convertedValue.innerText} ${amountValue}</h3>`;

}  else {

convertedValue.innerHTML = '';

convertedValue.innerHTML = `<h3> ... Loading rates, please refresh the page and try again</h3>`;
     }
}

convertBtn.addEventListener('click', convert);
