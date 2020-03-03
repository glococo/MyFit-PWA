self.addEventListener('install', e=>
  e.waitUntil( caches.open('myfitpwa-v01').then( cache=> cache.addAll(['/index.html']) ) )
)

self.addEventListener('fetch', e=>
  e.respondWith( caches.match(e.request).then( response=> response || fetch(e.request) ) )
)
