/* Rundenzeiten nach dem Workout (Ergebnis-Screen und Ergebnisliste) */
import {fmt} from './util.js';

/* chronologisch und je Satz gruppiert; die schnellste Runde eines Satzes ist hervorgehoben.
   sets: [{times:[Sekunden ab Satzbeginn je Tipp]}] */
export function splitsHTML(sets){
  if(!sets.some(r=>r.times&&r.times.length))return '';
  const multi=sets.length>1;
  const groups=sets.map((r,si)=>{const ts=r.times||[],sp=ts.map((t,i)=>[i+1,t-(ts[i-1]||0),t]);
    const best=sp.length>1?Math.min(...sp.map(x=>x[1])):-1;
    return `<div data-set="${si+1}">${multi?`<div class="sl">Satz ${si+1}</div>`:''}${sp.length?sp.map(([n,d,t])=>
      `<div class="row${d===best?' best':''}" data-lap="${n}"><span data-col="runde">${n}</span><b data-col="zeit">${fmt(d)}</b><span data-col="gesamt">${fmt(t)}</span></div>`).join(''):'<div class="row none">keine Runde</div>'}</div>`}).join('');
  return `<div class="sh2"><span>Runde</span><span>Zeit</span><span>Gesamt</span></div><div class="list2">${groups}</div>`}

/* Kurzfassung eines Ergebnisses für die Ergebnisliste */
export function summary(e){
  const r=e.res||[];
  if(e.mode==='fortime'){const x=r[0]||{el:0,laps:0};
    return x.capped?`Time Cap · ${x.laps} Runden`:fmt(x.el)+(x.laps?` · ${x.laps} Runden`:'')}
  if(e.mode==='amrap'){const n=r.reduce((a,x)=>a+x.laps,0);return `${n} Runden`}
  return `Work ${fmt(e.work||0)}`}
