/* Einstieg: lädt alle Screens und startet die App */
import {applyTheme} from './state.js';
import {renderSetup} from './setup.js';
import './saved.js';
import './run.js';

applyTheme();
renderSetup();

/* offline support (GitHub Pages / any https host) */
if('serviceWorker' in navigator&&location.protocol==='https:'){
  window.addEventListener('load',()=>{try{
    /* updateViaCache:'none': sw.js nie aus dem HTTP-Cache, sonst wird eine neue Version bis zu 10 min übersehen */
    navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(reg=>{
      /* iOS lädt eine Home-Bildschirm-App beim Zurückholen meist nicht neu, deshalb dann selbst nach Updates fragen */
      document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')reg.update().catch(()=>{})})}).catch(()=>{})}catch(e){}});
  /* Neue Version aktiv: einmal neu laden, aber nie während eines Workouts oder auf dem Ergebnis-Screen */
  const hadSW=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!hadSW)return;
    const tryReload=()=>{const st=document.querySelector('#run').dataset.state;if(!st||st==='closed')location.reload();else setTimeout(tryReload,3000)};
    tryReload()});
}
