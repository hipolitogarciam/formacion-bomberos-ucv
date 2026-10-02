/* Fotos reales disponibles en assets/img/fotos/ (sin extensión). Añadan el nombre aquí al subir cada foto. */
window.PHOTOS=[];

/* Contenido: módulos, panel interactivo, autoevaluaciones y vídeos */
window.MODS=[
 {id:'lp12',n:1,title:'LIFEPAK 12',sub:'Monitor-desfibrilador',
  intro:'Checklist, modo DEA, terapias manuales (desfibrilación, cardioversión y marcapasos) y monitorización: ECG, 12 derivaciones, SpO2, PNI y EtCO2.',
  goals:['Hacer el checklist diario y saber cuándo un equipo queda fuera de servicio.','Usar el modo DEA con seguridad, también en la ambulancia.','Conocer los pasos y las trampas de la desfibrilación manual, la cardioversión y el marcapasos (personal acreditado).','Monitorizar e interpretar las trampas de la SpO2, la PNI y la EtCO2.'],
  manual:'content/manual-lp12.html',infoHtml:'assets/docs/infografia-lp12.html',panel:'lp12',
  loom:{title:'Sesión 1 · LIFEPAK 12 (≈ 12 min)',url:''}},
 {id:'save',n:2,title:'SAVe II+',sub:'Ventilador de transporte',
  intro:'Cuándo usarlo y cuándo no, puesta en marcha con prueba de alarmas, presets por altura, oxígeno, modo RCP y resolución de alarmas.',
  goals:['Decidir entre bolsa y ventilador según las condiciones del fabricante.','Poner en marcha el SAVe y probar sus alarmas.','Calcular el flujo de O2 y usar el modo RCP.','Resolver DISCONNECT, PIP REACHED y HIGH PEEP empezando por el paciente.'],
  manual:'content/manual-save.html',infoHtml:'assets/docs/infografia-save.html',panel:'save',
  loom:{title:'Sesión 2 · SAVe II+ (≈ 11 min)',url:''}},
 {id:'int',n:3,title:'Integración clínica',sub:'Los dos equipos en el paciente',
  intro:'Roles, el orden de conexión, la ronda de 5 minutos, alarmas simultáneas, parada en el paciente ventilado, niños y entrega en el hospital.',
  goals:['Repartir papeles con 2 o 3 personas.','Seguir el orden paciente → vía aérea → ventilación → circulación → equipo.','Manejar una parada en un paciente conectado al SAVe.','Saber qué no hacer en niños y en zonas con humo.'],
  manual:'content/manual-integracion.html',infoHtml:'assets/docs/infografia-int.html',panel:null,
  loom:{title:'Sesión 3 · Integración clínica (≈ 10 min)',url:''}}
];

/* ---------- Alturas del SAVe II+: etiquetas del propio equipo (pies y metros). FR y VT de cada preset [14, 24] ---------- */
window.SAVE_HEIGHTS=[
 {id:'4-3',ft:'4\'3"',m:'1,30 m',rr:20,vt:250},{id:'4-6',ft:'4\'6"',m:'1,37 m',rr:21,vt:250},{id:'4-9',ft:'4\'9"',m:'1,45 m',rr:21,vt:260},
 {id:'5-0',ft:'5\'',m:'1,52 m',rr:20,vt:300},{id:'5-3',ft:'5\'3"',m:'1,60 m',rr:18,vt:340},{id:'5-6',ft:'5\'6"',m:'1,67 m',rr:16,vt:380},
 {id:'5-9',ft:'5\'9"',m:'1,75 m',rr:15,vt:420},{id:'6-0',ft:'6\'',m:'1,82 m',rr:14,vt:470},{id:'6-3',ft:'6\'3"',m:'1,90 m',rr:13,vt:510}
];
window.heightLabel=h=>`${h.m} (${h.ft})`;

/* ---------- Panel interactivo (esquemas de elaboración propia, no a escala; disposición según el equipo real) ---------- */
window.PANELS=(function(){
 const D='#23282E',Y='#E8B500',INK='#11161F';
 // LIFEPAK 12: rejilla del altavoz
 const spk=[];for(let dx=-36;dx<=36;dx+=12)for(let dy=-36;dy<=36;dy+=12)if(dx*dx+dy*dy<=38*38)spk.push({t:'circle',x:150+dx,y:730+dy,r:2.6,fill:'#9A9482'});
 // SAVe II+: presets en el óvalo alrededor de CONFIRM (posiciones según el equipo real)
 const C=[451,268],POS=[[334,388],[251,321],[259,239],[331,175],[451,148],[570,175],[644,239],[640,321],[570,388]];
 const presets=SAVE_HEIGHTS.map((h,i)=>({id:'H'+h.id,x:POS[i][0]-42,y:POS[i][1]-22,w:84,h:44,r:10,l:h.ft,fill:'#3B7DDD',sz:22,n:`Preset ${heightLabel(h)}`,
   i:`Altura ${heightLabel(h)}: FR ${h.rr} y VT ${h.vt} mL, unos 6 mL/kg de peso ideal. Elijan la altura y pulsen CONFIRM. Para <b>salir del modo RCP</b> hay que subir la FR por encima de 0 (por ejemplo, con un preset de altura) y pulsar CONFIRM: comprueben en su equipo que el preset sale del modo RCP.`,p:'14, 24'}));
 const metric=SAVE_HEIGHTS.map((h,i)=>({t:'text',x:Math.round(C[0]+(POS[i][0]-C[0])*1.5),y:Math.round(C[1]+(POS[i][1]-C[1])*1.5),s:h.m,sz:16,fill:'#E6E8EA',w:600}));
 const pm=(id,cx,n)=>({id:'pm-'+id,x:cx-58,y:632,w:116,h:56,r:28,fill:'#1D2A3D',stroke:'#3B7DDD',n:`− + de ${n}`,
   extra:[{t:'circle',x:cx-28,y:660,r:22,fill:'#3B7DDD'},{t:'circle',x:cx+28,y:660,r:22,fill:'#3B7DDD'},{t:'text',x:cx-28,y:660,s:'−',sz:32},{t:'text',x:cx+28,y:660,s:'+',sz:32}],
   i:'Bajan (−) o suben (+) el parámetro de encima. <b>Nada se aplica hasta pulsar CONFIRM.</b> Si FR × VT supera unos 12,5 L/min, sale HIGH MV y no se acepta: ajusten primero el parámetro que van a bajar.',p:'30, 43'});
 const disp=(id,x,w,val,n,i,p)=>({id,x,y:560,w,h:64,r:4,fill:'#0A0C0D',stroke:'#2B2F33',l:val,tc:'#9BE34A',sz:44,n,i,p});
 return {
 lp12:{title:'LIFEPAK 12 · frontal',vb:'0 0 1000 990',
  acred:['energy','charge','shock','sync','pacer','rate','current','pause'], // terapias manuales: aviso de personal acreditado (regla 3)
  deco:[
   {t:'rect',x:50,y:20,w:910,h:860,r:40,fill:'#E8E3D3',stroke:'#A89F86',sw:3},
   {t:'rect',x:22,y:250,w:46,h:390,r:8,fill:'#2B3036'},{t:'text',x:45,y:434,s:'ECG',sz:14},
   {t:'rect',x:330,y:48,w:270,h:72,r:22,fill:'#2E3239'},
   {t:'rect',x:80,y:42,w:220,h:86,r:6,fill:'#F7F5EE',stroke:'#CFC8B4'},{t:'text',x:190,y:84,s:'LIFEPAK 12',sz:32,fill:'#1E1E1E'},{t:'text',x:190,y:112,s:'DEFIBRILLATOR/MONITOR',sz:11,fill:'#555555',w:600},
   {t:'rect',x:640,y:34,w:300,h:100,r:6,fill:'#F7F5EE',stroke:'#CFC8B4'},{t:'text',x:790,y:56,s:'MANUAL · AED · PACER',sz:12,fill:'#444444'},
   {t:'rect',x:670,y:70,w:240,h:5,fill:'#C9C3B2'},{t:'rect',x:670,y:86,w:220,h:5,fill:'#C9C3B2'},{t:'rect',x:670,y:102,w:240,h:5,fill:'#C9C3B2'},{t:'rect',x:670,y:118,w:180,h:5,fill:'#C9C3B2'},
   {t:'rect',x:70,y:148,w:870,h:500,r:24,fill:'#D7D4CA'},
   {t:'rect',x:250,y:162,w:295,h:468,r:18,fill:'#ECE9E0',stroke:'#C2BCA8'},
   {t:'rect',x:84,y:396,w:152,h:232,r:12,fill:'#3B4149'},
   {t:'rect',x:556,y:158,w:380,h:592,r:16,fill:'#343A42'},
   {t:'rect',x:566,y:226,w:178,h:164,r:10,fill:'#3F7FD0'},{t:'path',d:'M744 344 H756 V332 L774 362 L756 392 V380 H744 Z',fill:'#3F7FD0'},
   {t:'rect',x:764,y:226,w:166,h:164,r:10,fill:'#8F969E'},
   {t:'rect',x:764,y:452,w:166,h:218,r:10,fill:'#2F6B4A'},
   {t:'text',x:756,y:195,s:'1',sz:26},{t:'text',x:756,y:260,s:'2',sz:26},{t:'text',x:756,y:316,s:'3',sz:26},
   {t:'circle',x:584,y:184,r:6,fill:'#5F656C'},{t:'text',x:596,y:184,s:'Batt Chg',sz:16,a:'start',w:600},
   {t:'circle',x:584,y:208,r:6,fill:'#5F656C'},{t:'text',x:596,y:208,s:'Service',sz:16,a:'start',w:600},
   {t:'text',x:850,y:690,s:'SELECTOR',sz:15,ls:3},
   {t:'circle',x:850,y:778,r:72,fill:'#E8E3D3',stroke:'#A89F86',sw:2},
   {t:'text',x:500,y:918,s:'Según las opciones del equipo (no están en todos los modelos):',sz:17,fill:'currentColor',w:600}
  ],
  hot:[
   {id:'leds',ghost:true,x:570,y:170,w:150,h:52,n:'Luces BATT CHG y SERVICE',i:'<b>BATT CHG:</b> hay una batería cargándose con el adaptador de red. <b>SERVICE:</b> ha fallado el autotest: equipo fuera de servicio y aviso al técnico.',p:'2-5'},
   {id:'on',x:775,y:172,w:150,h:46,r:23,fill:'#287A3E',l:'ON',led:true,n:'1 · ON',i:'Enciende y apaga el equipo. <b>De fábrica arranca como desfibrilador manual y monitor</b>, con la derivación II. Antes de encender para el checklist, desconecten de la red y esperen 2 s.',p:'2-5, 4-13'},
   {id:'energy',x:775,y:236,w:150,h:48,r:24,fill:D,l:'ENERGY\nSELECT',sz:15,arrows:true,n:'2 · ENERGY SELECT ▼▲',i:'Elige la energía en modo manual (hasta 360 J): ▼ baja y ▲ sube. Desde el modo DEA, pulsarlo pasa a manual si la configuración lo permite. <b>Si cambian la energía mientras carga, la carga se elimina.</b>',p:'4-15, 4-16'},
   {id:'charge',x:775,y:294,w:150,h:44,r:22,fill:Y,tc:'#111111',l:'CHARGE',n:'3 · CHARGE',i:'Carga el desfibrilador en modo manual. Al terminar suena un tono. <b>Si no descargan en 60 s, la energía se elimina dentro del equipo.</b> Al cargar, el marcapasos se para.',p:'4-15, 4-20'},
   {id:'shock',x:775,y:344,w:150,h:40,r:20,fill:'#D32F2F',l:'SHOCK',led:true,n:'SHOCK',i:'Descarga. Antes, "¡fuera todos!". En la cardioversión, <b>manténganlo pulsado</b> hasta que descargue con el siguiente QRS.',p:'4-6, 4-16'},
   {id:'advisory',x:578,y:238,w:156,h:44,r:22,fill:D,l:'ADVISORY',led:true,n:'ADVISORY',i:'Activa la vigilancia continua del ritmo (CPSS) en modo DEA. Desde el DEA, pulsarlo puede pasar a manual según la configuración.',p:'4-11'},
   {id:'analyze',x:578,y:296,w:156,h:44,r:22,fill:Y,tc:'#111111',l:'ANALYZE',led:true,n:'ANALYZE',i:'Modo DEA: analiza el ritmo. <b>Vehículo parado y nadie tocando al paciente.</b> Si es desfibrilable, carga solo y pide SHOCK; si no pulsan en 60 s, se desarma. La flecha azul del panel lleva de ANALYZE a SHOCK.',p:'4-4 a 4-6'},
   {id:'sync',x:775,y:398,w:150,h:44,r:22,fill:D,l:'SYNC',led:true,n:'SYNC',i:'Activa la cardioversión sincronizada: debe salir <b>una marca sobre cada QRS</b>. Si el paciente pasa a FV, apaguen SYNC y desfibrilen. Que siga activo tras descargar depende de la configuración (SYNC AFTER SHOCK).',p:'4-16, 9-4'},
   {id:'pacer',x:775,y:462,w:150,h:44,r:22,fill:D,l:'PACER',led:true,n:'PACER',i:'Enciende o apaga el marcapasos transcutáneo. Necesita los parches y también el cable de ECG para funcionar a demanda.',p:'4-19'},
   {id:'rate',x:775,y:514,w:150,h:44,r:22,fill:D,l:'RATE',arrows:true,n:'RATE ▼▲',i:'Frecuencia del marcapasos: 40-170 ppm. Cada pulsación cambia 10 ppm (▼ baja, ▲ sube); el SELECTOR la cambia de 5 en 5.',p:'4-19, A-7'},
   {id:'current',x:775,y:566,w:150,h:44,r:22,fill:D,l:'CURRENT',sz:16,arrows:true,n:'CURRENT ▼▲',i:'Corriente: 0-200 mA. Cada pulsación cambia 10 mA (▼ baja, ▲ sube); el SELECTOR la cambia de 5 en 5. Súbanla hasta la captura y <b>comprueben el pulso</b>. Si se suelta un parche, vuelve a 0.',p:'4-20, A-7'},
   {id:'pause',x:775,y:618,w:150,h:44,r:22,fill:D,l:'PAUSE',n:'PAUSE',i:'Mientras se mantiene pulsado, estimula al 25 % de la frecuencia para ver el ritmo propio del paciente.',p:'4-20'},
   {id:'alarms',x:578,y:514,w:156,h:44,r:22,fill:Y,tc:'#111111',l:'ALARMS',led:true,n:'ALARMS',i:'Activa las alarmas (QUICK SET pone límites sobre los valores actuales). Con una alarma sonando, la silencia 2 min. <b>Con el paciente inestable no repitan QUICK SET</b>: silencien hasta 15 min.',p:'2-22 a 2-24'},
   {id:'options',x:578,y:566,w:156,h:44,r:22,fill:D,l:'OPTIONS',n:'OPTIONS',i:'Menú de opciones: datos del paciente, modo de marcapasos (demanda o no demanda), impresión de la configuración y <b>User Test</b> (se carga a 10 J, descarga dentro del equipo e imprime "Pasa" o "Falla").',p:'2-9, 8-3'},
   {id:'event',x:578,y:618,w:156,h:44,r:22,fill:D,l:'EVENT',n:'EVENT',i:'Registra sucesos (fármacos, intubación…) con hora. Salen en el CODE SUMMARY.',p:'2-8'},
   {id:'home',x:578,y:676,w:96,h:66,r:10,fill:'#343A42',stroke:'#343A42',icon:'home',label2:'Home Screen',sz:20,n:'HOME SCREEN',i:'Vuelve de inmediato a la pantalla principal.',p:'2-7'},
   {id:'selector',c:true,x:850,y:778,r:56,fill:'#1A1A1A',extra:[{t:'circle',x:850,y:778,r:20,fill:'#2C2C2C'}],n:'SELECTOR',i:'Botón giratorio: se gira para moverse por los menús y ajustar valores (frecuencia y corriente del marcapasos de 5 en 5) y se pulsa para elegir. <b>Pulsado con el equipo cargado, retira la carga.</b>',p:'2-8, 4-15, 4-19'},
   {id:'screen',ghost:false,x:266,y:182,w:263,h:400,r:8,fill:'#0D1218',stroke:'#0D1218',l:'PANTALLA',tc:'#49F27A',sz:24,n:'Pantalla',i:'ECG, FC, SpO2, PNI, EtCO2, mensajes, energía, indicador de la alarma FV/TV y estado de las 2 baterías. La batería en uso aparece resaltada.',p:'2-14 a 2-17'},
   {id:'transmit',x:99,y:416,w:122,h:48,r:24,fill:D,l:'TRANSMIT',sz:16,n:'TRANSMIT',i:'Transmite informes (módem o fax). En esta formación no se usa: hemos omitido la telemedicina.',p:'6-7'},
   {id:'code',x:99,y:476,w:122,h:62,r:24,fill:D,l:'CODE\nSUMMARY',sz:15,n:'CODE SUMMARY',i:'Imprime el resumen del evento: descargas, análisis, sucesos y constantes. <b>Imprímanlo al terminar</b>: la memoria borra al paciente más antiguo cuando se llena.',p:'6-2 a 6-5'},
   {id:'print',x:99,y:552,w:122,h:48,r:24,fill:D,l:'PRINT',sz:16,n:'PRINT',i:'Imprime una tira del ECG en tiempo real.',p:'2-12'},
   {id:'ecg',c:true,x:45,y:470,r:20,fill:'#3E8E5A',n:'Conector del cable de ECG',i:'Conector del cable de ECG, en el lateral izquierdo. En los laterales van también los conectores de SpO2, PNI y CO2, si el equipo tiene esas opciones.',p:'2-10, 2-11'},
   {id:'speaker',c:true,x:150,y:730,r:50,fill:'#D2CDBE',stroke:'#B7AF98',extra:spk,n:'Altavoz',i:'Altavoz: tonos, alarmas y mensajes de voz.',p:'2-10, 2-11'},
   {id:'printer',x:250,y:660,w:295,h:165,r:8,fill:'#E1DCCD',stroke:'#B7AF98',extra:[{t:'rect',x:268,y:690,w:259,h:10,r:3,fill:'#9E967F'}],l:'IMPRESORA',tc:'#6B6452',sz:18,n:'Impresora',i:'Imprime las tiras de ECG, el 12 derivaciones y el CODE SUMMARY. Papel de 50 o 100 mm.',p:'2-10, 2-11'},
   {id:'therapy',c:true,x:712,y:822,r:30,fill:'#1A1A1A',extra:[{t:'circle',x:712,y:822,r:14,fill:'#3A3A3A'}],n:'Conector del cable de terapia',i:'Conector del cable de terapia (QUIK-COMBO o palas). El cable y su conector se revisan cada día en el checklist.',p:'2-10, 2-11'},
   {id:'warn',x:250,y:836,w:295,h:30,r:4,fill:'#F7F5EE',stroke:'#CFC8B4',l:'DANGER · EXPLOSION HAZARD',tc:'#333333',sz:13,n:'Etiqueta de peligro',i:'Etiqueta del equipo: riesgo de explosión, <b>no usar en presencia de gases inflamables</b>. Salida eléctrica peligrosa: solo personal cualificado.',src:'Etiqueta del propio equipo'},
   {id:'12lead',dash:true,x:110,y:934,w:170,h:46,r:23,fill:D,l:'12-LEAD',n:'12-LEAD (según el modelo)',i:'Adquiere e imprime el ECG de 12 derivaciones (con el cable de 12 derivaciones). <b>Vehículo parado y paciente quieto.</b> Con NOISY DATA, corrijan el ruido; con más de 30 s de ruido se cancela.',p:'3-8 a 3-16'},
   {id:'nibp',dash:true,x:310,y:934,w:170,h:46,r:23,fill:D,l:'NIBP',n:'NIBP (según el modelo)',i:'Inicia una medición de la tensión arterial: tarda unos 40 s y se cancela a los 120 s. <b>Nunca en el brazo del suero.</b>',p:'3-26'},
   {id:'lead',dash:true,x:510,y:934,w:170,h:46,r:23,fill:D,l:'LEAD',n:'LEAD (según el modelo)',i:'Cambia la derivación del ECG. Para la alarma FV/TV solo valen PADDLES o II.',p:'3-2'},
   {id:'size',dash:true,x:710,y:934,w:170,h:46,r:23,fill:D,l:'SIZE',n:'SIZE (según el modelo)',i:'Cambia el tamaño del ECG. Si en SYNC las marcas faltan o caen sobre la onda T, ajusten el tamaño (más o menos) o cambien la derivación: una mala sincronización puede provocar una FV.',p:'3-3, 4-16'}
  ]},
 save:{title:'SAVe II+ · frontal',vb:'0 0 900 860',
  deco:[
   {t:'rect',x:30,y:20,w:840,h:720,r:34,fill:'#3A3D42'},
   {t:'rect',x:62,y:44,w:776,h:480,r:16,fill:'#62676E'},
   {t:'rect',x:62,y:516,w:776,h:200,r:16,fill:'#141618'},
   {t:'rect',x:294,y:8,w:312,h:62,r:16,fill:'#3A3D42'},{t:'text',x:450,y:40,s:'SAVe II+',sz:34},
   {t:'ellipse',x:451,y:268,rx:300,ry:196,fill:'#575C63'},
   {t:'ellipse',x:451,y:268,rx:268,ry:168,fill:'#BFC4CA'},
   {t:'ellipse',x:451,y:268,rx:196,ry:116,fill:'#4E535A'},
   ...metric,
   {t:'circle',x:405,y:392,r:7,fill:'#E6E8EA'},{t:'rect',x:399,y:401,w:12,h:24,r:4,fill:'#E6E8EA'},
   {t:'circle',x:515,y:382,r:9,fill:'#E6E8EA'},{t:'rect',x:507,y:393,w:16,h:34,r:5,fill:'#E6E8EA'},
   {t:'path',d:'M133 288 L121 306 H130 L125 322 L139 302 H130 Z',fill:'#C9CDD2'},
   {t:'text',x:174,y:546,s:'RESPIRATORY RATE (BPM)',sz:14,fill:'#E6E8EA',w:600},{t:'text',x:366,y:546,s:'TIDAL VOLUME (ML)',sz:14,fill:'#E6E8EA',w:600},
   {t:'text',x:560,y:546,s:'PIP (CMH2O)',sz:14,fill:'#E6E8EA',w:600},{t:'text',x:728,y:546,s:'PEEP (CMH2O)',sz:14,fill:'#E6E8EA',w:600},
   {t:'text',x:450,y:770,s:'Otros indicadores (su posición exacta no se representa en el esquema):',sz:16,fill:'currentColor',w:600}
  ],
  hot:[
   {id:'power',c:true,x:129,y:113,r:30,fill:'#C9CDD2',tc:'#3A3D42',icon:'power',n:'POWER',i:'Encender: pulsar 1 s. <b>Apagar: mantener 3 s.</b>',p:'13, 44'},
   {id:'mute',c:true,x:771,y:113,r:30,fill:'#C9CDD2',tc:'#3A3D42',icon:'mute',n:'MUTE',i:'Silencia la alarma 120 s. Una alarma nueva anula el silencio. Silenciar no resuelve nada.',p:'15, 36'},
   {id:'batt',ghost:true,x:104,y:184,w:52,h:144,n:'LED de batería',extra:[0,1,2,3].map(k=>({t:'rect',x:121,y:194+k*17,w:16,h:12,r:2,fill:'#7BD34A'})),i:'4 LED de batería: 4 > 75 %, 3 > 50 %, 2 > 25 %, 1 > 10 %; 1 parpadeando < 10 %. Debajo, el indicador de alimentación externa.',p:'13-14'},
   ...presets,
   {id:'confirm',x:391,y:242,w:120,h:72,r:36,fill:'#3B7DDD',l:'CONFIRM',sz:19,n:'CONFIRM',i:'Aplica los cambios (parpadea si hay alguno pendiente). <b>Pulsado sin cambios, muestra 3 s la PIP y la PEEP medidas</b>: úsenlo en la ronda de cada 5 min.',p:'14, 32'},
   {id:'trigger',c:true,x:745,y:457,r:44,fill:'#3B7DDD',l:'MANUAL\nTRIGGER',sz:14,extra:[{t:'circle',x:800,y:457,r:5,fill:'#5F656C'}],n:'MANUAL TRIGGER',i:'Da una respiración con el VT fijado. En modo RCP es la única forma de ventilar. El fabricante lo pensó para el 30:2 con mascarilla; con tubo, las guías ERC 2025 (soporte vital avanzado) indican 1 cada 6 s, y si salta PIP REACHED una y otra vez → bolsa. SAVe en modo RCP o bolsa: lo decide su dirección médica. <b>Con mascarilla, lo pulsa el líder.</b> Fuera del modo RCP, solo da una respiración extra durante la espiración.',p:'15, 32-33'},
   {id:'adultpre',ghost:true,x:84,y:474,w:236,h:38,extra:[{t:'circle',x:100,y:493,r:7,fill:'#2B2E33',stroke:'#C9CDD2',sw:1.5},{t:'text',x:116,y:493,s:'ADULT PRESETS',sz:17,a:'start',fill:'#E6E8EA'}],n:'Indicador ADULT PRESETS',i:'Se enciende cuando el equipo ventila con un preset por altura.',p:'13-14'},
   {id:'userdef',ghost:true,x:346,y:474,w:214,h:38,extra:[{t:'circle',x:362,y:493,r:7,fill:'#2B2E33',stroke:'#C9CDD2',sw:1.5},{t:'text',x:378,y:493,s:'USER DEFINED',sz:17,a:'start',fill:'#E6E8EA'}],n:'Indicador USER DEFINED',i:'Se enciende cuando se han cambiado los parámetros a mano y se han confirmado con CONFIRM.',p:'13-14'},
   disp('rr',126,96,'15','FR (frecuencia respiratoria)','Frecuencia respiratoria: 0 u 8-30 rpm. <b>FR 0 = modo RCP</b>: solo ventila al pulsar MANUAL TRIGGER.','13-15'),
   disp('vt',291,150,'420','VT (volumen corriente)','Volumen corriente: 200-800 mL. Aquí salen también los códigos de error (E13 frío extremo, E16 calor extremo).','13-15, 40'),
   disp('pip',512,97,'30','PIP (límite de presión)','Límite de presión: 10-60 cmH2O (30 de inicio, 20 en modo RCP). Si se alcanza, salta PIP REACHED y la respiración se corta. <b>Fuera de la RCP, no pasar de 35.</b> En la RCP, el límite lo fija su dirección médica (guías ERC 2025, soporte vital avanzado: alarma a 60-70). Los cambios, por orden médica.','13-15'),
   disp('peep',678,99,'0','PEEP','PEEP: 0-20 cmH2O, por orden médica. En modo RCP se desactiva.','13-15'),
   pm('rr',174,'FR'),pm('vt',366,'VT'),pm('pip',560,'PIP'),pm('peep',728,'PEEP'),
   {id:'alarmpanel',dash:true,x:40,y:790,w:520,h:48,r:10,fill:'#141618',l:'ALARMAS · DEVICE · DISCONNECT · PIP REACHED · HIGH PEEP…',tc:'#FF6B6B',sz:15,n:'Alarmas',i:'Alarmas: DEVICE · DISCONNECT · PIP REACHED · BATTERY · HIGH PEEP · LOW PEEP · HIGH MV · BREATH · BREATH ASSIST. <b>Paran la ventilación: DEVICE, HIGH PEEP y la batería en reserva → bolsa ya.</b> Las demás siguen ventilando. Al resolverse, el indicador queda fijo 30 s. Primero el paciente, luego el equipo.',p:'16, 36-43'},
   {id:'heart',dash:true,x:580,y:790,w:280,h:48,r:10,fill:'#3A1F22',l:'♥ GUÍA DE COMPRESIONES',tc:'#FF8A8A',sz:15,n:'♥ Guía de compresiones',i:'Parpadea a 100/min en modo RCP como guía para las compresiones; las compresiones van a 100-120/min y de 5 a 6 cm (guías ERC 2025, soporte vital básico).',p:'15, 32-33'}
  ]}
 };
})();

/* ---------- Autoevaluación ---------- */
window.QUIZ={
 lp12:[
  {q:'Al encenderlo con la configuración de fábrica, ¿en qué modo arranca el LIFEPAK 12?',o:['En modo DEA','En modo manual y monitor, con la derivación II','En modo marcapasos'],a:1,w:'De fábrica arranca como desfibrilador manual y monitor. Para usarlo como DEA se pulsa ANALYZE [4-13].'},
  {q:'Van en marcha y el paciente entra en parada. ¿Cuándo pulsan ANALYZE?',o:['En marcha, para no perder tiempo','Con el vehículo parado y sin compresiones durante el análisis','Solo al llegar al hospital'],a:1,w:'El movimiento puede provocar una descarga inadecuada o que no se aconseje la descarga cuando sí toca [4-4].'},
  {q:'En el checklist diario, la prueba con la carga de prueba (Test Load) se hace a…',o:['10 J','200 J, y debe aparecer ENERGY DELIVERED','360 J, sin mirar el mensaje'],a:1,w:'Apéndice C: 200 J → CHARGE → SHOCK → ENERGY DELIVERED. El User Test usa 10 J internamente.'},
  {q:'Cargan a 200 J en manual y no descargan. ¿Qué pasa a los 60 s?',o:['Descarga sola','La energía se elimina dentro del equipo','Se queda cargado indefinidamente'],a:1,w:'Solo personal acreditado, con orden médica y según protocolo. A los 60 s, la energía se retira dentro del equipo [4-16].'},
  {q:'En pleno marcapasos se despega un parche. Lo vuelven a pegar. ¿Qué más hay que hacer?',o:['Nada: vuelve a estimular igual','Volver a subir la corriente: se ha puesto a 0 mA','Apagar y encender el equipo'],a:1,w:'Solo personal acreditado, con orden médica y según protocolo. Sale PACING STOPPED y la corriente vuelve a 0 mA; al recolocarlo hay que subirla a mano [4-20].'},
  {q:'Durante una cardioversión, el paciente pasa a FV. ¿Qué hacen?',o:['Mantener SYNC y descargar','Apagar SYNC y desfibrilar','Esperar a que vuelva a tener QRS'],a:1,w:'Solo personal acreditado, con orden médica y según protocolo. En SYNC, el equipo busca un QRS para descargar; en FV no lo hay.'},
  {q:'Paciente rescatado de un incendio con SpO2 98 %. ¿Qué piensan?',o:['Está bien oxigenado','Con CO, la SpO2 puede salir normal aunque haya hipoxia','El sensor está roto'],a:1,w:'La carboxihemoglobina falsea la pulsioximetría [3-17].'},
  {q:'¿Qué posición de los parches NO sirve para el modo DEA?',o:['Anterolateral','Anteroposterior'],a:1,w:'La anteroposterior vale para el modo manual, la cardioversión y el marcapasos, pero no para el DEA ni para monitorizar [4-3].'},
  {q:'¿Con qué se limpia el LIFEPAK 12?',o:['Lejía diluida','Alcohol isopropílico, amonios cuaternarios o ácido peracético, con un paño húmedo','Se sumerge en desinfectante'],a:1,w:'Nunca lejía, fenoles, abrasivos ni inflamables. No sumergir [8-4, 7-6].'},
  {q:'Los parches QUIK-COMBO pediátricos son para…',o:['Menores de 8 años, pesen lo que pesen','Menos de 15 kg','Menos de 25 kg'],a:1,w:'Manual del LP12: pediátricos para menos de 15 kg; los de adulto, para 15 kg o más [5-3].'}
 ],
 save:[
  {q:'¿Cuál de estas condiciones exige el fabricante para usar el SAVe II+?',o:['Tener O2 a presión','Capnografía (o volumen espirado) funcionando','Paciente de más de 18 años'],a:1,w:'Sin capnografía o volumen espirado no se usa: bolsa [4]. El límite es de peso (45 kg), no de edad.'},
  {q:'Eligen 1,75 m (5\'9"). ¿Cuándo empieza a ventilar con esos valores?',o:['En cuanto pulsan la altura','Al pulsar CONFIRM','A los 10 s'],a:1,w:'Ningún cambio se aplica sin CONFIRM [14, 32].'},
  {q:'FR 15 y VT 420 mL. ¿Qué flujo de O2 ponen al tubo reservorio?',o:['2 L/min','7 L/min (6,3 redondeado hacia arriba)','15 L/min siempre'],a:1,w:'Flujo = volumen minuto, redondeado hacia arriba → FiO2 cercana al 100 %.'},
  {q:'¿Qué alarmas detienen la ventilación?',o:['DISCONNECT y PIP REACHED','DEVICE, HIGH PEEP y la batería en reserva','Todas'],a:1,w:'Paran y abren la válvula: hay que ventilar con bolsa ya [16, 36-43].'},
  {q:'Salta PIP REACHED. ¿Por dónde empiezan?',o:['Subo la PIP a 50','Paciente: tubo, secreciones, neumotórax… (DOPE)','Silencio con MUTE'],a:1,w:'Primero el paciente. Sin causa clara → bolsa [38-43]. No pasar de una PIP de 35 [13-15].'},
  {q:'En la parada, ¿cómo se pone el SAVe en modo RCP?',o:['Pulsando MANUAL TRIGGER','Bajando la FR a 0 y CONFIRM','Apagándolo'],a:1,w:'Con FR 0, solo ventila al pulsar MANUAL TRIGGER. PIP 20 y sin PEEP [13-15, 32-33].'},
  {q:'El paciente recupera el pulso y siguen en FR 0. ¿Qué pasa?',o:['Ventila solo a 12 rpm','No recibe respiraciones salvo con MANUAL TRIGGER','Pasa a CPAP'],a:1,w:'Hay que salir del modo RCP: subir la FR por encima de 0 (por ejemplo, con el botón de altura) y CONFIRM. Comprueben en su equipo que el botón de altura sale del modo RCP.'},
  {q:'Paciente de 40 kg. ¿Usan el SAVe?',o:['Sí, con el preset más bajo','No: por debajo de 45 kg, bolsa del tamaño adecuado'],a:1,w:'El límite es de 45 kg, sea cual sea la edad.'},
  {q:'¿Dónde guardan el SAVe entre servicios?',o:['En la cabina de la ambulancia, al sol','En la base, cargado, sin sol y a ≤ 30 °C (≤ 40 °C solo a corto plazo)'],a:1,w:'Solo tiene cargador de red: hay que salir con la batería llena. Almacenamiento: 0-40 °C a corto plazo y 0-30 °C a largo plazo.'}
 ],
 int:[
  {q:'Suenan alarmas en los dos equipos. ¿En qué orden revisan?',o:['Equipo → paciente','Paciente → vía aérea → ventilación → circulación → equipo','La que suene más fuerte'],a:1,w:'Si en 30 s no está claro: bolsa.'},
  {q:'RCP con mascarilla y SAVe, con 3 personas: quien sella usa las dos manos. ¿Quién pulsa MANUAL TRIGGER?',o:['Nadie: el SAVe lo hace solo','El líder','Quien sella la mascarilla'],a:1,w:'Criterio del autor: con 3 personas, el líder. Con 2, mejor bolsa; quien comprime solo podría pulsarlo en la pausa si lo han ensayado.'},
  {q:'Paciente ventilado: la curva de EtCO2 desaparece de golpe al moverlo. Primera sospecha:',o:['El sensor de SpO2','Tubo desplazado o desconexión','Hipotermia'],a:1,w:'Sin curva = problema de vía aérea hasta que se demuestre lo contrario.'},
  {q:'Van a descargar a un paciente intubado y conectado al SAVe con O2 en el reservorio. ¿Qué es correcto?',o:['Sujetar el tubo con la mano durante la descarga','Cerrar o apartar el O2 libre a más de 1 m del tórax y que nadie toque al paciente','Dejar el O2 abierto junto al tórax: no pasa nada'],a:1,w:'Manual del LP12: apartar o cerrar las fuentes de gas durante la descarga [1-2], a 1 m del tórax como mínimo (guías ERC 2025, soporte vital avanzado). El SAVe se queda conectado al tubo, con su salida apartada del tórax (guías ERC 2025, soporte vital avanzado); confírmenlo con su dirección médica.'},
  {q:'Niño de 6 años en FV. ¿Qué pasa con el modo DEA del LP12?',o:['Es igual que en el adulto','El fabricante no lo diseñó para menores de 8 años: protocolo pediátrico de la dirección médica'],a:1,w:'Las guías ERC 2025 (soporte vital pediátrico) recomiendan el DEA a cualquier edad, en modo adulto si no tiene modo pediátrico. Su dirección médica decide de antemano: modo manual a 4 J/kg si hay alguien acreditado (solo personal acreditado, con orden médica y según protocolo); si no, el LP12 en modo DEA.'},
  {q:'¿Qué entregan en el hospital?',o:['Solo la información verbal','12 derivaciones y CODE SUMMARY + ajustes del SAVe y alarmas + transferencia verbal'],a:1,w:'Papel y palabras.'}
 ]
};

/* ---------- Vídeos ----------
   Los vídeos de la formación (Loom) se añaden en MODS[].loom.url.
   Para añadir un vídeo de YouTube concreto: {t:'Título', yt:'ID_DEL_VIDEO', fuente:'Canal'}.
   Mientras no haya un vídeo revisado, se ofrece la búsqueda en YouTube. */
window.VIDEOS={
 lp12:[ // revisados y aprobados por el autor (02-10-2026); ver VIDEOS_CANDIDATOS.md
  {t:'LIFEPAK 12: test diario (procedimiento de DeKalb EMS)',yt:'_fAEkKdDD1Q',fuente:'TheGrogmister · DeKalb EMS'},
  {t:'LIFEPAK 12: puesta en marcha y desfibrilación',yt:'d4Xa3BrRXzw',fuente:'QRS Educational Services'},
  {t:'LIFEPAK 12: modo DEA',yt:'IQHRUdI0BGo',fuente:'Shock Value'},
  {t:'LIFEPAK 12: colocación del ECG de 12 derivaciones',yt:'4Zxf93LuTgg',fuente:'CommandeRoy · Whatcom County Medic One'},
  {t:'ECG de 12 derivaciones: colocación y calidad de la señal',yt:'ismBgo8O8ms',fuente:'Tom Bouthillet'},
  {t:'LIFEPAK 12: cardioversión sincronizada',q:'LIFEPAK 12 synchronized cardioversion'},
  {t:'LIFEPAK 12: marcapasos transcutáneo',q:'LIFEPAK 12 transcutaneous pacing'}
 ],
 save:[
  {t:'SAVe II+: puesta en marcha en 5 pasos',yt:'GKJbhbWSCms',fuente:'Safeguard Medical (fabricante)'},
  {t:'SAVe II+: modo manual y modo RCP',yt:'OzEpe6AG6x4',fuente:'Safeguard Medical (fabricante)'},
  {t:'SAVe II+: alarmas',q:'SAVe II ventilator alarms'}
 ],
 int:[
  {t:'Capnografía en la parada cardiaca',q:'capnografía parada cardiaca RCP'},
  {t:'Guías ERC: soporte vital avanzado',q:'European Resuscitation Council guidelines 2025 advanced life support'}
 ]
};
