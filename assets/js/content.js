/* Fotos reales disponibles en assets/img/fotos/ (sin extensión). Añadan el nombre aquí al subir cada foto. */
window.PHOTOS=[];

/* Contenido: módulos, panel interactivo, autoevaluaciones y vídeos */
window.MODS=[
 {id:'lp12',n:1,title:'LIFEPAK 12',sub:'Monitor-desfibrilador',color:'#0E7C86',
  intro:'Checklist, modo DEA, terapias manuales (desfibrilación, cardioversión y marcapasos) y monitorización: ECG, 12 derivaciones, SpO2, PNI y EtCO2.',
  goals:['Hacer el checklist diario y saber cuándo un equipo queda fuera de servicio.','Usar el modo DEA con seguridad, también en la ambulancia.','Conocer los pasos y las trampas de la desfibrilación manual, la cardioversión y el marcapasos (personal acreditado).','Monitorizar e interpretar las trampas de la SpO2, la PNI y la EtCO2.'],
  manual:'content/manual-lp12.html',info:'assets/docs/Infografia_LIFEPAK12',panel:'lp12',
  loom:{title:'Sesión 1 · LIFEPAK 12 (≈ 12 min)',url:''}},
 {id:'save',n:2,title:'SAVe II+',sub:'Ventilador de transporte',color:'#F08A24',
  intro:'Cuándo usarlo y cuándo no, puesta en marcha con prueba de alarmas, presets por altura, oxígeno, modo RCP y resolución de alarmas.',
  goals:['Decidir entre bolsa y ventilador según las condiciones del fabricante.','Poner en marcha el SAVe y probar sus alarmas.','Calcular el flujo de O2 y usar el modo RCP.','Resolver DISCONNECT, PIP REACHED y HIGH PEEP empezando por el paciente.'],
  manual:'content/manual-save.html',info:'assets/docs/Infografia_SAVeII',panel:'save',
  loom:{title:'Sesión 2 · SAVe II+ (≈ 11 min)',url:''}},
 {id:'int',n:3,title:'Integración clínica',sub:'Los dos equipos en el paciente',color:'#3CC6D2',
  intro:'Roles, el orden de conexión, la ronda de 5 minutos, alarmas simultáneas, parada en el paciente ventilado, niños y entrega en el hospital.',
  goals:['Repartir papeles con 2 o 3 personas.','Seguir el orden paciente → vía aérea → ventilación → circulación → equipo.','Manejar una parada en un paciente conectado al SAVe.','Saber qué no hacer en niños y en zonas con humo.'],
  manual:'content/manual-integracion.html',info:'assets/docs/Infografia_Integracion',panel:null,
  loom:{title:'Sesión 3 · Integración clínica (≈ 10 min)',url:''}}
];

/* ---------- Panel interactivo (esquemas de elaboración propia, no a escala) ---------- */
window.PANELS={
 lp12:{title:'LIFEPAK 12 · frontal',vb:'0 0 1000 640',body:[20,20,960,600],
  deco:[{t:'rect',x:180,y:50,w:470,h:310,fill:'#05080D',r:10},{t:'text',x:415,y:205,s:'PANTALLA',fill:'#49F27A'},{t:'text',x:100,y:40,s:'ZONA 5',fill:'#9FB0C3',sz:16},{t:'text',x:830,y:40,s:'ZONA 1',fill:'#9FB0C3',sz:16},{t:'text',x:830,y:495,s:'ZONA 2 · MARCAPASOS',fill:'#9FB0C3',sz:15},{t:'text',x:330,y:380,s:'ZONA 3 · MONITOR',fill:'#9FB0C3',sz:16}],
  hot:[
   {id:'12lead',x:40,y:60,w:120,h:52,l:'12-LEAD',i:'Adquiere e imprime el ECG de 12 derivaciones (con el cable de 12 derivaciones). <b>Vehículo parado y paciente quieto.</b> Con NOISY DATA, corrige el ruido; con más de 30 s de ruido se cancela.',p:'3-8 a 3-14'},
   {id:'transmit',x:40,y:125,w:120,h:52,l:'TRANSMIT',i:'Transmite informes (módem o fax). En esta formación no se usa: hemos omitido la telemedicina.',p:'6-7'},
   {id:'code',x:40,y:190,w:120,h:52,l:'CODE SUMMARY',i:'Imprime el resumen del evento: descargas, análisis, sucesos y constantes. <b>Imprímanlo al terminar</b>: la memoria borra al paciente más antiguo cuando se llena.',p:'6-2 a 6-5'},
   {id:'print',x:40,y:255,w:120,h:52,l:'PRINT',i:'Imprime una tira del ECG en tiempo real.',p:'2-12'},
   {id:'side',x:40,y:330,w:120,h:250,l:'LATERALES',i:'<b>Zona 4:</b> conectores del cable de terapia (QUIK-COMBO o palas), ECG, SpO2, PNI y CO2; altavoz e impresora (papel de 50 o 100 mm). El cable de terapia y su conector se revisan cada día.',p:'2-10, 2-11'},
   {id:'screen',x:180,y:50,w:470,h:310,l:'',i:'<b>Zona 6, pantalla:</b> ECG, FC, SpO2, PNI, EtCO2, mensajes, energía, indicador de la alarma FV/TV y estado de las 2 baterías. La batería en uso aparece resaltada.',p:'2-14 a 2-17'},
   {id:'nibp',x:180,y:400,w:100,h:48,l:'NIBP',i:'Inicia una medición de la tensión arterial: tarda unos 40 s y se cancela a los 120 s. <b>Nunca en el brazo del suero.</b>',p:'3-24'},
   {id:'lead',x:290,y:400,w:100,h:48,l:'LEAD',i:'Cambia la derivación del ECG. Para la alarma FV/TV solo valen PADDLES o II.',p:'3-2'},
   {id:'size',x:400,y:400,w:100,h:48,l:'SIZE',i:'Cambia el tamaño del ECG. Si en SYNC las marcas faltan o caen sobre la onda T, ajusten el tamaño (más o menos) o cambien la derivación: una mala sincronización puede provocar una FV.',p:'3-3, 4-16'},
   {id:'alarms',x:180,y:460,w:100,h:48,l:'ALARMS',i:'Activa las alarmas (QUICK SET pone límites sobre los valores actuales). Con una alarma sonando, la silencia 2 min. <b>Con el paciente inestable no repitan QUICK SET</b>: silencien hasta 15 min.',p:'2-22 a 2-24'},
   {id:'options',x:290,y:460,w:100,h:48,l:'OPTIONS',i:'Menú de opciones: datos del paciente, modo de marcapasos (demanda o no demanda), impresión de la configuración y <b>User Test</b> (se carga a 10 J, descarga dentro del equipo e imprime "Pasa" o "Falla").',p:'2-9, 8-3'},
   {id:'event',x:400,y:460,w:100,h:48,l:'EVENT',i:'Registra sucesos (fármacos, intubación…) con hora. Salen en el CODE SUMMARY.',p:'2-8'},
   {id:'home',x:180,y:520,w:210,h:48,l:'HOME SCREEN',i:'Vuelve de inmediato a la pantalla principal.',p:'2-7'},
   {id:'selector',c:true,x:580,y:490,r:62,l:'SELECTOR',i:'Botón giratorio: se gira para moverse por los menús y ajustar valores (frecuencia y corriente del marcapasos de 5 en 5) y se pulsa para elegir. <b>Pulsado con el equipo cargado, retira la carga.</b>',p:'2-8, 4-15, 4-19'},
   {id:'on',x:860,y:55,w:100,h:50,l:'1 · ON',fill:'#2E7D32',i:'Enciende y apaga el equipo. <b>De fábrica arranca como desfibrilador manual y monitor</b>, con la derivación II. Antes de encender para el checklist, desconecten de la red y esperen 2 s.',p:'2-5, 4-13'},
   {id:'leds',x:700,y:55,w:140,h:50,l:'BATT CHG · SERVICE',fill:'#3B4558',sz:15,i:'<b>BATT CHG:</b> hay una batería cargándose con el adaptador de red. <b>SERVICE:</b> ha fallado el autotest: equipo fuera de servicio y aviso al técnico.',p:'2-5'},
   {id:'energy',x:700,y:130,w:260,h:55,l:'2 · ENERGY SELECT ▼▲',i:'Elige la energía en modo manual (hasta 360 J). Desde el modo DEA, pulsarlo pasa a manual si la configuración lo permite. <b>Si cambian la energía mientras carga, la carga se elimina.</b>',p:'4-15, 4-16'},
   {id:'charge',x:700,y:200,w:260,h:55,l:'3 · CHARGE',fill:'#D9A400',tc:'#111',i:'Carga el desfibrilador en modo manual. Al terminar suena un tono. <b>Si no descargan en 60 s, la energía se elimina dentro del equipo.</b> Al cargar, el marcapasos se para.',p:'4-15, 4-20'},
   {id:'shock',x:700,y:270,w:260,h:75,l:'SHOCK',fill:'#C62828',i:'Descarga. Antes, "¡fuera todos!". En la cardioversión, <b>manténganlo pulsado</b> hasta que descargue con el siguiente QRS.',p:'4-6, 4-16'},
   {id:'analyze',x:700,y:365,w:125,h:52,l:'ANALYZE',fill:'#0E7C86',i:'Modo DEA: analiza el ritmo. <b>Vehículo parado y nadie tocando al paciente.</b> Si es desfibrilable, carga solo y pide SHOCK; si no pulsan en 60 s, se desarma.',p:'4-4 a 4-6'},
   {id:'advisory',x:835,y:365,w:125,h:52,l:'ADVISORY',i:'Activa la vigilancia continua del ritmo (CPSS) en modo DEA. Desde el DEA, pulsarlo puede pasar a manual según la configuración.',p:'4-11'},
   {id:'sync',x:700,y:430,w:125,h:52,l:'SYNC',i:'Activa la cardioversión sincronizada: debe salir <b>una marca sobre cada QRS</b>. Si el paciente pasa a FV, apaguen SYNC y desfibrilen. Que siga activo tras descargar depende de la configuración (SYNC AFTER SHOCK).',p:'4-16, 9-4'},
   {id:'pacer',x:700,y:510,w:125,h:45,l:'PACER',fill:'#5A4B8C',i:'Enciende o apaga el marcapasos transcutáneo. Necesita los parches y también el cable de ECG para funcionar a demanda.',p:'4-19'},
   {id:'pause',x:835,y:510,w:125,h:45,l:'PAUSE',fill:'#5A4B8C',i:'Mientras se mantiene pulsado, estimula al 25 % de la frecuencia para ver el ritmo propio del paciente.',p:'4-20'},
   {id:'rate',x:700,y:565,w:125,h:45,l:'RATE',fill:'#5A4B8C',i:'Frecuencia del marcapasos: 40-170 ppm. Cada pulsación sube 10 ppm; el SELECTOR la cambia de 5 en 5.',p:'4-19'},
   {id:'current',x:835,y:565,w:125,h:45,l:'CURRENT',fill:'#5A4B8C',i:'Corriente: 0-200 mA. Cada pulsación sube 10 mA; el SELECTOR la cambia de 5 en 5. Súbanla hasta la captura y <b>comprueben el pulso</b>. Si se suelta un parche, vuelve a 0.',p:'4-20'}
  ]},
 save:{title:'SAVe II+ · frontal',vb:'0 0 900 520',body:[20,20,860,480],
  deco:[{t:'text',x:450,y:300,s:'ADULT HEIGHT PRESETS',fill:'#9FB0C3',sz:15}],
  hot:[
   {id:'alarmpanel',x:50,y:40,w:800,h:56,l:'DEVICE · DISCONNECT · PIP REACHED · BATTERY · HIGH PEEP · LOW PEEP · HIGH MV · BREATH',fill:'#05080D',tc:'#FF6B6B',sz:15,i:'Panel de alarmas. <b>Paran la ventilación: DEVICE, HIGH PEEP y la batería en reserva → bolsa ya.</b> Las demás siguen ventilando. Al resolverse, el indicador queda fijo 30 s. Primero el paciente, luego el equipo.',p:'16, 36-43'},
   {id:'rr',x:50,y:115,w:180,h:110,l:'FR',fill:'#05080D',tc:'#49F27A',i:'Frecuencia respiratoria: 0 u 8-30 rpm. <b>FR 0 = modo RCP</b>: solo ventila al pulsar MANUAL TRIGGER.',p:'13-15'},
   {id:'vt',x:245,y:115,w:180,h:110,l:'VT',fill:'#05080D',tc:'#49F27A',i:'Volumen corriente: 200-800 mL. Aquí salen también los códigos de error (E13 frío, E15 batería, E16 calor).',p:'13-15, 40'},
   {id:'pip',x:440,y:115,w:180,h:110,l:'PIP',fill:'#05080D',tc:'#49F27A',i:'Límite de presión: 10-60 cmH2O (30 de inicio, 20 en modo RCP). Si se alcanza, salta PIP REACHED y la respiración se corta. <b>No pasar de 35</b>; los cambios, por orden médica.',p:'13-15'},
   {id:'peep',x:635,y:115,w:180,h:110,l:'PEEP',fill:'#05080D',tc:'#49F27A',i:'PEEP: 0-20 cmH2O, por orden médica. En modo RCP se desactiva.',p:'13-15'},
   {id:'arrows',x:50,y:235,w:765,h:40,l:'▲ ▼   flechas de cada parámetro',fill:'#3B4558',sz:16,i:'Suben o bajan el parámetro. <b>Nada se aplica hasta pulsar CONFIRM.</b> Si FR × VT supera unos 12,5 L/min, sale HIGH MV y no se acepta: ajusten primero el parámetro que van a bajar.',p:'30, 43'},
   {id:'presets',x:50,y:310,w:800,h:52,l:'129 · 137 · 145 · 152 · 160 · 168 · 175 · 183 · 191 cm',fill:'#0E7C86',sz:17,i:'Presets por altura: cargan FR y VT (unos 6 mL/kg de peso ideal). Elijan la altura y pulsen CONFIRM. También sirven para <b>salir del modo RCP</b>.',p:'14, 24'},
   {id:'power',x:50,y:385,w:150,h:58,l:'POWER',fill:'#2E7D32',i:'Encender: pulsar 1 s. <b>Apagar: mantener 3 s.</b>',p:'13, 44'},
   {id:'mute',x:215,y:385,w:120,h:58,l:'MUTE',i:'Silencia la alarma 120 s. Una alarma nueva anula el silencio. Silenciar no resuelve nada.',p:'15, 36'},
   {id:'heart',c:true,x:395,y:414,r:30,l:'♥',fill:'#7A1F1F',i:'Guía de compresiones: parpadea a 100/min en modo RCP.',p:'15, 32-33'},
   {id:'trigger',x:450,y:385,w:200,h:58,l:'MANUAL TRIGGER',fill:'#0E7C86',i:'Da una respiración con el VT fijado. En modo RCP es la única forma de ventilar. El fabricante lo pensó para el 30:2 con mascarilla; con tubo, la ERC indica 1 cada 6 s, y si salta PIP REACHED una y otra vez → bolsa. <b>Con mascarilla, lo pulsa el líder.</b> Fuera del modo RCP, solo da una respiración extra durante la espiración.',p:'15, 32-33'},
   {id:'confirm',x:665,y:385,w:185,h:58,l:'CONFIRM',fill:'#D9A400',tc:'#111',i:'Aplica los cambios (parpadea si hay alguno pendiente). <b>Pulsado sin cambios, muestra 3 s la PIP y la PEEP medidas</b>: úsenlo en la ronda de cada 5 min.',p:'14, 32'},
   {id:'leds',x:50,y:455,w:800,h:32,l:'Batería ▮▮▮▮ · red externa · preset activo · user defined',fill:'#3B4558',sz:14,i:'4 LED de batería: 4 > 75 %, 3 > 50 %, 2 > 25 %, 1 > 10 %; 1 parpadeando < 10 %. Indicadores de alimentación externa, preset por altura activo y parámetros cambiados por el usuario.',p:'13-14'}
  ]}
};

/* ---------- Autoevaluación ---------- */
window.QUIZ={
 lp12:[
  {q:'Al encenderlo con la configuración de fábrica, ¿en qué modo arranca el LIFEPAK 12?',o:['En modo DEA','En modo manual y monitor, con la derivación II','En modo marcapasos'],a:1,w:'De fábrica arranca como desfibrilador manual y monitor. Para usarlo como DEA se pulsa ANALYZE [4-13].'},
  {q:'Van en marcha y el paciente entra en parada. ¿Cuándo pulsan ANALYZE?',o:['En marcha, para no perder tiempo','Con el vehículo parado y sin compresiones durante el análisis','Solo al llegar al hospital'],a:1,w:'El movimiento puede provocar una descarga inadecuada o que no se aconseje la descarga cuando sí toca [4-4].'},
  {q:'En el checklist diario, la prueba con la carga de prueba (Test Load) se hace a…',o:['10 J','200 J, y debe aparecer ENERGY DELIVERED','360 J, sin mirar el mensaje'],a:1,w:'Apéndice C: 200 J → CHARGE → SHOCK → ENERGY DELIVERED. El User Test usa 10 J internamente.'},
  {q:'Cargan a 200 J en manual y no descargan. ¿Qué pasa a los 60 s?',o:['Descarga sola','La energía se elimina dentro del equipo','Se queda cargado indefinidamente'],a:1,w:'A los 60 s, la energía se retira dentro del equipo [4-16].'},
  {q:'En pleno marcapasos se despega un parche. Lo vuelven a pegar. ¿Qué más hay que hacer?',o:['Nada: vuelve a estimular igual','Volver a subir la corriente: se ha puesto a 0 mA','Apagar y encender el equipo'],a:1,w:'Sale PACING STOPPED y la corriente vuelve a 0 mA; al recolocarlo hay que subirla a mano [4-20].'},
  {q:'Durante una cardioversión, el paciente pasa a FV. ¿Qué hacen?',o:['Mantener SYNC y descargar','Apagar SYNC y desfibrilar','Esperar a que vuelva a tener QRS'],a:1,w:'En SYNC, el equipo busca un QRS para descargar; en FV no lo hay.'},
  {q:'Paciente rescatado de un incendio con SpO2 98 %. ¿Qué piensan?',o:['Está bien oxigenado','Con CO, la SpO2 puede salir normal aunque haya hipoxia','El sensor está roto'],a:1,w:'La carboxihemoglobina falsea la pulsioximetría [3-16].'},
  {q:'¿Qué posición de los parches NO sirve para el modo DEA?',o:['Anterolateral','Anteroposterior'],a:1,w:'La anteroposterior vale para el modo manual, la cardioversión y el marcapasos, pero no para el DEA ni para monitorizar [4-2].'},
  {q:'¿Con qué se limpia el LIFEPAK 12?',o:['Lejía diluida','Alcohol isopropílico, amonios cuaternarios o ácido peracético, con un paño húmedo','Se sumerge en desinfectante'],a:1,w:'Nunca lejía, fenoles, abrasivos ni inflamables. No sumergir [8-4, 7-6].'},
  {q:'Los parches QUIK-COMBO pediátricos son para…',o:['Menores de 8 años, pesen lo que pesen','Menos de 15 kg','Menos de 25 kg'],a:1,w:'Manual del LP12: pediátricos para menos de 15 kg; los de adulto, para 15 kg o más [5-2].'}
 ],
 save:[
  {q:'¿Cuál de estas condiciones exige el fabricante para usar el SAVe II+?',o:['Tener O2 a presión','Capnografía (o volumen espirado) funcionando','Paciente de más de 18 años'],a:1,w:'Sin capnografía o volumen espirado no se usa: bolsa. El límite es de peso (45 kg), no de edad.'},
  {q:'Eligen 175 cm. ¿Cuándo empieza a ventilar con esos valores?',o:['En cuanto pulsan la altura','Al pulsar CONFIRM','A los 10 s'],a:1,w:'Ningún cambio se aplica sin CONFIRM.'},
  {q:'FR 15 y VT 420 mL. ¿Qué flujo de O2 ponen al tubo reservorio?',o:['2 L/min','7 L/min (6,3 redondeado hacia arriba)','15 L/min siempre'],a:1,w:'Flujo = volumen minuto, redondeado hacia arriba → FiO2 cercana al 100 %.'},
  {q:'¿Qué alarmas detienen la ventilación?',o:['DISCONNECT y PIP REACHED','DEVICE, HIGH PEEP y la batería en reserva','Todas'],a:1,w:'Paran y abren la válvula: hay que ventilar con bolsa ya.'},
  {q:'Salta PIP REACHED. ¿Por dónde empiezan?',o:['Subo la PIP a 50','Paciente: tubo, secreciones, neumotórax… (DOPE)','Silencio con MUTE'],a:1,w:'Primero el paciente. Sin causa clara → bolsa. No pasar de una PIP de 35.'},
  {q:'En la parada, ¿cómo se pone el SAVe en modo RCP?',o:['Pulsando MANUAL TRIGGER','Bajando la FR a 0 y CONFIRM','Apagándolo'],a:1,w:'Con FR 0, solo ventila al pulsar MANUAL TRIGGER. PIP 20 y sin PEEP.'},
  {q:'El paciente recupera el pulso y siguen en FR 0. ¿Qué pasa?',o:['Ventila solo a 12 rpm','No recibe respiraciones salvo con MANUAL TRIGGER','Pasa a CPAP'],a:1,w:'Hay que salir del modo RCP: elegir la altura y CONFIRM.'},
  {q:'Paciente de 40 kg. ¿Usan el SAVe?',o:['Sí, con el preset más bajo','No: por debajo de 45 kg, bolsa del tamaño adecuado'],a:1,w:'El límite es de 45 kg, sea cual sea la edad.'},
  {q:'¿Dónde guardan el SAVe entre servicios?',o:['En la cabina de la ambulancia, al sol','En la base, cargado, sin sol y a ≤ 30 °C (≤ 40 °C solo a corto plazo)'],a:1,w:'Solo tiene cargador de red: hay que salir con la batería llena. Almacenamiento: 0-40 °C a corto plazo y 0-30 °C a largo plazo.'}
 ],
 int:[
  {q:'Suenan alarmas en los dos equipos. ¿En qué orden revisan?',o:['Equipo → paciente','Paciente → vía aérea → ventilación → circulación → equipo','La que suene más fuerte'],a:1,w:'Si en 30 s no está claro: bolsa.'},
  {q:'RCP con mascarilla y SAVe, con 3 personas: quien sella usa las dos manos. ¿Quién pulsa MANUAL TRIGGER?',o:['Nadie: el SAVe lo hace solo','El líder','Quien sella la mascarilla'],a:1,w:'Criterio del autor: con 3 personas, el líder. Con 2, mejor bolsa; quien comprime solo podría pulsarlo en la pausa si lo han ensayado.'},
  {q:'Paciente ventilado: la curva de EtCO2 desaparece de golpe al moverlo. Primera sospecha:',o:['El sensor de SpO2','Tubo desplazado o desconexión','Hipotermia'],a:1,w:'Sin curva = problema de vía aérea hasta que se demuestre lo contrario.'},
  {q:'Van a descargar a un paciente intubado y conectado al SAVe con O2 en el reservorio. ¿Qué es correcto?',o:['Sujetar el tubo con la mano durante la descarga','Cerrar o apartar el O2 libre a más de 1 m del tórax y que nadie toque al paciente','Dejar el O2 abierto junto al tórax: no pasa nada'],a:1,w:'Manual del LP12: apartar o cerrar las fuentes de gas durante la descarga [1-2]. Que el SAVe siga conectado al tubo lo decide su dirección médica.'},
  {q:'Niño de 6 años en FV. ¿Qué pasa con el modo DEA del LP12?',o:['Es igual que en el adulto','El fabricante no lo diseñó para menores de 8 años: protocolo pediátrico de la dirección médica'],a:1,w:'ERC: 4 J/kg en manual si hay alguien acreditado; si no, un desfibrilador de adulto antes que no desfibrilar.'},
  {q:'¿Qué entregan en el hospital?',o:['Solo la información verbal','12 derivaciones y CODE SUMMARY + ajustes del SAVe y alarmas + transferencia verbal'],a:1,w:'Papel y palabras.'}
 ]
};

/* ---------- Vídeos ----------
   Los vídeos de la formación (Loom) se añaden en MODS[].loom.url.
   Para añadir un vídeo de YouTube concreto: {t:'Título', yt:'ID_DEL_VIDEO', fuente:'Canal'}.
   Mientras no haya un vídeo revisado, se ofrece la búsqueda en YouTube. */
window.VIDEOS={
 lp12:[
  {t:'LIFEPAK 12: modo DEA y desfibrilación',q:'LIFEPAK 12 AED mode defibrillation training'},
  {t:'LIFEPAK 12: marcapasos transcutáneo',q:'LIFEPAK 12 transcutaneous pacing'},
  {t:'LIFEPAK 12: cardioversión sincronizada',q:'LIFEPAK 12 synchronized cardioversion'},
  {t:'ECG de 12 derivaciones: colocación de electrodos',q:'colocación electrodos ECG 12 derivaciones'}
 ],
 save:[
  {t:'Safeguard Medical: "How to Operate the SAVeII+ Interface" (canal oficial)',url:'https://www.youtube.com/@SafeguardMedical',fuente:'Canal oficial del fabricante'},
  {t:'SAVe II ventilator: puesta en marcha',q:'SAVe II ventilator AutoMedx setup'}
 ],
 int:[
  {t:'Capnografía en la parada cardiaca',q:'capnografía parada cardiaca RCP'},
  {t:'Guías ERC: soporte vital avanzado',q:'European Resuscitation Council guidelines advanced life support'}
 ]
};
