#!/usr/bin/env node
/* Führt die Specs in tests/features/*.feature aus. Ohne Abhängigkeiten: braucht nur Node und Chrome (oder Edge).
   Aufruf:  node tests/run.js              alle Features
            node tests/run.js loeschen     nur Features, deren Dateiname „loeschen“ enthält
            node tests/run.js --alle       zusätzlich alle Schritte ausgeben (liest sich wie die Spec)
   Chrome-Pfad bei Bedarf über die Umgebungsvariable CHROME setzen. */
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),{spawn,spawnSync}=require('child_process');

const ROOT=path.resolve(__dirname,'..'),FEATURES=path.join(__dirname,'features');
const args=process.argv.slice(2),verbose=args.includes('--alle'),filter=args.find(a=>!a.startsWith('--'))||'';
const TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.feature':'text/plain',
  '.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml'};
const c=(n,s)=>process.stdout.isTTY?`\x1b[${n}m${s}\x1b[0m`:s,green=s=>c(32,s),red=s=>c(31,s),grey=s=>c(90,s),bold=s=>c(1,s);

function findChrome(){
  if(process.env.CHROME)return process.env.CHROME;
  const e=process.env,cands=process.platform==='win32'
    ?[e.ProgramFiles,e['ProgramFiles(x86)'],e.LOCALAPPDATA].filter(Boolean).flatMap(b=>[path.join(b,'Google/Chrome/Application/chrome.exe'),path.join(b,'Microsoft/Edge/Application/msedge.exe')])
    :process.platform==='darwin'?['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge']
    :['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'];
  return cands.find(p=>fs.existsSync(p))}

/* ---------- Test-Server: liefert App und Tests aus, fügt die simulierte Uhr ein, nimmt das Ergebnis an ---------- */
let onResult;
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(req.method==='POST'&&url.pathname==='/__result'){let b='';req.on('data',d=>b+=d);req.on('end',()=>{res.end('ok');onResult(JSON.parse(b))});return}
  if(url.pathname==='/__features'){
    const list=fs.readdirSync(FEATURES).filter(f=>f.endsWith('.feature')&&f.includes(filter)).sort();
    res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify(list))}
  const file=path.join(ROOT,decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(ROOT)){res.writeHead(403);return res.end()}
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404);return res.end('404')}
    if(url.pathname==='/index.html'&&url.searchParams.has('fakeclock'))
      data=String(data).replace('<head>','<head>\n<script src="/tests/lib/clock.js"></script>');
    res.writeHead(200,{'Content-Type':TYPES[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)})});

function print({features,error}){
  if(error){console.log(red('Abbruch: ')+error);return false}
  let sc=0,bad=0,st=0;
  for(const f of features){
    console.log('\n'+bold('Funktionalität: '+f.name)+grey('  '+f.file));
    for(const d of f.desc)console.log(grey('  '+d));
    for(const s of f.scenarios){sc++;const fail=s.status==='failed';if(fail)bad++;
      console.log((fail?red('  ✗ '):green('  ✓ '))+s.name);
      if(!fail&&!verbose){st+=s.steps.length;continue}
      for(const x of s.steps){st++;
        const mark=x.status==='passed'?green('✓'):x.status==='failed'?red('✗'):grey('–');
        console.log(`      ${mark} ${x.status==='skipped'?grey(x.kw+' '+x.text):bold(x.kw)+' '+x.text}`);
        if(x.table)for(const r of x.table)console.log(grey('          | '+r.join(' | ')+' |'));
        if(x.error)console.log(red('          → '+x.error.replace(/\n/g,'\n            ')))}}}
  console.log('\n'+(bad?red(`${bad} von ${sc} Szenarien fehlgeschlagen`):green(`${sc} Szenarien bestanden`))+grey(` (${st} Schritte)`));
  return bad===0}

/* ---------- Ablauf ---------- */
const chromePath=findChrome();
if(!chromePath){console.error('Chrome oder Edge nicht gefunden. Pfad über die Umgebungsvariable CHROME angeben.');process.exit(2)}
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'wodclock-specs-'));
let browser;
function cleanup(){
  if(browser&&browser.exitCode===null){
    if(process.platform==='win32')spawnSync('taskkill',['/pid',String(browser.pid),'/T','/F'],{stdio:'ignore'});else browser.kill()}
  try{fs.rmSync(profile,{recursive:true,force:true,maxRetries:5})}catch(e){}}
server.listen(0,'127.0.0.1',()=>{
  const {port}=server.address();
  const timer=setTimeout(()=>{console.error(red('Zeitüberschreitung: keine Antwort vom Browser nach 60 s'));finish(false)},60000);
  function finish(passed){clearTimeout(timer);cleanup();server.close();process.exitCode=passed?0:1}
  onResult=r=>finish(print(r));
  /* In der CI (GitHub setzt CI=true) blockieren neuere Ubuntu-Runner teils Chromes Sandbox */
  const ci=process.env.CI?['--no-sandbox']:[];
  browser=spawn(chromePath,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-extensions',...ci,
    `--user-data-dir=${profile}`,'--window-size=800,1000',`http://127.0.0.1:${port}/tests/lib/runner.html?f=${encodeURIComponent(filter)}`],{stdio:'ignore'});
  browser.on('error',e=>{console.error(red('Chrome ließ sich nicht starten: '+e.message));finish(false)});
});
