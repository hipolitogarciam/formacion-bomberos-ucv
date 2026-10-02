/* Dibuja los esquemas SVG de los paneles (PANELS en content.js).
   Lo usan el panel interactivo, el simulador y las infografías. Esquemas de elaboración propia, no a escala. */
(function(){
'use strict';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const FONT='Barlow Semi Condensed,Barlow,sans-serif';
const a=(k,v)=>v==null?'':` ${k}="${esc(v)}"`;
const paint=d=>a('fill',d.fill||'none')+a('stroke',d.stroke)+a('stroke-width',d.sw)+(d.dash?' stroke-dasharray="7 5"':'');

function text(x,y,s,o={}){
  const sz=o.sz||17,lines=String(s).split('\n'),lh=sz*1.05,y0=y-(lines.length-1)*lh/2+sz*.35;
  return `<text x="${x}" y="${y0}" fill="${esc(o.fill||'#FFFFFF')}" font-family="${FONT}" font-weight="${o.w||700}" font-size="${sz}" text-anchor="${o.a||'middle'}"${o.ls?` letter-spacing="${o.ls}"`:''}>`+
    lines.map((l,i)=>i?`<tspan x="${x}" dy="${lh}">${esc(l)}</tspan>`:esc(l)).join('')+'</text>';
}
function shape(d,cls){
  const c=cls?` class="${cls}"`:'';
  switch(d.t){
    case 'circle': return `<circle${c} cx="${d.x}" cy="${d.y}" r="${d.r}"${paint(d)}/>`;
    case 'ellipse': return `<ellipse${c} cx="${d.x}" cy="${d.y}" rx="${d.rx}" ry="${d.ry}"${paint(d)}/>`;
    case 'path': return `<path${c} d="${d.d}"${paint(d)}/>`;
    case 'text': return text(d.x,d.y,d.s,{sz:d.sz,fill:d.fill,a:d.a,w:d.w,ls:d.ls});
    default: return `<rect${c} x="${d.x}" y="${d.y}" width="${d.w}" height="${d.h}" rx="${d.r||0}"${paint(d)}/>`;
  }
}
const ICON={
  power:(x,y,s,c)=>`<path d="M${x-s*.42} ${y-s*.3} A${s*.55} ${s*.55} 0 1 0 ${x+s*.42} ${y-s*.3}" fill="none" stroke="${c}" stroke-width="${s*.14}" stroke-linecap="round"/><line x1="${x}" y1="${y-s*.62}" x2="${x}" y2="${y-s*.05}" stroke="${c}" stroke-width="${s*.14}" stroke-linecap="round"/>`,
  mute:(x,y,s,c)=>`<path d="M${x-s*.55} ${y-s*.2} h${s*.25} l${s*.35} -${s*.3} v${s} l-${s*.35} -${s*.3} h-${s*.25} z" fill="${c}"/><path d="M${x+s*.2} ${y-s*.2} l${s*.4} ${s*.4} M${x+s*.6} ${y-s*.2} l-${s*.4} ${s*.4}" stroke="${c}" stroke-width="${s*.12}" stroke-linecap="round"/>`,
  home:(x,y,s,c)=>`<path d="M${x-s*.5} ${y} L${x} ${y-s*.45} L${x+s*.5} ${y} M${x-s*.35} ${y-s*.12} V${y+s*.42} H${x+s*.35} V${y-s*.12}" fill="none" stroke="${c}" stroke-width="${s*.1}" stroke-linejoin="round"/><rect x="${x-s*.1}" y="${y+s*.1}" width="${s*.2}" height="${s*.32}" fill="${c}"/>`
};
function hot(h){
  const tc=h.tc||'#FFFFFF',sz=h.sz||17;
  const base=Object.assign({},h,{t:h.c?'circle':'rect',fill:h.ghost?'transparent':(h.fill||'#23282E'),stroke:h.ghost?'transparent':(h.dash?'#9FB0C3':(h.stroke||'#11161F')),sw:h.dash?2.5:2});
  let s=shape(base,'hs');
  for(const e of (h.extra||[]))s+=shape(e);
  const cx=h.c?h.x:h.x+h.w/2,cy=h.c?h.y:h.y+h.h/2;
  if(h.led)s+=`<circle class="led" data-led="${h.id}" cx="${h.x+17}" cy="${cy}" r="5.5" fill="#5F656C" stroke="#11161F" stroke-width="1"/>`;
  if(h.arrows)s+=text(h.x+18,cy,'▼',{sz:sz*.95,fill:tc})+text(h.x+h.w-18,cy,'▲',{sz:sz*.95,fill:tc});
  const half=h.c?h.r:Math.min(h.w,h.h)/2;
  if(h.icon)s+=ICON[h.icon](cx,h.label2?cy-half*.3:cy,half*(h.label2?.75:.9),tc);
  if(h.l)s+=text(cx+(h.led&&!h.arrows?7:0),cy,h.l,{sz,fill:tc});
  if(h.label2)s+=text(cx,cy+half*.62,h.label2,{sz:sz*.75,fill:tc});
  return `<g class="hot" tabindex="0" role="button" data-id="${esc(h.id)}" aria-label="${esc(h.n||h.l||h.id)}">${s}</g>`;
}
window.drawPanel=function(P){
  return `<svg class="panelsvg" viewBox="${P.vb}" role="group" aria-label="${esc(P.title)}">`+P.deco.map(d=>shape(d)).join('')+P.hot.map(hot).join('')+'</svg>';
};
})();
