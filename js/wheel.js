/* Scrollrad-Dialog für Minuten und Sekunden */
import {$} from './util.js';

export const FIELDS={work:'Work',rest:'Rest',setRest:'Rest zwischen Sätzen',dur:'Dauer',every:'Intervall',cap:'Time Cap',prep:'Countdown'};
const MIN={work:5,rest:0,setRest:0,dur:30,every:10,cap:0,prep:0};

let sheetCb=null,wM=null,wS=null;
function wheel(items,val){
  const w=document.createElement('div');w.className='wheel';w.tabIndex=0;
  w.innerHTML='<div class="pad"></div><div class="pad"></div>'+items.map(x=>`<div>${x.l}</div>`).join('')+'<div class="pad"></div><div class="pad"></div>';
  let idx=items.findIndex(x=>x.v===val);if(idx<0)idx=items.reduce((bi,x,i)=>Math.abs(x.v-val)<Math.abs(items[bi].v-val)?i:bi,0);
  requestAnimationFrame(()=>{w.scrollTop=idx*44});
  w.get=()=>items[Math.max(0,Math.min(items.length-1,Math.round(w.scrollTop/44)))].v;
  w.onclick=e=>{const el=e.target;if(el.parentNode!==w||el.classList.contains('pad'))return;w.scrollTo({top:([...w.children].indexOf(el)-2)*44,behavior:'smooth'})};
  w.onkeydown=e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();w.scrollBy({top:e.key==='ArrowDown'?44:-44,behavior:'smooth'})}};
  return w}

/* öffnet den Dialog; cb bekommt den gewählten Wert in Sekunden */
export function openWheel(field,val,cb){
  const box=$('#wheels');box.innerHTML='';
  const mins=Array.from({length:60},(_,i)=>({v:i,l:i})),secs=Array.from({length:12},(_,i)=>({v:i*5,l:String(i*5).padStart(2,'0')}));
  wM=wheel(mins,Math.floor(val/60));wS=wheel(secs,Math.round((val%60)/5)*5);
  wM.setAttribute('aria-label','Minuten');wS.setAttribute('aria-label','Sekunden');
  const u=t=>{const s=document.createElement('span');s.className='unit';s.textContent=t;return s};
  box.append(wM,u('min'),wS,u('s'));
  $('#shT').textContent=FIELDS[field]||'Zeit';sheetCb=v=>{const mn=MIN[field]??0;cb(v===0&&field==='cap'?0:Math.max(mn,v))};
  $('#sheet').classList.add('show');setTimeout(()=>wM.focus({preventScroll:true}),50)}
function closeSheet(){$('#sheet').classList.remove('show');sheetCb=null}

$('#shOk').onclick=()=>{const v=wM.get()*60+wS.get();const cb=sheetCb;cb&&cb(v);closeSheet()};
$('#shNo').onclick=closeSheet;$('#sheet .dim').onclick=closeSheet;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#sheet').classList.contains('show'))closeSheet()});
