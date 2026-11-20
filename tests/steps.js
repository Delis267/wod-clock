/* Glue-Code: verbindet die Sätze aus tests/features/*.feature mit der App.
   Jeder Schritt bekommt die „Welt“ eines Szenarios (w) und die Werte aus den Platzhaltern.
   Platzhalter: {int} Zahl, {string} Text in "Anführungszeichen", {zeit} m:ss */
import {step,eq,ok} from './lib/gherkin.js';

/* ---------- Welt: eine frisch geladene App pro Szenario ---------- */
const DEF={mode:'tabata',prep:10,sound:false,theme:'system',
  cfg:{tabata:{work:20,rest:10,rounds:8,sets:1,setRest:60},amrap:{dur:720,sets:1,setRest:60},emom:{every:60,rounds:10},fortime:{cap:1200,rounds:0}}};
const clone=o=>JSON.parse(JSON.stringify(o));
const sec=z=>{const [m,s]=z.split(':');return +m*60+ +s};

export class World{
  constructor(){this.s=clone(DEF);this.store={};this.frame=null}
  /* Einstellungen gehen nur vor dem Laden der App (sie liegen in localStorage) */
  set(fn){ok(!this.frame,'Einstellungen müssen vor dem Start der App stehen (als „Angenommen“ vor dem ersten „Wenn“)');fn(this.s)}
  async app(){
    if(this.frame)return;
    localStorage.clear();localStorage.setItem('wodclock.s',JSON.stringify(this.s));
    for(const [k,v] of Object.entries(this.store))localStorage.setItem('wodclock.'+k,JSON.stringify(v));
    const f=document.createElement('iframe');f.className='app';
    await new Promise(r=>{f.onload=r;f.src='/index.html?fakeclock';document.body.append(f)});
    this.frame=f;this.win=f.contentWindow;this.doc=this.win.document;this.clock=this.win.__clock}
  $(s){return this.doc.querySelector(s)}
  $$(s){return [...this.doc.querySelectorAll(s)]}
  visible(el){return el.getClientRects().length>0&&this.win.getComputedStyle(el).visibility!=='hidden'}
  /* sichtbarer Text der Seite, so wie er im Quelltext steht (ohne CSS-Großschreibung) */
  visibleText(){const out=[],tw=this.doc.createTreeWalker(this.doc.body,NodeFilter.SHOW_TEXT);
    while(tw.nextNode()){const p=tw.currentNode.parentElement;if(p&&this.visible(p))out.push(tw.currentNode.textContent)}
    return out.join(' ').replace(/\s+/g,' ')}
  button(label){
    const b=this.$$('button').filter(b=>this.visible(b)).find(b=>b.textContent.trim()===label||b.getAttribute('aria-label')===label);
    ok(b,`Kein sichtbarer Knopf „${label}“`);return b}
  tapClock(){const c=this.$('#clock'),P=this.win.PointerEvent;
    c.dispatchEvent(new P('pointerdown',{bubbles:true}));c.dispatchEvent(new P('pointerup',{bubbles:true}));c.click()}
  /* Knöpfe unter der Uhr, nur wenn sie bedienbar sind (aria-hidden) */
  ctlButtons(){const c=this.$('#rCtl');if(c.getAttribute('aria-hidden')==='true')return [];
    return [...c.querySelectorAll('button')].filter(b=>this.visible(b)).map(b=>b.textContent.trim())}
  state(){return this.$('#run').dataset.state}
  /* Zeilen der Rundenliste als "Runde | Zeit | Gesamt" */
  laps(){return this.$$('#rInfo [data-lap]').map(r=>['runde','zeit','gesamt'].map(k=>r.querySelector('[data-col="'+k+'"]').textContent.trim()).join(' | '))}
  after(){if(this.win&&this.win.__errors.length)throw new Error('JavaScript-Fehler in der App: '+this.win.__errors.join(' | '))}
  dispose(){if(this.frame)this.frame.remove()}
}

/* ---------- Einstellungen (vor dem Start) ---------- */
step('der Countdown ist {int} Sekunden',(w,n)=>w.set(s=>{s.prep=n}));
step('der Countdown ist aus',w=>w.set(s=>{s.prep=0}));
step('Tabata ist eingestellt auf {int} Sekunden Work, {int} Sekunden Rest und {int} Runden',
  (w,work,rest,rounds)=>w.set(s=>Object.assign(s.cfg.tabata,{work,rest,rounds})));
step(['AMRAP dauert {int} Minuten','AMRAP dauert {int} Minute'],(w,n)=>w.set(s=>{s.cfg.amrap.dur=n*60}));
step('AMRAP hat {int} Sätze mit {int} Sekunden Rest dazwischen',(w,sets,setRest)=>w.set(s=>Object.assign(s.cfg.amrap,{sets,setRest})));
step('For Time hat kein Cap und kein Rundenziel',w=>w.set(s=>Object.assign(s.cfg.fortime,{cap:0,rounds:0})));
step('For Time hat {int} Runden als Ziel und kein Cap',(w,rounds)=>w.set(s=>Object.assign(s.cfg.fortime,{cap:0,rounds})));
step('der Verlauf enthält {int} Workouts',(w,n)=>{w.set(()=>{});w.store.hist=Array.from({length:n},(_,i)=>({mode:'emom',cfg:{every:60,rounds:5+i}}))});
step('die Ergebnisliste enthält {int} Workouts',(w,n)=>{w.set(()=>{});
  w.store.results=Array.from({length:n},(_,i)=>({mode:'emom',cfg:{every:60,rounds:5+i},at:Date.now()-(i+1)*864e5,res:[],work:300+60*i}))});
step('es gibt {int} Favoriten',(w,n)=>{w.set(()=>{});w.store.fav=Array.from({length:n},(_,i)=>({mode:'amrap',cfg:{dur:300+60*i,sets:1,setRest:60}}))});

/* ---------- Aktionen ---------- */
step('ich {string} starte',async(w,mode)=>{
  await w.app();const b=w.$$('#modes button').find(b=>b.textContent===mode);ok(b,`Kein Modus „${mode}“`);
  b.click();w.$('#start').click();w.startAt=w.clock.now()});
step('ich den Modus {string} wähle',async(w,mode)=>{
  await w.app();const b=w.$$('#modes button').find(b=>b.textContent===mode);ok(b,`Kein Modus „${mode}“`);b.click()});
step('ich auf {string} tippe',async(w,label)=>{await w.app();w.button(label).click()});
step('ich auf die Uhr tippe',w=>w.tapClock());
step('ich {int}-mal auf die Uhr tippe',(w,n)=>{for(let i=0;i<n;i++)w.tapClock()});
step('ich die Uhr lange drücke',w=>{const c=w.$('#clock'),P=w.win.PointerEvent;
  c.dispatchEvent(new P('pointerdown',{bubbles:true}));w.clock.tick(600);c.dispatchEvent(new P('pointerup',{bubbles:true}));c.click()});
step(['{int} Sekunden vergehen','{int} Sekunde vergeht'],(w,n)=>w.clock.tick(n*1000));
/* Zeitpunkte zählen ab Beginn von Work, also nach dem Countdown */
step(/^ich tippe Runden bei (.+)$/,(w,list)=>{
  const workStart=w.startAt+w.s.prep*1000;
  for(const z of list.split(/,\s*|\s+und\s+/)){const t=workStart+sec(z)*1000;
    ok(t>=w.clock.now(),`${z} liegt in der Vergangenheit`);w.clock.tick(t-w.clock.now());w.tapClock()}});
step('ich auf das × von Runde {int} tippe',(w,n)=>{const b=w.$(`#rInfo [data-del="${n-1}"]`);ok(b,`Kein × bei Runde ${n}`);b.click()});

/* ---------- Prüfungen: Uhr ---------- */
step(['ist die Uhr pausiert','die Uhr ist pausiert'],w=>eq(w.state(),'paused','Zustand der Uhr'));
step(['läuft die Uhr','die Uhr läuft'],w=>eq(w.state(),'running','Zustand der Uhr'));
step(['zeigt die Uhr {string}','die Uhr zeigt {string}'],(w,t)=>eq(w.$('#lT').textContent,t,'Phasenanzeige'));
step(['zeigt die Uhr keine Phase','die Uhr zeigt keine Phase'],w=>eq(w.$('#lT').textContent,'','Phasenanzeige'));
step(['zeigt die Uhr die Zeit {zeit}','die Uhr zeigt die Zeit {zeit}'],(w,z)=>eq(w.$('#ledT').getAttribute('aria-label'),z,'Zeit'));
step(['zeigt der Rundenzähler {int}','der Rundenzähler zeigt {int}'],(w,n)=>eq(w.$('#ledR').getAttribute('aria-label'),String(n),'Rundenzähler'));
step(['lautet der Titel {string}','der Titel lautet {string}'],(w,t)=>eq(w.$('#rTitle').textContent,t,'Titel'));
step(['lautet der Hinweis {string}','der Hinweis lautet {string}'],(w,t)=>{const h=w.$('[data-hint]');eq(h&&h.textContent.trim(),t,'Hinweis')});
step(['gibt es unter der Uhr keine Knöpfe','unter der Uhr sind keine Knöpfe'],w=>eq(w.ctlButtons().join(', '),'','Knöpfe unter der Uhr'));
step(['ist unter der Uhr nur der Knopf {string} zu sehen','unter der Uhr ist nur der Knopf {string} zu sehen'],(w,t)=>eq(w.ctlButtons().join(', '),t,'Knöpfe unter der Uhr'));
step(['steht auf dem Knopf {string}','auf dem Knopf steht {string}'],(w,t)=>eq(w.ctlButtons().join(', '),t,'Knopf unter der Uhr'));

/* ---------- Prüfungen: Rundenliste ---------- */
step(['ist Runde {int} zum Löschen markiert','Runde {int} ist zum Löschen markiert'],(w,n)=>{
  const r=w.$('#rInfo [data-armed]');ok(r,'Keine Runde ist markiert');
  eq(r.dataset.lap,String(n),'Markierte Runde');eq(r.querySelector('[data-col="zeit"]').textContent,'Löschen?','Text der markierten Zeile')});
step(['ist keine Runde zum Löschen markiert','keine Runde ist zum Löschen markiert'],w=>ok(!w.$('#rInfo [data-armed]'),'Eine Runde ist noch markiert'));
step(['lautet die Rundenliste:','die Rundenliste lautet:'],(w,table)=>{
  eq(w.laps().join('\n'),table.slice(1).map(r=>r.join(' | ')).join('\n'),'Rundenliste')});

/* ---------- Prüfungen: Ergebnis ---------- */
step(['erscheint das Ergebnis {string}','das Ergebnis {string} erscheint'],(w,t)=>{
  eq(w.state(),'done','Zustand der Uhr');ok(w.visible(w.$('#fin')),'Der Ergebnis-Screen ist nicht zu sehen');eq(w.$('#fT').textContent,t,'Ergebnis-Titel')});
step(['ist kein Ergebnis zu sehen','es ist kein Ergebnis zu sehen'],w=>ok(!w.visible(w.$('#fin')),'Der Ergebnis-Screen ist zu sehen'));
step(['zeigt das Ergebnis {string} mit {string}','das Ergebnis zeigt {string} mit {string}'],(w,k,v)=>{
  const row=w.$$('#fR [data-result]').find(d=>d.dataset.result===k);ok(row,`Keine Ergebniszeile „${k}“`);
  eq(row.dataset.value,v,`Ergebnis „${k}“`)});

/* Rundenzeiten (Ergebnis-Screen und Ergebnisliste); die Spalten kommen aus der Kopfzeile der Tabelle, „Satz“ aus der umgebenden Gruppe */
const lapRows=(w,sel)=>w.$$(sel+' [data-lap]').filter(r=>w.visible(r));
function lapTable(w,sel,table,what){
  const cols=table[0].map(c=>c.toLowerCase());
  const rows=lapRows(w,sel).map(r=>cols.map(k=>k==='satz'?r.closest('[data-set]').dataset.set:r.querySelector('[data-col="'+k+'"]').textContent.trim()).join(' | '));
  eq(rows.join('\n'),table.slice(1).map(r=>r.join(' | ')).join('\n'),what)}
step(['lautet die Rundenliste im Ergebnis:','die Rundenliste im Ergebnis lautet:'],(w,table)=>lapTable(w,'#fSp',table,'Rundenliste im Ergebnis'));
step(['gibt es im Ergebnis keine Rundenliste','im Ergebnis gibt es keine Rundenliste'],w=>ok(!lapRows(w,'#fSp').length,'Im Ergebnis steht eine Rundenliste'));

/* ---------- Prüfungen: Ergebnisliste unter „Gespeichert“ ---------- */
const results=w=>w.$$('#resList [data-entry]');
step(['hat die Ergebnisliste {int} Einträge','hat die Ergebnisliste {int} Eintrag','die Ergebnisliste hat {int} Einträge'],(w,n)=>eq(results(w).length,n,'Einträge in der Ergebnisliste'));
step(['ist das oberste Ergebnis {string} mit {string}','das oberste Ergebnis ist {string} mit {string}'],(w,name,sum)=>{
  const e=results(w)[0];ok(e,'Die Ergebnisliste ist leer');
  eq(e.querySelector('[data-name]').textContent,name,'Name des obersten Ergebnisses');
  eq(e.querySelector('[data-summary]').textContent,sum,'Ergebnis des obersten Eintrags')});
step('ich das oberste Ergebnis aufklappe',w=>{const e=results(w)[0];ok(e,'Die Ergebnisliste ist leer');
  const b=e.querySelector('[aria-expanded]');ok(b,'Das oberste Ergebnis lässt sich nicht aufklappen');b.click()});
step(['lauten die Rundenzeiten des obersten Ergebnisses:','die Rundenzeiten des obersten Ergebnisses lauten:'],(w,table)=>
  lapTable(w,'#resList [data-entry]:first-child',table,'Rundenzeiten des obersten Ergebnisses'));
step(['sind keine Rundenzeiten aufgeklappt','es sind keine Rundenzeiten aufgeklappt'],w=>ok(!lapRows(w,'#resList').length,'In der Ergebnisliste sind Rundenzeiten aufgeklappt'));

/* ---------- Prüfungen: Texte und Listen ---------- */
step(['sehe ich {string}','ich sehe {string}'],(w,t)=>ok(w.visibleText().includes(t),`„${t}“ ist nicht zu sehen`));
step(['steht nirgends {string}','nirgends steht {string}'],(w,t)=>ok(!w.visibleText().includes(t),`„${t}“ ist zu sehen`));
const LISTS={Verlauf:'#histList',Favoriten:'#favList'};
step(['ist die Liste {string} vollständig sichtbar','die Liste {string} ist vollständig sichtbar'],(w,name)=>{
  const e=w.$(LISTS[name]);ok(e,`Keine Liste „${name}“`);
  ok(e.clientHeight>=e.scrollHeight,`${name}: nur ${e.clientHeight} px von ${e.scrollHeight} px sichtbar`)});
step(['lässt sich die Seite scrollen','die Seite lässt sich scrollen'],w=>{
  const e=w.$$('[data-scroll]').find(x=>w.visible(x));ok(e,'Kein sichtbarer Scrollbereich');ok(e.scrollHeight>e.clientHeight,`Kein Scrollen möglich (${e.scrollHeight} px Inhalt, ${e.clientHeight} px Platz)`)});
step(['steht {string} ganz oben im Verlauf','{string} steht ganz oben im Verlauf'],(w,t)=>{
  const e=w.$('#histList [data-name]');eq(e&&e.textContent,t,'Erster Verlaufseintrag')});
