self.addEventListener('install', e=>
  e.waitUntil( caches.open('mifitscale').then( cache=> cache.addAll(['/assets/demodata.js','/assets/mifitruler.svg','/assets/BalooThambi2-Bold.ttf','/assets/Ubuntu-Regular.ttf']) ) )
)

self.addEventListener('fetch', e=> e.respondWith( caches.match(e.request).then( response=> response || fetch(e.request) ) ) )
