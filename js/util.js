/* Kleine Helfer ohne App-Wissen: DOM, Formatierung, localStorage */
export const $ = s => document.querySelector(s);
export const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const fmt = s => {s=Math.max(0,Math.round(s));const m=Math.floor(s/60),x=String(s%60).padStart(2,'0');return `${m}:${x}`};
export const ledTime = s => {s=Math.max(0,Math.floor(s));const m=Math.floor(s/60),x=String(s%60).padStart(2,'0');return `${String(m).padStart(2,' ')}:${x}`};
export const clone = o => JSON.parse(JSON.stringify(o));
export const store = {
  get(k,d){try{const v=JSON.parse(localStorage.getItem('wodclock.'+k));return v??d}catch(e){return d}},
  set(k,v){try{localStorage.setItem('wodclock.'+k,JSON.stringify(v))}catch(e){}}};
