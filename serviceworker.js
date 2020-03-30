self.addEventListener('install', e=>
  e.waitUntil( caches.open('mifitscale').then( cache=> cache.addAll(['/demodata.js','/mifitruler.svg']) ) )
)

self.addEventListener('fetch', e=> e.respondWith( caches.match(e.request).then( response=> response || fetch(e.request) ) ) )
