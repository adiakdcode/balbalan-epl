importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
 
if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
  { url: './manifest.json', revision: '2' },
  { url: './index.html', revision: '2' },
  { url: './pages/fav-team.html', revision: '2' },
  { url: './pages/home.html', revision: '2' },
  { url: './pages/match.html', revision: '2' },
  { url: './pages/team.html', revision: '2' },
  { url: './pages/topscore.html', revision: '2' },
  { url: './assets/shell/nav-shell.html', revision: '2' },
  { url: './assets/images/epl_icon1.png',  revision: '2' },
  { url: './assets/images/epl_club.jpg',  revision: '2' },
  { url: './assets/images/standing_bg.jpg',  revision: '2' },
  { url: './assets/images/pl_bg.jpg',  revision: '2' },
  { url: './assets/images/epl_sd.jpg', revision: '2' },
  { url: './assets/images/icon.png', revision: '2' },
  {url : './assets/images/myicon.png', revision: '2' },
  { url: './assets/images/icons/icon-96x96.png', revision: '2' },
  { url: './assets/images/icons/icon-128x128.png', revision: '2' },
  { url: './assets/images/icons/icon-144x144.png', revision: '2' },
  { url: './assets/images/icons/icon-152x152.png', revision: '2' },
  { url: './assets/images/icons/icon-192x192.png', revision: '2' },
  { url: './assets/images/icons/icon-384x384.png', revision: '2' },
  { url: './assets/images/icons/icon-512x512.png', revision: '2' },
  { url: './assets/css/materialize.css', revision: '2' },
  { url: './assets/css/materialize.min.css', revision: '2' },
  { url: './assets/css/style.css', revision: '2' },
  { url: './assets/js/api.js', revision: '2' },
  { url: './assets/js/DB.js', revision: '2' },
  { url: './assets/js/nav.js', revision: '2' },
  { url: './assets/js/idb.js', revision: '2' },
  { url: './assets/js/init.js', revision: '2' },
  { url: './assets/js/materialize.min.js', revision: '2' },
  { url: './assets/js/script.js', revision: '2' },
], {
  ignoreUrlParameterMatching: [/.*/]
});

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
  /.*(?:googleapis|gstatic)\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

workbox.routing.registerRoute(
    new RegExp('/pages/'),
      workbox.strategies.staleWhileRevalidate({
          cacheName: 'halaman'
    })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 14 * 24 * 60 * 60, // 14 hari
      }),
    ],
  }),
);

// Push notification
self.addEventListener('push', event => {
  console.log(event);
  let body;
  if (event.data) {
      body = event.data.text()
  }else{
      body = "push message no payload"
  }

  let opt ={
      body,
      icon : './assets/images/icon.png',
      vibrate : [100,50,100],
      data : {
          dateOfArrival : Date.now(),
          primaryKey : 1
      }
  }

  event.waitUntil(
      self.registration.showNotification('Push notification',opt)
  )
});