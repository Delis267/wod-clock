/* Szenen für die README-Screenshots. Wird von tests/screenshots.js nach der simulierten Uhr (clock.js) in index.html
   eingefügt. Jede Szene setzt die Einstellungen vor dem Start der App und bedient sie danach wie ein Mensch.
   Uhrzeit und Datum sind fest, damit die Bilder bei unveränderter App gleich bleiben. */
(()=>{
  const FIXED=Date.parse('2026-11-20T18:30:00');
  Date.now=()=>FIXED+performance.now();

  const DEF={mode:'tabata',prep:0,sound:true,theme:'dark',
    cfg:{tabata:{work:20,rest:10,rounds:8,sets:1,setRest:60},amrap:{dur:720,sets:1,setRest:60},emom:{every:60,rounds:10},fortime:{cap:1200,rounds:0}}};
  const sec=z=>{const [m,s]=z.split(':');return +m*60+ +s};
  const $=s=>document.querySelector(s);
  const tick=s=>__clock.tick(s*1000);
  const tapClock=()=>{const c=$('#clock');c.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));c.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));c.click()};
  /* Runden zu festen Zeitpunkten ab Beginn von Work tippen, danach bis „bis“ weiterlaufen */
  function laps(list,bis){let t=0;for(const z of list){tick(sec(z)-t);t=sec(z);tapClock()}if(bis)tick(sec(bis)-t)}
  function start(mode){[...document.querySelectorAll('#modes button')].find(b=>b.textContent===mode).click();$('#start').click()}

  const SCENES={
    einstellen:{s:{mode:'tabata',cfg:{tabata:{sets:2}}}},
    'for-time':{s:{mode:'fortime',cfg:{fortime:{cap:0,rounds:5}}},run(){start('For Time');laps(['2:08','4:12','6:19'],'6:42')}},
    'amrap-quer':{s:{mode:'amrap'},run(){start('AMRAP');laps(['1:05','2:19','3:17'],'3:43')}},
    ergebnis:{s:{mode:'amrap',cfg:{amrap:{dur:600}}},run(){start('AMRAP');laps(['1:52','3:51','5:58','8:02'],'10:00')}},
    ergebnisse:{s:{},store:{count:24,results:[
      {mode:'fortime',cfg:{cap:0,rounds:5},at:FIXED-36e5,res:[{el:612,laps:5,times:[118,239,358,484,612]}],work:612},
      {mode:'amrap',cfg:{dur:720,sets:1,setRest:60},at:FIXED-864e5,res:[{el:720,laps:6,times:[110,228,349,472,598,712]}],work:720},
      {mode:'tabata',cfg:{work:20,rest:10,rounds:8,sets:1,setRest:60},at:FIXED-2*864e5,res:[],work:160},
      {mode:'emom',cfg:{every:60,rounds:10},at:FIXED-4*864e5,res:[],work:600}]},
      run(){$('#toSaved').click();$('#resList [data-res]').click()}},
  };

  const name=new URLSearchParams(location.search).get('scene'),sc=SCENES[name];
  if(!sc)throw new Error('Unbekannte Szene: '+name);
  const s=JSON.parse(JSON.stringify(DEF));
  for(const [k,v] of Object.entries(sc.s))if(k!=='cfg')s[k]=v;
  for(const [m,c] of Object.entries(sc.s.cfg||{}))Object.assign(s.cfg[m],c);
  localStorage.clear();localStorage.setItem('wodclock.s',JSON.stringify(s));
  for(const [k,v] of Object.entries(sc.store||{}))localStorage.setItem('wodclock.'+k,JSON.stringify(v));
  /* CSS-Übergänge laufen in echter Zeit, nicht mit der simulierten Uhr; ohne sie ist jedes Bild gleich */
  document.addEventListener('DOMContentLoaded',()=>{const st=document.createElement('style');
    st.textContent='*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}';document.head.append(st)});
  addEventListener('load',()=>{if(sc.run)sc.run();__clock.tick(32)});
})();
