/* Screen "Timer einstellen" */
import {$,fmt} from './util.js';
import {S,save} from './state.js';
import {MODES,MC,total,notation} from './workout.js';
import {FIELDS,openWheel} from './wheel.js';

/* Zeile mit −/+; wird auch im Screen "Gespeichert" genutzt */
export function stepper(key,label,val,sub,show){
  return `<div class="rowx"><span>${label}${sub?`<small>${sub}</small>`:''}</span><span class="stp">
  <button data-step="${key}" data-d="-1" aria-label="${label} weniger">−</button><span class="val num">${show??val}</span>
  <button data-step="${key}" data-d="1" aria-label="${label} mehr">+</button></span></div>`}
function chips(key,vals,cur){
  return `<div class="chips" style="grid-template-columns:repeat(${vals.length},minmax(0,1fr))">${vals.map(([v,l])=>`<button data-quick="${key}" data-v="${v}" aria-pressed="${v===cur}">${l}</button>`).join('')}</div>`}
function bigCard(key,top,val,hint){
  return `<button class="card big" data-pick="${key}" aria-label="${FIELDS[key.split('.')[1]]} ändern"><span class="t">${top}</span><span class="v">${val}</span><span class="h">${hint}</span></button>`}
function rftViz(c){
  if(!c.rounds)return '';const n=c.rounds,W=1000,g=n>20?4:8,w=(W-g*(n-1))/n;
  let o='';for(let i=0;i<n;i++)o+=`<rect x="${(i*(w+g)).toFixed(1)}" y="0" width="${w.toFixed(1)}" height="14" fill="#ff3b2f"/>`;
  const pace=c.cap?`max. <b>${fmt(c.cap/n)}</b> pro Runde`:'ohne Cap';
  return `<div class="tl"><div class="r"><span class="lab">${n} ${n===1?'Runde':'Runden'} auf Zeit</span><span class="lab">${pace}</span></div><svg viewBox="0 0 ${W} 14" preserveAspectRatio="none" role="img" aria-label="${n} Runden${c.cap?', höchstens '+fmt(c.cap/n)+' pro Runde':''}">${o}</svg></div>`}
function timeline(m,c){
  const T=total(m,c);if(!T)return '';let x=0,o='';const W=1000,k=W/T;
  const r=(w,col,op,y=0,h=14)=>{o+=`<rect x="${(x+1).toFixed(1)}" y="${y}" width="${Math.max(1,w*k-2).toFixed(1)}" height="${h}" fill="${col}" fill-opacity="${op}"/>`;x+=w*k};
  if(m==='tabata')for(let s=0;s<c.sets;s++){for(let i=0;i<c.rounds;i++){r(c.work,'#ff3b2f',1);if(i<c.rounds-1&&c.rest)r(c.rest,'#2fe36a',.8)}if(s<c.sets-1&&c.setRest)r(c.setRest,'#2fe36a',.4,4,6)}
  if(m==='emom')for(let i=0;i<c.rounds;i++)r(c.every,'#ff3b2f',1);
  if(m==='amrap')for(let i=0;i<c.sets;i++){r(c.dur,'#ff3b2f',1);if(i<c.sets-1&&c.setRest)r(c.setRest,'#2fe36a',.5,4,6)}
  return `<div class="tl"><div class="r"><span class="lab">${m==='emom'?`${c.rounds} × ${fmt(c.every)}`:'Ablauf'}</span><span class="lab">Gesamt <b>${fmt(T)}</b></span></div><svg viewBox="0 0 ${W} 14" preserveAspectRatio="none" role="img" aria-label="Ablauf, ${fmt(T)} gesamt">${o}</svg></div>`}

export function renderSetup(){
  const m=S.mode,c=S.cfg[m];
  $('#modes').innerHTML=Object.entries(MODES).map(([k,n])=>`<button data-mode="${k}" aria-pressed="${k===m}">${n}</button>`).join('');
  let h='';
  if(m==='tabata'){
    h=`<div class="card" style="padding:12px 14px 4px"><div class="lab" style="margin-bottom:8px">Eine Runde</div>
      <div class="blocks"><button class="block" data-pick="tabata.work"><span class="k"><i class="dot"></i>Work</span><span class="v">${fmt(c.work)}</span></button>
      <button class="block rest" data-pick="tabata.rest"><span class="k"><i class="dot"></i>Rest</span><span class="v">${fmt(c.rest)}</span></button></div>
      <div style="margin:0 -14px">${stepper('tabata.rounds','Runden',c.rounds)}</div></div>
      <div class="card">${stepper('tabata.sets','Sätze',c.sets,'Alle Runden noch einmal')}
      ${c.sets>1?`<button class="rowx" data-pick="tabata.setRest"><span style="display:flex;align-items:center;gap:8px"><i class="dot" style="background:var(--grn);opacity:.55"></i>Rest zwischen Sätzen</span><span class="val">${fmt(c.setRest)}</span></button>`:''}</div>
      ${timeline(m,c)}`}
  if(m==='amrap'){
    h=bigCard('amrap.dur','So viele Runden wie möglich in',fmt(c.dur),'Antippen zum Ändern')+
      chips('amrap.dur',[[300,'5 min'],[600,'10 min'],[720,'12 min'],[900,'15 min'],[1200,'20 min']],c.dur)+
      `<div class="card">${stepper('amrap.sets','Sätze',c.sets,'Mehrere AMRAPs mit Rest dazwischen')}
      ${c.sets>1?`<button class="rowx" data-pick="amrap.setRest"><span style="display:flex;align-items:center;gap:8px"><i class="dot" style="background:var(--grn);opacity:.55"></i>Rest zwischen Sätzen</span><span class="val">${fmt(c.setRest)}</span></button>`:''}</div>`+
      (c.sets>1?timeline(m,c):'')}
  if(m==='emom'){
    h=bigCard('emom.every','Jede Runde startet alle',fmt(c.every),'Was übrig bleibt, ist dein Rest')+
      chips('emom.every',[[30,'0:30'],[60,'1:00'],[90,'1:30'],[120,'2:00'],[180,'3:00']],c.every)+
      `<div class="card">${stepper('emom.rounds','Runden',c.rounds)}</div>`+timeline(m,c)}
  if(m==='fortime'){
    h=bigCard('fortime.cap','Time Cap',c.cap?fmt(c.cap):'ohne',c.cap?'Uhr läuft hoch und stoppt spätestens hier':'Uhr läuft hoch, bis du Fertig tippst')+
      chips('fortime.cap',[[0,'Ohne'],[600,'10'],[900,'15'],[1200,'20'],[1800,'30']],c.cap)+
      `<div class="card">${stepper('fortime.rounds','Runden',c.rounds,'Optional. Stoppt nach der letzten Runde',c.rounds||'offen')}</div>`+rftViz(c)}
  $('#body').innerHTML=h;
  /* Countdown vor dem Start: gehört zum Starten, deshalb unten direkt über dem Start-Knopf; gilt für alle Modi */
  $('#cdRow').innerHTML=`<span>Countdown</span><span class="mini" role="group" aria-label="Countdown vor dem Start">${PREP.map(v=>`<button data-prep="${v}" aria-pressed="${S.prep===v}">${v} s</button>`).join('')}</span>`;
  $('#vSetup').style.setProperty('--mode',MC[m]);const fc=$('#body').querySelector('.card');if(fc)fc.classList.add('acc');
  $('#start').setAttribute('aria-label',`Start: ${notation(m,c)}`);
}

const PREP=[3,5,10,30];

$('#cdRow').onclick=e=>{const b=e.target.closest('[data-prep]');if(!b)return;S.prep=+b.dataset.prep;save();renderSetup()};
$('#modes').onclick=e=>{const b=e.target.closest('[data-mode]');if(!b)return;S.mode=b.dataset.mode;save();renderSetup()};
$('#body').onclick=e=>{
  const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.pick){const[m,f]=d.pick.split('.');openWheel(f,S.cfg[m][f],v=>{S.cfg[m][f]=v;save();renderSetup()})}
  if(d.step){const[m,f]=d.step.split('.');const c=S.cfg[m];const min=(m==='fortime'&&f==='rounds')?0:1,max=f==='sets'?10:99;
    c[f]=Math.max(min,Math.min(max,c[f]+(+d.d)));save();renderSetup()}
  if(d.quick){const[m,f]=d.quick.split('.');S.cfg[m][f]=+d.v;save();renderSetup()}
};
