/* Comprobación automática de la web (herramienta de desarrollo: la web no la carga).
   Qué hace: juega los 9 casos de principio a fin pulsando los botones del simulador y después recorre
   las 33 rutas midiendo si hay scroll horizontal.
   Uso:
   1. Servidor local: python3 -m http.server 8765 (en la carpeta del proyecto) y abrir http://localhost:8765/#/
   2. Para el celular, poner la ventana o la emulación a 390 px de ancho.
   3. Pegar este archivo entero en la consola del navegador (o en javascript_tool). Devuelve 'lanzado'.
   4. Tarda 2-3 minutos. Consultar el resultado con: window.__walk  (mientras corre vale 'en curso';
      el progreso parcial está en window.__out).
   Si se cambian los botones del simulador o los pasos de un caso, hay que actualizar PLAY. */
window.__walk='en curso';if(document.hidden)window.requestAnimationFrame=cb=>setTimeout(()=>cb(performance.now()),16);(async()=>{
const W=ms=>new Promise(r=>setTimeout(r,ms));
const R=()=>document.getElementById('simroot');
const txt=e=>e.textContent.replace(/^[✔○]\s*/,'').trim();
const find=(sel,pred)=>[...R().querySelectorAll(sel)].find(pred);
const key=(box,k)=>R().querySelector(`${box} [data-key="${k}"]`);
async function act(a){
  if(a.w){await W(a.w);return;}
  for(let i=0;i<(a.n||1);i++){
    let el;
    if(a.lp)el=key('.dev:not(.save)',a.lp);
    if(a.sv)el=key('.dev.save',a.sv);
    if(a.a)el=find('.acc button',b=>txt(b).startsWith(a.a));
    if(!el)throw new Error('No encuentro '+JSON.stringify(a));
    el.click();await W(120);}
  await W(250);
}
const L=(lp)=>({lp}),A=(a)=>({a}),V=(sv)=>({sv}),w=(w)=>({w});
const PLAY={
 'dea-campus':[null,[L('ON'),A('Colocar parches'),L('ANALYZE'),w(5600)],[A('"¡Fuera'),L('SHOCK')],[A('Compresiones'),A('Avanzar')],[A('Compresiones'),L('ANALYZE'),w(3000)],[A('Palpar')],[A('Cable de 12'),L('12LEAD'),w(3000)],null],
 'marcapasos':[[L('ON'),A('Cable de ECG'),A('Sensor de SpO2'),A('Manguito'),L('NIBP'),w(3000)],null,[L('PACER'),L('RATE+'),{lp:'CURRENT+',n:7}],[A('Palpar'),L('NIBP'),w(3000)],[{lp:'CURRENT+',n:7}]],
 'cardioversion':[null,[L('ON'),L('SYNC'),{lp:'ENERGY-',n:4},L('CHARGE'),w(2800)],[A('"¡Fuera'),L('SHOCK'),w(1600)],[L('SYNC'),{lp:'ENERGY+',n:4},L('CHARGE'),w(2800),A('"¡Fuera'),L('SHOCK')],null],
 'save-tce':[null,[V('POWER'),V('H5-9'),V('CONFIRM')],[A('Tapar'),w(1200),A('Tapar'),w(1200)],[A('Conectar circuito'),A('Ventilar con bolsa'),A('Línea de EtCO2'),A('Mirar el tórax')],null,[A('Mirar el tórax'),A('Ventilar con bolsa'),A('Conectar circuito'),A('Aspirar'),A('Cambiar circuito'),A('Conectar circuito'),A('Ventilar con bolsa'),w(1200)],null],
 'save-asma':[null,[A('Desconectar el tubo'),A('Ventilar con bolsa')],[{sv:'rr-',n:8},V('CONFIRM'),A('Conectar circuito'),A('Ventilar con bolsa')]],
 'parada-ventilado':[[A('Compresiones'),A('Ambulancia')],[{sv:'rr-',n:8},V('CONFIRM'),V('TRIG')],[A('"¡Fuera'),L('ANALYZE'),w(5600),A('"¡Fuera'),L('SHOCK')],[A('Compresiones'),A('Avanzar')],null,[V('H5-9'),V('CONFIRM'),A('Mirar el tórax')]],
 'desconexion':[[A('Mirar el tórax'),A('Revisar tubo')],null],
 'humo':[[A('Sensor de SpO2'),A('Cable de ECG'),A('Manguito'),L('NIBP'),w(3000)],null,null],
 'nino':[null,null,null]
};
const out=[];window.__out=out;
for(const c of CASES){
  location.hash='#/caso/'+c.id;await W(700);
  let res='OK';
  try{
    for(let i=0;i<c.steps.length;i++){
      const st=c.steps[i];
      if(st.options){const good=st.options.find(o=>o.ok);const b=find('.story .choices button',x=>x.textContent===good.t);if(!b)throw new Error('opción no encontrada paso '+(i+1));b.click();await W(200);}
      else for(const a of (PLAY[c.id][i]||[]))await act(a);
      let nb;for(let k=0;k<40&&!nb;k++){nb=find('.story button.btn',b=>/Continuar|Ver resumen/.test(b.textContent));if(!nb)await W(250);}
      if(!nb)throw new Error('bloqueado en el paso '+(i+1)+': '+(R().querySelector('.fb')||{}).textContent);
      nb.click();await W(300);
    }
    const h3=R().querySelector('.story h3');res=h3?h3.textContent:'sin resumen';
  }catch(e){res='FALLO: '+e.message;}
  out.push(c.id+' → '+res);
}
const routes=['#/'];for(const m of ['lp12','save','int'])for(const t of ['inicio','manual','panel','infografia','videos','casos','test'])if(!(m==='int'&&t==='panel'))routes.push(`#/m/${m}/${t}`);routes.push('#/casos',...CASES.map(c=>'#/caso/'+c.id),'#/checklist','#/acerca');const bad=[];for(const r of routes){location.hash=r;await W(500);const sw=document.documentElement.scrollWidth,cw=document.documentElement.clientWidth;if(sw>cw)bad.push(`${r}: ${sw}>${cw}`);}
location.hash='#/';
window.__walk=out.join('\n')+'\nRutas: '+routes.length+' · ancho '+innerWidth+' · desbordes: '+(bad.join(', ')||'ninguno');
})().catch(e=>window.__walk='ERR '+e.message);'lanzado'
