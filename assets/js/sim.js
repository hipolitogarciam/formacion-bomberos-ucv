/* Simulador de casos: monitor ECG, LIFEPAK 12 virtual, SAVe II+ virtual y motor de casos.
   Didáctico y simplificado: no reproduce todo el comportamiento real de los equipos. */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const h=(tag,attrs={},...kids)=>{const e=document.createElement(tag);for(const k in attrs){if(k==='class')e.className=attrs[k];else if(k==='html')e.innerHTML=attrs[k];else if(k.startsWith('on'))e.addEventListener(k.slice(2),attrs[k]);else if(attrs[k]!==false&&attrs[k]!=null)e.setAttribute(k,attrs[k]);}for(const c of kids.flat()){if(c==null)continue;e.append(c.nodeType?c:document.createTextNode(c));}return e;};
const G=(t,mu,s,a)=>a*Math.exp(-((t-mu)*(t-mu))/(2*s*s));
const sig=(x)=>1/(1+Math.exp(-x));

/* ---------- ECG ---------- */
const NARROW=(t,st)=>G(t,-.16,.025,.12)+G(t,-.02,.008,-.1)+G(t,0,.012,1)+G(t,.026,.01,-.25)+G(t,.26,.05,.3)+(st?st*(sig((t-.04)*120)-sig((t-.2)*40)):0);
const WIDE=(t)=>G(t,0,.035,.85)+G(t,.07,.03,-.3)+G(t,.32,.07,-.32);
const PACED=(t,cap)=>G(t,0,.0025,1.6)+(cap?WIDE(t-.05):0);
const RH={
  sinus:{beat:true,tpl:t=>NARROW(t,0),label:'Ritmo sinusal'},
  stemi:{beat:true,tpl:t=>NARROW(t,.28),label:'Sinusal con elevación del ST'},
  af:{beat:true,irr:.28,tpl:t=>NARROW(t,0)-G(t,-.16,.025,.12),base:t=>.04*Math.sin(2*Math.PI*6.3*t)+.03*Math.sin(2*Math.PI*8.9*t),label:'Fibrilación auricular'},
  svt:{beat:true,tpl:t=>NARROW(t,0)-G(t,-.16,.025,.12),label:'Taquicardia de QRS estrecho'},
  bav3:{beat:true,tpl:t=>WIDE(t),pw:80,label:'Bradicardia extrema (BAV completo)'},
  vt:{beat:true,tpl:t=>G(t,0,.05,1)+G(t,.16,.06,-.7),label:'Taquicardia ventricular'},
  vf:{beat:false,f:t=>(.45+.2*Math.sin(t*.9))*Math.sin(2*Math.PI*5.1*t+Math.sin(t*1.7))+.25*Math.sin(2*Math.PI*3.6*t+1)+.12*Math.sin(2*Math.PI*7.7*t),label:'Fibrilación ventricular'},
  asys:{beat:false,f:t=>.02*Math.sin(2*Math.PI*.3*t)+.01*Math.sin(2*Math.PI*9*t),label:'Asistolia'},
  paced:{beat:true,tpl:t=>PACED(t,true),label:'Ritmo de marcapasos con captura'}
};
class ECG{
  constructor(cv){this.cv=cv;this.ctx=cv.getContext('2d');this.r='sinus';this.hr=75;this.t=0;this.x=0;this.beats=[];this.next=0;this.pnext=0;this.py=null;this.cpr=false;this.off=false;this.sync=false;this.pacer=null;this.resize();this._rs=()=>this.resize();addEventListener('resize',this._rs);}
  dispose(){removeEventListener('resize',this._rs);}
  resize(){const r=this.cv.getBoundingClientRect();const d=devicePixelRatio||1;this.W=Math.max(200,r.width);this.H=r.height||120;this.cv.width=this.W*d;this.cv.height=this.H*d;this.ctx.setTransform(d,0,0,d,0,0);this.ctx.fillStyle='#05080D';this.ctx.fillRect(0,0,this.W,this.H);this.x=0;this.py=null;}
  set(r,hr){this.r=r;if(hr!=null)this.hr=hr;}
  val(t){
    if(this.off) return 0;
    const R=RH[this.r]||RH.sinus;let v=0;
    if(this.pacer&&this.pacer.on&&this.pacer.mA>0){
      // espigas del marcapasos
      const per=60/this.pacer.rate;
      if(t>=this.pnext){this.beats.push({t:this.pnext,p:true,cap:this.pacer.cap});this.pnext+=per;}
      if(this.pacer.cap){for(const b of this.beats) if(b.p&&t-b.t<.8&&t>=b.t) v+=PACED(t-b.t,true);
        this.beats=this.beats.filter(b=>t-b.t<1.2);return v+(this.cpr?this.cprA(t):0);}
      for(const b of this.beats) if(b.p&&t-b.t<.05&&t>=b.t) v+=PACED(t-b.t,false);
    } else this.pnext=t;
    if(R.beat&&!R.paced){
      if(t>=this.next){const per=60/Math.max(10,this.hr)*(R.irr?(1-R.irr/2+Math.random()*R.irr):1);this.beats.push({t:this.next+.2});this.next+=per;}
      for(const b of this.beats) if(!b.p){const d=t-b.t;if(d>-.3&&d<.7) v+=R.tpl(d);}
      if(R.pw){const pp=60/R.pw;const ph=((t%pp)+pp)%pp;v+=G(ph,.1,.025,.13);} // ondas P disociadas
      if(R.base) v+=R.base(t);
      this.beats=this.beats.filter(b=>t-b.t<1.2);
    } else if(!R.beat){ v+=R.f(t); this.beats=this.beats.filter(b=>t-b.t<1.2);}
    if(this.cpr) v+=this.cprA(t);
    return v;
  }
  cprA(t){return .9*Math.pow(Math.abs(Math.sin(Math.PI*1.85*t)),3)-.3}
  step(dt){
    const ctx=this.ctx,W=this.W,H=this.H,pxs=W/4.2; // ~4 s por pantalla
    let nx=this.x+dt*pxs;const y0=H*.58,sc=H*.36;
    ctx.lineWidth=2;ctx.strokeStyle='#49F27A';
    const n=Math.max(1,Math.ceil((nx-this.x)));
    for(let i=1;i<=n;i++){
      const xx=this.x+(nx-this.x)*i/n;const tt=this.t+dt*i/n;
      let px=xx%W;
      if(this.py==null||px<this.px){ctx.fillStyle='#05080D';ctx.fillRect(px,0,14,H);this.py=null;}
      ctx.fillStyle='#05080D';ctx.fillRect(px+1,0,12,H);
      const v=this.val(tt);const y=y0-v*sc;
      if(this.py!=null){ctx.beginPath();ctx.moveTo(this.px,this.py);ctx.lineTo(px,y);ctx.stroke();}
      // marcas de sincronía sobre el QRS
      if(this.sync&&!this.off){for(const b of this.beats){if(!b.p&&!b.mk&&tt>=b.t){b.mk=1;if(RH[this.r].beat){ctx.fillStyle='#FFFFFF';ctx.beginPath();ctx.moveTo(px,y0-sc*1.25);ctx.lineTo(px-5,y0-sc*1.25-8);ctx.lineTo(px+5,y0-sc*1.25-8);ctx.fill();}}}}
      this.px=px;this.py=y;
    }
    this.x=nx%W;this.t+=dt;
  }
}

/* ---------- Utilidades ---------- */
const ENERGIES=[2,3,4,5,6,7,8,9,10,15,20,30,50,70,100,125,150,175,200,225,250,275,300,325,360];
const HEIGHTS=window.SAVE_HEIGHTS; // etiquetas del propio equipo (pies y metros), en content.js
const ACC={
  pads:{l:'Colocar parches QUIK-COMBO',t:true},
  ecg:{l:'Cable de ECG (3/5 hilos)',t:true},
  ecg12:{l:'Cable de 12 derivaciones',t:true},
  spo2:{l:'Sensor de SpO2',t:true},
  cuff:{l:'Manguito de PNI',t:true},
  co2:{l:'Línea de EtCO2 (FilterLine)',t:true},
  cpr:{l:'Compresiones torácicas',t:true},
  clear:{l:'📢 "¡Fuera todos!"'},
  moving:{l:'Ambulancia en marcha',t:true},
  pulse:{l:'Palpar el pulso'},
  chest:{l:'Mirar el tórax'},
  tube:{l:'Revisar tubo y circuito'},
  bvm:{l:'Ventilar con bolsa',t:true},
  o2:{l:'O2 con mascarilla reservorio',t:true},
  saveConn:{l:'Conectar circuito del SAVe al paciente',t:true},
  occlude:{l:'Tapar la salida del circuito (prueba)',t:true},
  disc:{l:'Desconectar el tubo unos segundos'},
  suction:{l:'Aspirar secreciones'},
  newcirc:{l:'Cambiar circuito / HMEF'},
  o2save:{l:'O2 al reservorio del SAVe',t:true},
  airway:{l:'Retirar tubo desplazado y ventilar con bolsa-mascarilla'},
  adv2:{l:'⏩ Avanzar 2 min de RCP'}
};

/* ---------- Motor ---------- */
function create(root,CASE,opts={}){
  root.innerHTML='';
  const S={pt:Object.assign({rhythm:'sinus',hr:80,pulse:true,spo2:97,etco2:36,sbp:120,dbp:75,breathing:true,coHb:false,capAt:999,findings:{}},CASE.start.pt||{}),
    acc:Object.assign({},CASE.start.acc||{}),
    lp:Object.assign({on:false,mode:'MANUAL',energy:200,charged:false,charging:false,sync:false,pacer:false,rate:70,mA:0,shocks:0,msg:'',over:null,nibp:null,lead:'II',alarms:false,cprUntil:0,clearAt:-99,printed:[]},CASE.start.lp||{}),
    sv:Object.assign({on:false,preset:null,rr:0,vt:0,pip:30,peep:0,pend:null,pendUser:false,userDef:false,alarms:new Set(),muted:0,batt:4,showMeas:0,running:false,lastBreath:0,trig:0},CASE.start.sv||{}),
    t:0,errors:0,step:0,ended:false,f:{},hl:new Set()};
  let timers=[];const later=(ms,fn)=>{const id=setTimeout(fn,ms);timers.push(id);return id;};
  const steps=CASE.steps;const devs=CASE.devices||['lp12'];
  // --- estructura
  const story=h('div',{class:'story'});
  const mon=h('div',{class:'mon',role:'region','aria-label':'Monitor del LIFEPAK 12'});
  const cv=h('canvas');const vit=h('div',{class:'vit'});const status=h('div',{class:'status'});
  mon.append(h('div',{class:'scr'},cv,vit),status);
  const lpBox=h('div',{class:'dev'});const svBox=h('div',{class:'dev save'});
  const accBox=h('div',{class:'acc'});const log=h('div',{class:'log','aria-live':'polite'});
  const prog=h('div',{class:'prog'},h('i',{style:'width:0%'}));
  const right=h('div',{class:'sim'},mon);
  // cada equipo en un bloque plegable: en el celular solo se abre el que se usa en el paso
  const W={lp12:h('details',{class:'devw',open:''},h('summary',{},'LIFEPAK 12 (virtual)',h('small',{},'esquema simplificado')),lpBox),
    save:h('details',{class:'devw',open:''},h('summary',{},'SAVe II+ (virtual)',h('small',{},'esquema simplificado')),svBox)};
  for(const d of devs)if(W[d])right.append(W[d]);
  const mobile=()=>matchMedia('(max-width:900px)').matches;
  let curDev=devs[0];
  function showDev(d){if(!d||!W[d])return;curDev=d;if(devs.length<2)return;for(const k of devs)W[k].open=mobile()?k===d:true;}
  root.append(h('div',{class:'sim'},prog,h('div',{class:'simtop'},h('div',{class:'sim'},story,accBox,h('div',{class:'logw'},h('b',{},'Registro'),log)),right)));
  const ecg=new ECG(cv);
  const L=(m)=>{const d=h('div',{},`${fmt(S.t)} · ${m}`);log.prepend(d);};
  const fmt=(t)=>{t=Math.floor(t);return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`};
  const ctx={S,log:L,after:later,fb:(type,msg)=>feedback(type,msg),setPt:(o)=>{Object.assign(S.pt,o);sync();},
    savAlarm:(a,on=true)=>{on?S.sv.alarms.add(a):S.sv.alarms.delete(a);if(on)L('SAVe: alarma '+a);drawSV();}};

  /* ---------- Monitor ---------- */
  function sync(){
    ecg.off=!(S.acc.pads||S.acc.ecg||S.acc.ecg12)||!S.lp.on;
    ecg.set(S.pt.rhythm,S.pt.hr);ecg.cpr=!!S.acc.cpr;ecg.sync=S.lp.sync&&S.lp.on;
    const cap=S.lp.pacer&&S.lp.mA>=S.pt.capAt;
    ecg.pacer=S.lp.pacer?{on:true,rate:S.lp.rate,mA:S.lp.mA,cap}:null;
    drawVit();drawLP();
  }
  function drawVit(){
    const on=S.lp.on;const p=S.pt;let hr='---';
    if(on&&!ecg.off){if(S.lp.pacer&&S.lp.mA>=p.capAt)hr=S.lp.rate;else if(p.rhythm==='vf')hr='---';else if(p.rhythm==='asys')hr='0';else hr=p.hr;}
    const sp=on&&S.acc.spo2?(p.pulse?(p.spo2+''):'---'):'---';
    const co=on&&S.acc.co2?(p.etco2!=null?p.etco2:'---'):'---';
    const bp=on&&S.lp.nibp?S.lp.nibp:'---/---';
    vit.innerHTML=`<div class="v hr"><small>FC</small><b>${hr}</b></div><div class="v sp"><small>SpO2 %</small><b>${sp}</b></div><div class="v co"><small>EtCO2 mmHg</small><b>${co}</b></div><div class="v bp"><small>PNI</small><b>${bp}</b></div>`;
    let left='',right='';
    if(!on){left='<span class="e">— apagado —</span>';}
    else{left=S.lp.over||S.lp.msg||'';right=`${S.lp.mode==='AED'?'DEA':'MANUAL'} · ${S.lp.energy} J${S.lp.sync?' · SYNC':''}${S.lp.pacer?` · MP ${S.lp.rate} ppm ${S.lp.mA} mA`:''}`;if(ecg.off&&on&&!S.lp.msg)left='<span class="alarm">CONNECT ELECTRODES / LEADS OFF</span>';}
    status.innerHTML=`<span>${left}</span><span class="e">${right}</span>`;
  }

  /* ---------- LIFEPAK 12 (misma disposición y colores que el panel) ---------- */
  const PK=(key,label,cls)=>h('button',{class:'pk '+(cls||''),type:'button','data-key':key,onclick:()=>lpKey(key)},label);
  const ARR=(base,label)=>h('div',{class:'pk arr'},h('button',{type:'button','data-key':base+'-','aria-label':label+': bajar',onclick:()=>lpKey(base+'-')},'▼'),h('span',{},label),h('button',{type:'button','data-key':base+'+','aria-label':label+': subir',onclick:()=>lpKey(base+'+')},'▲'));
  function drawLP(){
    if(!devs.includes('lp12'))return;
    const lp=S.lp,lit={ON:lp.on,SYNC:lp.on&&lp.sync,PACER:lp.on&&lp.pacer,ANALYZE:lp.on&&lp.mode==='AED',ALARMS:lp.on&&lp.alarms,SHOCK:lp.on&&lp.charged};
    const k=(key,label,cls)=>{const b=PK(key,label,cls);if(lit[key])b.classList.add('lit');return b;};
    const nb=(n,el)=>h('div',{class:'nb'},h('span',{class:'num','aria-hidden':'true'},n),el);
    lpBox.innerHTML='';
    lpBox.append(h('div',{class:'lpbody'},
      h('div',{class:'lpc'},
        h('div',{class:'lpleds'},h('span',{},h('i'),'Batt Chg'),h('span',{},h('i'),'Service')),
        nb('1',k('ON','ON','g led')),
        h('div',{class:'z blue'},k('ADVISORY','ADVISORY','led'),k('ANALYZE','ANALYZE','y led'),h('span',{class:'arrow','aria-hidden':'true'},'➜')),
        h('div',{class:'z grey'},nb('2',ARR('ENERGY','ENERGY SELECT')),nb('3',k('CHARGE','CHARGE','y')),k('SHOCK','SHOCK','r led')),
        h('div'),k('SYNC','SYNC','led'),
        h('div',{class:'z plain'},k('ALARMS','ALARMS','y led'),k('OPTIONS','OPTIONS'),k('EVENT','EVENT'),k('HOME','⌂ Home Screen','home')),
        h('div',{class:'z green'},k('PACER','PACER','led'),ARR('RATE','RATE'),ARR('CURRENT','CURRENT'),k('PAUSE','PAUSE')),
        h('div'),k('SELP','◉ SELECTOR · retirar carga','sel')),
      h('div',{class:'lprow'},h('span',{},'Registro (a la izquierda de la pantalla)'),k('CODE','CODE SUMMARY'),k('PRINT','PRINT')),
      h('div',{class:'lprow opt'},h('span',{},'Según las opciones del equipo'),k('12LEAD','12-LEAD'),k('NIBP','NIBP'),k('LEAD','LEAD'))));
    applyHL();
  }
  let chargeT=null,disarmT=null;
  function emit(ev){ // pasa el evento al paso actual del caso
    const st=steps[S.step];if(!st||S.ended)return;
    if(st.react){const r=st.react(ev,S,ctx);if(r)feedback(r[0],r[1]);}
    checkGoal();
  }
  function disarm(msg){const lp=S.lp;lp.charged=false;lp.charging=false;clearTimeout(chargeT);clearTimeout(disarmT);L(msg);}
  function lpKey(k){
    const lp=S.lp,p=S.pt;S.hl.delete('lp:'+k);
    if(k!=='ON'&&!lp.on){feedback('tip','El LIFEPAK está apagado: pulsen ON.');applyHL();return;}
    switch(k){
      case 'ON': lp.on=!lp.on;if(lp.on){lp.mode='MANUAL';lp.msg='';L('LP12 encendido (modo manual, derivación II)');}else{clearTimeout(chargeT);clearTimeout(disarmT);Object.assign(lp,{charged:false,charging:false,sync:false,pacer:false,mA:0,mode:'MANUAL',over:null,msg:''});L('LP12 apagado');}break;
      case 'ANALYZE':
        if(!S.acc.pads){lp.msg='<span class="alarm">CONNECT ELECTRODES</span>';L('ANALYZE sin parches');break;}
        lp.mode='AED';lp.charged=false;lp.over=null;
        if(S.acc.moving||S.acc.cpr){lp.msg='<span class="alarm">MOTION DETECTED! STOP MOTION!</span>';L('Análisis interrumpido por movimiento');emit({type:'analysis',result:'motion'});break;}
        lp.msg='ANALYZING NOW – STAND CLEAR';L('Analizando…');sync();
        later(2600,()=>{if(S.acc.moving||S.acc.cpr){lp.msg='<span class="alarm">MOTION DETECTED! STOP MOTION!</span>';L('Movimiento durante el análisis');emit({type:'analysis',result:'motion'});sync();return;}
          const shockable=(p.rhythm==='vf'||(p.rhythm==='vt'&&!p.pulse));
          if(shockable){lp.msg='SHOCK ADVISED – CHARGING';L('SHOCK ADVISED: cargando');emit({type:'analysis',result:'shock'});lp.energy=lp.aedEnergy||200;sync();
            later(2500,()=>{lp.charged=true;lp.msg='<span class="alarm">STAND CLEAR – PUSH SHOCK BUTTON</span>';L(`Cargado a ${lp.energy} J`);sync();armDisarm();});}
          else{lp.msg='NO SHOCK ADVISED → START CPR';L('NO SHOCK ADVISED');emit({type:'analysis',result:'noshock'});}
          sync();});
        break;
      case 'ENERGY+': case 'ENERGY-':{
        if(lp.mode==='AED'){lp.mode='MANUAL';L('Paso a modo manual');}
        if(lp.charged||lp.charging)disarm('Energía cambiada durante la carga: carga eliminada, hay que volver a cargar');
        const i=ENERGIES.indexOf(lp.energy),d=k==='ENERGY+'?1:-1;lp.energy=ENERGIES[Math.min(ENERGIES.length-1,Math.max(0,i+d))];lp.msg=`ENERGY SELECT / ${lp.energy} J`;break;}
      case 'SELP': if(lp.charged||lp.charging){disarm('Carga retirada con el SELECTOR');lp.msg='DISARMING…';}else lp.msg='SELECTOR: no hay carga que retirar';break;
      case 'CHARGE':
        if(!S.acc.pads){lp.msg='<span class="alarm">CONNECT ELECTRODES</span>';break;}
        if(lp.mode==='AED'){lp.mode='MANUAL';L('Paso a modo manual');}
        if(lp.pacer){lp.pacer=false;lp.mA=0;L('Al cargar, el marcapasos se detiene');}
        lp.charging=true;lp.charged=false;lp.msg=`CHARGING ${lp.energy} J…`;L(`Cargando a ${lp.energy} J`);
        clearTimeout(chargeT);chargeT=later(2200,()=>{lp.charging=false;lp.charged=true;lp.msg=`<span class="alarm">${lp.energy} J AVAILABLE – STAND CLEAR</span>`;L(`${lp.energy} J disponibles`);armDisarm();sync();emit({type:'charged'});});
        break;
      case 'SHOCK':
        if(!lp.charged){lp.msg='Equipo no cargado';break;}
        if(S.acc.cpr){feedback('no','¡Hay alguien haciendo compresiones! Ordenen parar y digan "¡fuera todos!" antes de descargar. (El simulador bloquea esta descarga.)');return;}
        if(S.t-lp.clearAt>20){feedback('tip','Antes de descargar, avisen en voz alta: "¡fuera todos!" (botón de acciones). Descarga realizada, pero acostúmbrense a hacerlo.');}
        if(lp.sync&&!RH[p.rhythm].beat){feedback('no','En SYNC no descargará: no hay QRS que sincronizar. En FV, apaguen SYNC y desfibrilen.');return;}
        clearTimeout(disarmT);lp.charged=false;lp.shocks++;lp.msg='ENERGY DELIVERED';L(`DESCARGA ${lp.shocks}: ${lp.energy} J${lp.sync?' sincronizada':''}`);
        {const ev={type:'shock',energy:lp.energy,sync:lp.sync,mode:lp.mode};emit(ev);}
        if(lp.mode==='AED')later(1500,()=>{lp.msg='START CPR';L('START CPR');sync();});
        break;
      case 'SYNC': lp.sync=!lp.sync;if(lp.mode==='AED')lp.mode='MANUAL';lp.msg=lp.sync?'SYNC ON':'SYNC OFF';L(lp.msg);break;
      case 'ADVISORY': lp.msg='ADVISORY: vigilancia del ritmo (no simulada en estos casos)';L('ADVISORY pulsado (no simulado)');break;
      case 'PACER':
        if(!lp.pacer&&!S.acc.pads){lp.msg='<span class="alarm">CONNECT ELECTRODES</span>';break;}
        lp.pacer=!lp.pacer;if(!lp.pacer)lp.mA=0;lp.mode='MANUAL';
        if(lp.pacer&&!(S.acc.ecg||S.acc.ecg12)){lp.msg='<span class="alarm">PACER ON – NON-DEMAND (ECG LEADS OFF)</span>';feedback('tip','Sin el cable de ECG estimula a frecuencia fija, a ciegas, sin tener en cuenta el ritmo propio. Para el marcapasos a demanda, coloquen también el cable de ECG.');L('PACER sin ECG: frecuencia fija (no demanda)');}
        else{lp.msg=lp.pacer?'PACER ON – DEMAND':'PACER OFF';L(lp.msg);}break;
      case 'RATE+': case 'RATE-': if(!lp.pacer){lp.msg='Pulsen PACER primero';break;}lp.rate=Math.min(170,Math.max(40,lp.rate+(k==='RATE+'?10:-10)));lp.msg=`PACER RATE ${lp.rate} ppm`;L(lp.msg);break;
      case 'CURRENT+': case 'CURRENT-': if(!lp.pacer){lp.msg='Pulsen PACER primero';break;}setmA(lp.mA+(k==='CURRENT+'?10:-10));break;
      case 'PAUSE': if(lp.pacer){lp.msg='PAUSED (25 % de la frecuencia)';L('PAUSE: se ve el ritmo propio');}break;
      case 'NIBP':
        if(!S.acc.cuff){lp.msg='<span class="alarm">NIBP CHECK CUFF</span>';break;}
        lp.msg='NIBP midiendo…';L('PNI en curso (~40 s reales)');later(2500,()=>{lp.nibp=p.pulse?`${p.sbp}/${p.dbp}`:'---/---';lp.msg=p.pulse?'':'<span class="alarm">NIBP WEAK PULSE</span>';L('PNI: '+lp.nibp);sync();emit({type:'nibp'});});break;
      case 'ALARMS': lp.alarms=true;lp.msg='ALARMS: QUICK SET activado';L('Alarmas activadas (QUICK SET)');break;
      case 'OPTIONS': lp.msg='OPTIONS: menú de opciones (no simulado)';break;
      case 'EVENT': lp.msg='EVENT registrado';L('EVENT registrado');break;
      case 'HOME': lp.msg='';lp.over=null;break;
      case 'LEAD': lp.lead=lp.lead==='II'?'III':lp.lead==='III'?'PADDLES':'II';lp.msg='Derivación '+lp.lead;break;
      case '12LEAD':
        if(!S.acc.ecg12){lp.msg='<span class="alarm">CONNECT CHEST LEADS</span>';feedback('tip','Para el 12 derivaciones hay que colocar el cable de 12 derivaciones (V1-V6 y miembros).');break;}
        if(S.acc.moving){lp.msg='<span class="alarm">NOISY DATA! PRESS 12-LEAD TO ACCEPT</span>';feedback('tip','Con la ambulancia en marcha hay ruido: paren el vehículo para adquirir el 12 derivaciones.');L('12D con ruido (vehículo en marcha)');emit({type:'12lead',ok:false});break;}
        lp.msg='ACQUIRING 12-LEAD…';L('Adquiriendo 12 derivaciones');later(2500,()=>{const res=p.rhythm==='stemi'?'***ACUTE MI SUSPECTED*** (ST ↑ II, III, aVF)':'Sin criterios de IAM';lp.msg='12-LEAD: '+res;lp.printed.push('12D');L('12D impreso: '+res);sync();emit({type:'12lead',ok:true,res});});break;
      case 'CODE': lp.printed.push('CODE');lp.msg='Imprimiendo CODE SUMMARY';L('CODE SUMMARY impreso');emit({type:'code'});break;
      case 'PRINT': lp.msg='Imprimiendo ECG';L('Tira de ECG impresa');break;
    }
    sync();emit({type:'key',dev:'lp',key:k});
  }
  function setmA(v){const lp=S.lp;if(!S.acc.pads){lp.msg='<span class="alarm">CONNECT CABLE</span>';return;}lp.mA=Math.min(200,Math.max(0,v));lp.msg=`PACER CURRENT ${lp.mA} mA`;const cap=lp.mA>=S.pt.capAt;L(`Corriente ${lp.mA} mA${cap?' → captura eléctrica':''}`);if(cap&&!S._cap){S._cap=1;emit({type:'capture'});}}
  function armDisarm(){clearTimeout(disarmT);disarmT=later(60000,()=>{if(S.lp.charged){S.lp.charged=false;S.lp.msg='DISARMING…';L('60 s sin descargar: energía retirada');sync();}});}

  /* ---------- SAVe II+ (misma disposición que el panel: presets en óvalo, − + bajo cada display) ---------- */
  const ICO={POWER:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 6.5a7.5 7.5 0 1 0 10 0" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><line x1="12" y1="3" x2="12" y2="11" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    MUTE:'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor"/><path d="M15 9l6 6M21 9l-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>'};
  const OVAL={'4-3':'4/2','4-6':'3/1','4-9':'2/1','5-0':'1/2','5-3':'1/3','5-6':'1/4','5-9':'2/5','6-0':'3/5','6-3':'4/4'};
  function drawSV(){
    if(!devs.includes('save'))return;
    const sv=S.sv;svBox.innerHTML='';
    const al=['DEVICE','DISCONNECT','PIP REACHED','BATTERY','HIGH PEEP','LOW PEEP','HIGH MV','BREATH','BREATH ASSIST'];
    const show=(k)=>{if(!sv.on)return '';if(sv.showMeas&&(k==='rr'||k==='vt'))return '';const v=(sv.pend&&k in sv.pend)?sv.pend[k]:sv[k];if(sv.showMeas&&k==='pip')return sv.measPip;if(sv.showMeas&&k==='peep')return sv.measPeep;return v;};
    const sk=(key,label,cls,attrs={})=>h('button',Object.assign({class:'sk '+(cls||''),type:'button','data-key':key,onclick:()=>svKey(key)},attrs),label);
    const oval=h('div',{class:'oval'});
    for(const x of HEIGHTS){const b=sk('H'+x.id,x.ft,'pre'+(sv.on&&sv.preset===x.id?' lit':''),{'aria-label':'Preset '+heightLabel(x)});b.append(h('small',{},x.m));b.style.gridArea=OVAL[x.id];oval.append(b);}
    const cf=sk('CONFIRM','CONFIRM','cf'+(sv.pend?' fl':''));cf.style.gridArea='2/2/4/5';oval.append(cf);
    const batt=h('div',{class:'svbatt','aria-label':'Batería'});for(let i=3;i>=0;i--)batt.append(h('i',{class:i<sv.batt&&sv.on?'f':''}));batt.append(h('b',{'aria-hidden':'true'},'ϟ'));
    const disp=(k,lab)=>h('div',{class:'svd'},h('small',{},lab),h('b',{class:sv.pend&&k in sv.pend?'fl':''},String(show(k))),h('div',{class:'pm'},sk(k+'-','−','',{'aria-label':lab+': bajar'}),sk(k+'+','+','',{'aria-label':lab+': subir'})));
    svBox.append(h('div',{class:'svc'},
      h('div',{class:'svtop'},sk('POWER','','ico',{html:ICO.POWER,'aria-label':'POWER'}),h('b',{},'SAVe II+'),sk('MUTE','','ico',{html:ICO.MUTE,'aria-label':'MUTE'})),
      h('div',{class:'svmid'},batt,oval),
      h('div',{class:'svind'},h('span',{class:sv.on&&sv.running&&sv.preset&&!sv.userDef?'on':''},h('i'),'ADULT PRESETS'),h('span',{class:sv.on&&sv.userDef?'on':''},h('i'),'USER DEFINED'),sk('TRIG','MANUAL TRIGGER','trig')),
      h('div',{class:'svdisp'},disp('rr','FR (rpm)'),disp('vt','VT (mL)'),disp('pip',sv.showMeas?'PIP medida':'PIP'),disp('peep',sv.showMeas?'PEEP medida':'PEEP'))),
      h('div',{class:'alarms','aria-label':'Alarmas del SAVe'},...al.map(a=>h('span',{class:sv.alarms.has(a)&&sv.on?'a':''},a)),sv.on&&sv.running&&sv.rr===0?h('span',{class:'a heart'},'♥ 100/min'):null));
    applyHL();
  }
  function svKey(k){
    const sv=S.sv;S.hl.delete('sv:'+k);
    if(k!=='POWER'&&!sv.on){feedback('tip','El SAVe está apagado: pulsen POWER.');applyHL();return;}
    if(k==='POWER'){if(!sv.on){sv.on=true;sv.preset=null;sv.rr=0;sv.vt=0;sv.pip=30;sv.peep=0;sv.running=false;sv.userDef=false;sv.alarms.clear();L('SAVe encendido: elijan la altura y CONFIRM');}else{sv.on=false;sv.running=false;L('SAVe apagado (POWER 3 s)');}}
    else if(k[0]==='H'){const x=HEIGHTS.find(y=>y.id===k.slice(1));sv.preset=x.id;sv.pend={rr:x.rr,vt:x.vt,pip:30,peep:0};sv.pendUser=false;L(`Preset ${heightLabel(x)}: FR ${x.rr}, VT ${x.vt} (pendiente de CONFIRM)`);}
    else if(/^(rr|vt|pip|peep)[+-]$/.test(k)){const p=k.slice(0,-1),d=k.endsWith('+')?1:-1;const base=Object.assign({rr:sv.rr,vt:sv.vt,pip:sv.pip,peep:sv.peep},sv.pend||{});
      const lim={rr:[8,30],vt:[200,800],pip:[10,60],peep:[0,20]},st={rr:1,vt:10,pip:5,peep:1};let v=base[p]+d*st[p];
      if(p==='rr'&&base.rr===0)v=d>0?8:0;else if(p==='rr'&&base.rr===8&&d<0)v=0;else v=Math.min(lim[p][1],Math.max(lim[p][0],v));
      base[p]=v;if(base.rr===0){base.pip=20;base.peep=0;}sv.pend=base;sv.pendUser=true;
      if(base.rr*base.vt>12500){sv.alarms.add('HIGH MV');}else sv.alarms.delete('HIGH MV');}
    else if(k==='CONFIRM'){
      if(sv.pend){if(sv.pend.rr*sv.pend.vt>12500){feedback('tip','HIGH MV: la combinación supera unos 12,5 L/min y no se acepta. Ajusten primero el parámetro que van a bajar.');return;}
        Object.assign(sv,sv.pend);sv.pend=null;sv.userDef=!!sv.pendUser;sv.running=true;sv.lastBreath=S.t;if(sv.rr>0)sv.alarms.delete('BREATH');L(sv.rr===0?'SAVe en MODO RCP (FR 0): solo ventila con MANUAL TRIGGER':`SAVe ventilando: FR ${sv.rr}, VT ${sv.vt}, PIP ${sv.pip}, PEEP ${sv.peep}`);sv.cprBlink=sv.rr===0;emit({type:'save',what:'confirm'});}
      else{measure();sv.showMeas=1;L(`CONFIRM sin cambios: PIP medida ${sv.measPip}, PEEP medida ${sv.measPeep}`);later(3000,()=>{sv.showMeas=0;drawSV();});emit({type:'save',what:'measure'});}
    }
    else if(k==='TRIG'){if(!sv.running){feedback('tip','Primero confirmen unos ajustes (altura o FR 0).');return;}sv.trig++;sv.lastBreath=S.t;sv.alarms.delete('BREATH');L('MANUAL TRIGGER: 1 respiración');emit({type:'trigger'});}
    else if(k==='MUTE'){sv.muted=S.t+120;L('SAVe silenciado 120 s');}
    drawSV();emit({type:'key',dev:'sv',key:k});
  }
  function measure(){const sv=S.sv,p=S.pt;let pip=Math.round((p.pipBase||16)*(sv.vt||400)/420);if(p.obstruct)pip=sv.pip;sv.measPip=Math.min(pip,sv.pip);sv.measPeep=p.trap?sv.peep+7:sv.peep;}
  function svTick(){ // alarmas derivadas del estado
    const sv=S.sv,p=S.pt;if(!sv.on||!sv.running)return;
    if(sv.rr>0){
      if(S.acc.occlude){sv.alarms.add('PIP REACHED');sv.alarms.delete('DISCONNECT');}
      else{
        if(!S.acc.saveConn||p.leak)sv.alarms.add('DISCONNECT');else sv.alarms.delete('DISCONNECT');
        if(S.acc.saveConn&&p.obstruct)sv.alarms.add('PIP REACHED');else sv.alarms.delete('PIP REACHED');
      }
      if(S.acc.saveConn&&p.trap)sv.alarms.add('HIGH PEEP');else if(!p.trap)sv.alarms.delete('HIGH PEEP');
    } else {
      if(S.t-sv.lastBreath>30&&!sv.alarms.has('BREATH')){sv.alarms.add('BREATH');L('SAVe: alarma BREATH (30 s sin respiración)');}
    }
  }

  /* ---------- Acciones ---------- */
  function drawAcc(){
    accBox.innerHTML='';const list=CASE.acc||[];
    const keys=h('div',{class:'keys'});
    for(const id of list){const a=ACC[id];if(!a)continue;if(id==='adv2'&&!S.acc.cpr)continue;
      const b=h('button',{class:'k'+(a.t&&S.acc[id]?' lit':''),type:'button','data-key':id,onclick:()=>accAct(id)},(a.t?(S.acc[id]?'✔ ':'○ '):'')+a.l);keys.append(b);}
    accBox.append(h('b',{},'Acciones sobre el paciente y el material'),keys);
    applyHL();
  }
  /* Pista: resalta los botones o acciones que tocan en el paso */
  function applyHL(){
    for(const [box,pre] of [[lpBox,'lp:'],[svBox,'sv:'],[accBox,'acc:']])
      box.querySelectorAll('[data-key]').forEach(b=>b.classList.toggle('hl',S.hl.has(pre+b.dataset.key)));
  }
  function accAct(id){
    const a=ACC[id];S.hl.delete('acc:'+id);
    if(a.t){S.acc[id]=!S.acc[id];L((S.acc[id]?'✔ ':'✖ ')+a.l);
      if(id==='cpr'&&S.acc.cpr&&S.lp.charged&&S.lp.mode==='MANUAL'){}
      if(id==='moving'&&!S.acc.moving)L('Vehículo detenido');}
    else{
      if(id==='clear'){S.lp.clearAt=S.t;S.acc.cpr=false;L('"¡Fuera todos!": nadie toca al paciente');}
      if(id==='pulse'){const r=S.pt.pulse?(S.pt.pulseText||`Pulso presente (${S.lp.pacer&&S.lp.mA>=S.pt.capAt?S.lp.rate:S.pt.hr} lpm)`):'Sin pulso';if(S.acc.cpr)feedback('tip','Para palpar el pulso hay que parar las compresiones: háganlo solo en la pausa del análisis.');L('Pulso: '+r);feedback('tip','Pulso: '+r);}
      if(id==='chest'){const r=S.pt.findings.chest||(S.acc.bvm||(S.sv.running&&S.acc.saveConn&&!S.pt.leak&&!S.pt.obstruct&&!S.pt.trap)?'El tórax sube de forma simétrica':'El tórax no se mueve con ventilación');L('Tórax: '+r);feedback('tip','Tórax: '+r);}
      if(id==='tube'){const r=S.pt.findings.tube||'Tubo a la misma marca, circuito bien conectado';L('Tubo/circuito: '+r);feedback('tip',r);}
      if(id==='disc'){L('Tubo desconectado unos segundos: sale el aire atrapado');}
      if(id==='suction'){L('Aspiración de secreciones');}
      if(id==='newcirc'){L('Circuito/HMEF nuevos');}
      if(id==='airway'){L('Tubo retirado según protocolo; bolsa-mascarilla');}
      if(id==='adv2'){S.t+=120;if(S.sv.running&&S.sv.rr===0)S.sv.lastBreath=S.t;L('⏩ +2 min de RCP');if(S.lp.mode==='AED'&&S.lp.on){S.lp.msg='PUSH ANALYZE';}}
    }
    sync();drawSV();drawAcc();emit({type:'acc',id,on:!!S.acc[id]});
  }

  /* ---------- Historia y pasos ---------- */
  let fbEl=null;
  function feedback(type,msg){if(!fbEl)return;fbEl.style.display='block';fbEl.className='fb '+(type==='ok'?'ok':type==='no'?'no':'tip');fbEl.innerHTML=msg;if(type==='no')S.errors++;}
  function renderStep(){
    const st=steps[S.step];prog.firstChild.style.width=(100*S.step/steps.length)+'%';
    if(st.onEnter)st.onEnter(S,ctx);
    story.innerHTML='';
    story.append(h('div',{class:'who'},`${CASE.title} · paso ${S.step+1} de ${steps.length}`),h('div',{html:st.text}));
    if(st.goal)story.append(h('div',{class:'goal',html:'🎯 '+st.goal}));
    fbEl=h('div',{class:'fb',style:'display:none'});
    if(st.options){
      const box=h('div',{class:'choices'});
      [...st.options].sort(()=>Math.random()-.5).forEach((o)=>{const b=h('button',{type:'button',onclick:()=>{if(S.ended||b.disabled)return;fbEl.style.display='block';if(o.ok){b.classList.add('good');feedback('ok',o.fb||'Correcto.');[...box.children].forEach(x=>x.disabled=true);if(o.effect)o.effect(S,ctx);done(st);}else{b.classList.add('bad');feedback('no',o.fb||'No es lo más adecuado.');}}},o.t);box.append(b);});
      story.append(box);
    }
    S.hl=new Set();
    const hlDev=(st.hl||[]).map(x=>x.startsWith('lp:')?'lp12':x.startsWith('sv:')?'save':null).find(Boolean);
    showDev(st.dev||hlDev||curDev);
    const hints=st.hints||(st.hl?['Les resaltamos en naranja los botones y las acciones de este paso.']:null);
    if(hints){let i=0;const hb=h('button',{class:'btn alt sm',type:'button',style:'margin-top:10px',onclick:()=>{fbEl.style.display='block';feedback('tip','💡 '+hints[Math.min(i,hints.length-1)]);i++;
      if(st.hl){S.hl=new Set(st.hl);applyHL();const first=root.querySelector('.hl');if(first){const w=first.closest('details');if(w&&!w.open)w.open=true;first.scrollIntoView({behavior:'smooth',block:'nearest'});}}}},'Pista');story.append(hb);}
    story.append(fbEl);
    sync();drawSV();drawAcc();
    checkGoal();
  }
  function checkGoal(){const st=steps[S.step];if(!st||st.options||S._done)return;if(st.check&&st.check(S)){done(st);}}
  function done(st){
    if(S._done)return;S._done=true;
    if(st.success){fbEl.style.display='block';feedback('ok','✔ '+st.success);}
    if(st.after)st.after(S,ctx);
    const nb=h('button',{class:'btn',type:'button',style:'margin-top:12px',onclick:()=>{S._done=false;S.step++;if(S.step>=steps.length)finish();else renderStep();}},S.step+1>=steps.length?'Ver resumen del caso':'Continuar →');
    story.append(nb);nb.focus({preventScroll:true});
  }
  function finish(){
    S.ended=true;prog.firstChild.style.width='100%';
    story.innerHTML='';story.append(h('div',{class:'who'},CASE.title+' · resumen'),h('h3',{},S.errors===0?'Caso completado sin errores':`Caso completado · ${S.errors} decisión(es) a revisar`),
      h('ul',{class:'debrief',html:(CASE.debrief||[]).map(x=>'<li>'+x+'</li>').join('')}),
      h('div',{class:'row'},h('button',{class:'btn',type:'button',onclick:()=>{destroy();create(root,CASE,opts);}},'Repetir caso'),opts.back?h('a',{class:'btn alt',href:opts.back},'Otros casos'):null));
    if(opts.onFinish)opts.onFinish(S);
  }

  /* ---------- Bucle ---------- */
  let last=performance.now(),raf;
  function loop(now){const dt=Math.min(.1,(now-last)/1000);last=now;S.t+=dt;
    if(S.lp.on)ecg.step(dt);
    if(Math.floor(S.t*2)!==Math.floor((S.t-dt)*2)){svTick();if(CASE.tick)CASE.tick(S,ctx);drawSVlite();drawVit();if(!S._done)checkGoal();}
    raf=requestAnimationFrame(loop);}
  let svSig='';function drawSVlite(){const s=JSON.stringify([...S.sv.alarms])+S.sv.showMeas+S.sv.on;if(s!==svSig){svSig=s;drawSV();}}
  function destroy(){cancelAnimationFrame(raf);timers.forEach(clearTimeout);ecg.dispose();}
  renderStep();raf=requestAnimationFrame(loop);
  return {destroy};
}

window.SIM={create,ECG,RH,HEIGHTS};
})();
