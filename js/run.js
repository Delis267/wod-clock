/* Laufender Timer: Ablaufsteuerung, Anzeige, Bedienung, Ergebnis-Screen.
   Die Bedienlogik ist in docs/bedienlogik.md als Matrix beschrieben. */
import {$,fmt,ledTime,clone} from './util.js';
import {setLed} from './led.js';
import {S,D,save,saveHist,saveCount} from './state.js';
import {lapMode,keyOf,notation,build} from './workout.js';
import {audioInit,audioResume,audioSleep,SND,vib,wake,unwake} from './sound.js';
import {renderSetup} from './setup.js';

let R={};
const LED={prep:'#ffb000',work:'#ff3b2f',rest:'#2fe36a',setrest:'#2fe36a',done:'#4f8cff'};
const ICON={
  x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>',
  snd:'<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4zM16.5 9a4 4 0 0 1 0 6"/></svg>',
  mute:'<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4zM17 9.5l5 5M22 9.5l-5 5"/></svg>'};

/* Zustand für Tests und Hilfstechnik: data-state="running|paused|done|closed" an #run (Design nutzt die Klassen) */
const syncState=()=>{$('#run').dataset.state=!R.active?'closed':R.done?'done':R.paused?'paused':'running'};

/* ---------- Ablauf ---------- */
function start(){
  audioInit();wake();
  const m=S.mode,c=clone(S.cfg[m]);
  const k=keyOf(m,c);D.hist=[{mode:m,cfg:c},...D.hist.filter(h=>keyOf(h.mode,h.cfg)!==k)].slice(0,10);saveHist();
  R={active:true,m,c,seg:build(m,c,S.prep),i:0,t0:performance.now(),paused:false,pAt:0,laps:[],res:[],done:false,last:null,half:false,arm:0,workTotal:0,undo:null,doneArm:0};
  $('#rTitle').textContent=notation(m,c);
  $('#cG').classList.toggle('hide',!(m==='tabata'||m==='emom'||(m==='fortime'&&c.rounds)));
  $('#lR').textContent=lapMode(m)?'Runden':'Runde';$('#lG').textContent=m==='fortime'?'Ziel':'von';
  /* einziger Knopf unter der Uhr: Fertig bei For Time (mit Bestätigung) */
  $('#rCtl').innerHTML=m==='fortime'?`<button class="rk" id="bDone">Fertig</button>`:'';
  $('#rCtl').classList.toggle('hide',m!=='fortime');$('#run').classList.toggle('nolap',m!=='fortime');if($('#bDone'))$('#bDone').onclick=e=>{const b=e.currentTarget,s=R.seg[R.i];if(s.k!=='work'||R.done)return;
    if(Date.now()-(R.doneArm||0)>2500){R.doneArm=Date.now();b.textContent='Sicher? Nochmal tippen';setTimeout(()=>{if(b.isConnected)b.textContent='Fertig'},2500);return}
    advance(segEl())};
  $('#fin').classList.remove('show');$('#run').classList.remove('paused');sndIcon();
  $('#run').classList.add('show');syncState();enter(0,false);loop()}
const segEl=()=>((R.paused?R.pAt:performance.now())-R.t0)/1000;
function enter(i,quiet){R.i=i;R.last=null;R.half=false;R.delArm=null;const s=R.seg[i];if(s.k==='work'&&R.m==='amrap'&&s.set>1)R.laps=[];
  $('#run').style.setProperty('--led',LED[s.k]);R.infoKey='';
  if(quiet)return;
  if(s.k==='work'){SND.work();vib(250)}else if(s.k!=='prep'){SND.rest();vib([120,80,120])}}
function leave(el){const s=R.seg[R.i];if(s.k==='work'){R.workTotal+=el;if(lapMode(R.m))R.res.push({el,laps:R.laps.length,capped:R.m==='fortime'&&el>=s.dur})}}
function advance(el){leave(el);R.t0=performance.now();if(R.i+1>=R.seg.length)return finish(true);enter(R.i+1,false)}
function loop(){
  if(!R.active||R.done)return;
  if(!R.paused){let s=R.seg[R.i],el=segEl();
    while(el>=s.dur){leave(s.dur);R.t0+=s.dur*1000;if(R.i+1>=R.seg.length)return finish(true);enter(R.i+1,el-s.dur>1);s=R.seg[R.i];el=segEl()}
    const rem=s.dur-el,sec=Math.ceil(rem);
    if(isFinite(rem)&&sec!==R.last){
      if(sec>=1&&sec<=3)SND.count();
      if(sec===10&&s.dur>=30&&s.k!=='prep')SND.ten();
      R.last=sec}
    if(!R.half&&s.k==='work'&&lapMode(R.m)&&isFinite(s.dur)&&s.dur>=240&&el>=s.dur/2){R.half=true;SND.half()}
    draw(s,el,rem)}
  requestAnimationFrame(loop)}

/* ---------- Anzeige ---------- */
function draw(s,el,rem){
  const m=R.m,c=R.c;
  setLed($('#ledT'),s.up?ledTime(el):ledTime(Math.ceil(rem)));
  let rv=0,gv=0;
  if(m==='tabata'||m==='emom'){rv=s.r||1;gv=c.rounds}else{rv=R.laps.length;gv=c.rounds||0}
  setLed($('#ledR'),String(rv).padStart(2,' '));if(gv)setLed($('#ledG'),String(gv).padStart(2,' '));
  $('#rCtl').classList.toggle('off',s.k!=='work');
  const ctlOn=m==='fortime'&&s.k==='work';$('#rCtl').toggleAttribute('inert',!ctlOn);$('#rCtl').setAttribute('aria-hidden',String(!ctlOn));
  setPhase(s);
  let fr='';
  if(R.paused)fr='Pausiert';
  else if(s.k==='prep')fr='Gleich geht’s los';
  else if(m==='tabata'){fr=s.k==='setrest'?'Rest zwischen Sätzen':(c.sets>1?`Satz ${s.set} von ${c.sets}`:(s.k==='work'&&c.rest&&s.r<c.rounds?`Danach ${fmt(c.rest)} Rest`:''))}
  else if(m==='emom'){const left=R.seg.slice(R.i+1).reduce((a,x)=>a+x.dur,0)+rem;fr=`Gesamt noch ${fmt(left)}`}
  else if(s.k==='setrest'){const nx=R.seg[R.i+1];fr=`Rest, gleich Satz ${nx?nx.set:''}`}
  else{const n=R.laps.length;fr=n?`Letzte Runde ${fmt(R.laps[n-1]-(R.laps[n-2]||0))}`:(m==='fortime'?(c.cap?`Cap ${fmt(c.cap)}`:'ohne Cap'):'');if(m==='amrap'&&c.sets>1)fr=`Satz ${s.set} von ${c.sets}`+(fr?`, ${fr}`:'')}
  $('#footR').textContent=fr;
  const key=`${R.laps.length}|${s.k}|${R.paused}|${R.delArm?R.delArm.i:-1}`;
  if(R.infoKey!==key){R.infoKey=key;let h='';
    if(lapMode(m)&&s.k==='work'){
      /* Rundenliste, auch in der Pause sichtbar, damit man Fehltipps in Ruhe löschen kann */
      const sp=R.laps.map((t,i)=>[i+1,t-(R.laps[i-1]||0),t]);
      const best=sp.length>1?Math.min(...sp.map(x=>x[1])):-1;
      h=`<div class="hint" data-hint><i></i>${R.paused?'Lange halten setzt fort':'Tippen zählt eine Runde, lange halten pausiert'}</div>`+(sp.length?`<div class="splits"><div class="sh2"><span>Runde</span><span>Zeit</span><span>Gesamt</span><span></span></div><div class="list2">${sp.slice().reverse().map(([n,d,t])=>{const arm=R.delArm&&R.delArm.i===n-1;
        return `<div class="row${d===best?' best':''}${arm?' arm':''}" data-lap="${n}"${arm?' data-armed':''}><span data-col="runde">${n}</span><b data-col="zeit">${arm?'Löschen?':fmt(d)}</b><span data-col="gesamt">${fmt(t)}</span><button class="del" data-del="${n-1}" aria-label="${arm?`Runde ${n} wirklich löschen`:`Runde ${n} löschen`}">${ICON.x}</button></div>`}).join('')}</div></div>`:'')}
    else if(R.paused)h=`<div class="hint" data-hint><i></i>Antippen setzt fort</div>`;
    else h=`<div class="hint" data-hint><i></i>Uhr antippen pausiert</div>`;
    /* Scrollposition der Rundenliste beim Neuzeichnen behalten */
    const old=$('#rInfo .list2'),top=old?old.scrollTop:0;
    $('#rInfo').innerHTML=h;
    const nw=$('#rInfo .list2');if(nw)nw.scrollTop=top}
}
/* Phase oben in der Uhr: WORK oder REST, im Countdown leer */
function setPhase(s){const t=$('#lT'),txt=s.k==='work'?'WORK':(s.k==='prep'?'':'REST');if(t.textContent!==txt)t.textContent=txt}
function redraw(){const s=R.seg[R.i],el=segEl();draw(s,el,s.dur-el)}

/* Fehltipp löschen: 1. Tippen aufs × markiert die Zeile, 2. Tippen innerhalb von 2,5 s löscht.
   Gespeichert sind die Tipp-Zeitpunkte, daher verschmilzt die gelöschte Runde automatisch mit der nächsten. */
$('#rInfo').addEventListener('click',e=>{
  const b=e.target.closest('[data-del]');if(!b||!R.active||R.done)return;
  const i=+b.dataset.del;if(!(i>=0&&i<R.laps.length))return;
  if(R.delArm&&R.delArm.i===i&&Date.now()-R.delArm.t<2500){R.laps.splice(i,1);R.delArm=null;vib(30)}
  else{const arm=R.delArm={i,t:Date.now()};setTimeout(()=>{if(R.delArm===arm){R.delArm=null;redraw()}},2500)}
  redraw()});
function sndIcon(){$('#rSnd').innerHTML=S.sound?ICON.snd:ICON.mute}

/* ---------- Bedienung ---------- */
function tapClock(){
  if(!R.active||R.done)return;audioInit();
  const s=R.seg[R.i];
  if(lapMode(R.m)&&s.k==='work'&&!R.paused){const t=segEl();R.laps.push(t);SND.lap();vib(40);
    const h=$('#clock');h.classList.add('flash');setTimeout(()=>h.classList.remove('flash'),160);
    if(R.m==='fortime'&&R.c.rounds&&R.laps.length>=R.c.rounds){R.undo={t0:R.t0,el:t};return advance(t)}
    draw(s,t,s.dur-t);return}
  /* außerhalb von WORK (Countdown, Rest) pausiert ein Tippen in jedem Modus */
  if(!lapMode(R.m)||s.k!=='work')togglePause()}
function togglePause(){if(R.done)return;audioInit();
  if(!R.paused){R.paused=true;R.pAt=performance.now();$('#run').classList.add('paused')}
  else{R.t0+=performance.now()-R.pAt;R.paused=false;$('#run').classList.remove('paused')}
  syncState();
  const s=R.seg[R.i],el=segEl();draw(s,el,s.dur-el)}
(()=>{const el=$('#clock');let lp=null,fired=false;
  el.addEventListener('pointerdown',()=>{fired=false;if(!R.active||R.done||!lapMode(R.m))return;clearTimeout(lp);lp=setTimeout(()=>{fired=true;togglePause();vib(60)},550)});
  ['pointerup','pointerleave','pointercancel'].forEach(t=>el.addEventListener(t,()=>clearTimeout(lp)));
  el.addEventListener('contextmenu',e=>e.preventDefault());
  el.onclick=()=>{if(fired){fired=false;return}
    if(lapMode(R.m)&&R.paused&&R.seg[R.i].k==='work')return;tapClock()}})();

/* ---------- Ende ---------- */
/* Ergebniszeile; data-result/data-value sind die stabilen Haken für Tests */
const res=(k,v)=>`<div data-result="${k}" data-value="${v}"><span>${k}</span>${v}</div>`;
function finish(completed){
  R.done=true;unwake();SND.end();vib([400,120,400]);
  if(completed){D.count++;saveCount()}
  $('#run').style.setProperty('--led',LED.done);$('#run').classList.remove('paused');
  const m=R.m,c=R.c;let title='Geschafft',sub=notation(m,c),led=ledTime(R.workTotal),rows='';
  if(m==='fortime'){const r=R.res[0]||{el:0,laps:0};
    if(r.capped){title='Time Cap';led=ledTime(c.cap);rows=res('Runden geschafft',r.laps)}
    else{title='Time!';led=ledTime(r.el);rows=res('Deine Zeit',fmt(r.el))+(r.laps?res('Runden',r.laps):'')}}
  else if(m==='amrap'){const sum=R.res.reduce((a,r)=>a+r.laps,0);title='Time!';led=String(sum).padStart(2,' ');
    rows=R.res.length>1?R.res.map((r,i)=>res(`Satz ${i+1}`,`${r.laps} Runden`)).join('')+res('Gesamt',`${sum} Runden`):res(`Runden in ${fmt(c.dur)}`,sum)}
  else rows=res('Work gesamt',fmt(R.workTotal))+res('Workouts insgesamt',D.count);
  $('#fT').textContent=title;$('#fS').textContent=sub;setLed($('#ledF'),led);$('#fR').innerHTML=rows;
  $('#fUndo').classList.toggle('hide',!R.undo);
  $('#fin').classList.add('show');syncState()}
function undoFinish(){
  if(!R.undo||!R.done)return;const u=R.undo;R.undo=null;
  D.count=Math.max(0,D.count-1);saveCount();
  R.res.pop();R.workTotal-=u.el;R.laps.pop();R.t0=u.t0;R.done=false;R.last=null;
  $('#fin').classList.remove('show');$('#run').style.setProperty('--led',LED.work);R.infoKey='';
  syncState();audioInit();SND.lap();wake();loop()}
function closeRun(){R.active=false;R.done=true;syncState();unwake();audioSleep();$('#run').classList.remove('show');renderSetup()}

$('#rClose').onclick=()=>{
  if(!R.done&&Date.now()-R.arm>2500){R.arm=Date.now();const t=$('#rTitle');t.textContent='Nochmal tippen zum Beenden';setTimeout(()=>{if(R.active&&!R.done)t.textContent=notation(R.m,R.c)},2500);return}
  closeRun()};
$('#fBack').onclick=closeRun;
$('#fUndo').onclick=undoFinish;
$('#fAgain').onclick=()=>{closeRun();start()};
$('#rSnd').onclick=()=>{S.sound=!S.sound;save();sndIcon();if(S.sound){audioInit();SND.lap()}};
$('#start').onclick=start;

/* Rückkehr in die App: während eines Workouts Bildschirm und Ton wieder aktivieren,
   sonst Ton im Hintergrund freigeben, damit iOS die Musik nicht anhält */
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'){if(R.active&&!R.done){wake();audioResume()}}
  else if(!R.active||R.done)audioSleep()});
