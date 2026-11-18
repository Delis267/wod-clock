/* Töne (Box-Buzzer per Web Audio), Vibration, Bildschirm wach halten */
import {S} from './state.js';

let ac=null,master=null;
export function audioInit(){
  /* 'ambient' mischt sich mit laufender Musik (Spotify/Apple Music), statt sie wie 'playback' zu unterbrechen */
  try{if(navigator.audioSession)navigator.audioSession.type='ambient'}catch(e){}
  try{if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();const comp=ac.createDynamicsCompressor();master=ac.createGain();master.gain.value=.9;master.connect(comp);comp.connect(ac.destination);
      const b=ac.createBuffer(1,1,22050),s=ac.createBufferSource();s.buffer=b;s.connect(ac.destination);s.start(0)}
    if(ac.state!=='running')ac.resume()}catch(e){}}
/* nur fortsetzen, wenn schon ein AudioContext existiert (kein neuer ohne Nutzeraktion) */
export function audioResume(){try{if(ac&&ac.state!=='running')ac.resume()}catch(e){}}
export function audioSleep(){try{if(ac&&ac.state==='running')ac.suspend()}catch(e){}}

function tone(f,dur,o={}){
  if(!S.sound||!ac)return;const{type='square',vol=.4,when=0,det=true}=o;
  try{const t=ac.currentTime+when,g=ac.createGain(),lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=4200;
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.006);g.gain.setValueAtTime(vol,Math.max(t+.007,t+dur-.03));g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    g.connect(lp);lp.connect(master);
    (det?[f,f*1.007]:[f]).forEach(fr=>{const os=ac.createOscillator();os.type=type;os.frequency.value=fr;os.connect(g);os.start(t);os.stop(t+dur+.03)})}catch(e){}}
export const SND={
  count:()=>tone(1000,.14,{vol:.45}),
  work:()=>tone(1250,.7,{type:'sawtooth',vol:.42}),
  rest:()=>tone(520,.5,{vol:.42}),
  ten:()=>{tone(1000,.09,{vol:.4});tone(1000,.09,{vol:.4,when:.17})},
  half:()=>tone(880,.13,{vol:.35}),
  lap:()=>tone(2100,.04,{vol:.32,det:false}),
  end:()=>tone(760,.9,{type:'sawtooth',vol:.45}),
};

export const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};

let wl=null;
export async function wake(){try{if('wakeLock' in navigator)wl=await navigator.wakeLock.request('screen')}catch(e){}}
export function unwake(){try{wl&&wl.release()}catch(e){}wl=null}
