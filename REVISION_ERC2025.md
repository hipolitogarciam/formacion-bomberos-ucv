# Revisión de la web frente a las Guías ERC 2025

Fecha: 02-10-2026. Revisión sobre `main` (commit `b9c1001`, `VERSION` = `v3.13-2026-10-02`). **No se ha cambiado nada de la web**: solo se ha escrito este informe.

**Fuentes primarias** (texto completo en resuscitationjournal.com, *Resuscitation* 2025; 215 supl. 1). Abreviaturas de la tabla:
- **SVA**: Soar J, et al. *ERC Guidelines 2025 Adult Advanced Life Support*. 110769. Incluye la fe de erratas del 16-09-2026, que no afecta a nada de la web (ibutilida y dos referencias).
- **SVB**: Smyth MA, et al. *ERC Guidelines 2025 Adult Basic Life Support*. 110771.
- **SVP**: Djakow J, et al. *ERC Guidelines 2025 Paediatric Life Support*. 110767.
- **CE**: Lott C, et al. *ERC Guidelines 2025 Special Circumstances in Resuscitation*. 110753.
- **PR**: *ERC-ESICM Guidelines 2025 Post-Resuscitation Care* (PII S0300-9572(25)00321-1).

Manual del LP12: MIN 3207254-033, página del pie entre corchetes, cotejada en el PDF privado del autor. Las citas de las guías van en inglés, textuales y con menos de 15 palabras. «…» marca un corte.

## Resumen

- **33 temas revisados.**
  - **13 coinciden** con la ERC 2025.
  - **11 conviene matizarlos.**
  - **4 están desactualizados.**
  - **5 los decide la dirección médica.** Son conflictos entre el equipo y la guía.
- **Lo más importante:**
  1. **Niños.** La ERC 2025 ya no «acepta» el DEA de adulto: lo **recomienda** en niños de cualquier edad. Además, propone la posición anteroposterior por debajo de 25 kg, y el fabricante del LP12 no la admite en modo DEA.
  2. **El SAVe durante la descarga.** Que se quede conectado al tubo ya no es «criterio del autor»: lo recomienda la ERC 2025. Esto resuelve en parte un pendiente de CLAUDE.md.
  3. **El modo RCP del SAVe no coincide con lo que sugiere la ERC 2025 para un ventilador en la RCP:**
     - la ERC sugiere FR 10 automática, alarma de presión a 60-70 cmH2O y sin disparo por el paciente;
     - el modo RCP del SAVe ventila a mano (MANUAL TRIGGER), con una PIP de 20;
     - la web pone «no pasar de 35».
  4. **Una cifra mal citada (no viene de la ERC):** la web dice que las energías del DEA del LP12 van «de 100 a 360 J [9-5]». En realidad, en modo DEA van de **150 a 360 J [9-6]**; el rango de 100 a 360 J es el del modo manual [9-5]. **La configuración de fábrica del DEA coincide con la ERC 2025** [9-6, G-1]:
     - 200-300-360 J;
     - una sola descarga y 2 min de RCP;
     - sin RCP inicial;
     - sin aviso de comprobar el pulso.
  5. **El LP12 puede ser monofásico o bifásico** [2-2]. Todas las energías de la web y de la ERC 2025 son para bifásico.

## Tabla (ordenada por importancia clínica)

| # | Tema | Dónde (archivo:línea) | Qué dice la web | Qué dice la ERC 2025 (capítulo · sección · cita) | Estado | Texto propuesto |
|---|---|---|---|---|---|---|
| 1 | DEA en menores de 8 años | `content/manual-integracion.html:124-127`, `content/manual-lp12.html:127`, `assets/js/content.js:168`, `assets/js/cases.js:247`, `:255`, `assets/docs/infografia-int.html:75` | «El fabricante no diseñó el modo DEA para ellos… las guías **aceptan** un desfibrilador de adulto antes que no desfibrilar» | **SVP · Recommendations for those trained in PBLS:** el DEA, «as soon as possible for children of all ages». Modo pediátrico por debajo de 25 kg (unos 8 años); si el DEA no lo tiene, «use it in standard adult mode». El fabricante sí excluye a los menores de 8 años en modo DEA [pref.] | **Desactualizado** y **decide la dirección médica** (el fabricante y la guía no coinciden) | «El fabricante no diseñó el modo DEA del LP12 para menores de 8 años [pref.]. Las guías ERC 2025 (soporte vital pediátrico) recomiendan usar el DEA a cualquier edad y, si no tiene modo pediátrico, en modo adulto. El LP12 no tiene modo pediátrico en el DEA. Su dirección médica debe decidir de antemano: modo manual a 4 J/kg si hay alguien acreditado; si no, el LP12 en modo DEA.» |
| 2 | Parches y posición en el niño | `assets/js/cases.js:249-253`, `content/manual-integracion.html:129`, `assets/js/content.js:150`, `content/manual-lp12.html:96`, `:106` | 20 kg → parches de adulto («los pediátricos son para menos de 15 kg»); «si el tórax es pequeño, posición anteroposterior en modo manual» | **SVP · PBLS (uso del DEA):** «Use the antero-posterior position in infants and children weighing less than 25 kg», con parches de adulto. **SVP · Defibrillation during PALS:** anteroposterior si es difícil que no se toquen. Fabricante: pediátricos para 15 kg o menos [5-3]; con ellos, 100 J o más pueden quemar [5-4]; **la anteroposterior no vale para el DEA** [4-3] | **Decide la dirección médica** | Caso 9 (`fb` de la opción correcta, línea 252): «Correcto, según el manual del LP12 [5-3]. Que no se toquen entre sí. Las guías ERC 2025 (soporte vital pediátrico) prefieren la posición anteroposterior por debajo de 25 kg, pero el fabricante no la admite en modo DEA [4-3]: en manual, anteroposterior; en DEA, lo que diga su protocolo.» |
| 3 | Energía en el niño | `content/manual-integracion.html:126`, `assets/js/content.js:168`, `assets/js/cases.js:247`, `assets/docs/infografia-int.html:75` | «ERC: 4 J/kg» | **SVP · Defibrillation during PALS:** «Use 4 J kg−1 as the standard energy dose for the initial shocks», sin pasar de la dosis de adulto (120-200 J). Si hacen falta más de 5 descargas, subir poco a poco «up to 8 J kg−1 (max. 360 J)» | **Coincide** (falta la escalada) | Añadir: «4 J/kg; si hacen falta más de 5 descargas, subir poco a poco hasta 8 J/kg (máximo 360 J) (guías ERC 2025, soporte vital pediátrico). Solo personal acreditado, con orden médica y según protocolo.» |
| 4 | Secuencia del DEA del LP12 (configuración) | `content/manual-lp12.html:21`, `:134` | «RCP inicial, número de descargas y energías del DEA, entre 100 y 360 J [9-5]»; «2 min con la configuración de fábrica» | **SVA · Energy levels and number of shocks:** «Use single shocks followed by a 2-minute cycle of chest compressions»; primera descarga bifásica «at least 150 J»; subir la energía «it is reasonable». **SVA · CPR versus defibrillation as the initial treatment:** «routine delivery of a pre-specified period of CPR … is not recommended». Fabricante, valores de fábrica [9-6, G-1]: 200-300-360 J, STACKED SHOCKS OFF, INITIAL CPR OFF, PRESHOCK CPR OFF, CPR TIME 1 y 2 = 120 s, PULSE CHECK NEVER y MOTION DETECTION ON | **Coincide** la configuración de fábrica. **La cifra de la web está mal:** en DEA, 150-360 J [9-6] | «La secuencia del DEA depende de la configuración [9-6]. De fábrica: 200, 300 y 360 J; una descarga y 2 min de RCP; sin RCP inicial y sin pedir que se compruebe el pulso [9-6, G-1]. Así coincide con las guías ERC 2025 (SVA). En DEA, la energía se puede fijar entre 150 y 360 J [9-6]. Impriman su configuración: si pone STACKED SHOCKS ON o INITIAL CPR, avisen a su dirección médica (ver «Configuración del LP12», más abajo).» |
| 5 | Monofásico o bifásico | `assets/js/cases.js:84-92`, `content/manual-lp12.html:147`, `app.js` CK (palas: «bifásico» o «monofásico») | Todas las energías (70-120 J, al menos 150 J) dan por hecho un equipo bifásico | **SVA · Energy levels:** solo da energías para ondas bifásicas; no encontré ninguna recomendación para monofásico. Fabricante: el LP12 existe «monophasic or biphasic» [2-2] | **Decide la dirección médica** (y comprobar la etiqueta) | En el manual del LP12, «Antes de nada»: «Comprueben en la etiqueta si su LP12 es bifásico o monofásico [2-2]. Las energías de esta web, y las de las guías ERC 2025, son para bifásico. Si es monofásico, las energías las decide su dirección médica.» |
| 6 | El SAVe durante la descarga | `content/manual-integracion.html:116`, `assets/js/cases.js:179`, `assets/js/content.js:167`, `assets/docs/infografia-int.html:71` | «el SAVe puede quedarse conectado al tubo si su dirección médica lo acepta (criterio del autor)» | **SVA · Safe and effective defibrillation:** «A self-inflating bag or the ventilator circuit should remain attached» al tubo o al supraglótico, y la salida de O2 del circuito, dirigida lejos del tórax | **Desactualizado** (ya no es criterio del autor) | «El SAVe se queda conectado al tubo y su salida, apartada del tórax (guías ERC 2025, SVA). El O2 libre del reservorio, cerrado o a 1 m como mínimo. El manual del SAVe no lo trata en lo que hemos podido consultar: confírmenlo con su dirección médica.» Actualizar CLAUDE.md (pendiente). |
| 7 | Ventilador durante la RCP con tubo (modo RCP del SAVe) | `content/manual-save.html:111-116`, `assets/js/content.js:124`, `:129`, `assets/js/infografia.js:35-36`, `content/manual-integracion.html:109-110`, `assets/js/cases.js:175-177` | FR 0 + MANUAL TRIGGER cada 6 s; PIP 20 y sin PEEP; «PIP REACHED repetido → bolsa»; «subir la PIP… sin pasar de 35» | **SVA · Airway and ventilation:** con ventilador, modo de volumen, VT 6-8 mL/kg, FR 10, PEEP 0-5, «the peak pressure alarm at 60–70 cm H2O, and the flow trigger off». Además: «Ensure mechanical ventilation is effective and if not, use manual ventilation.» **SVA · Mechanical ventilation during CPR:** no hay pruebas para preferir el ventilador a la bolsa | **Decide la dirección médica** (conflicto entre equipo y guía) | Ver «Conflictos entre equipo y guía», punto B. En el panel (`pip`) y en la infografía, cambiar «No pasar de 35» por «Fuera de la RCP, no pasar de 35. En la RCP, el límite lo fija su dirección médica (guías ERC 2025, SVA: alarma a 60-70)». |
| 8 | Oxígeno en el modo RCP del SAVe | `content/manual-save.html:102`, `assets/js/content.js:155` | Flujo de O2 = FR × VT. En modo RCP, FR = 0 | **SVA · Airway and ventilation:** «Give the highest feasible inspired oxygen during CPR.» | **Conviene matizar** (la fórmula da 0 en modo RCP) | En «Modo RCP» del manual del SAVe: «Con FR 0, calculen el flujo con 10 respiraciones/min: 10 × VT (por ejemplo, 10 × 0,42 = 4,2 → 5 L/min) (criterio del autor; las guías ERC 2025, SVA, piden el máximo O2 posible).» **El autor debe confirmarlo.** |
| 9 | Pausas en la desfibrilación manual | `content/manual-lp12.html:146-150` | ENERGY SELECT → CHARGE → «¡fuera todos!» → SHOCK | **SVA · Defibrillation strategy:** «continuing chest compressions during defibrillator charging» y una interrupción «of less than 5 s». **SVA · Safe and effective defibrillation:** «Do not defibrillate during manual chest compressions» | **Conviene matizar** (la web no lo dice) | «2. CHARGE **sin parar las compresiones**. 3. Con el equipo cargado: se paran las compresiones, ritmo, "¡fuera todos!" y SHOCK, en menos de 5 s; compresiones al momento (guías ERC 2025, SVA). Solo personal acreditado, con orden médica y según protocolo.» |
| 10 | «Nunca en asistolia ni en AESP» | `content/manual-lp12.html:154` | «Nunca en asistolia ni en AESP (guías ERC)» | **SVA · AED versus manual defibrillation:** «A shock should be given if … in doubt whether fine VF or asystole». Si no reconocen el ritmo en 5 s, «they should use the defibrillator in an AED mode» | **Conviene matizar** | «No se descarga en asistolia ni en AESP. Si dudan entre FV fina y asistolia, se descarga. Si no reconocen el ritmo en 5 s, modo DEA (guías ERC 2025, SVA).» |
| 11 | ¿Ritmo de compresiones o ritmo de análisis? (pulso y 2 min) | `assets/js/cases.js:24-27`, `:42`, `content/manual-lp12.html:134` | Tras la descarga, compresiones al momento y 2 min; el pulso, después | **SVA · One shock versus three stacked shock sequence:** «Do not delay CPR for … a pulse check immediately after a shock» | **Coincide** | — |
| 12 | Análisis: vehículo parado y sin compresiones | `content/manual-lp12.html:130`, `assets/js/content.js:76`, `:142`, `assets/js/cases.js:17`, `:42`, `content/manual-integracion.html:111`, `:137` | Parar el vehículo; nadie toca al paciente durante el análisis | **SVB · When and how to use an AED:** «Ensure that nobody touches the person whilst the AED is analysing». Lo del movimiento lo da el fabricante [4-4] | **Coincide** | — |
| 13 | Capnografía: tubo, calidad y recuperación de la circulación | `content/manual-integracion.html:71`, `:97-103`, `assets/docs/infografia-int.html:49`, `:63`, `assets/js/cases.js:185-188`, `content/manual-lp12.html:220` | Curva cuadrada que se repite = el aire llega; valor bajo = compresiones poco eficaces; subida brusca = posible RCE, pulso en la siguiente pausa sin parar antes | **SVA · Waveform capnography during ALS:** confirmar el tubo y vigilar la calidad; si sube, «chest compression should not be interrupted based on this sign alone»; «Do not use a low ETCO2 value alone to decide» si se para la RCP. **SVA · Airway and ventilation:** «A sustained ETCO2 trace on waveform capnography must be used» | **Coincide.** Conviene añadir 2 matices | Manual 3, sección 7: «…una curva **mantenida** (al menos 7 respiraciones) confirma el tubo (guías ERC 2025, SVA)» y «Un valor bajo por sí solo no sirve para decidir que se para la RCP (guías ERC 2025, SVA).» |
| 14 | Gasping y comprobación del pulso | `assets/js/cases.js:10-13`, `:42`, `content/manual-lp12.html:127` | «Respiración agónica = parada»; «Comprobar el pulso no debe pasar de 10 s»; DEA si «no tiene pulso [pref.]» | **SVB · Recognising cardiac arrest:** «agonal gasping or panting, must be recognised as signs of cardiac arrest». En los capítulos de adultos no encontré el «10 s» del pulso (SVP pone 10 s para valorar la respiración) | **Coincide** el gasping. **Conviene matizar** lo de los 10 s | Caso 1, opción 2 (`fb`): «No. Si no responde y no respira con normalidad (el gasping cuenta), es una parada: no hay que buscar el pulso para empezar la RCP (guías ERC 2025, SVB).» Manual del LP12 (línea 127): conservar la cita del fabricante y añadir «Para reconocer la parada basta con que no responda y no respire con normalidad (guías ERC 2025, SVB).» |
| 15 | O2 libre a más de 1 m | `content/manual-lp12.html:155`, `content/manual-integracion.html:115`, `assets/js/content.js:167`, `assets/docs/infografia-int.html:71` | «apartarlo a más de 1 m del tórax… [1-2]» | **SVA · Safe and effective defibrillation:** «at least 1 m away from the patient’s chest». El fabricante solo dice que se cierre o se aparte la fuente de gas [1-2]; no da distancia | **Coincide.** Matizar la atribución | «…apartarlo [1-2], a 1 m del tórax como mínimo (guías ERC 2025, SVA).» |
| 16 | Cardioversión: energías y sedación (caso 3) | `assets/js/cases.js:79-92`, `content/manual-lp12.html:159-167` | «ERC: 70-120 J en taquicardia regular de QRS estrecho»; FV: al menos 150 J en bifásico; sedoanalgesia | **SVA · Tachyarrhythmias:** flúter y TSV paroxística, «Give an initial shock of 70–120 J»; FA, a la máxima energía; TV con pulso, «120–150 J for the initial shock»; «Conscious patients require careful anaesthesia or sedation». **SVA · Cardioversion:** si la marca falla, «choose another lead and/or adjust the amplitude» | **Coincide** (bifásico) | Opcional en el manual del LP12, sección 8: «Energías iniciales según las guías ERC 2025 (SVA), en bifásico: TSV y flúter, 70-120 J; FA, la máxima; TV con pulso, 120-150 J. Las decide su dirección médica.» |
| 17 | Marcapasos: indicación y captura | `content/manual-lp12.html:171-176`, `assets/js/cases.js:53`, `:61-65`, `:71` | Bradicardia con pulso e inestable; captura eléctrica y mecánica (pulso femoral: criterio del autor); analgesia; «tras los fármacos indicados» | **SVA · Bradycardia:** «Consider pacing in patients who are unstable, with symptomatic bradycardia refractory to drug therapies»; el transcutáneo, como puente al transvenoso. **SVA · Bradycardias and pacing:** «electrical and mechanical capture»; analgesia o sedación. Además: «Do not give atropine to patients with high-degree atrioventricular block and wide QRS» | **Coincide.** Conviene matizar el caso 2 (bloqueo AV completo con QRS ancho) | Caso 2, línea 53: «…ordena marcapasos transcutáneo porque los fármacos que ha indicado no han funcionado.» Manual del LP12: «Bradicardia inestable que no responde a los fármacos; es un puente hasta el marcapasos definitivo o transvenoso (guías ERC 2025, SVA).» |
| 18 | 30:2 y 10/min con vía aérea avanzada | `content/manual-save.html:113-114`, `content/manual-integracion.html:109`, `assets/js/cases.js:175`, `assets/js/content.js:124` | Mascarilla 30:2; con vía aérea avanzada, 10/min (1 cada 6 s) sin parar las compresiones | **SVA · Airway and ventilation:** «ventilate the lungs at a rate of 10 min−1 and continue chest compressions». Si el supraglótico fuga, «using a compression-ventilation ratio of 30:2». **SVB · Compression to ventilation ratios:** 30:2 | **Coincide.** Falta lo del supraglótico | Manual del SAVe, sección 8: «Con supraglótico, si la fuga impide ventilar, se vuelve al 30:2 (guías ERC 2025, SVA).» |
| 19 | Quién pulsa MANUAL TRIGGER; equipos de 2 | `content/manual-save.html:113`, `content/manual-integracion.html:38`, `:41`, `assets/js/content.js:165` | El líder (criterio del autor); con 2, mejor bolsa | **SVA · Airway and ventilation:** «if necessary, use a two-person technique for bag-mask ventilation». **CE · Resuscitation by two-member ALS crews:** «The evidence is not robust enough to support formal recommendations» | **Coincide** (el criterio del autor es compatible con la guía) | Opcional: «(criterio del autor; las guías ERC 2025, SVA, aconsejan sellar la mascarilla entre dos)». |
| 20 | ♥ a 100/min del SAVe | `content/manual-save.html:57`, `:112`, `assets/js/content.js:133`, `assets/js/sim.js:272` | «Parpadea a 100/min como guía para las compresiones» | **SVB · High quality chest compressions:** «Compress the chest at a rate of 100–120 min−1», de 5 a 6 cm | **Conviene matizar** | «Parpadea a 100/min [pág. pendiente de cotejar]; las compresiones van a 100-120/min y de 5 a 6 cm (guías ERC 2025, SVB).» |
| 21 | Tras la RCE: oxígeno y tensión | `assets/js/cases.js:33-40`, `:42` | SpO2 93 % tras la RCE, sin ninguna acción sobre el O2 | **SVA · Fig. 2 (algoritmo):** tras la RCE, SpO2 94-98 %, PAS > 100 mmHg y ECG de 12 derivaciones. **PR · Control of oxygenation:** O2 al 100 % hasta poder medir la SpO2; después, 94-98 % | **Conviene matizar** | En el `debrief` del caso 1: «Tras la RCE: O2 para una SpO2 de 94-98 % y PAS > 100 mmHg (guías ERC 2025, SVA y posresucitación).» Si se cambia el texto del paso 7, no cambia la lógica del caso. |
| 22 | Tras la RCE: 12 derivaciones, centro y preaviso | `assets/js/cases.js:33-40`, `content/manual-integracion.html:119` | 12 derivaciones con el vehículo parado; hospital con hemodinámica y preaviso | **SVA · Fig. 2:** «12 Lead ECG». **PR · Coronary reperfusion:** cateterismo urgente si el ST sigue elevado. **PR · Cardiac arrest centres:** «should be considered for transport to a cardiac arrest centre» | **Coincide** | — |
| 23 | Tras la RCE: los parches se quedan | `assets/js/cases.js:39`, `:42` | «los parches se quedan puestos: puede volver a fibrilar» | No encontré ninguna recomendación en SVA ni en PR | **Conviene matizar** la atribución | «…se quedan puestos (criterio del autor): puede volver a fibrilar.» |
| 24 | Humo y CO | `content/manual-lp12.html:210`, `assets/js/content.js:147`, `assets/js/cases.js:225-234` | La SpO2 puede salir normal con CO [3-17]; «O2 al máximo» | **CE:** no menciona el monóxido de carbono ni la carboxihemoglobina (búsqueda en todo el texto). **PR · Control of oxygenation:** la pulsioximetría puede sobrestimar la saturación en pieles oscuras | **Conviene matizar** la atribución (no viene de la ERC 2025) | En el caso 8 y en su `debrief`: «O2 al máximo con mascarilla reservorio (criterio del autor).» Opcional en la tabla de SpO2 del manual: «Puede sobrestimar la saturación en pieles oscuras (guías ERC 2025, posresucitación).» |
| 25 | Ahogamiento (caso 9) | `assets/js/cases.js:241` | «Hacen RCP con ventilaciones de rescate» | **SVP · Drowning:** «Start standard PBLS with five rescue breaths as soon as it is safe»; O2 al 100 %; DEA tras secar el tórax. **SVP · PBLS:** 15:2 si están formados en SVP; si no, 30:2. **CE · Cardiac arrest caused by drowning:** ritmo desfibrilable inicial en menos del 10 % | **Coincide.** Conviene concretarlo | Caso 9, línea 241: «…Hacen RCP: 5 ventilaciones de rescate con O2 al 100 % y después 15:2 (30:2 si no tienen formación pediátrica) (guías ERC 2025, soporte vital pediátrico).» En el `debrief`: «En el ahogamiento lo primero es ventilar. La FV es rara (menos del 10 %); secar el tórax antes de los parches (guías ERC 2025).» |
| 26 | Traslado con RCP en curso | `assets/js/cases.js:14`, `:173`, `content/manual-integracion.html:108` | La desfibrilación se hace en el lugar y el traslado viene después; ante una parada durante el traslado, se para el vehículo | **CE · Emergency medical services:** «provide resuscitation at the scene rather than undertake ambulance transport with ongoing resuscitation»; si hay traslado, considerar la RCP mecánica | **Coincide** | — |
| 27 | Parches del adulto: posición e implantes | `content/manual-lp12.html:91-101`, `:96` | Anterolateral (la de siempre); anteroposterior solo en modo manual [4-3]; «lejos de marcapasos implantados» | **SVA · Defibrillation pads and paddles:** la anterolateral es la de elección; anteroposterior para cambiar de vector «following three failed shocks» en FV refractaria; con dispositivo implantado, «more than 8 cm away». **SVB · Positioning of defibrillation pads:** en el DEA, seguir las instrucciones del fabricante | **Coincide.** Conviene concretar | «…a más de 8 cm de un marcapasos o DAI implantado (guías ERC 2025, SVA).» Opcional, en desfibrilación manual: «Tras 3 descargas sin éxito, el médico puede pedir pasar a la anteroposterior (guías ERC 2025, SVA).» |
| 28 | Quién usa el modo manual | `content/manual-lp12.html:127`, `:145` | El DEA, para quien no está acreditado en ritmos; el manual, solo personal acreditado | **SVA · AED versus manual defibrillation:** el manual solo para quien identifica el ritmo «(within 5 s)»; si llegan con un DEA puesto, se siguen sus indicaciones | **Coincide** | — |
| 29 | Fuentes (`#/acerca`) | `assets/js/app.js:227`, `content/manual-save.html:180`, `content/manual-integracion.html:153`, `assets/docs/infografia-int.html:91` | «Guías ERC… Comprueben la versión vigente» | ERC 2025, publicadas en *Resuscitation* 2025;215 supl. 1 | **Desactualizado** | En `#/acerca`: «Guías del European Resuscitation Council (ERC) 2025 (*Resuscitation* 2025;215 supl. 1): soporte vital básico y avanzado del adulto, soporte vital pediátrico, circunstancias especiales y cuidados posresucitación (ERC-ESICM). Revisión de la web frente a ellas: 10-2026.» En los pies, «guías ERC» → «guías ERC 2025». |
| 30 | Vídeo «Guías ERC: SVA» | `assets/js/content.js:194` | Búsqueda en YouTube sin año | — | **Conviene matizar** | `q:'European Resuscitation Council guidelines 2025 advanced life support'` |
| 31 | BREATH ASSIST durante las compresiones | `content/manual-save.html:131` | «Durante compresiones → modo RCP (FR 0)» | **SVA · Airway and ventilation:** con ventilador en la RCP, «the flow trigger off» | **Coincide** (el modo RCP evita que las compresiones disparen respiraciones) | Opcional: «…(guías ERC 2025, SVA: sin disparo por el paciente en la RCP).» |
| 32 | Ventilación tras la RCE con el SAVe | `content/manual-save.html:77`, `:116` | Presets de unos 6 mL/kg de peso ideal | **PR · Control of ventilation:** «a tidal volume of 6–8 mL kg−1 ideal body weight», con normocapnia (35-45 mmHg) | **Coincide** | Opcional en la sección 5 del manual del SAVe: «(en el rango de 6-8 mL/kg de las guías ERC 2025, posresucitación)». |
| 33 | Energía del DEA en el simulador | `assets/js/sim.js:196` | Siempre carga 200 J | Fabricante, configuración de fábrica: 200-300-360 J [9-6]. SVA: subir la energía «it is reasonable» | **Conviene matizar** (simplificación) | Sin cambios en el simulador. Ningún caso tiene una segunda descarga en DEA. Si se quiere, `lp.energy=[200,300,360][Math.min(dea,2)]`. |

## Conflictos entre equipo y guía: cómo explicarlo en la web

Para cada conflicto: qué dice la ERC 2025, qué hace el equipo, qué manda y qué revisar.

**A. La secuencia del DEA del LP12** (manual del LP12, secciones 1 y 6)
- **ERC 2025:**
  - una sola descarga y 2 min de RCP;
  - la primera, de 150 J o más en bifásico, subiendo si se puede;
  - sin un periodo fijo de RCP antes de analizar;
  - nada de comprobar el pulso justo después de descargar (SVA).
- **Equipo:** el DEA del LP12 (cprMAX) se ajustó a las guías de 2005 [G-1]. Con los valores de fábrica también coincide con la ERC 2025 [9-6, G-1]. Pero se puede configurar:
  - descargas en serie (STACKED SHOCKS ON, «three-shock stack»);
  - RCP inicial de 15-180 s;
  - RCP antes de la descarga;
  - aviso de comprobar el pulso.

  Un equipo configurado hace años puede seguir con guías anteriores. El listado de mensajes describe el aviso CHECK FOR PULSE tras «each standard 3 shock sequence» [B-1].
- **Qué manda:** el protocolo de la dirección médica. El fabricante dice que la configuración solo la cambie un médico con experiencia en RCP [G-1].
- **Texto propuesto para la web** (manual del LP12, sección 6, tras la lista): «Si su equipo pide varias descargas seguidas sin RCP, RCP antes de analizar o comprobar el pulso tras cada descarga, está configurado con guías antiguas. Las guías ERC 2025 (SVA) piden una descarga y 2 min de RCP. Mientras no se cambie, sigan las indicaciones del equipo y avisen a su responsable.»

**B. El SAVe en la RCP con tubo** (manual del SAVe, sección 8; manual 3, sección 8; panel; infografía)
- **ERC 2025:** si se usa un ventilador en la RCP:
  - modo de volumen, VT 6-8 mL/kg y FR 10;
  - PEEP 0-5;
  - alarma de presión a 60-70 cmH2O;
  - sin disparo por el paciente;
  - si no ventila bien, bolsa.

  No hay pruebas de que el ventilador sea mejor que la bolsa (SVA).
- **Equipo:** el modo RCP (FR 0) no ventila solo: da una respiración con MANUAL TRIGGER, con una PIP de 20 y sin PEEP. Según el fabricante, está pensado sobre todo para el 30:2 con mascarilla [33]. Con compresiones continuas, la PIP de 20 puede cortar las respiraciones (PIP REACHED).

  Ventilar en modo normal con FR 10 sería lo más parecido a la ERC. Pero no lo podemos recomendar sin el manual completo, por dos motivos:
  - el disparo por el paciente (BREATH ASSIST) no sabemos si se puede quitar;
  - la PIP haría falta subirla.
- **Qué manda:** la dirección médica, que debe elegir entre:
  - SAVe en modo RCP, con MANUAL TRIGGER cada 6 s;
  - bolsa al tubo, a 10/min.

  También debe fijar la PIP máxima en la RCP. Ahora la web pone 35 sin fuente; la ERC pone la alarma a 60-70.
- **Texto propuesto** (sustituye la viñeta de «Con vía aérea avanzada» del manual del SAVe, línea 114): «**Con vía aérea avanzada:** 10 ventilaciones/min (1 cada 6 s) sin parar las compresiones (guías ERC 2025, SVA). Si se usa un ventilador, la ERC sugiere FR 10, VT 6-8 mL/kg, PEEP 0-5, alarma de presión a 60-70 cmH2O y sin disparo por el paciente; si no ventila bien, bolsa. El modo RCP del SAVe no es exactamente eso: ventila solo cuando se pulsa MANUAL TRIGGER y limita la PIP a 20, así que con las compresiones puede saltar PIP REACHED y recortarse el volumen [33]. Su dirección médica decide si usan el SAVe en modo RCP o la bolsa, y cuál es la PIP máxima. Si PIP REACHED se repite o el tórax no sube → bolsa conectada al tubo, 10/min.»

**C. El SAVe conectado al tubo durante la descarga:** ver la fila 6. La ERC 2025 lo recomienda; el manual del SAVe no se ha podido consultar. En CLAUDE.md, el pendiente pasa a «confirmar que el fabricante del SAVe no lo contraindica».

**D. El DEA del LP12 en niños:** ver las filas 1-2. Hay tres conflictos:
- el fabricante lo excluye en menores de 8 años [pref.] y la ERC 2025 lo recomienda a cualquier edad;
- el LP12 no tiene modo pediátrico en el DEA y su energía mínima en DEA es de 150 J [9-6]: unos 7,5 J/kg en un niño de 20 kg, por encima de la escalada de la ERC;
- la ERC prefiere la posición anteroposterior por debajo de 25 kg, y el LP12 no la admite en DEA [4-3].

La dirección médica debe dejarlo decidido por escrito. La web ya lo plantea así; solo hay que actualizar lo que dice la ERC.

**E. Monofásico o bifásico:** ver la fila 5.

## Configuración del LP12 que conviene imprimir y revisar (Sección 9)

Se imprime desde OPTIONS (configuración). Valores de fábrica en negrita en el manual:

| Menú | Opción | De fábrica | Qué mirar frente a la ERC 2025 |
|---|---|---|---|
| AED [9-6] | ENERGY PROTOCOL | 200 → 300 → 360 J (rango de 150 a 360 J) | Primera descarga de 150 J o más y escalada (SVA). Correcto |
| AED [9-6] | STACKED SHOCKS | OFF | Debe estar en OFF (SVA: una descarga) |
| AED [9-6] | AUTO ANALYZE | AFTER 1ST SHOCK (solo actúa con STACKED SHOCKS ON) | Sin efecto si STACKED está en OFF |
| AED [9-6] | INITIAL CPR / INITIAL CPR TIME | OFF / 120 s | La ERC 2025 no aconseja un periodo fijo de RCP antes de analizar: OFF |
| AED [9-6] | PRESHOCK CPR | OFF | Con 15 s, pide compresiones mientras carga [G-2]. Lo decide la dirección médica |
| AED [9-6] | CPR TIME 1 / CPR TIME 2 | 120 s / 120 s | 2 min (SVA). Correcto |
| AED [9-6] | PULSE CHECK | NEVER | La ERC 2025 solo pide comprobar el pulso si hay signos de RCE (SVA): NEVER o AFTER EVERY NSA, según el protocolo |
| AED [9-6] | MOTION DETECTION | ON | Mantenerlo |
| Manual [9-4, 9-5] | PADS DEFAULT / ENERGY PROTOCOL | Protocolo 200 → 300 → 360 J (rango de 100 a 360 J) | Lo decide la dirección médica (en bifásico, 150 J o más) |
| Manual [9-4] | SYNC AFTER SHOCK | según el equipo | La web ya pide comprobarlo antes de repetir |
| Manual [9-5] | MANUAL ACCESS | DIRECT | Según quién esté acreditado |

## Capítulos que leí

En texto completo, en resuscitationjournal.com con el navegador:
- **SVA (Soar 2025):**
  - recomendaciones breves de desfibrilación, vía aérea y ventilación, capnografía, RCP mecánica, taquiarritmias y bradicardia;
  - secciones de evidencia: «AED versus manual», «CPR versus defibrillation as the initial treatment», «Safe use of oxygen during defibrillation», «Pad placement for ventricular arrhythmias», «One shock versus three stacked shock sequence», «First shock», «Second and subsequent shocks», «30:2 versus asynchronous ventilation», «Ventilation rate», «Mechanical ventilation during CPR», «Confirmation of correct placement of the tracheal tube», «Waveform capnography during ALS», «Cardioversion», «Cardioversion for atrial flutter and PSVT», «Bradycardias and pacing» y «Transfer of patients with OHCA»;
  - la figura 2 (algoritmo de SVA);
  - la fe de erratas del 16-09-2026.
- **SVB (Smyth 2025):** «Recognising cardiac arrest», «High quality chest compressions», «Rescue breaths», «When and how to use an AED», «Abnormal breathing», «Minimising interruptions», «Compression to ventilation ratios», «Should chest compressions be performed before defibrillation?» y «Positioning of defibrillation pads».
- **SVP (Djakow 2025):** «Recommendations for those trained in PBLS», «Defibrillation during PALS», «Oxygenation and ventilation during PALS», «Drowning», «Defibrillation» y «Shockable rhythms» (evidencia).
- **CE (Lott 2025):** «Toxic agents», «Drowning», «Cardiac arrest caused by drowning», «Emergency medical services», «Resuscitation during transport» y «Resuscitation by two-member ALS crews». Además, una búsqueda de «carbon monoxide / carboxy / COHb / smoke» en todo el texto, sin resultados.
- **PR (ERC-ESICM 2025):** «Immediate post-resuscitation care», «Diagnosis of cause», «Airway management after ROSC», «Control of oxygenation», «Control of ventilation», «Coronary reperfusion», «Haemodynamic monitoring», «Post-ROSC arrhythmias» y «Cardiac arrest centres».
- **Manual del LP12** (PDF privado, cotejado): [pref.] indicaciones del DEA; [1-2] O2; [2-2] monofásico o bifásico; [4-6 a 4-8] secuencia del DEA; [5-3, 5-4] parches pediátricos; [9-4 a 9-6] menús de configuración (los valores de fábrica, comprobados en la imagen de la página); [A-17] energías de cardioversión; [G-1, G-2] cprMAX.

## Lo que no pude comprobar

- **Los 10 s del pulso en el adulto:** no aparecen en los textos de SVB ni de SVA que leí (SVP da 10 s para valorar la respiración). No leí el texto completo de las figuras de SVB.
- **Las figuras 8 (taquiarritmias) y 9 (bradicardia) de SVA:** no las leí; usé el texto de las recomendaciones.
- **Capítulos que no leí:** resumen ejecutivo, primeros auxilios (podría tratar el CO o el humo), recién nacido, sistemas, educación, ética y epidemiología. Tampoco los CoSTR de ILCOR.
- **SAVe II+:** sin el manual completo, no pude comprobar:
  - si el fabricante admite que siga conectado durante la descarga;
  - si BREATH ASSIST se puede desactivar;
  - si el modo normal con FR 10 sirve durante la RCP;
  - de dónde sale el límite de 35 cmH2O;
  - la página del ♥ a 100/min.
- **LP12 de los bomberos:**
  - si es bifásico;
  - su versión de software (si es antigua, quizá no tenga cprMAX);
  - su configuración real.
- **El flujo de O2 en modo RCP (fila 8):** es una propuesta del autor de la revisión, no un dato del fabricante.
