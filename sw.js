/* Caché para uso sin conexión. Sube VERSION al publicar cambios. */
const VERSION='v3.3-2026-10-02';
const CORE=['./','index.html','manifest.webmanifest','assets/css/app.css','assets/js/content.js','assets/js/cases.js','assets/js/sim.js','assets/js/app.js',
'content/manual-lp12.html','content/manual-save.html','content/manual-integracion.html',
'assets/fonts/barlow-latin-400-normal.woff2','assets/fonts/barlow-latin-400-italic.woff2','assets/fonts/barlow-latin-600-normal.woff2','assets/fonts/barlow-latin-700-normal.woff2','assets/fonts/barlow-semi-condensed-latin-600-normal.woff2','assets/fonts/barlow-semi-condensed-latin-700-normal.woff2',
'assets/img/icon.svg','assets/img/icon-192.png',
'assets/docs/Infografia_LIFEPAK12.jpg','assets/docs/Infografia_SAVeII.jpg','assets/docs/Infografia_Integracion.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  // red primero para que lleguen las actualizaciones; si no hay red, caché
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();if(r.ok)caches.open(VERSION).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});
