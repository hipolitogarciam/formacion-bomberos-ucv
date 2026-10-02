(function(){
'use strict';
const app=document.getElementById('app');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let simInst=null;const cache={};

/* ---------- Tema ---------- */
const root=document.documentElement;
function setTheme(t){if(t==='auto')root.removeAttribute('data-theme');else root.setAttribute('data-theme',t);try{localStorage.setItem('theme',t)}catch(e){}const b=document.getElementById('themeBtn');if(b)b.textContent=t==='dark'?'☾':t==='light'?'☀':'◐';}
try{setTheme(localStorage.getItem('theme')||'auto')}catch(e){setTheme('auto')}
document.getElementById('themeBtn').addEventListener('click',()=>{const c=root.getAttribute('data-theme')||'auto';setTheme(c==='auto'?'dark':c==='dark'?'light':'auto');});

/* ---------- Anclas internas (índices de los manuales) ---------- */
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const h=a.getAttribute('href');if(h.startsWith('#/'))return;e.preventDefault();const el=document.getElementById(h.slice(1));if(el)el.scrollIntoView({behavior:'smooth',block:'start'});});

/* ---------- Router ---------- */
function route(){
  if(simInst){simInst.destroy();simInst=null;}
  const parts=(location.hash.replace(/^#\/?/,'')||'').split('/').filter(Boolean);
  document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.r===(parts[0]||'home')||(parts[0]==='m'&&a.dataset.r===parts[1])||(parts[0]==='caso'&&a.dataset.r==='casos')));
  window.scrollTo(0,0);
  if(!parts.length)return home();
  if(parts[0]==='m')return mod(parts[1],parts[2]||'inicio');
  if(parts[0]==='casos')return casos();
  if(parts[0]==='caso')return caso(parts[1]);
  if(parts[0]==='acerca')return acerca();
  home();
}
addEventListener('hashchange',route);

/* ---------- Portada ---------- */
function home(){
  document.title='Formación LIFEPAK 12 y SAVe II+ · Bomberos UCV';
  app.innerHTML=`
  <section class="hero">
    <div class="kick">Web formativa</div>
    <h1>LIFEPAK 12 y SAVe II+ en la ambulancia</h1>
    <p>Plan formativo en 3 módulos con manuales de bolsillo, esquemas interactivos de los equipos, infografías, vídeos y casos clínicos en los que manejan los equipos virtuales.</p>
    <div class="row"><a class="btn orange" href="#/m/lp12">Empezar por el módulo 1</a><a class="btn alt" href="#/casos">Ir a los casos clínicos</a></div>
    <svg class="deco" viewBox="0 0 200 100" fill="none" stroke="#3CC6D2" stroke-width="4"><path d="M0 60h50l10-30 15 60 15-80 12 50h98"/></svg>
  </section>
  <div class="section"><h2>Plan formativo</h2>
  <p class="lead">Se recomienda seguir el orden. Cada módulo termina con una autoevaluación y casos prácticos.</p>
  <ol class="plan">
   ${MODS.map(m=>`<li><b>Módulo ${m.n} · ${m.title}</b> <span class="pill">${m.sub}</span><br>${m.intro}<br><small>Vídeo (≈ 10-13 min) → manual de bolsillo → panel interactivo → infografía → casos → autoevaluación</small><br><a href="#/m/${m.id}">Abrir el módulo ${m.n} →</a></li>`).join('')}
  </ol></div>
  <div class="section"><div class="card key"><b>Aviso importante.</b> Material docente de elaboración propia, basado en los manuales de los fabricantes. Las energías, quién usa las terapias manuales, los fármacos y la vía aérea los decide <b>su dirección médica</b>. Comprueben la configuración y las opciones de sus equipos. <b>Esta web no sustituye la formación práctica ni la acreditación.</b> <a href="#/acerca">Fuentes y límites</a>.</div></div>`;
}

/* ---------- Módulo ---------- */
const TABS=[['inicio','Inicio'],['manual','Manual'],['panel','Panel interactivo'],['infografia','Infografía'],['videos','Vídeos'],['casos','Casos'],['test','Autoevaluación']];
function mod(id,tab){
  const m=MODS.find(x=>x.id===id);if(!m)return home();
  document.title=`Módulo ${m.n} · ${m.title}`;
  const tabs=TABS.filter(t=>t[0]!=='panel'||m.panel);
  if(!tabs.some(t=>t[0]===tab))tab='inicio';
  app.innerHTML=`<div class="crumbs"><a href="#/">Inicio</a> › Módulo ${m.n}</div>
   <div class="mod-n">Módulo ${m.n} · ${m.sub}</div><h1>${m.title}</h1>
   <div class="tabs" role="tablist">${tabs.map(t=>`<button role="tab" class="${t[0]===tab?'on':''}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>
   <div id="tab"></div><div class="next" id="tabnext"></div>`;
  app.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{location.hash=`#/m/${id}/${b.dataset.t}`;}));
  {const bar=app.querySelector('.tabs'),on=bar.querySelector('.on');if(on)bar.scrollLeft=on.offsetLeft-bar.offsetLeft-(bar.clientWidth-on.offsetWidth)/2;} // pestaña activa visible en el celular
  const T=document.getElementById('tab');
  ({inicio:tInicio,manual:tManual,panel:tPanel,infografia:tInfo,videos:tVideos,casos:tCasos,test:tTest}[tab])(m,T);
  // Botón "Siguiente": Inicio → Manual → Panel → Infografía → Vídeos → Casos → Autoevaluación → siguiente módulo
  const k=tabs.findIndex(t=>t[0]===tab),nt=tabs[k+1],nm=MODS[MODS.indexOf(m)+1];
  document.getElementById('tabnext').innerHTML=nt?`<a class="btn" href="#/m/${id}/${nt[0]}">Siguiente: ${nt[1]} →</a>`
    :nm?`<a class="btn" href="#/m/${nm.id}">Siguiente: módulo ${nm.n} · ${nm.title} →</a>`
    :`<a class="btn" href="#/">Plan formativo completado: volver al inicio →</a>`;
}
function tInicio(m,T){
  T.innerHTML=`<div class="card"><h3>Al terminar este módulo sabrán…</h3><ul>${m.goals.map(g=>`<li>${g}</li>`).join('')}</ul>
    <h3>Cómo seguirlo</h3><ol><li>Vean el vídeo de la sesión, aquí debajo.</li><li>Lean el <a href="#/m/${m.id}/manual">manual de bolsillo</a>.</li>${m.panel?`<li>Exploren el <a href="#/m/${m.id}/panel">panel interactivo</a>.</li>`:''}<li>Descarguen la <a href="#/m/${m.id}/infografia">infografía</a>.</li><li>Consulten los <a href="#/m/${m.id}/videos">vídeos complementarios</a>.</li><li>Hagan los <a href="#/m/${m.id}/casos">casos</a> y la <a href="#/m/${m.id}/test">autoevaluación</a>.</li></ol>
    <p class="muted">Al final de cada pestaña, el botón «Siguiente» les lleva a la próxima.</p></div>
   <div class="card" style="margin-top:14px"><h3>Vídeo de la sesión</h3>${loom(m.loom)}</div>`;
}
function loom(l){
  if(l&&l.url){const id=(l.url.match(/loom\.com\/(?:share|embed)\/([a-z0-9]+)/i)||[])[1];if(id)return `<div class="embed"><iframe src="https://www.loom.com/embed/${id}" allowfullscreen title="${esc(l.title)}"></iframe></div><p><small>${esc(l.title)}</small></p>`;return `<p><a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener">▶ ${esc(l.title)}</a></p>`;}
  return `<div class="photo">🎬 <b>${esc(l.title)}</b><br>El vídeo de Loom se publicará aquí.</div>`;
}
async function tManual(m,T){
  T.innerHTML='<p class="muted">Cargando…</p>';
  try{if(!cache[m.manual]){const r=await fetch(m.manual);if(!r.ok)throw 0;cache[m.manual]=await r.text();}
    const canPrint=/github\.io$|^localhost$/.test(location.hostname);T.innerHTML=(canPrint?`<div class="row" style="justify-content:flex-end;margin-bottom:8px"><button class="btn alt sm" onclick="window.print()">Imprimir o guardar en PDF</button></div>`:'')+cache[m.manual];
    photos(T);
  }catch(e){T.innerHTML='<p>No se pudo cargar el manual. Comprueben la conexión.</p>';}
}
function photos(T){ // si existe la foto real, sustituye el hueco
  T.querySelectorAll('[data-photo]').forEach(f=>{if(!(window.PHOTOS||[]).includes(f.dataset.photo))return;const src=`assets/img/fotos/${f.dataset.photo}.jpg`;const im=new Image();im.onload=()=>{f.className='';f.innerHTML='';f.append(im);im.alt='Foto del equipo';im.style.borderRadius='12px';};im.src=src;});
}
function tPanel(m,T){
  const P=PANELS[m.panel];
  const [bx,by,bw,bh]=P.body;
  let svg=`<svg class="panelsvg" viewBox="${P.vb}" role="group" aria-label="${esc(P.title)}"><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="28" fill="#2A3140" stroke="#11161F" stroke-width="6"/>`;
  for(const d of P.deco){if(d.t==='rect')svg+=`<rect x="${d.x}" y="${d.y}" width="${d.w}" height="${d.h}" rx="${d.r||8}" fill="${d.fill}"/>`;else svg+=`<text x="${d.x}" y="${d.y}" fill="${d.fill}" font-family="Barlow Semi Condensed,Barlow,sans-serif" font-weight="700" font-size="${d.sz||28}" text-anchor="middle">${d.s}</text>`;}
  for(const h of P.hot){
    const fill=h.fill||'#3B4558',tc=h.tc||'#FFFFFF';
    if(h.c)svg+=`<g class="hot" tabindex="0" role="button" data-id="${h.id}" aria-label="${esc(h.l)}"><circle cx="${h.x}" cy="${h.y}" r="${h.r}" fill="${fill}" stroke="#11161F" stroke-width="3"/><text x="${h.x}" y="${h.y+6}" fill="${tc}" font-family="Barlow Semi Condensed,Barlow,sans-serif" font-weight="700" font-size="${h.sz||18}" text-anchor="middle">${h.l}</text></g>`;
    else svg+=`<g class="hot" tabindex="0" role="button" data-id="${h.id}" aria-label="${esc(h.l||h.id)}"><rect x="${h.x}" y="${h.y}" width="${h.w}" height="${h.h}" rx="10" fill="${h.id==='screen'?'transparent':fill}" stroke="${h.id==='screen'?'transparent':'#11161F'}" stroke-width="2"/>${h.l?`<text x="${h.x+h.w/2}" y="${h.y+h.h/2+6}" fill="${tc}" font-family="Barlow Semi Condensed,Barlow,sans-serif" font-weight="700" font-size="${h.sz||19}" text-anchor="middle">${h.l}</text>`:''}</g>`;
  }
  svg+='</svg>';
  T.innerHTML=`<p>Toquen cualquier botón o zona del ${m.title} para ver qué hace. <small>Esquema didáctico de elaboración propia, no a escala; la disposición real puede variar según el modelo y las opciones.</small></p>
   <div class="panelwrap"><div class="card" style="padding:10px">${svg}<div class="photo" data-photo="${m.id==='lp12'?'lp12-frontal':'save-frontal'}">📷 Aquí aparecerá la foto real de su equipo cuando la añadan.</div></div>
   <div class="card info" id="pinfo" aria-live="polite"><h3>${esc(P.title)}</h3><p>Seleccionen un elemento del panel.</p></div></div>`;
  const info=document.getElementById('pinfo');
  const show=(g)=>{T.querySelectorAll('.hot').forEach(x=>x.classList.remove('sel'));g.classList.add('sel');const h=P.hot.find(x=>x.id===g.dataset.id);info.innerHTML=`<h3>${h.l||'Pantalla'}</h3><p>${h.i}</p><p class="src">Manual oficial, pág. ${h.p}</p>`;if(innerWidth<860)info.scrollIntoView({behavior:'smooth',block:'nearest'});};
  T.querySelectorAll('.hot').forEach(g=>{g.addEventListener('click',()=>show(g));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(g);}});});
  photos(T);
}
function tInfo(m,T){
  T.innerHTML=`<p>Infografía A4 de consulta rápida. Imprímanla y llévenla en la ambulancia.</p>
   <div class="row" style="margin-bottom:12px"><a class="btn" href="${m.info}.pdf" download>Descargar PDF</a><a class="btn alt" href="${m.info}.jpg" target="_blank" rel="noopener">Ver en grande</a></div>
   <div class="card" style="padding:8px"><img src="${m.info}.jpg" alt="Infografía ${esc(m.title)}" loading="lazy" style="width:100%;border-radius:8px"></div>`;
}
function tVideos(m,T){
  const list=VIDEOS[m.id]||[];
  T.innerHTML=`<div class="card" style="margin-bottom:14px"><h3>Vídeo de la sesión</h3>${loom(m.loom)}</div>
  <h3>Vídeos complementarios</h3>
  <p class="muted">Material externo de consulta. Si no hay un vídeo concreto revisado, el enlace abre una búsqueda en YouTube: elijan vídeos de fuentes fiables (fabricante, sociedades científicas) y recuerden que <b>manda su protocolo</b>.</p>
  <div class="grid g2">${list.map(v=>{let link,body='';
    if(v.yt){body=`<div class="embed"><iframe src="https://www.youtube-nocookie.com/embed/${esc(v.yt)}" allowfullscreen loading="lazy" title="${esc(v.t)}"></iframe></div>`;link='';}
    else if(v.url)link=`<a href="${esc(v.url)}" target="_blank" rel="noopener">Abrir →</a>`;
    else link=`<a href="https://www.youtube.com/results?search_query=${encodeURIComponent(v.q)}" target="_blank" rel="noopener">Buscar en YouTube →</a>`;
    return `<div class="card"><div class="vid"><div class="play">▶</div><div><b>${esc(v.t)}</b><br><small>${esc(v.fuente||(v.yt?'YouTube':'Búsqueda en YouTube'))}</small><br>${link}</div></div>${body}</div>`;}).join('')}</div>`;
}
function caseCard(c){return `<a class="card" href="#/caso/${c.id}"><div class="row" style="justify-content:space-between"><span class="pill ${c.mod==='save'?'o':''}">${c.tag}</span><small>${c.level} · ≈ ${c.min} min</small></div><h3 style="margin-top:8px">${esc(c.title)}</h3><p>${esc(c.summary)}</p><small>Equipos: ${c.devices.map(d=>d==='lp12'?'LIFEPAK 12':'SAVe II+').join(' + ')}</small></a>`;}
function tCasos(m,T){const l=CASES.filter(c=>c.mod===m.id);T.innerHTML=`<p>En los casos manejan los equipos virtuales: botones del LIFEPAK 12, del SAVe II+ y acciones sobre el paciente. Si se atascan, pulsen <b>Pista</b>.</p><div class="grid g2">${l.map(caseCard).join('')}</div>`;}
function tTest(m,T){
  const Q=QUIZ[m.id]||[];let ok=0,ans=0;
  T.innerHTML=`<p>Autoevaluación: ${Q.length} preguntas. Las respuestas no se guardan ni se envían.</p><div id="qs"></div><div class="card" id="qres" style="display:none"></div>`;
  const qs=document.getElementById('qs');
  Q.forEach((q,i)=>{const d=document.createElement('div');d.className='q card';const ord=q.o.map((_,j)=>j).sort(()=>Math.random()-.5);d.innerHTML=`<b>${i+1}. ${q.q}</b><div class="opts">${ord.map(j=>`<label data-j="${j}"><input type="radio" name="q${i}" value="${j}"> <span>${q.o[j]}</span></label>`).join('')}</div><div class="why">${q.w}</div>`;qs.append(d);
    d.querySelectorAll('input').forEach(inp=>inp.addEventListener('change',()=>{if(d.classList.contains('done'))return;d.classList.add('done');ans++;const j=+inp.value;const lab=k=>d.querySelector(`label[data-j="${k}"]`);lab(q.a).classList.add('good');if(j===q.a)ok++;else lab(j).classList.add('bad');d.querySelectorAll('input').forEach(x=>x.disabled=true);
      if(ans===Q.length){const r=document.getElementById('qres');r.style.display='block';r.innerHTML=`<div class="score">${ok} / ${Q.length}</div><p>${ok===Q.length?'¡Perfecto!':ok>=Q.length*.8?'Muy bien. Repasen las que han fallado.':'Repasen el manual y vuelvan a intentarlo.'}</p><button class="btn sm" id="again">Repetir</button>`;document.getElementById('again').onclick=()=>tTest(m,T);}}));});
}

/* ---------- Casos ---------- */
function casos(){
  document.title='Casos clínicos interactivos';
  app.innerHTML=`<h1>Casos clínicos interactivos</h1><p class="lead">Situaciones realistas de ambulancia. Toman decisiones y manejan el LIFEPAK 12 y el SAVe II+ virtuales. Son casos ficticios y el simulador está simplificado: no reproduce todo el comportamiento real de los equipos.</p>
  ${MODS.map(m=>`<div class="section"><h2>Módulo ${m.n} · ${m.title}</h2><div class="grid g2">${CASES.filter(c=>c.mod===m.id).map(caseCard).join('')}</div></div>`).join('')}`;
}
function caso(id){
  const c=CASES.find(x=>x.id===id);if(!c)return casos();
  document.title=c.title;
  const m=MODS.find(x=>x.id===c.mod);
  app.innerHTML=`<div class="crumbs"><a href="#/">Inicio</a> › <a href="#/casos">Casos</a> › ${esc(c.title)}</div><div id="simroot"></div>
   <details class="card" style="margin-top:14px"><summary><b>Cómo funciona el simulador</b></summary><ul>
   <li>Lean el caso a la izquierda. Si hay opciones, elijan una; si hay un 🎯 objetivo, cúmplanlo con los botones de los equipos y las acciones.</li>
   <li><b>Acciones</b>: lo que hacen con las manos (parches, compresiones, "¡fuera todos!", mirar el tórax…). Las que tienen ○/✔ se activan y desactivan.</li>
   <li><b>SAVe:</b> toquen un display (FR, VT, PIP o PEEP) para elegirlo y usen ▲▼. Nada se aplica sin CONFIRM.</li>
   <li>Los tiempos van acelerados: el análisis, la carga y la PNI duran unos segundos, y el botón ⏩ adelanta 2 min de RCP.</li></ul></details>`;
  simInst=SIM.create(document.getElementById('simroot'),c,{back:'#/casos'});
}

/* ---------- Acerca ---------- */
function acerca(){
  document.title='Fuentes y límites';
  app.innerHTML=`<h1>Fuentes, límites y créditos</h1><div class="manual card">
  <h3>Fuentes</h3><ul>
   <li><b>LIFEPAK 12</b> Defibrillator/Monitor Operating Instructions, Physio-Control, MIN 3207254-033 (ed. 2008-2015). Todo el material del LIFEPAK 12 se ha cotejado con esta edición.</li>
   <li><b>SAVe II+</b> Operator's Manual – Instructions for Use, M42110 Rev 5.3 (AutoMedx, 2021), a partir de un extracto documentado; ficha de producto Safeguard Medical SGM-MKT-SV2P-01 Rev 001; FDA 510(k) K131877. <b>No hemos podido conseguir el manual completo para cotejarlo</b>: comprueben la etiqueta (M50016) y el firmware de su equipo.</li>
   <li>Guías del European Resuscitation Council (ERC) para los aspectos clínicos. Comprueben la versión vigente.</li></ul>
  <h3>Límites</h3><ul>
   <li>Material docente; no sustituye a los manuales oficiales, a la práctica presencial ni a la acreditación.</li>
   <li>Las energías, la indicación de las terapias manuales, los fármacos, la sedoanalgesia y la vía aérea los decide la dirección médica.</li>
   <li>El LIFEPAK 12 es configurable: impriman su configuración y revisen la secuencia del DEA, el acceso al modo manual, SYNC AFTER SHOCK y las alarmas.</li>
   <li>Los paneles son esquemas de elaboración propia, no a escala. Los casos son ficticios y el simulador está simplificado.</li></ul>
  <h3>Autoría</h3><p>Hipólito García, médico de Urgencias y Emergencias. Versión 2 · octubre de 2026. LIFEPAK, QUIK-COMBO y CODE SUMMARY son marcas de Physio-Control/Stryker; SAVe es una marca de AutoMedx/Safeguard Medical. Esta web no está afiliada a los fabricantes.</p>
  <h3>Funciona sin conexión</h3><p>Tras la primera visita, la web queda guardada en el dispositivo y se puede consultar sin internet (salvo los vídeos). En el celular, "Añadir a pantalla de inicio".</p>
  <p class="src">Tipografía Barlow (SIL Open Font License).</p></div>`;
}

/* ---------- Sin conexión ---------- */
if('serviceWorker' in navigator&&location.protocol==='https:'){navigator.serviceWorker.register('sw.js').catch(()=>{});}
const off=document.getElementById('offline');addEventListener('offline',()=>{off.style.display='block'});addEventListener('online',()=>{off.style.display='none'});
route();
})();
