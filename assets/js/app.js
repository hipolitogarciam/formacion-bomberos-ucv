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
  if(parts[0]==='checklist')return checklist();
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
    <svg class="deco" viewBox="0 0 200 100" fill="none" stroke="currentColor" stroke-width="4"><path d="M0 60h50l10-30 15 60 15-80 12 50h98"/></svg>
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
  app.innerHTML=`<div class="crumbs"><a href="#/">Inicio</a> › Módulo ${m.n}<a class="cklink" href="#/checklist">📋 Checklist de inicio de guardia</a></div>
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
  T.innerHTML=`<p>Toquen cualquier botón o zona del ${m.title} para ver qué hace. <small>Esquema didáctico de elaboración propia, no a escala, con la disposición del equipo real.${m.id==='lp12'?' Los botones con borde discontinuo dependen de las opciones del equipo.':''}</small></p>${P.acred?'<p class="pill r">Desfibrilación manual, cardioversión y marcapasos: solo personal acreditado, con orden médica y según protocolo</p>':''}
   <div class="panelwrap"><div class="card" style="padding:10px"><div class="row" style="justify-content:flex-end;margin-bottom:6px"><button class="btn alt sm" type="button" id="pzoom" aria-pressed="false">🔍 Ampliar</button></div><div class="pscroll" id="pscroll">${drawPanel(P)}</div><div class="photo" data-photo="${m.id==='lp12'?'lp12-frontal':'save-frontal'}">📷 Aquí aparecerá la foto real de su equipo cuando la añadan.</div></div>
   <div class="card info" id="pinfo" aria-live="polite"><h3>${esc(P.title)}</h3><p>Seleccionen un elemento del panel.</p></div></div>`;
  const info=document.getElementById('pinfo'),zb=document.getElementById('pzoom'),ps=document.getElementById('pscroll');
  zb.addEventListener('click',()=>{const on=ps.classList.toggle('zoom');zb.setAttribute('aria-pressed',on);zb.textContent=on?'🔍 Reducir':'🔍 Ampliar';});
  const show=(g)=>{T.querySelectorAll('.hot').forEach(x=>x.classList.remove('sel'));g.classList.add('sel');const h=P.hot.find(x=>x.id===g.dataset.id);info.innerHTML=`<h3>${esc(h.n||h.l||'')}</h3><p>${h.i}</p>${(P.acred||[]).includes(h.id)?'<p class="pill r">Solo personal acreditado, con orden médica y según protocolo</p>':''}<p class="src">${h.src?esc(h.src):'Manual oficial, pág. '+h.p}</p>`;if(innerWidth<860)info.scrollIntoView({behavior:'smooth',block:'nearest'});};
  T.querySelectorAll('.hot').forEach(g=>{g.addEventListener('click',()=>show(g));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(g);}});});
  photos(T);
}
function fitA4(a){const f=a.querySelector('iframe');if(f)f.style.transform=`scale(${a.clientWidth/794})`;}
addEventListener('resize',()=>{const a=document.getElementById('a4');if(a)fitA4(a);});
function tInfo(m,T){
  T.innerHTML=`<p>Infografía A4 de consulta rápida: ${m.panel?`el panel del ${m.title} con lo que hace cada botón`:'lo esencial del módulo en una hoja'}. Imprímanla o guárdenla en PDF y llévenla en la ambulancia.</p>
   <div class="row" style="margin-bottom:12px"><button class="btn" type="button" id="iprint">Imprimir o guardar en PDF</button><a class="btn alt" href="${m.infoHtml}" target="_blank" rel="noopener">Abrir en pantalla completa</a></div>
   <div class="card" style="padding:8px"><div class="a4" id="a4"><iframe src="${m.infoHtml}?embed" title="Infografía ${esc(m.title)}"></iframe></div></div>`;
  const a=document.getElementById('a4'),f=a.querySelector('iframe');fitA4(a);
  document.getElementById('iprint').onclick=()=>{try{f.contentWindow.print();}catch(e){open(m.infoHtml,'_blank');}};
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
   <li><b>Equipos:</b> los botones tienen la misma disposición que el equipo real. En el LIFEPAK, ENERGY SELECT, RATE y CURRENT tienen su ▼ y su ▲. En el SAVe, cada display (FR, VT, PIP y PEEP) tiene sus − + debajo, y nada se aplica sin CONFIRM.</li><li><b>Pista:</b> además del consejo, resalta con un borde naranja los botones y acciones que tocan.</li><li><b>En el celular</b>, el monitor queda fijo arriba y solo se abre el equipo que se usa en cada paso; el otro se puede abrir tocando su nombre.</li>
   <li>Los tiempos van acelerados: el análisis, la carga y la PNI duran unos segundos, y el botón ⏩ adelanta 2 min de RCP.</li></ul></details>`;
  simInst=SIM.create(document.getElementById('simroot'),c,{back:'#/casos'});
}

/* ---------- Checklist de inicio de guardia (imprimible en A4) ---------- */
const CK={
 lp12:[ // Adaptación del "Operator's Checklist", Apéndice C del manual del LIFEPAK 12 (MIN 3207254-033)
  ['1','<b>Aspecto:</b> sin suciedad ni sustancias extrañas.','Limpiar el equipo.'],
  ['','Sin golpes ni grietas.','Avisar al servicio técnico.'],
  ['2','<b>Baterías:</b> contactos (pines) sin roturas, holguras ni desgaste.','Avisar al servicio técnico.'],
  ['','Ninguna batería dañada ni con fugas.','Retirarla y desecharla o reciclarla.'],
  ['3','<b>Cable de ECG:</b> sin grietas, daños ni piezas o pines rotos o doblados.','Cambiar el cable de ECG.'],
  ['4','<b>Parches y electrodos</b> (de ECG y de terapia) dentro de fecha.','Cambiar los caducados.'],
  ['','Parches y electrodos de recambio disponibles.','Conseguir recambio.'],
  ['5','<b>Encendido:</b> con la batería puesta, desconectar de la red (si está conectado), <b>esperar al menos 2 s</b> y pulsar <kbd>ON</kbd>. Se encienden un momento los LED y salen los mensajes de autotest.','Si no aparecen: avisar al servicio técnico.'],
  ['','No sale <span class="msg">LOW BATTERY</span> ni <span class="msg">REPLACE BATTERY</span>.','Cambiar la batería en ese momento.'],
  ['','Hay <b>2 baterías cargadas</b>.','Cambiar la batería baja.'],
  ['','La luz <b>SERVICE</b> está apagada (en el equipo y en el adaptador de red).','Avisar al servicio técnico.'],
  ['6','<b>Cable de terapia QUIK-COMBO</b> (modo manual): sin grietas, daños ni pines rotos o doblados.','Cambiar el cable QUIK-COMBO.'],
  ['','Conectar el cable al equipo y a la <b>carga de prueba</b> (<i>Test Load</i>) → <b>200 J</b> → <kbd>CHARGE</kbd> → <kbd>SHOCK</kbd> → debe salir <span class="msg">ENERGY DELIVERED</span>. Al terminar, retirar la carga de prueba.','Si sale CONNECT ELECTRODES, PADDLES LEADS OFF o CONNECT CABLE, o no sale ENERGY DELIVERED: cambiar el cable y repetir. Si sigue: fuera de servicio y avisar.'],
  ['','<b>Palas rígidas</b> (solo si se usan): cable y superficie de las palas sin daños, picaduras ni gel; derivación PADDLES; 10 J en las palas → CHARGE en las palas. Con <b>un solo</b> botón de descarga no debe descargar (probar cada uno). Con los dos: <span class="msg">ABNORMAL ENERGY DELIVERED</span> (bifásico) o <span class="msg">ENERGY NOT DELIVERED</span> (monofásico). Fuera de los soportes, artefacto en pantalla; palas juntas, línea plana.','Si falla: cambiar las palas o el cable y repetir. Si sigue: fuera de servicio y avisar.'],
  ['7','<b>User Test</b> (<kbd>OPTIONS</kbd>): se imprime el resultado.','Si falla: fuera de servicio y avisar al servicio técnico.'],
  ['8','Volver a conectar a la red (si procede): cables del adaptador sin roturas ni desgaste.','Cambiar las piezas dañadas.'],
  ['','LED del adaptador de red y luz <b>Batt Chg</b> del equipo encendidos.','Avisar al servicio técnico.'],
  ['9','<b>Impresora:</b> papel suficiente.','Poner papel nuevo.'],
  ['','La impresora imprime.','Si no: avisar al servicio técnico.'],
  ['10','Apagar el equipo.','']
 ],
 save:[ // Criterio del autor, basado en el manual de bolsillo del SAVe II+
  ['<b>Batería:</b> 4 LED encendidos (más del 75 %).','Cargarlo antes de salir: solo tiene cargador de red.'],
  ['<b>Circuito</b> de recambio precintado y dentro de fecha.','Conseguir un circuito nuevo.'],
  ['<b>Filtros</b> puestos y en buen estado.','Cambiarlos.'],
  ['<b>Tubo reservorio</b> de O2.','Conseguirlo.'],
  ['<b>HMEF</b> de recambio.','Conseguirlo.'],
  ['<b>FilterLine</b> (línea de EtCO2) de recambio y en fecha, y el LIFEPAK 12 con la opción de EtCO2 funcionando.','Sin capnografía no se usa el SAVe: ventilar con bolsa.'],
  ['<b>Cargador</b> de red disponible.','Conseguirlo.']
 ],
 comun:[ // Criterio del autor
  ['<b>Bolsa-mascarilla con reservorio</b>, de adulto y pediátrica.','Reponer antes de salir: sin bolsa no se sale.'],
  ['<b>Bombona de O2</b> con presión suficiente.','Cambiar la bombona.'],
  ['<b>Caudalímetro</b>.','Conseguirlo.'],
  ['<b>Aspirador</b> funcionando.','Cargarlo o cambiarlo.']
 ]
};
function checklist(){
  document.title='Checklist de inicio de guardia';
  const row=(r,lp)=>{const [n,q,a]=lp?r:['',r[0],r[1]];return `<tr><td class="cb"><label><input type="checkbox"><span class="vh">Hecho</span></label></td>${lp?`<td class="n">${n}</td>`:''}<td>${q}</td><td class="fx">${a}</td></tr>`;};
  const tbl=(rows,lp)=>`<table class="ckt"><tr><th class="cb">✔</th>${lp?'<th class="n">Paso</th>':''}<th>Comprobar</th><th class="fx">Si falla</th></tr>${rows.map(r=>row(r,lp)).join('')}</table>`;
  app.innerHTML=`<div class="crumbs noprint"><a href="#/">Inicio</a> › Checklist de inicio de guardia</div>
  <div class="row noprint" style="justify-content:space-between;align-items:center;margin-bottom:10px"><p class="lead" style="margin:0">Para revisar los equipos al empezar la guardia. Las casillas no se guardan: impriman la hoja o guárdenla en PDF.</p><button class="btn" type="button" onclick="window.print()">Imprimir o guardar en PDF</button></div>
  <div class="cksheet">
   <h1>Checklist de inicio de guardia</h1>
   <div class="ckf"><span>Fecha: <i></i></span><span>Unidad: <i></i></span><span>Responsable: <i></i></span><span>N.º de serie del LP12: <i></i></span></div>
   <h2>LIFEPAK 12</h2>
   <p class="src">Adaptación al castellano del <i>Operator's Checklist</i> (Apéndice C) de las LIFEPAK 12 Defibrillator/Monitor Operating Instructions, Physio-Control, MIN 3207254-033. El fabricante permite reproducirlo y recomienda hacerlo a diario.</p>
   ${tbl(CK.lp12,true)}
   <div class="key red"><b>Si algo falla: equipo fuera de servicio y avisar.</b></div>
   <div class="ck2"><div><h2>SAVe II+</h2>
   <p class="src">Criterio del autor, basado en el manual de bolsillo del SAVe II+ (no hay checklist del fabricante en las fuentes disponibles).</p>
   ${tbl(CK.save,false)}</div>
   <div><h2>Material común</h2>
   <p class="src">Criterio del autor.</p>
   ${tbl(CK.comun,false)}</div></div>
   <div class="ckf obs"><span>Observaciones: <i></i></span></div>
   <p class="src">Material docente de elaboración propia (H. García). Manda el protocolo de su dirección médica.</p>
  </div>`;
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
  <h3>Autoría</h3><p>Hipólito García, médico de Urgencias y Emergencias. Versión 3 · octubre de 2026. LIFEPAK, QUIK-COMBO y CODE SUMMARY son marcas de Physio-Control/Stryker; SAVe es una marca de AutoMedx/Safeguard Medical. Esta web no está afiliada a los fabricantes.</p>
  <h3>Funciona sin conexión</h3><p>Tras la primera visita, la web queda guardada en el dispositivo y se puede consultar sin internet (salvo los vídeos). En el celular, "Añadir a pantalla de inicio".</p>
  <p class="src">Tipografía Barlow (SIL Open Font License).</p></div>`;
}

/* ---------- Sin conexión ---------- */
if('serviceWorker' in navigator&&location.protocol==='https:'){navigator.serviceWorker.register('sw.js').catch(()=>{});}
const off=document.getElementById('offline');addEventListener('offline',()=>{off.style.display='block'});addEventListener('online',()=>{off.style.display='none'});
route();
})();
