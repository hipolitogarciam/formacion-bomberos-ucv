# CLAUDE.md — Web de formación LIFEPAK 12 y SAVe II+ (Bomberos UCV)

## Qué es este proyecto

Web estática de formación asíncrona para los **bomberos voluntarios de la UCV (Venezuela)**. Les enseña a usar:
- el monitor-desfibrilador **LIFEPAK 12** (Physio-Control/Stryker);
- el ventilador de transporte **SAVe II+** (AutoMedx/Safeguard Medical). En documentos antiguos aparece como "SAFE II": es un error.

El autor es Hipólito García, médico de Urgencias y Emergencias, responsable del contenido clínico. Se publica en **GitHub Pages**, en un repositorio público.

Contenido:
- **3 módulos:** LIFEPAK 12, SAVe II+ e integración clínica.
- **En cada módulo:**
  - vídeo de Loom;
  - manual de bolsillo;
  - panel interactivo;
  - infografía;
  - vídeos complementarios;
  - casos clínicos;
  - autoevaluación.
- **9 casos clínicos interactivos**, con un LIFEPAK 12 y un SAVe II+ virtuales.

## Restricciones del público (mandan sobre cualquier preferencia técnica)

- **Conectividad mala** (Venezuela): la web debe ser ligera y funcionar sin conexión (service worker).
  - Nada de frameworks ni pasos de compilación.
  - Nada de CDN externos ni Google Fonts: las fuentes van en `assets/fonts`.
  - Imágenes comprimidas, de 400 KB como máximo.
- **Se usa sobre todo en el móvil**: hay que probar siempre a 390 px de ancho, sin scroll horizontal.
- **Sin registro, cookies ni analítica.** No se guarda quién completa la formación: es una decisión del autor.
- **Idioma:** castellano.
  - **Tratamiento:** "ustedes/su" en todo el texto (decidido por el autor el 02-10-2026). Nunca "vosotros" ni "tú" dirigido al alumno; las opciones de los casos van en primera persona.

## Estructura

```
index.html                   Shell: cabecera, navegación y carga de los scripts
assets/css/app.css           Estilos (tokens en :root, modo oscuro). Paleta B elegida por el autor: azul marino #1D4F91 (primario, token --teal) y rojo #D2401C (acento, --orange). Sin logo de Bomberos UCV hasta confirmar el permiso
assets/js/content.js         MODS (módulos, enlaces de Loom), SAVE_HEIGHTS (alturas del SAVe), PANELS (panel interactivo), QUIZ, VIDEOS, PHOTOS
assets/js/panel.js           drawPanel(): dibuja los esquemas SVG de PANELS (panel interactivo e infografías)
assets/js/cases.js           CASES: los 9 casos (texto, opciones, check(S), react(ev,S,c), debrief)
assets/js/sim.js             Simulador: ECG en canvas, LP12 virtual, SAVe virtual, motor de casos
assets/js/app.js             Router por hash (#/, #/m/lp12/manual, #/casos, #/caso/<id>, #/acerca)
content/manual-*.html        Manuales de bolsillo (fragmentos HTML que se cargan con fetch)
assets/docs/                 Infografías A4 imprimibles: infografia-lp12.html e infografia-save.html (usan PANELS) e infografia-int.html (HTML propio)
assets/js/infografia.js      Genera las infografías A4 (panel en el centro y flechas a los cuadros)
assets/img/fotos/            Fotos REALES de los equipos (ver LEEME.md); se activan en window.PHOTOS
herramientas/recorrido_casos.js  Comprobación automática: juega los 9 casos y mide el scroll horizontal de las 33 rutas (ver su cabecera)
sw.js                        Service worker (caché sin conexión)
manifest.webmanifest         PWA
```

Probar en local: `python3 -m http.server 8765` y abrir `http://localhost:8765`. El service worker solo se registra por https, así que en local no interfiere.

## Reglas de trabajo (importantes)

1. **Cada cambio publicado → subir `VERSION` en `sw.js`.** Si no, los móviles siguen mostrando la copia antigua.
2. **Rigor clínico:**
   - Cada dato técnico del equipo lleva la página del manual entre corchetes, p. ej. `[4-16]`.
   - Lo que no venga del fabricante se marca como **"criterio del autor"** o se atribuye a las **guías ERC**.
   - No inventar cifras ni citas. Ante la duda, preguntar al autor.
3. **Las terapias manuales** (desfibrilación manual, cardioversión, marcapasos) aparecen siempre como "solo personal acreditado, con orden médica y según protocolo". Las energías, los fármacos y la vía aérea los decide la dirección médica.
4. **Copyright:** el repositorio es público.
   - No subir manuales del fabricante (PDF ni texto extraído) ni fotos o figuras de los manuales.
   - Los paneles son esquemas SVG de elaboración propia.
   - Las fotos deben ser del equipo real de los bomberos (ver `assets/img/fotos/LEEME.md`).
5. **Casos clínicos:** las opciones se barajan al mostrarse. La opción correcta lleva `ok:true`. Al tocar un caso, comprobar que se puede completar de principio a fin.
6. **Sin YouTube incrustado sin revisar:** en `VIDEOS`, `{t, yt:'ID', fuente}` solo para vídeos que el autor haya revisado. Mientras no los haya, se usan enlaces de búsqueda.
7. Los enlaces de Loom van en `MODS[].loom.url` (enlace *share*).

## Checklist antes de cada publicación

- [ ] La consola no muestra errores en todas las rutas (`#/`, los 3 módulos con todas sus pestañas, `#/casos`, cada `#/caso/<id>` y `#/acerca`).
- [ ] Los 9 casos se completan sin bloqueos.
- [ ] Sin scroll horizontal a 390 px. El modo oscuro se lee bien.
- [ ] `VERSION` de `sw.js` incrementada.
- [ ] Si cambió contenido clínico, el autor lo ha revisado.

## Fuentes (no están en el repositorio; las tiene el autor en su proyecto de Claude)

- **LIFEPAK 12** Defibrillator/Monitor Operating Instructions, Physio-Control, MIN 3207254-033 (ed. 2008-2015). Material cotejado con esta edición (01-10-2026). En la auditoría v3 (02-10-2026) se revisaron 27 citas con el PDF y se corrigieron las páginas desfasadas; el resto de citas no se ha vuelto a cotejar una por una.
- **SAVe II+** Operator's Manual M42110 Rev 5.3 (2021), a partir de un extracto documentado, más la ficha de Safeguard SGM-MKT-SV2P-01 y la FDA 510(k) K131877. **No hay manual completo:** las páginas citadas del SAVe están pendientes de cotejar.
- Guías ERC, para el criterio clínico.

## Paneles: corregir con las fotos de referencia (02-10-2026)

En la carpeta privada `~/Desktop/Formacion_Bomberos_UCV_LP12_SAVe/` hay 3 fotos de referencia **sacadas de internet o del fabricante**. **No se publican**: tienen derechos. Sirven solo para redibujar los esquemas SVG de `PANELS` (content.js) y los botones del simulador (sim.js) con la disposición real.
- **LP12 real:**
  - columna derecha: LED Batt Chg/Service, **1 ON · 2 ENERGY SELECT ▼▲ · 3 CHARGE · SHOCK**;
  - a su izquierda, ADVISORY y ANALYZE (zona azul);
  - SYNC;
  - zona verde de marcapasos: PACER · RATE ▼▲ · CURRENT ▼▲ · PAUSE;
  - ALARMS, OPTIONS y EVENT a la derecha de la pantalla; Home Screen; SELECTOR abajo a la derecha;
  - TRANSMIT, CODE SUMMARY y PRINT a la izquierda;
  - conector ECG en el lateral izquierdo, impresora abajo en el centro y altavoz abajo a la izquierda.
  - El modelo de la foto no tiene 12-LEAD, NIBP, LEAD ni SIZE en el frontal. Esos botones dependen de las opciones del equipo: confirmar con el de los bomberos.
  - La numeración 1-2-3 ya está corregida (antes ponía 1 ENERGY · 2 CHARGE · 3 SHOCK, y era un error).
- **SAVe II+ real:**
  - POWER arriba a la izquierda y MUTE arriba a la derecha; LED de batería a la izquierda;
  - **presets de altura en un óvalo alrededor de CONFIRM** (4'3"/1,30 m … 6'3"/1,90 m);
  - MANUAL TRIGGER a la derecha;
  - indicadores ADULT PRESETS y USER DEFINED;
  - abajo, 4 displays (FR, VT, PIP, PEEP), cada uno con sus botones **− +** debajo.

## Estado (02-10-2026)

- v3 publicada en GitHub Pages (https://hipolitogarciam.github.io/formacion-bomberos-ucv/):
  - tratamiento de "ustedes", navegación con «Siguiente», paneles y simulador con la disposición real, infografías A4 en HTML, checklist de inicio de guardia, paleta B;
  - auditoría independiente (`AUDITORIA_v3.md`) con todos sus hallazgos corregidos;
  - los 9 casos se completan de principio a fin; consola limpia; sin scroll horizontal a 390 px.
- **Pendiente técnico:**
  - fotos reales;
  - enlaces de Loom (cuando se graben);
  - vídeos de YouTube: aprobados los de VIDEOS_CANDIDATOS.md; faltan vídeos del LP12 para cardioversión y marcapasos, y de alarmas del SAVe II+ (siguen con búsqueda);
  - comprobar el service worker por https (caché sin conexión y espera máxima de 4 s a la red);
  - cotejar con el PDF las citas del LP12 que no se revisaron en la auditoría.
- **Pendiente de la dirección médica o del equipo físico:**
  - política de DEA en menores de 8 años;
  - acreditación para las terapias manuales;
  - SAVe o bolsa en la RCP con tubo;
  - si el SAVe sigue conectado al tubo durante la descarga;
  - si el LP12 lleva la opción de EtCO2;
  - imprimir la configuración del LP12 (secuencia del DEA, MANUAL ACCESS, SYNC AFTER SHOCK);
  - etiqueta y firmware del SAVe;
  - si el botón de altura sale del modo RCP;
  - SAVe: dónde aparecen en el frontal las alarmas y el ♥ de la guía de compresiones (no se ven en la foto de referencia; en el panel van aparte como "otros indicadores");
  - LP12: si el conector redondo de abajo a la derecha es el del cable de terapia (así está etiquetado en el panel).
- **Ideas para más adelante:**
  - más casos (hipotermia, quemado con vía aérea, trauma);
  - versión imprimible de los manuales.
