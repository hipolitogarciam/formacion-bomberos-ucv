/* Infografías A4 imprimibles: el panel SVG en el centro y una flecha desde cada botón a su cuadro.
   Los textos salen de PANELS (content.js), resumidos a sus primeras frases. */
(function(){
'use strict';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const plain=html=>{const d=document.createElement('div');d.innerHTML=html;return d.textContent.replace(/\s+/g,' ').trim();};
function short(html,min=70,max=150){ // primeras frases completas hasta ~min caracteres
  const ss=(plain(html).match(/[^.!?]+[.!?]+["»”]?|[^.!?]+$/g)||[]).map(x=>x.trim());let out='';
  for(const s of ss){if(out&&(out.length>=min||out.length+s.length>max))break;out+=(out?' ':'')+s;}
  return out;
}
const CFG={
  lp12:{
    cols:'44mm 1fr 64mm',split:.55,balance:false,len:[55,112],
    // textos propios donde el resumen automático perdería un mensaje de seguridad (mismo contenido que PANELS)
    x:{leds:'BATT CHG: batería cargándose con el adaptador de red. SERVICE: ha fallado el autotest → fuera de servicio y avisar al técnico.',
      energy:'Elige la energía en manual (hasta 360 J): ▼ baja, ▲ sube. Si cambian la energía mientras carga, la carga se elimina.',
      charge:'Carga en modo manual. Si no descargan en 60 s, la energía se elimina dentro del equipo. Al cargar, el marcapasos se para.',
      shock:'Descarga, después de "¡fuera todos!". En la cardioversión, manténganlo pulsado hasta que descargue con el siguiente QRS.',
      sync:'Cardioversión sincronizada: una marca sobre cada QRS. Si el paciente pasa a FV, apaguen SYNC y desfibrilen.',
      pacer:'Enciende o apaga el marcapasos transcutáneo. Necesita los parches y también el cable de ECG (a demanda).',
      alarms:'Activa las alarmas (QUICK SET). Con una alarma sonando, la silencia 2 min. Con el paciente inestable, no repitan QUICK SET.'},
    title:'LIFEPAK 12 · Guía rápida del panel',
    sub:'Qué hace cada botón y cada zona del frontal. Las terapias manuales (desfibrilación manual, cardioversión y marcapasos): solo personal acreditado, con orden médica y según protocolo.',
    src:'Fuente: LIFEPAK 12 Defibrillator/Monitor Operating Instructions, Physio-Control, MIN 3207254-033 (2008-2015); entre corchetes, la página.',
    groups:P=>{
      const opt=['12lead','nibp','lead','size'];
      const g=P.hot.filter(h=>!opt.includes(h.id)).map(h=>({ids:[h.id],t:h.n||h.l,x:CFG.lp12.x[h.id]||short(h.i,...CFG.lp12.len),p:h.p,src:h.src}));
      g.push({ids:opt,t:'Según las opciones del equipo',x:'No están en todos los equipos: 12-LEAD (ECG de 12 derivaciones, con el vehículo parado), NIBP (tensión; nunca en el brazo del suero), LEAD (derivación) y SIZE (tamaño del ECG).',p:'3-2, 3-3, 3-8, 3-24'});
      return g;}
  },
  save:{
    cols:'43mm 1fr 43mm',split:.5,balance:true,len:[60,130],
    x:{alarmpanel:'Paran la ventilación: DEVICE, HIGH PEEP y la batería en reserva → bolsa ya. Las demás siguen ventilando. Primero el paciente, luego el equipo.',
      pip:'Límite de presión: 10-60 cmH2O (30 de inicio, 20 en modo RCP). Si se alcanza, salta PIP REACHED. No pasar de 35; los cambios, por orden médica.',
      trigger:'Da una respiración con el VT fijado; en modo RCP es la única forma de ventilar. Con tubo, 1 cada 6 s; si PIP REACHED se repite → bolsa. Con mascarilla, lo pulsa el líder.'},
    title:'SAVe II+ · Guía rápida del panel',
    sub:'Qué hace cada botón y cada indicador. Solo adultos de 45 kg o más, con capnografía funcionando y la bolsa siempre a mano.',
    src:'Fuente: SAVe II+ Operator\'s Manual M42110 Rev 5.3 (AutoMedx, 2021), según un extracto documentado (páginas pendientes de cotejar con el manual completo).',
    groups:P=>{
      const H=P.hot,by=id=>H.find(h=>h.id===id),one=id=>{const h=by(id);return {ids:[id],t:h.n||h.l,x:CFG.save.x[id]||short(h.i,...CFG.save.len),p:h.p};};
      const pre=H.filter(h=>h.id[0]==='H').map(h=>h.id),pm=H.filter(h=>h.id.startsWith('pm-')).map(h=>h.id);
      const tab=SAVE_HEIGHTS.map(x=>`${x.ft} ${x.m}: ${x.rr}/${x.vt}`).join(' · ');
      return [one('power'),one('mute'),one('batt'),
        {ids:pre,t:'Presets de altura (pies · metros)',x:'Cargan FR y VT, unos 6 mL/kg de peso ideal. Elijan la altura y pulsen CONFIRM. FR/VT (mL): '+tab+'.',p:'14, 24'},
        one('confirm'),one('trigger'),one('adultpre'),one('userdef'),one('rr'),one('vt'),one('pip'),one('peep'),
        {ids:pm,t:'Botones − +',x:short(by(pm[0]).i,90,170),p:by(pm[0]).p},one('alarmpanel'),one('heart')];}
  }
};
// Ajuste común de las páginas A4: modo incrustado, reducción en pantallas estrechas y botón de imprimir
window.INFOG_SETUP=function(page,onResize){
  if(/embed/.test(location.search))document.body.classList.add('embed');
  const wrap=document.getElementById('wrap');
  function fit(){if(!wrap)return;const s=Math.min(1,wrap.clientWidth/page.offsetWidth);page.style.transformOrigin='0 0';page.style.transform=s<1?`scale(${s})`:'';wrap.style.height=s<1?`${page.offsetHeight*s}px`:'';}
  fit();addEventListener('resize',()=>{fit();if(onResize)onResize();});
  const pb=document.getElementById('print');if(pb)pb.onclick=()=>print();
};
window.INFOG=function(id){
  const P=PANELS[id],C=CFG[id];
  document.title=C.title;
  const page=document.getElementById('page');
  page.innerHTML=`<header><h1>${esc(C.title)}</h1><p>${esc(C.sub)}</p></header>
   <div class="stage" style="grid-template-columns:${C.cols}"><div class="col" id="cl"></div><div class="mid" id="mid">${drawPanel(P)}</div><div class="col" id="cr"></div></div>
   <footer><p>${esc(C.src)} Esquema de elaboración propia, no a escala; la disposición real puede variar según el modelo y las opciones.</p>
   <p>Material docente de elaboración propia (H. García, médico de Urgencias y Emergencias). No sustituye al manual oficial, a la formación práctica ni a la acreditación. Manda el protocolo de su dirección médica.</p></footer>
   <svg class="lines" id="lines" aria-hidden="true"></svg>`;
  const svg=page.querySelector('.panelsvg');
  const G=C.groups(P);
  // centro de cada objetivo en coordenadas de la página
  // coordenadas sin escala (la página puede estar reducida en pantallas estrechas)
  const K=()=>page.getBoundingClientRect().width/page.offsetWidth;
  const pt=idh=>{const g=svg.querySelector(`.hot[data-id="${CSS.escape(idh)}"] .hs`);const r=g.getBoundingClientRect(),pr=page.getBoundingClientRect(),k=K();return [(r.left+r.width/2-pr.left)/k,(r.top+r.height/2-pr.top)/k];};
  const mid=()=>{const r=svg.getBoundingClientRect(),pr=page.getBoundingClientRect();return (r.left+r.width*C.split-pr.left)/K();};
  // reparto izquierda/derecha según la posición del objetivo, equilibrado
  const cx=mid();
  G.forEach(g=>{const ps=g.ids.map(pt);g.y=ps.reduce((a,p)=>a+p[1],0)/ps.length;g.x0=ps.reduce((a,p)=>a+p[0],0)/ps.length;});
  let L=G.filter(g=>g.x0<cx),R=G.filter(g=>g.x0>=cx);
  if(C.balance){while(L.length>R.length+1){L.sort((a,b)=>b.x0-a.x0);R.push(L.shift());}while(R.length>L.length+1){R.sort((a,b)=>a.x0-b.x0);L.push(R.shift());}}
  const box=g=>`<div class="call" data-ids="${esc(g.ids.join(' '))}"><b>${esc(g.t)}</b> ${esc(g.x)} <small>${g.src?esc(g.src):'['+esc(g.p)+']'}</small></div>`;
  L.sort((a,b)=>a.y-b.y);R.sort((a,b)=>a.y-b.y);
  document.getElementById('cl').innerHTML=L.map(box).join('');
  document.getElementById('cr').innerHTML=R.map(box).join('');
  function lines(){
    const pr=page.getBoundingClientRect(),ln=document.getElementById('lines'),k=K();
    ln.setAttribute('viewBox',`0 0 ${page.offsetWidth} ${page.offsetHeight}`);
    let s='<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#D2401C"/></marker></defs>';
    page.querySelectorAll('.call').forEach(b=>{
      const r=b.getBoundingClientRect(),left=b.parentNode.id==='cl';
      const x0=((left?r.right:r.left)-pr.left)/k,y0=(r.top+r.height/2-pr.top)/k;
      for(const idh of b.dataset.ids.split(' ')){const [x,y]=pt(idh);s+=`<path d="M${x0} ${y0} L${x} ${y}" stroke="#D2401C" stroke-width="1" fill="none" marker-end="url(#ah)" opacity=".9"/>`;s+=`<circle cx="${x0}" cy="${y0}" r="1.8" fill="#D2401C"/>`;}
    });
    ln.innerHTML=s;
  }
  INFOG_SETUP(page,lines);lines();addEventListener('beforeprint',lines);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(lines);
};
})();
