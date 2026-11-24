/* Screen "Gespeichert": Ergebnisse, Favoriten, Verlauf, Einstellungen */
import {$,esc,clone} from './util.js';
import {S,D,DEF,save,saveFav,saveHist,saveResults,applyTheme} from './state.js';
import {MC,keyOf,notation,detail,lapMode} from './workout.js';
import {splitsHTML,summary} from './splits.js';
import {renderSetup,stepper} from './setup.js';
import {audioInit,SND} from './sound.js';

const STAR='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/></svg>';
const isFav=(m,c)=>D.fav.some(f=>keyOf(f.mode,f.cfg)===keyOf(m,c));
function item(list,i,e){const fav=isFav(e.mode,e.cfg);
  return `<div class="it"><button class="go" data-load="${list}:${i}"><i class="md" style="background:${MC[e.mode]}"></i><span style="min-width:0"><div class="tt" data-name>${esc(notation(e.mode,e.cfg))}</div><div class="dd">${esc(detail(e.mode,e.cfg))}</div></span></button>
  <button class="star" data-star="${list}:${i}" aria-pressed="${fav}" aria-label="${fav?'Aus Favoriten entfernen':'Als Favorit speichern'}">${STAR}</button></div>`}

/* Ergebnisliste: Antippen klappt die Rundenzeiten auf (nur AMRAP/For Time mit getippten Runden) */
let openAt=null;
const when=t=>{const d=new Date(t);return `${d.toLocaleDateString('de-DE',{weekday:'short',day:'numeric',month:'numeric'})}, ${d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}`};
function resItem(e){
  const sp=lapMode(e.mode)?splitsHTML(e.res||[]):'',open=sp&&openAt===e.at;
  const head=`<i class="md" style="background:${MC[e.mode]}"></i><span class="rx"><div class="tt" data-name>${esc(notation(e.mode,e.cfg))}</div><div class="dd">${esc(when(e.at))}</div></span><b class="rv" data-summary>${esc(summary(e))}</b>`;
  return `<div class="rs${open?' open':''}" data-entry>${sp
    ?`<button class="go" data-res="${e.at}" aria-expanded="${!!open}">${head}<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>${open?`<div class="splits rsp">${sp}</div>`:''}`
    :`<div class="go">${head}<span class="chev"></span></div>`}</div>`}

function renderSaved(){
  $('#resList').innerHTML=D.results.length?D.results.map(resItem).join(''):'<div class="empty">Noch keine Ergebnisse. Jedes fertige Workout landet hier, abgebrochene nicht.</div>';
  $('#clearRes').classList.toggle('hide',!D.results.length);
  $('#count').textContent=D.count;$('#countL').textContent=D.count===1?'Workout geschafft':'Workouts geschafft';
  $('#favList').innerHTML=D.fav.length?D.fav.map((e,i)=>item('f',i,e)).join(''):'<div class="empty">Noch keine Favoriten. Tippe im Verlauf auf den Stern, um einen Timer zu behalten.</div>';
  $('#histList').innerHTML=D.hist.length?D.hist.map((e,i)=>item('h',i,e)).join(''):'<div class="empty">Noch kein Verlauf. Jeder gestartete Timer landet hier.</div>';
  $('#clearHist').classList.toggle('hide',!D.hist.length);
  const th=[['system','Auto'],['light','Hell'],['dark','Dunkel']];
  $('#prefs').innerHTML=`${stepper('prep','Countdown vor dem Start',S.prep,'',S.prep?S.prep+' s':'aus')}
   <div class="rowx"><span>Töne</span><button class="sw" role="switch" data-sw="sound" aria-checked="${S.sound}" aria-label="Töne"></button></div>
   <div class="rowx"><span>Darstellung</span><span class="mini" role="group" aria-label="Darstellung">${th.map(([v,l])=>`<button data-theme="${v}" aria-pressed="${S.theme===v}">${l}</button>`).join('')}</span></div>`;
  /* installierte Version = Name des Offline-Caches (z. B. wod-clock-1.4.2, gesetzt vom Deploy); ohne Service Worker leer */
  try{caches.keys().then(k=>{const v=k.find(x=>x.startsWith('wod-clock-'));$('#ver').textContent=v?'Version '+v.slice(10):''}).catch(()=>{})}catch(e){}}

function show(v){$('#vSetup').classList.toggle('hide',v!=='setup');$('#vSaved').classList.toggle('hide',v!=='saved');if(v==='saved')renderSaved();else renderSetup()}

$('#toSaved').onclick=()=>show('saved');$('#back').onclick=()=>show('setup');
$('#vSaved').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.res){const at=+d.res;openAt=openAt===at?null:at;renderSaved()}
  if(b.id==='clearRes'){if(b.textContent!=='Wirklich?'){b.textContent='Wirklich?';setTimeout(()=>{if(b.isConnected)b.textContent='Leeren'},2500);return}D.results=[];saveResults();openAt=null;b.textContent='Leeren';renderSaved()}
  if(d.load){const[l,i]=d.load.split(':');const e2=(l==='f'?D.fav:D.hist)[+i];S.mode=e2.mode;S.cfg[e2.mode]=Object.assign({},DEF.cfg[e2.mode],clone(e2.cfg));save();show('setup')}
  if(d.star){const[l,i]=d.star.split(':');const e2=(l==='f'?D.fav:D.hist)[+i];const k=keyOf(e2.mode,e2.cfg);
    if(isFav(e2.mode,e2.cfg))D.fav=D.fav.filter(f=>keyOf(f.mode,f.cfg)!==k);else D.fav.unshift({mode:e2.mode,cfg:clone(e2.cfg)});saveFav();renderSaved()}
  if(d.step==='prep'){const L=[0,3,5,10,15,20,30];let i=L.indexOf(S.prep);if(i<0)i=L.findIndex(v=>v>=S.prep);S.prep=L[Math.max(0,Math.min(L.length-1,i+(+d.d)))];save();renderSaved()}
  if(d.sw==='sound'){S.sound=!S.sound;save();renderSaved();if(S.sound){audioInit();SND.lap()}}
  if(d.theme){S.theme=d.theme;save();applyTheme();renderSaved()}
  if(b.id==='clearHist'){if(b.textContent!=='Wirklich?'){b.textContent='Wirklich?';setTimeout(()=>{if(b.isConnected)b.textContent='Leeren'},2500);return}D.hist=[];saveHist();b.textContent='Leeren';renderSaved()}
});
