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
  - infografía A4 imprimible (se puede guardar en PDF);
  - vídeos complementarios;
  - casos clínicos;
  - autoevaluación.
- 9 casos interactivos con LIFEPAK 12 y SAVe II+ virtuales (`assets/js/cases.js`, `assets/js/sim.js`).
- Funciona sin conexión tras la primera visita (`sw.js`).
- No usa cookies, registro ni analítica propios, y no envía datos a ningún sitio. Los vídeos de Loom y YouTube se cargan desde esos servicios solo al reproducirlos.

## Cómo actualizar

| Qué | Dónde |
|---|---|
| Enlaces de Loom | `assets/js/content.js` → `MODS[].loom.url` (peguen el enlace *share* de Loom) |
| Vídeos de YouTube revisados | `assets/js/content.js` → `VIDEOS` (`{t:'Título', yt:'ID', fuente:'Canal'}`) |
| Fotos reales de los equipos | `assets/img/fotos/` (ver `LEEME.md`) y añadan el nombre a `window.PHOTOS` |
| Manuales | `content/*.html` |
| Checklist de inicio de guardia | `assets/js/app.js` → `CK` |
| Iconos de la interfaz | `index.html` → sprite SVG (`<symbol id="i-…">`); se usan con `<svg class="ic"><use href="#i-…"/></svg>` |
| Icono de la app | `assets/img/icon.svg` y los PNG de 192 y 512 px |
| Infografías | `assets/docs/infografia-*.html`: las del LP12 y el SAVe se dibujan con el panel de `PANELS` (`assets/js/infografia.js`); la de integración es HTML propio |

**Tras cualquier cambio**, suban `VERSION` en `sw.js`. Si no, los celulares seguirán mostrando la copia guardada.

## Publicar en GitHub Pages

La web ya está publicada en https://hipolitogarciam.github.io/formacion-bomberos-ucv/ (rama `main`, carpeta raíz). Cada `git push` a `main` la actualiza en 1-2 minutos.

Para publicar una copia en otra cuenta:
1. Creen un repositorio público, por ejemplo `formacion-bomberos-ucv`.
2. Suban todo el contenido de esta carpeta a la raíz del repositorio.
3. En *Settings → Pages → Build and deployment*: *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
4. Al cabo de 1-2 minutos estará en `https://<usuario>.github.io/formacion-bomberos-ucv/`.

## Fuentes y límites

- **LIFEPAK 12:** Operating Instructions, MIN 3207254-033 (2008-2015). El material del LIFEPAK 12 se cotejó con esta edición; en la auditoría v3 se revisaron de nuevo las páginas citadas (ver `AUDITORIA_v3.md`).
- **SAVe II+:** extracto documentado del manual M42110 Rev 5.3 y ficha SGM-MKT-SV2P-01. Pendiente de cotejar con el manual completo.

Es material docente: no sustituye a los manuales, a la práctica ni a la acreditación. Manda el protocolo de la dirección médica.

Autor: Hipólito García, médico de Urgencias y Emergencias. Tipografía Barlow (SIL OFL).
