/* Caché para uso sin conexión. Sube VERSION al publicar cambios. */
const VERSION='v3.18-2026-10-03';
const CORE=['./','index.html','manifest.webmanifest','assets/css/app.css','assets/js/content.js','assets/js/panel.js','assets/js/cases.js','assets/js/sim.js','assets/js/app.js',
'content/manual-lp12.html','content/manual-save.html','content/manual-integracion.html',
'assets/fonts/barlow-latin-400-normal.woff2','assets/fonts/barlow-latin-400-italic.woff2','assets/fonts/barlow-latin-600-normal.woff2','assets/fonts/barlow-latin-700-normal.woff2','assets/fonts/barlow-semi-condensed-latin-600-normal.woff2','assets/fonts/barlow-semi-condensed-latin-700-normal.woff2',
'assets/img/icon.svg','assets/img/icon-192.png','assets/img/icon-512.png',
'assets/docs/infografia-lp12.html','assets/docs/infografia-save.html','assets/docs/infografia-int.html','assets/js/infografia.js','assets/css/infografia.css'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  // red primero para que lleguen las actualizaciones; si la red falla o tarda más de 4 s, la copia guardada
  const fallback=()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||(e.request.mode==='navigate'?caches.match('index.html'):Response.error()));
  const net=fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(VERSION).then(c=>c.put(e.request,cp));}return r;});
  const slow=new Promise(res=>setTimeout(res,4000)).then(()=>caches.match(e.request,{ignoreSearch:true})).then(r=>r||net);
  e.respondWith(Promise.race([net,slow]).catch(fallback));
  e.waitUntil(net.catch(()=>{}));
});
