self.addEventListener('install', e=>
  e.waitUntil( caches.open('mifitscale').then( cache=> cache.addAll(['/index.html','/index.css','/code.js','/demodata.js','/mifitruler.svg']) ) )
)

self.addEventListener('fetch', e=> e.respondWith( caches.match(e.request).then( response=> response || fetch(e.request) ) ) )
