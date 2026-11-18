/* Gespeicherter Zustand: Einstellungen (S) und Favoriten, Verlauf, Zähler (D) */
import {store,clone} from './util.js';
import {MODES} from './workout.js';

export const DEF={mode:'tabata',prep:10,sound:true,theme:'system',
  cfg:{tabata:{work:20,rest:10,rounds:8,sets:1,setRest:60},amrap:{dur:720,sets:1,setRest:60},emom:{every:60,rounds:10},fortime:{cap:1200,rounds:0}}};

export const S=clone(DEF);
(()=>{const s=store.get('s',null);if(!s)return;
  for(const k of ['mode','prep','sound','theme'])if(s[k]!=null)S[k]=s[k];
  if(s.cfg)for(const m in DEF.cfg)S.cfg[m]=Object.assign({},DEF.cfg[m],s.cfg[m]||{})})();
if(!MODES[S.mode])S.mode='tabata';
export const save=()=>store.set('s',S);

/* in einem Objekt, damit andere Module die Listen neu zuweisen können */
export const D={fav:store.get('fav',[]),hist:store.get('hist',[]),count:store.get('count',0)};
export const saveFav=()=>store.set('fav',D.fav);
export const saveHist=()=>store.set('hist',D.hist);
export const saveCount=()=>store.set('count',D.count);

export function applyTheme(){if(S.theme==='system')document.documentElement.removeAttribute('data-theme');else document.documentElement.dataset.theme=S.theme}
