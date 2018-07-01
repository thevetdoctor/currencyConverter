const cacheName = 'v1';
const cacheFiles = [
		'./',
		'./index.css',
		'./index.html',
		'./assets/',
		'./js/'
  		];

self.addEventListener('install', (e) => {
	console.log('[ServiceWorker] Installed');

	e.waitUntil(
		caches.open(cacheName).then((cache) => {
			console.log('[ServiceWorker] Caching cacheFiles');

			console.log(...cacheFiles);

			return cache.addAll(cacheFiles);
		})
	)
})

self.addEventListener('activate', (e) => {
	console.log('[ServiceWorker] Activated');

	e.waitUntil(

			caches.keys().then((cacheNames) => {
				return Promise.all(cacheNames.map((thisCacheName) => {
					if(thisCacheName !== cacheName){
						console.log('[ServiceWorker] Removing cached files from', thisCacheName);
						return caches.delete(thisCacheName);
					}
				}))
			})


		)
})

self.addEventListener('fetch', (e) => {
	console.log('[ServiceWorker] Fetching', e.request.url);

	e.respondWith(
		caches.match(e.request)
		.then((response) => {

			 if(response) {
				console.log('[ServiceWorker] Found in cache', e.request.url);
				return response;
			}


			let requestClone = e.request.clone();

			fetch(requestClone)
			.then((response) => {

				if(!response) {
					console.log('[ServiceWorker] No response from fetch');
					return response;
				}

				let responseClone = response.clone();
				caches.open(cacheName)
				.then((cache) => {
					console.log('[ServiceWorker] New Data New', e.request.url);
					cache.put(e.request, responseClone);
					return response;
				});

			})
			.catch((err) => {
				console.log('[ServiceWorker] Error fetching & caching new data', err);
			})
		})

		)
})
