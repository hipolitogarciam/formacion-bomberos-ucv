/* Casos clínicos interactivos. Ficticios, elaborados por el autor con fines docentes.
   Cada paso: text, goal, options (decisión) o check(S) (acción en los equipos), react(ev,S,c), hints, success. */
window.CASES=[
/* ===================== 1 · DEA ===================== */
{id:'dea-campus',title:'Parada en el campus',tag:'LIFEPAK 12',mod:'lp12',level:'Básico',min:8,
 summary:'Varón de 58 años que se desploma en una plaza del campus. DEA, RCP y 12 derivaciones tras recuperar el pulso.',
 devices:['lp12'],acc:['pads','cpr','clear','pulse','adv2','ecg12','spo2','cuff','moving'],
 start:{pt:{rhythm:'vf',hr:0,pulse:false,spo2:null,etco2:null,sbp:0,dbp:0}},
 steps:[
 {text:'<p>Un estudiante os avisa: un hombre de unos 58 años se ha desplomado en la plaza del campus. Un testigo hace compresiones. Llegáis a los 3 minutos.</p><p>No responde y hace <i>gasping</i>.</p>',
  options:[
   {t:'Confirmo la parada, sigo con compresiones de calidad, enciendo el LIFEPAK y coloco los parches',ok:true,fb:'Correcto: respiración agónica = parada. Compresiones sin interrupciones mientras otro prepara el desfibrilador.'},
   {t:'Busco el pulso carotídeo durante 30 s antes de hacer nada',fb:'No. Si no responde y no respira con normalidad, es una parada. Comprobar el pulso no debe pasar de 10 s ni retrasar la RCP.'},
   {t:'Lo meto primero en la ambulancia para trabajar más cómodos',fb:'No. La desfibrilación precoz en el lugar es lo que salva. El traslado viene después.'}]},
 {text:'<p>Tu compañero sigue con las compresiones. Prepara el LIFEPAK en modo DEA.</p>',
  goal:'Enciende el equipo, coloca los parches y pide que se analice el ritmo con nadie tocando al paciente.',
  hints:['ON → parches → ANALYZE.','Durante el análisis no puede haber compresiones: desactiva "Compresiones torácicas" antes de pulsar ANALYZE.'],
  react:(ev,S)=>{if(ev.type==='analysis'&&ev.result==='motion')return['no','El equipo ha detectado movimiento. Hay que parar las compresiones durante el análisis.'];if(ev.type==='analysis'&&ev.result==='shock')S.f.adv=1;},
  check:S=>S.f.adv&&S.lp.charged,success:'SHOCK ADVISED: el equipo carga solo.'},
 {text:'<p>El equipo está cargado y pide <span class="msg">PUSH SHOCK BUTTON</span>.</p>',goal:'Descarga con seguridad.',
  hints:['Primero el aviso de seguridad ("¡Fuera todos!") y después SHOCK.'],
  react:(ev,S,c)=>{if(ev.type==='shock'){c.setPt({rhythm:'stemi',hr:96});S.f.shock=1;}},
  check:S=>S.f.shock,success:'Descarga administrada.'},
 {text:'<p>El equipo indica <span class="msg">START CPR</span>.</p>',goal:'Reanuda las compresiones de inmediato y completa 2 minutos de RCP.',
  hints:['Activa "Compresiones torácicas" y después usa "Avanzar 2 min".','No compruebes el pulso justo tras la descarga: primero 2 min de RCP.'],
  react:(ev,S)=>{if(ev.type==='acc'&&ev.id==='pulse'&&!S.f.cpr2)return['tip','Tras la descarga no se busca el pulso: se reanudan las compresiones de inmediato.'];if(ev.type==='acc'&&ev.id==='adv2')S.f.cpr2=1;},
  check:S=>S.f.cpr2,success:'2 minutos de RCP completados. El equipo pide <span class="msg">PUSH ANALYZE</span>.'},
 {text:'<p>Han pasado 2 minutos. Toca analizar de nuevo.</p>',goal:'Analiza otra vez con las compresiones paradas.',
  react:(ev,S)=>{if(ev.type==='analysis'&&ev.result==='noshock'){S.f.ns=1;S.pt.pulse=true;S.pt.sbp=108;S.pt.dbp=64;S.pt.spo2=93;}if(ev.type==='analysis'&&ev.result==='motion')return['no','Para las compresiones durante el análisis.'];},
  check:S=>S.f.ns,success:'NO SHOCK ADVISED. Hay un ritmo organizado en pantalla.'},
 {text:'<p><span class="msg">NO SHOCK ADVISED</span>. En pantalla, un ritmo organizado a unos 96 lpm.</p>',goal:'Comprueba si tiene pulso.',
  react:(ev,S)=>{if(ev.type==='acc'&&ev.id==='pulse')S.f.p=1;},check:S=>S.f.p,success:'Pulso presente: recuperación de la circulación (RCE).'},
 {text:'<p>Tiene pulso y empieza a respirar. Antes de salir hacia el hospital, buscad un infarto.</p>',goal:'Haz un ECG de 12 derivaciones e imprímelo. La ambulancia está parada en la plaza.',
  hints:['Coloca el "Cable de 12 derivaciones" y pulsa 12-LEAD.','Si pones la ambulancia en marcha, habrá ruido.'],
  react:(ev,S)=>{if(ev.type==='12lead'&&ev.ok)S.f.d12=1;},check:S=>S.f.d12,success:'El LIFEPAK sugiere IAM agudo inferior (ST elevado en II, III y aVF).'},
 {text:'<p>12 derivaciones: <b>elevación del ST en la cara inferior</b>. Constantes: TA 108/64, SpO2 93 %.</p><p>¿Qué es lo más importante ahora?</p>',
  options:[
   {t:'Imprimir el CODE SUMMARY, trasladar a un hospital con hemodinámica y preavisar con el ECG',ok:true,fb:'Correcto. El papel viaja con el paciente: 12 derivaciones y CODE SUMMARY.'},
   {t:'Quitar los parches para que esté más cómodo durante el traslado',fb:'No. Tras una parada, los parches se quedan puestos: puede volver a fibrilar.'},
   {t:'Ir al hospital más cercano aunque no tenga hemodinámica, sin avisar',fb:'Con un IAM con elevación del ST tras una parada, lo indicado es un centro con capacidad de reperfusión y preaviso, según vuestra red.'}]}
 ],
 debrief:['Gasping = parada: compresiones y desfibrilador sin perder tiempo.','En el análisis, nadie toca al paciente: ni compresiones ni ambulancia en marcha.','Tras la descarga, compresiones inmediatas durante 2 min. El pulso se comprueba después.','Tras la RCE: los parches se quedan, 12 derivaciones con el vehículo parado y CODE SUMMARY impreso.']},

/* ===================== 2 · Marcapasos ===================== */
{id:'marcapasos',title:'Bradicardia que no espera',tag:'LIFEPAK 12',mod:'lp12',level:'Avanzado · personal acreditado',min:8,
 summary:'Mujer de 79 años con bradicardia extrema e hipotensión. Monitorización, marcapasos transcutáneo y un imprevisto en el traslado.',
 devices:['lp12'],acc:['ecg','spo2','cuff','pads','pulse','moving'],
 start:{pt:{rhythm:'bav3',hr:32,pulse:true,spo2:91,etco2:null,sbp:72,dbp:40,capAt:70,pulseText:'Pulso débil, 32 lpm'},lp:{rate:60}},
 steps:[
 {text:'<p>Mujer de 79 años, mareada, sudorosa y casi inconsciente. Piel fría.</p>',goal:'Enciende el LIFEPAK y monitoriza: ECG, SpO2 y tensión arterial.',
  hints:['ON, y coloca el cable de ECG, el sensor de SpO2 y el manguito.','Pulsa NIBP para medir la tensión.'],
  react:(ev,S)=>{if(ev.type==='nibp')S.f.bp=1;},check:S=>S.lp.on&&S.acc.ecg&&S.acc.spo2&&S.f.bp,success:'FC 32, TA 72/40. Bloqueo AV completo con QRS ancho.'},
 {text:'<p>FC 32 lpm, TA 72/40 y nivel de conciencia bajo. Según vuestro protocolo, el médico regulador ordena marcapasos transcutáneo tras los fármacos indicados, que no han funcionado.</p><p>¿Qué necesitas antes de empezar?</p>',
  options:[
   {t:'Parches colocados y también el cable de ECG, y avisar a la paciente porque va a doler (analgesia por orden médica)',ok:true,fb:'Correcto. Con el cable de ECG puesto, el marcapasos funciona a demanda. Duele: analgesia según la orden médica.'},
   {t:'Solo los parches: el cable de ECG sobra cuando hay marcapasos',fb:'No. Sin el ECG, o si se suelta un electrodo, estimula a frecuencia fija, a ciegas, sin tener en cuenta el ritmo propio.'},
   {t:'Modo DEA y analizar',fb:'No. Tiene pulso: el modo DEA es solo para la parada.'}]},
 {text:'<p>Parches anterolaterales colocados sobre la piel seca.</p>',goal:'Activa el marcapasos, pon la frecuencia en 70 ppm y sube la corriente hasta conseguir captura eléctrica.',
  hints:['PACER → RATE hasta 70 → CURRENT hasta que cada espiga vaya seguida de un QRS ancho.','En este caso la captura llega en torno a 70 mA.'],
  check:S=>S.lp.pacer&&S.lp.rate>=70&&S.lp.mA>=S.pt.capAt,success:'Captura eléctrica: cada espiga va seguida de un QRS ancho.'},
 {text:'<p>En pantalla hay captura eléctrica.</p>',goal:'Confirma la captura mecánica.',
  hints:['Palpa el pulso (mejor el femoral, por los artefactos del marcapasos) y vuelve a medir la tensión.'],
  react:(ev,S,c)=>{if(ev.type==='acc'&&ev.id==='pulse'){S.f.pp=1;S.pt.pulseText='Pulso femoral a la frecuencia del marcapasos';}if(ev.type==='nibp')S.f.bp2=1;},
  onEnter:(S)=>{S.pt.sbp=102;S.pt.dbp=58;S.pt.spo2=95;},
  check:S=>S.f.pp&&S.f.bp2,success:'Captura mecánica confirmada: pulso a 70 lpm y TA 102/58.'},
 {text:'<p>Durante el traslado, al moverla, un parche se despega. Suena una alarma y en pantalla sale <span class="msg">PACING STOPPED</span>.</p><p>Has vuelto a pegar bien el parche.</p>',goal:'Recupera la estimulación.',
  onEnter:(S,c)=>{S.lp.mA=0;S._cap=0;S.lp.msg='<span class="alarm">PACING STOPPED</span>';c.log('Parche despegado: PACING STOPPED, corriente a 0 mA');S.pt.sbp=70;},
  hints:['Al despegarse el parche, la corriente vuelve a 0 mA. Al recolocarlo NO vuelve sola: hay que subirla otra vez.'],
  check:S=>S.lp.pacer&&S.lp.mA>=S.pt.capAt,success:'Captura recuperada. Vuelve a comprobar el pulso.'}
 ],
 debrief:['Marcapasos: parches y cable de ECG. Sin ECG estimula a ciegas.','Ver la captura eléctrica no basta: comprueba el pulso (femoral) y la tensión.','Si se suelta un parche, sale PACING STOPPED y la corriente cae a 0 mA: hay que volver a subirla a mano.','Con el marcapasos encendido, la alarma FV/TV no funciona: vigilancia continua.']},

/* ===================== 3 · Cardioversión ===================== */
{id:'cardioversion',title:'Taquicardia con mala tolerancia',tag:'LIFEPAK 12',mod:'lp12',level:'Avanzado · personal acreditado',min:7,
 summary:'Varón de 50 años con taquicardia de QRS estrecho a 190 e hipotensión. Cardioversión sincronizada y qué hacer si pasa a FV.',
 devices:['lp12'],acc:['ecg','spo2','cuff','pads','clear','pulse','cpr'],
 start:{pt:{rhythm:'svt',hr:190,pulse:true,spo2:94,etco2:null,sbp:78,dbp:50,pulseText:'Pulso rápido y débil'}},
 steps:[
 {text:'<p>Varón de 50 años con palpitaciones desde hace 2 horas. Está pálido, con dolor torácico y TA 78/50. El monitor muestra una taquicardia regular de QRS estrecho a 190.</p><p>El médico regulador ordena cardioversión sincronizada con sedoanalgesia, según vuestro protocolo.</p><p>¿Qué es imprescindible?</p>',
  options:[
   {t:'Parches puestos, SYNC activado y comprobar que aparece una marca sobre cada QRS',ok:true,fb:'Correcto. Sin marcas sobre los QRS no se cardiovierte: cambia de derivación o sube el tamaño.'},
   {t:'Descargar en modo DEA, que es más rápido',fb:'No. El modo DEA es para la parada. Este paciente tiene pulso: necesita una descarga sincronizada en modo manual.'},
   {t:'Descargar sin SYNC a 360 J',fb:'No. Una descarga no sincronizada en un paciente con pulso puede provocar una FV.'}]},
 {text:'<p>Parches y cable de ECG colocados.</p>',goal:'Prepara la cardioversión: SYNC, energía inicial según el protocolo (ERC: 70-120 J en taquicardia regular de QRS estrecho; en este equipo, 100 J) y carga.',
  hints:['SYNC → SELECTOR ▼ hasta 100 J → CHARGE.','Comprueba que los triángulos blancos caen sobre cada QRS y no sobre la T.'],
  check:S=>S.lp.sync&&S.lp.charged&&S.lp.energy>=70&&S.lp.energy<=125,success:'Cargado y en SYNC, con marcas sobre los QRS.'},
 {text:'<p>Equipo cargado en SYNC.</p>',goal:'Descarga.',hints:['"¡Fuera todos!" y SHOCK. En el equipo real hay que mantener pulsado SHOCK hasta que descargue con el siguiente QRS.'],
  react:(ev,S,c)=>{if(ev.type==='shock'&&ev.sync){S.f.cv=1;c.after(1200,()=>{c.setPt({rhythm:'vf',pulse:false,hr:0,spo2:null});c.log('El paciente pasa a FV');});}if(ev.type==='shock'&&!ev.sync)return['no','Esa descarga no estaba sincronizada.'];},
  check:S=>S.f.cv,success:'Descarga sincronizada administrada.'},
 {text:'<p>Tras la descarga, el ritmo cambia: <b>fibrilación ventricular</b>. Ya no tiene pulso.</p>',goal:'Desfibrila: es una FV.',
  hints:['En SYNC no descargará: no hay QRS. Desactiva SYNC.','Comprueba si tu equipo deja SYNC activo tras la descarga (opción SYNC AFTER SHOCK).','SYNC desactivado → energía de desfibrilación según el protocolo → CHARGE → "¡fuera todos!" → SHOCK.'],
  react:(ev,S,c)=>{if(ev.type==='shock'&&!ev.sync){c.setPt({rhythm:'sinus',hr:92,pulse:true,sbp:110,dbp:70,spo2:96});S.f.df=1;}},
  check:S=>S.f.df,success:'Desfibrilación administrada → ritmo sinusal con pulso.'},
 {text:'<p>Ritmo sinusal a 92, TA 110/70.</p><p>¿Qué debes recordar para la próxima cardioversión?</p>',
  options:[
   {t:'Antes de cada descarga, comprobar que SYNC sigue activo, porque depende de la configuración',ok:true,fb:'Correcto. La opción SYNC AFTER SHOCK decide si sigue activo. Compruébalo siempre en pantalla.'},
   {t:'SYNC siempre se queda activo tras descargar',fb:'No necesariamente: depende de la configuración del equipo (SYNC AFTER SHOCK).'}]}
 ],
 debrief:['Cardioversión: SYNC con marcas sobre cada QRS, sedoanalgesia por orden médica y mantener pulsado SHOCK.','Si pasa a FV: apaga SYNC y desfibrila. En SYNC, el equipo no descarga sin QRS.','Antes de repetir, comprueba que SYNC sigue activo.']},

/* ===================== 4 · SAVe puesta en marcha + PIP ===================== */
{id:'save-tce',title:'Traslado de un TCE',tag:'SAVe II+',mod:'save',level:'Básico',min:10,
 summary:'Varón de 30 años intubado tras un accidente de moto. Poner en marcha el SAVe, probar las alarmas, calcular el O2 y resolver un PIP REACHED.',
 devices:['save','lp12'],acc:['saveConn','occlude','co2','spo2','ecg','chest','tube','bvm','suction','newcirc','o2save'],
 start:{pt:{rhythm:'sinus',hr:96,pulse:true,spo2:97,etco2:null,sbp:132,dbp:80,pipBase:17},lp:{on:true},acc:{ecg:true,spo2:true,bvm:true}},
 steps:[
 {text:'<p>Varón de 30 años, accidente de moto, TCE grave, Glasgow 6. El equipo de vía aérea lo ha intubado según el protocolo y lo ventiláis con bolsa. Mide unos 175 cm. Traslado de 40 minutos.</p><p>¿Podéis pasarlo al SAVe II+?</p>',
  options:[
   {t:'Sí: adulto de más de 45 kg con vía aérea asegurada, siempre que la capnografía funcione y la bolsa quede a mano',ok:true,fb:'Correcto. Son las condiciones del fabricante.'},
   {t:'Sí, aunque no tengamos capnografía: el SAVe ya mide las presiones',fb:'No. El fabricante exige capnografía o volumen espirado. Sin ella, bolsa.'},
   {t:'No: el SAVe solo se usa en la parada',fb:'No. Está pensado para ventilar durante el traslado a adultos de 45 kg o más.'}]},
 {text:'<p>Circuito nuevo conectado al equipo con sus 3 tubos y todavía sin conectar al paciente. Seguís con la bolsa.</p>',goal:'Enciende el SAVe, elige 175 cm y confirma.',
  hints:['POWER → botón 175 cm → CONFIRM. Nada cambia hasta pulsar CONFIRM.'],
  check:S=>S.sv.running&&S.sv.preset===175&&S.sv.rr===15,success:'Ventilando con FR 15 y VT 420. Como el circuito está abierto, aparece DISCONNECT.'},
 {text:'<p>Con el circuito abierto ha saltado <span class="msg">DISCONNECT</span>: la prueba de desconexión es correcta.</p>',goal:'Haz ahora la prueba de PIP: tapa la salida del circuito hasta que salte la alarma y luego destápala.',
  hints:['Activa "Tapar la salida del circuito". Cuando salte PIP REACHED, desactívala.'],
  react:(ev,S)=>{if(S.sv.alarms.has('PIP REACHED')&&S.acc.occlude)S.f.pipT=1;},tickCheck:true,
  check:S=>{if(S.sv.alarms.has('PIP REACHED')&&S.acc.occlude)S.f.pipT=1;return S.f.pipT&&!S.acc.occlude;},success:'Las dos alarmas de seguridad funcionan.'},
 {text:'<p>Alarmas comprobadas.</p>',goal:'Conecta el SAVe al tubo del paciente, retira la bolsa, pon la capnografía y comprueba que el tórax sube.',
  hints:['"Conectar circuito del SAVe al paciente", desactivar "Ventilar con bolsa", "Línea de EtCO2" y "Mirar el tórax".'],
  onEnter:(S)=>{S.pt.etco2=38;},react:(ev,S)=>{if(ev.type==='acc'&&ev.id==='chest'&&S.acc.saveConn)S.f.ch=1;},
  check:S=>S.acc.saveConn&&!S.acc.bvm&&S.acc.co2&&S.f.ch,success:'El tórax sube. EtCO2 38 con curva cuadrada y SpO2 97 %.'},
 {text:'<p>El médico pide FiO2 alta. Vas a conectar el O2 al tubo reservorio del SAVe (FR 15, VT 420 mL).</p><p>¿Qué flujo de O2 pones?</p>',
  options:[
   {t:'7 L/min (15 × 0,42 = 6,3, redondeado hacia arriba)',ok:true,fb:'Correcto. Un flujo igual al volumen minuto, redondeado hacia arriba, da una FiO2 cercana al 100 %.',effect:(S)=>{S.acc.o2save=true;}},
   {t:'2 L/min, para no gastar la bombona',fb:'Con un flujo menor que el volumen minuto, la FiO2 baja.'},
   {t:'15 L/min siempre',fb:'No hace falta: basta con el volumen minuto (≈ 6,3 → 7 L/min). Más flujo solo gasta la bombona.'}]},
 {text:'<p>Minuto 15 de traslado. Salta <span class="msg">PIP REACHED</span>, la curva de capnografía se deforma y la SpO2 baja a 92 %.</p>',
  goal:'Actúa en orden: primero el paciente, luego el equipo.',
  onEnter:(S,c)=>{S.pt.obstruct=true;S.pt.spo2=92;S.pt.etco2=44;S.pt.findings.chest='El tórax sube poco; se oyen secreciones por el tubo';S.pt.findings.tube='Tubo a la misma marca; hay secreciones en el tubo';c.log('PIP REACHED, SpO2 92 %');},
  hints:['Mira el tórax y revisa el tubo antes de tocar el ventilador.','Pasa a la bolsa, aspira, cambia el circuito y el HMEF y vuelve a conectar.'],
  react:(ev,S,c)=>{if(ev.type==='acc'){if(ev.id==='chest'||ev.id==='tube')S.f.look=1;if(ev.id==='suction'){if(!S.acc.bvm&&S.acc.saveConn)return['tip','Antes de aspirar, pasa a la bolsa (desconecta el SAVe).'];S.f.asp=1;S.pt.obstruct=false;S.pt.spo2=96;S.pt.etco2=38;S.pt.findings.chest='';S.pt.findings.tube='';}if(ev.id==='newcirc')S.f.nc=1;}
   if(ev.type==='key'&&ev.dev==='sv'&&!S.f.look)return['tip','Primero el paciente: mira el tórax y revisa el tubo antes de tocar el ventilador.'];},
  check:S=>S.f.look&&S.f.asp&&S.f.nc&&S.acc.saveConn&&!S.acc.bvm&&!S.sv.alarms.has('PIP REACHED'),success:'Secreciones aspiradas, circuito nuevo y SAVe reconectado: PIP normal, EtCO2 38 y SpO2 96 %.'},
 {text:'<p>Todo normalizado.</p><p>¿Cómo vigilaréis el resto del traslado?</p>',
  options:[
   {t:'Ronda cada 5 min: tórax, SpO2, curva de EtCO2, FC y TA, y CONFIRM sin cambios para ver la PIP medida',ok:true,fb:'Correcto. Y siempre después de mover al paciente.'},
   {t:'Si no suena ninguna alarma, todo va bien',fb:'No. El fabricante lo dice: la ausencia de alarma no garantiza que el paciente esté bien ventilado.'}]}
 ],
 debrief:['Condiciones para el SAVe: 45 kg o más, capnografía funcionando y bolsa a mano.','Puesta en marcha: altura → CONFIRM → prueba de DISCONNECT → prueba de PIP → paciente → ver que el tórax sube.','O2: flujo = FR × VT, redondeado hacia arriba.','Ante PIP REACHED, DOPE: Desplazamiento, Obstrucción, neumotórax (P), Equipo. Primero el paciente.']},

/* ===================== 5 · HIGH PEEP ===================== */
{id:'save-asma',title:'El aire que no sale',tag:'SAVe II+',mod:'save',level:'Intermedio',min:6,
 summary:'Mujer de 40 años con crisis asmática grave, intubada y ventilada. HIGH PEEP: el ventilador se detiene.',
 devices:['save','lp12'],acc:['chest','tube','disc','bvm','newcirc','saveConn','co2','spo2'],
 start:{pt:{rhythm:'sinus',hr:128,pulse:true,spo2:90,etco2:58,sbp:96,dbp:60},lp:{on:true},acc:{ecg:true,spo2:true,co2:true,saveConn:true},
   sv:{on:true,preset:160,rr:18,vt:310,pip:35,peep:0,running:true}},
 steps:[
 {text:'<p>Mujer de 40 años, crisis asmática grave, intubada por el equipo médico y conectada al SAVe (160 cm, FR 18, VT ajustado a mano a 310 por ser mujer). Al poco, suena una alarma.</p>',
  onEnter:(S,c)=>{S.pt.trap=true;S.pt.findings.chest='Tórax hinchado que apenas baja entre respiraciones';c.log('Atrapamiento aéreo');},
  options:[
   {t:'HIGH PEEP: el ventilador se ha detenido. Hay que ventilar ya con bolsa, porque esta alarma para la ventilación',ok:true,fb:'Correcto. DEVICE, HIGH PEEP y la batería en reserva detienen la ventilación.'},
   {t:'La silencio con MUTE y espero a ver si se resuelve',fb:'No. HIGH PEEP detiene la ventilación: silenciarla no ventila a la paciente.'}]},
 {text:'<p>El aire entra pero no le da tiempo a salir: atrapamiento aéreo.</p>',goal:'Deja salir el aire atrapado y ventila con bolsa, despacio.',
  hints:['"Desconectar el tubo unos segundos" y después "Ventilar con bolsa" (despacio, dejando espirar).','Retira o cambia el HMEF.'],
  react:(ev,S,c)=>{if(ev.type==='acc'&&ev.id==='disc'){S.f.d=1;S.acc.saveConn=false;S.pt.trap=false;S.pt.findings.chest='Sale aire durante varios segundos; el tórax baja';c.savAlarm('HIGH PEEP',false);}if(ev.type==='acc'&&ev.id==='newcirc')S.f.h=1;},
  check:S=>S.f.d&&S.acc.bvm,success:'El tórax baja y la bolsa entra mejor. SpO2 93 %.'},
 {text:'<p>El médico indica volver al SAVe con <b>FR 10</b> para dar más tiempo a la espiración.</p>',goal:'Baja la FR a 10, confirma y reconecta el SAVe en lugar de la bolsa.',
  hints:['Toca el display de FR, pulsa ▼ hasta 10 y luego CONFIRM.','"Conectar circuito del SAVe al paciente" y desactiva la bolsa.'],
  check:S=>S.sv.rr===10&&!S.sv.pend&&S.acc.saveConn&&!S.acc.bvm,success:'FR 10 confirmada. Sin alarmas, EtCO2 con curva y el tórax baja del todo.'}
 ],
 debrief:['HIGH PEEP = aire atrapado o salida tapada. El SAVe deja de ventilar.','Desconecta unos segundos, bolsa despacio, revisa el HMEF y la salida espiratoria.','El SAVe tiene un I:E fijo de 1:2: en el asma grave, la única forma de alargar la espiración es bajar la FR (por orden médica).','Con FR 10 y VT 310, el volumen minuto es de unos 3,1 L/min: vigilad la EtCO2 y la SpO2.']},

/* ===================== 6 · Parada en paciente ventilado ===================== */
{id:'parada-ventilado',title:'Parada en un paciente ventilado',tag:'Integración',mod:'int',level:'Avanzado',min:10,
 summary:'Paciente intubado y conectado al SAVe que pierde el pulso durante el traslado. Los dos equipos a la vez.',
 devices:['lp12','save'],acc:['cpr','moving','clear','pulse','adv2','pads','bvm','chest','saveConn','co2'],
 start:{pt:{rhythm:'sinus',hr:110,pulse:true,spo2:95,etco2:36,sbp:100,dbp:62},lp:{on:true},acc:{ecg:true,spo2:true,co2:true,saveConn:true,moving:true,pads:true},
   sv:{on:true,preset:175,rr:15,vt:420,pip:30,peep:0,running:true}},
 steps:[
 {text:'<p>Traslado de un varón de 64 años intubado tras un IAM, conectado al SAVe (175 cm). La ambulancia va en marcha.</p><p>De repente, el monitor cambia y la EtCO2 cae a 8.</p>',
  onEnter:(S,c)=>{c.setPt({rhythm:'vf',pulse:false,hr:0,etco2:8,spo2:null});c.log('FV, EtCO2 8');},
  goal:'Primeras acciones: empieza las compresiones y ordena parar la ambulancia.',hints:['"Compresiones torácicas" y desactiva "Ambulancia en marcha".'],
  check:S=>S.acc.cpr&&!S.acc.moving,success:'Compresiones en marcha y vehículo detenido.'},
 {text:'<p>Con vía aérea avanzada, las compresiones no se paran para ventilar.</p>',goal:'Pasa el SAVe a modo RCP y da una respiración.',
  hints:['Toca el display de FR y pulsa ▼ hasta 0 (de 8 pasa a 0) → CONFIRM.','Después, MANUAL TRIGGER cada 6 s.'],
  check:S=>S.sv.rr===0&&!S.sv.pend&&S.sv.trig>0,success:'Modo RCP: PIP 20, sin PEEP, ♥ a 100/min. Una respiración cada 6 s.'},
 {text:'<p>Vehículo parado y parches ya colocados.</p>',goal:'Analiza el ritmo y descarga de forma segura.',
  hints:['Para las compresiones ("¡Fuera todos!") y pulsa ANALYZE.','Cuando cargue: "¡Fuera todos!" y SHOCK. Cierra o aparta el O2 libre del reservorio; el SAVe puede quedar conectado al tubo si vuestra dirección médica lo acepta.'],
  react:(ev,S,c)=>{if(ev.type==='analysis'&&ev.result==='motion')return['no','Hay movimiento: compresiones paradas y vehículo detenido durante el análisis.'];if(ev.type==='shock'){S.f.sh=1;c.setPt({rhythm:'sinus',hr:100});}},
  check:S=>S.f.sh,success:'Descarga administrada.'},
 {text:'<p><span class="msg">START CPR</span>.</p>',goal:'Reanuda las compresiones y completa 2 minutos con ventilación cada 6 s.',
  hints:['"Compresiones torácicas" → "Avanzar 2 min".'],
  react:(ev,S,c)=>{if(ev.type==='acc'&&ev.id==='adv2'){S.f.a=1;c.setPt({pulse:true,etco2:38,sbp:96,dbp:58,spo2:94});c.log('La EtCO2 sube bruscamente a 38');}},
  check:S=>S.f.a,success:'Durante la RCP, la EtCO2 sube de golpe a 38: posible recuperación de la circulación.'},
 {text:'<p>La EtCO2 ha subido de 8 a 38 de golpe.</p><p>¿Qué haces?</p>',
  options:[
   {t:'Sigo comprimiendo y compruebo el pulso en la siguiente pausa para analizar',ok:true,fb:'Correcto. La subida brusca sugiere RCE, pero el pulso se comprueba en la pausa, sin parar antes de tiempo.'},
   {t:'Paro ya las compresiones y busco el pulso durante 30 s',fb:'No. Pausa corta y en el momento del análisis.'}]},
 {text:'<p>En la pausa: ritmo organizado con <b>pulso</b>. Paras las compresiones.</p>',goal:'Haz que el SAVe vuelva a ventilar solo y comprueba que el tórax sube.',
  onEnter:(S)=>{S.acc.cpr=false;},hints:['Fuera del modo RCP: botón 175 cm → CONFIRM.','En FR 0 el SAVe NO ventila solo.'],
  react:(ev,S)=>{if(ev.type==='acc'&&ev.id==='chest'&&S.sv.rr>0)S.f.c=1;},
  check:S=>S.sv.rr>0&&!S.sv.pend&&S.f.c,success:'Ventilación automática: FR 15 y VT 420. El tórax sube.'}
 ],
 debrief:['Parada con ventilador: compresiones YA y orden de parar el vehículo.','SAVe en FR 0 (modo RCP) con MANUAL TRIGGER cada 6 s. Si sale PIP REACHED una y otra vez → bolsa al tubo.','Análisis con el vehículo parado y sin compresiones. En la descarga, nadie toca.','Tras la RCE: sal del modo RCP (altura → CONFIRM). Es un olvido peligroso.']},

/* ===================== 7 · DISCONNECT ===================== */
{id:'desconexion',title:'Alarma al subir a la ambulancia',tag:'Integración',mod:'int',level:'Intermedio',min:5,
 summary:'Al pasar al paciente ventilado de la camilla a la ambulancia, salta DISCONNECT y la capnografía desaparece.',
 devices:['save','lp12'],acc:['chest','tube','pulse','airway','bvm','saveConn','co2'],
 start:{pt:{rhythm:'sinus',hr:104,pulse:true,spo2:96,etco2:35,sbp:118,dbp:70},lp:{on:true},acc:{ecg:true,spo2:true,co2:true,saveConn:true},
   sv:{on:true,preset:168,rr:16,vt:380,pip:30,peep:0,running:true}},
 steps:[
 {text:'<p>Paciente intubado tras una intoxicación, ventilado con el SAVe. Al pasarlo de la camilla a la ambulancia salta <span class="msg">DISCONNECT</span>. La curva de EtCO2 desaparece y la SpO2 empieza a bajar.</p>',
  onEnter:(S,c)=>{S.pt.leak=true;S.pt.etco2=null;S.pt.spo2=89;S.pt.findings.chest='El tórax NO sube; se oye una fuga por la boca';S.pt.findings.tube='El tubo está 6 cm más fuera que la marca: desplazado';c.log('DISCONNECT, EtCO2 sin curva');},
  goal:'Primero el paciente: averigua qué pasa.',hints:['Mira el tórax y revisa el tubo.'],
  react:(ev,S)=>{if(ev.type==='acc'&&(ev.id==='chest'||ev.id==='tube'))S.f[ev.id]=1;if(ev.type==='key'&&ev.dev==='sv')return['tip','No empieces por el ventilador: mira primero al paciente.'];},
  check:S=>S.f.chest&&S.f.tube,success:'El tubo se ha desplazado: esa es la fuga.'},
 {text:'<p>El tubo está fuera de su sitio.</p><p>¿Qué haces?</p>',
  options:[
   {t:'Retirar el tubo según el protocolo, ventilar con bolsa-mascarilla (o supraglótico) y avisar al responsable de la vía aérea',ok:true,fb:'Correcto. Ventilar a través de un tubo desplazado no sirve.',effect:(S,c)=>{S.acc.saveConn=false;S.acc.bvm=true;S.pt.leak=false;S.pt.spo2=94;S.pt.etco2=null;c.log('Bolsa-mascarilla');}},
   {t:'Subir el VT del SAVe para compensar la fuga',fb:'No. Con el tubo fuera de sitio, el aire no llega a los pulmones aunque subas el volumen.'},
   {t:'Silenciar la alarma y seguir el traslado',fb:'No. La SpO2 baja y no hay curva de capnografía: es una urgencia de la vía aérea.'}]}
 ],
 debrief:['Sin curva de capnografía = problema de vía aérea hasta que se demuestre lo contrario.','Ante cualquier alarma: paciente → vía aérea → ventilación → circulación → equipo.','Cada vez que se mueve al paciente, se revisan el tubo y la capnografía.','Si en 30 s no está claro: bolsa.']},

/* ===================== 8 · Humo ===================== */
{id:'humo',title:'Rescate en un incendio',tag:'Integración',mod:'int',level:'Básico',min:4,
 summary:'Varón rescatado de un apartamento en llamas. SpO2 98 %: ¿tranquilos?',
 devices:['lp12'],acc:['spo2','ecg','o2','cuff'],
 start:{pt:{rhythm:'sinus',hr:118,pulse:true,spo2:98,etco2:null,sbp:104,dbp:66},lp:{on:true}},
 steps:[
 {text:'<p>Sacáis a un hombre de 45 años de un apartamento en llamas. Está obnubilado, con hollín en la boca y respiración lenta.</p>',goal:'Monitorízalo: SpO2, ECG y tensión arterial.',
  react:(ev,S)=>{if(ev.type==='nibp')S.f.bp=1;},check:S=>S.acc.spo2&&S.acc.ecg&&S.f.bp,success:'SpO2 98 %, FC 118 y TA 104/66.'},
 {text:'<p>El LIFEPAK marca una <b>SpO2 de 98 %</b>.</p>',
  options:[
   {t:'No me fío: con monóxido de carbono la SpO2 puede salir normal aunque haya hipoxia. O2 al máximo con mascarilla reservorio',ok:true,fb:'Correcto. El pulsioxímetro no distingue la carboxihemoglobina.',effect:(S)=>{S.acc.o2=true;}},
   {t:'98 % es normal: no necesita oxígeno',fb:'Error peligroso. Con CO, la SpO2 engaña. Hay que dar O2 al máximo.'}]},
 {text:'<p>Empeora y el equipo médico decide asegurar la vía aérea y ventilar.</p><p>¿Dónde y cómo?</p>',
  options:[
   {t:'Fuera de la zona de humo. Si se usa el SAVe, con el O2 al tubo reservorio (flujo = volumen minuto)',ok:true,fb:'Correcto. El SAVe ventila el aire que lo rodea, y su filtro no retiene humo ni gases.'},
   {t:'Dentro del apartamento, cuanto antes, con el SAVe sin O2',fb:'No. En una zona con humo, el SAVe metería humo en los pulmones.'}]}
 ],
 debrief:['Con humo o CO, la SpO2 puede ser falsamente normal: O2 al máximo y traslado precoz.','Nunca ventilar con el SAVe dentro de una zona con humo o gases.','Vigila el ECG: el CO también afecta al corazón.']},

/* ===================== 9 · Pediátrico ===================== */
{id:'nino',title:'Niño ahogado en una piscina',tag:'Integración',mod:'int',level:'Decisión',min:3,
 summary:'Niño de 6 años en parada tras un ahogamiento. ¿Modo DEA? ¿SAVe?',
 devices:['lp12'],acc:[],start:{pt:{rhythm:'vf',hr:0,pulse:false,spo2:null,etco2:null,sbp:0,dbp:0},lp:{on:true},acc:{pads:true}},
 steps:[
 {text:'<p>Niño de 6 años (unos 20 kg) sacado de una piscina en parada. Hacéis RCP con ventilaciones de rescate.</p><p>¿Usáis el SAVe II+?</p>',
  options:[
   {t:'No: pesa menos de 45 kg. Bolsa-mascarilla del tamaño adecuado',ok:true,fb:'Correcto. Por debajo de 45 kg, nunca el SAVe.'},
   {t:'Sí, eligiendo el preset más bajo (129 cm)',fb:'No. El SAVe es solo para pacientes de 45 kg o más.'}]},
 {text:'<p>Monitor en FV. ¿Cómo desfibriláis con el LIFEPAK 12?</p>',
  options:[
   {t:'Según el protocolo pediátrico de la dirección médica: modo manual si alguien está acreditado (ERC: 4 J/kg); si nadie lo está, la dirección médica debe haber decidido antes si se usa el LP12 en DEA con parches de adulto, porque es preferible a no desfibrilar',ok:true,fb:'Correcto. El modo DEA del LP12 no está diseñado para menores de 8 años. La decisión debe estar tomada de antemano.'},
   {t:'No se puede desfibrilar a un niño con este equipo',fb:'No. Hay que desfibrilar: lo que cambia es cómo, según vuestro protocolo pediátrico.'},
   {t:'Modo DEA con parches pediátricos',fb:'Con 20 kg, los parches pediátricos (para menos de 15 kg) no valen: van los de adulto. Y el uso del DEA en menores de 8 años debe estar decidido por vuestra dirección médica.'}]},
 {text:'<p>Pesa unos 20 kg. ¿Qué parches QUIK-COMBO?</p>',
  options:[
   {t:'Los de adulto: los pediátricos son para menos de 15 kg',ok:true,fb:'Correcto, según el manual del LP12. Asegúrate de que no se toquen entre sí; si el tórax es pequeño, posición anteroposterior en modo manual.'},
   {t:'Los pediátricos, porque es un niño',fb:'El manual fija los pediátricos para menos de 15 kg. Con 20 kg, los de adulto.'}]}
 ],
 debrief:['Menos de 45 kg: nunca el SAVe. Bolsa del tamaño adecuado.','Menor de 8 años: el modo DEA del LP12 no está diseñado para él. Hay que tener el protocolo pediátrico decidido de antemano.','Parches pediátricos por debajo de 15 kg.']}
];
