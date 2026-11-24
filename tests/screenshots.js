#!/usr/bin/env node
/* Erzeugt die Screenshots für die README neu (screenshots/*.png). Wie die Specs ohne Abhängigkeiten: braucht nur
   Node und Chrome (oder Edge). Die Szenen stehen in tests/lib/scenes.js.
   Aufruf:  node tests/screenshots.js            alle Bilder
            node tests/screenshots.js ergebnis   nur Bilder, deren Name „ergebnis“ enthält
   Chrome-Pfad bei Bedarf über die Umgebungsvariable CHROME setzen. */
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require('child_process');

const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'screenshots');
/* Name → Fenstergröße in CSS-Pixeln (iPhone 13), gerendert mit Faktor 2 */
const SHOTS={einstellen:[390,844],'for-time':[390,560],'amrap-quer':[844,390],amrap:[390,560],emom:[390,560],tabata:[390,560],ergebnis:[390,844],ergebnisse:[390,844]};
const filter=process.argv[2]||'';
const TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml'};

function findChrome(){
  if(process.env.CHROME)return process.env.CHROME;
  const e=process.env,cands=process.platform==='win32'
    ?[e.ProgramFiles,e['ProgramFiles(x86)'],e.LOCALAPPDATA].filter(Boolean).flatMap(b=>[path.join(b,'Google/Chrome/Application/chrome.exe'),path.join(b,'Microsoft/Edge/Application/msedge.exe')])
    :process.platform==='darwin'?['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge']
    :['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser','/opt/pw-browsers/chromium'];
  return cands.find(p=>fs.existsSync(p))}

/* liefert die App aus und fügt simulierte Uhr und Szene vor allen App-Skripten ein */
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const file=path.join(ROOT,decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(ROOT)){res.writeHead(403);return res.end()}
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404);return res.end('404')}
    if(url.pathname==='/index.html')
      data=String(data).replace('<head>','<head>\n<script src="/tests/lib/clock.js"></script>\n<script src="/tests/lib/scenes.js"></script>');
    res.writeHead(200,{'Content-Type':TYPES[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)})});

function shoot(chrome,port,name,[w,h]){
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'wodclock-shot-')),out=path.join(OUT,name+'.png');
  const ci=process.env.CI?['--no-sandbox']:[];
  return new Promise((resolve,reject)=>{
    const p=spawn(chrome,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-extensions','--hide-scrollbars',...ci,
      `--user-data-dir=${profile}`,'--lang=de-DE',`--window-size=${w},${h}`,'--force-device-scale-factor=2',
      '--virtual-time-budget=5000',`--screenshot=${out}`,`http://127.0.0.1:${port}/index.html?scene=${name}`],{stdio:'ignore'});
    p.on('error',reject);
    p.on('exit',code=>{try{fs.rmSync(profile,{recursive:true,force:true,maxRetries:5})}catch(e){}
      code===0&&fs.existsSync(out)?resolve(out):reject(new Error(`${name}: Chrome endete mit Code ${code}`))})})}

const chrome=findChrome();
if(!chrome){console.error('Chrome oder Edge nicht gefunden. Pfad über die Umgebungsvariable CHROME angeben.');process.exit(2)}
server.listen(0,'127.0.0.1',async()=>{
  const {port}=server.address();let ok=true;
  for(const [name,size] of Object.entries(SHOTS).filter(([n])=>n.includes(filter))){
    try{console.log('✓ '+path.relative(ROOT,await shoot(chrome,port,name,size)))}catch(e){ok=false;console.error('✗ '+e.message)}}
  server.close();process.exitCode=ok?0:1});
