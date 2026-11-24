/* Simulierte Zeit für die App im Test. Wird vom Test-Server vor allen App-Skripten in index.html eingefügt.
   performance.now, Date.now, setTimeout und requestAnimationFrame laufen nur weiter, wenn der Test
   __clock.tick(ms) aufruft. So dauert „Wenn 90 Sekunden vergehen“ keine echte Zeit und ist exakt. */
(()=>{
  const realNow=Date.now(),timers=new Map();let now=0,nextId=1,frames=[];
  window.__errors=[];
  /* gespielte Töne [Name, Zeit in ms]; js/sound.js meldet sie hierher, wenn es das Array gibt */
  window.__snd=[];
  addEventListener('error',e=>__errors.push(e.message));
  addEventListener('unhandledrejection',e=>__errors.push(String(e.reason)));
  performance.now=()=>now;
  Date.now=()=>realNow+now;
  window.setTimeout=(fn,ms=0,...a)=>{const id=nextId++;timers.set(id,{at:now+Math.max(0,+ms||0),fn:()=>fn(...a)});return id};
  window.clearTimeout=id=>{timers.delete(id)};
  window.requestAnimationFrame=fn=>{const id=nextId++;frames.push([id,fn]);return id};
  window.cancelAnimationFrame=id=>{frames=frames.filter(f=>f[0]!==id)};
  function runTimers(){for(;;){let due=null;
    for(const [id,t] of timers)if(t.at<=now&&(!due||t.at<due[1].at))due=[id,t];
    if(!due)return;timers.delete(due[0]);due[1].fn()}}
  function runFrame(){const q=frames;frames=[];q.forEach(([,fn])=>fn(now))}
  window.__clock={
    now:()=>now,
    /* Zeit in Schritten von ~16 ms (ein Bildschirm-Frame) vorspulen */
    tick(ms){const end=now+Math.max(0,ms);while(now<end){now=Math.min(end,now+16);runTimers();runFrame()}},
  };
})();
