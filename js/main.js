/* Einstieg: lädt alle Screens und startet die App */
import {applyTheme} from './state.js';
import {renderSetup} from './setup.js';
import './saved.js';
import './run.js';

applyTheme();
renderSetup();

/* offline support (GitHub Pages / any https host) */
if('serviceWorker' in navigator&&location.protocol==='https:'){
  window.addEventListener('load',()=>{try{navigator.serviceWorker.register('sw.js').catch(()=>{})}catch(e){}});
}
