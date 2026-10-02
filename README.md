# Formación LIFEPAK 12 y SAVe II+ · Bomberos UCV

Web estática de formación asíncrona, pensada para publicarse en **GitHub Pages**.

## Qué contiene

- 3 módulos:
  - LIFEPAK 12;
  - SAVe II+;
  - integración clínica.
- Cada módulo incluye:
  - vídeo de la sesión (Loom);
  - manual de bolsillo;
  - panel interactivo;
  - infografía en PDF;
  - vídeos complementarios;
  - casos clínicos;
  - autoevaluación.
- 9 casos interactivos con LIFEPAK 12 y SAVe II+ virtuales (`assets/js/cases.js`, `assets/js/sim.js`).
- Funciona sin conexión tras la primera visita (`sw.js`).
- No usa cookies, registro ni analítica, y no envía datos a ningún sitio.

## Cómo actualizar

| Qué | Dónde |
|---|---|
| Enlaces de Loom | `assets/js/content.js` → `MODS[].loom.url` (peguen el enlace *share* de Loom) |
| Vídeos de YouTube revisados | `assets/js/content.js` → `VIDEOS` (`{t:'Título', yt:'ID', fuente:'Canal'}`) |
| Fotos reales de los equipos | `assets/img/fotos/` (ver `LEEME.md`) y añadir el nombre a `window.PHOTOS` |
| Manuales | `content/*.html` |
| Infografías | LP12 y SAVe: `assets/docs/infografia-*.html` (se dibujan con el panel de `PANELS`); integración: `assets/docs/` (PDF y JPG) |

**Tras cualquier cambio**, sube `VERSION` en `sw.js`. Si no, los móviles seguirán mostrando la copia guardada.

## Publicar en GitHub Pages

1. Crea un repositorio público, por ejemplo `formacion-bomberos-ucv`.
2. Sube todo el contenido de esta carpeta a la raíz del repositorio, por ejemplo con *Add file → Upload files*.
3. Ve a *Settings → Pages → Build and deployment*: *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
4. Al cabo de 1-2 minutos estará en `https://<usuario>.github.io/formacion-bomberos-ucv/`.

## Fuentes y límites

- **LIFEPAK 12:** Operating Instructions, MIN 3207254-033 (2008-2015). Todo el material del LIFEPAK 12 se ha cotejado con esta edición.
- **SAVe II+:** extracto documentado del manual M42110 Rev 5.3 y ficha SGM-MKT-SV2P-01. Pendiente de cotejar con el manual completo.

Es material docente: no sustituye a los manuales, a la práctica ni a la acreditación. Manda el protocolo de la dirección médica.

Autor: Hipólito García, médico de Urgencias y Emergencias. Tipografía Barlow (SIL OFL).
