/* Ablauf-Leiste in der laufenden Uhr: zeigt den Ablauf wie beim Einstellen, Erledigtes gedimmt, Strich = jetzt.
   Liefert Modell und SVG; run.js setzt sie ein und schiebt pro Frame nur Dimmung und Strich.
   Für Hilfstechnik ausgeblendet (aria-hidden): Runde, Zeit und Satz stehen schon in der Uhr. */

const W=1000,COL={work:'#ff3b2f',rest:'#2fe36a',setrest:'#2fe36a'},OP={work:1,rest:.8,setrest:.45};

/* Modell aus Modus, Einstellungen und Ablauf (build).
   time:   Abschnitte in Sekunden, die Leiste folgt der Zeit
   rounds: For Time nur mit Rundenziel, ohne Zeitmaßstab; die Leiste zählt erledigte Runden
   null:   For Time ohne Cap und Ziel, es gibt nichts zu zeigen */
export function progModel(m,c,seg){
  if(m==='fortime'){
    /* mit Cap: Cap gleichmäßig auf die Runden verteilt, das ist das Tempo für „genau im Cap“ */
    if(c.cap)return {kind:'time',blocks:Array.from({length:c.rounds||1},()=>({k:'work',dur:c.cap/(c.rounds||1)})),total:c.cap};
    if(c.rounds)return {kind:'rounds',blocks:Array.from({length:c.rounds},()=>({k:'work',dur:1})),total:c.rounds};
    return null}
  const blocks=seg.filter(s=>s.k!=='prep').map(s=>({k:s.k,dur:s.dur}));
  return {kind:'time',blocks,total:blocks.reduce((a,b)=>a+b.dur,0)}}

export function progSVG(p){
  const k=W/p.total;let x=0,o='';
  for(const b of p.blocks){const w=b.dur*k,thin=b.k==='setrest',y=thin?4:0,h=thin?6:14;
    o+=`<rect data-block data-kind="${b.k}" data-dur="${b.dur}" x="${(x+1).toFixed(1)}" y="${y}" width="${Math.max(1,w-2).toFixed(1)}" height="${h}" fill="${COL[b.k]}" fill-opacity="${OP[b.k]}"/>`;x+=w}
  /* Dimmung über dem Erledigten, darüber Rundenstriche und der Jetzt-Strich */
  o+=`<rect class="pdone" x="0" y="-1" width="0" height="16" fill="#000" fill-opacity=".78"/><g class="pticks"></g>`;
  if(p.kind==='time')o+=`<rect class="phead" x="-2" y="-5" width="4" height="24" fill="#fff"/>`;
  return `<svg viewBox="0 -5 ${W} 24" preserveAspectRatio="none" aria-hidden="true">${o}</svg>`}

/* Rundenstriche; t in Sekunden ab Beginn des Workouts */
export const ticksSVG=(p,ts)=>ts.map(t=>`<rect data-tick="${Math.round(t)}" x="${(t*W/p.total-2).toFixed(1)}" y="-3" width="4" height="20" fill="#ffb000"/>`).join('');

/* pro Frame: v = vergangene Sekunden (time) bzw. erledigte Runden (rounds) */
export function progUpdate(el,p,v){
  v=Math.max(0,Math.min(p.total,v));const x=(v*W/p.total).toFixed(1);
  el.querySelector('.pdone').setAttribute('width',x);
  const h=el.querySelector('.phead');if(h)h.setAttribute('x',(x-2).toFixed(1));
  if(p.kind==='time'){el.dataset.elapsed=Math.floor(v+1e-6);el.dataset.total=p.total}else el.dataset.done=v}
