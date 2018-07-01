
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

