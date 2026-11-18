/* Fachlogik der Workouts, ohne DOM: Modi, Bezeichnungen, Ablauf (Segmente) */
import {fmt} from './util.js';

export const MODES={fortime:'For Time',amrap:'AMRAP',emom:'EMOM',tabata:'Tabata'};
export const MC={fortime:'#3b82f6',amrap:'#ff8a1f',emom:'#8b5cf6',tabata:'#1fc8c0'};

/* AMRAP und For Time zählen Runden per Tippen */
export const lapMode=m=>m==='amrap'||m==='fortime';
export const keyOf=(m,c)=>m+':'+JSON.stringify(c);

export function total(m,c){
  if(m==='tabata')return c.sets*(c.rounds*c.work+(c.rounds-1)*c.rest)+(c.sets-1)*c.setRest;
  if(m==='amrap')return c.sets*c.dur+(c.sets-1)*c.setRest;if(m==='emom')return c.every*c.rounds;return c.cap||0}
export function notation(m,c){
  if(m==='tabata'){const base=(c.work===20&&c.rest===10&&c.rounds===8)?'Tabata':`${c.work}/${c.rest} × ${c.rounds}`;return c.sets>1?`${c.sets} × ${base}`:base}
  if(m==='amrap'){const a=c.dur%60===0?`AMRAP ${c.dur/60}`:`AMRAP ${fmt(c.dur)}`;return c.sets>1?`${c.sets} × ${a}`:a}
  if(m==='emom'){if(c.every===60)return `EMOM ${c.rounds}`;const e=c.every%60===0?c.every/60:fmt(c.every);return `E${e}MOM × ${c.rounds}`}
  return c.rounds?`${c.rounds} RFT`:'For Time'}
export function detail(m,c){
  if(m==='tabata')return (c.sets>1?`${fmt(c.setRest)} Rest zwischen Sätzen, `:'')+`${fmt(total(m,c))} gesamt`;
  if(m==='amrap')return c.sets>1?`${fmt(c.setRest)} Rest dazwischen, ${fmt(total(m,c))} gesamt`:'So viele Runden wie möglich';
  if(m==='emom')return `${fmt(total(m,c))} gesamt`;
  return c.cap?`Cap ${c.cap%60===0?c.cap/60:fmt(c.cap)}`:'ohne Cap'}

/* Ablauf als Liste von Segmenten: prep, work, rest, setrest */
export function build(m,c,prep){const seg=[];if(prep)seg.push({k:'prep',dur:prep});
  if(m==='tabata')for(let s=1;s<=c.sets;s++){for(let r=1;r<=c.rounds;r++){seg.push({k:'work',dur:c.work,r,set:s});if(r<c.rounds&&c.rest)seg.push({k:'rest',dur:c.rest,r,set:s})}
    if(s<c.sets&&c.setRest)seg.push({k:'setrest',dur:c.setRest,r:c.rounds,set:s})}
  if(m==='emom')for(let r=1;r<=c.rounds;r++)seg.push({k:'work',dur:c.every,r});
  if(m==='amrap')for(let s=1;s<=c.sets;s++){seg.push({k:'work',dur:c.dur,set:s});if(s<c.sets&&c.setRest)seg.push({k:'setrest',dur:c.setRest,set:s})}
  if(m==='fortime')seg.push({k:'work',dur:c.cap||Infinity,up:true});
  return seg}
