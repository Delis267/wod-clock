/* Mini-Gherkin ohne Abhängigkeiten: Parser für deutsche .feature-Dateien, Step-Registry und Ausführung.
   Unterstützt: Funktionalität (mit Beschreibung), Grundlage, Szenario, Szenariogrundriss + Beispiele,
   Angenommen / Gegeben sei / Wenn / Dann / Und / Aber, Datentabellen unter einem Schritt, #-Kommentare. */

const STEP_KW=/^(Angenommen|Gegeben seien|Gegeben sei|Wenn|Dann|Und|Aber)\s+(.*)$/;

export function parse(src,file){
  const feat={name:'',desc:[],file,background:null,scenarios:[]};
  let cur=null,mode=null,lastStep=null;
  src.split(/\r?\n/).forEach((raw,n)=>{
    const l=raw.trim(),line=n+1;let m;
    if(!l||l.startsWith('#'))return;
    const fail=msg=>{throw new Error(`${file}:${line}: ${msg}`)};
    if((m=l.match(/^Funktionalität:\s*(.*)$/))){feat.name=m[1];mode='feat';return}
    if((m=l.match(/^Grundlage:\s*(.*)$/))){cur=feat.background={name:m[1],steps:[]};mode='steps';return}
    if((m=l.match(/^(Szenariogrundriss|Szenario):\s*(.*)$/))){
      cur={name:m[2],outline:m[1]==='Szenariogrundriss',steps:[],examples:null,line};feat.scenarios.push(cur);mode='steps';return}
    if(/^Beispiele:/.test(l)){if(!cur||!cur.outline)fail('„Beispiele“ nur unter einem Szenariogrundriss');cur.examples=[];mode='examples';return}
    if(l.startsWith('|')){
      const cells=l.replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
      if(mode==='examples')cur.examples.push(cells);
      else if(lastStep)(lastStep.table||(lastStep.table=[])).push(cells);
      else fail('Tabelle ohne Schritt');
      return}
    if((m=l.match(STEP_KW))){if(!cur)fail('Schritt außerhalb eines Szenarios');lastStep={kw:m[1],text:m[2],line};cur.steps.push(lastStep);return}
    if(mode==='feat'){feat.desc.push(l);return}
    if(mode==='steps'&&cur&&!cur.steps.length){(cur.desc||(cur.desc=[])).push(l);return}
    fail(`Zeile nicht verstanden: „${l}“`)});
  /* Szenariogrundrisse in einzelne Szenarien auffalten; <Platzhalter> aus der Beispiele-Tabelle */
  feat.scenarios=feat.scenarios.flatMap(sc=>{
    if(!sc.outline)return [sc];
    const [head,...rows]=sc.examples||[];
    if(!head)throw new Error(`${file}:${sc.line}: Szenariogrundriss ohne Beispiele`);
    return rows.map(r=>{const sub=s=>s.replace(/<([^>]+)>/g,(_,k)=>head.includes(k)?r[head.indexOf(k)]:`<${k}>`);
      return {name:sub(sc.name),line:sc.line,steps:sc.steps.map(st=>({...st,text:sub(st.text),table:st.table&&st.table.map(row=>row.map(sub))}))}})});
  return feat}

/* ---------- Step-Registry ---------- */
const defs=[];
const TYPES={
  '{int}':  ['(-?\\d+)',Number],
  '{string}':['"([^"]*)"',String],
  '{zeit}': ['(\\d+:\\d\\d)',String]};

/* step('der Countdown ist {int} Sekunden', (welt, n) => …) — auch mehrere Formulierungen als Array oder ein RegExp */
export function step(patterns,fn){
  for(const p of [].concat(patterns)){
    if(p instanceof RegExp){defs.push({src:String(p),re:p,conv:[],fn});continue}
    const conv=[];
    const re=p.split(/(\{int\}|\{string\}|\{zeit\})/).map(part=>{
      if(TYPES[part]){conv.push(TYPES[part][1]);return TYPES[part][0]}
      return part.replace(/[.*+?^$()|[\]\\{}]/g,'\\$&')}).join('');
    defs.push({src:p,re:new RegExp('^'+re+'$'),conv,fn})}}

function match(text){
  const hits=[];for(const d of defs){const m=text.match(d.re);if(m)hits.push({d,args:m.slice(1).map((v,i)=>d.conv[i]?d.conv[i](v):v)})}
  if(!hits.length)throw new Error(`Kein Schritt definiert für: „${text}“ (in tests/steps.js ergänzen)`);
  if(hits.length>1)throw new Error(`Mehrdeutig: „${text}“ passt auf ${hits.map(h=>h.d.src).join(' | ')}`);
  return hits[0]}

/* ---------- Prüfhilfen für den Glue-Code ---------- */
export function eq(actual,expected,label){
  if(actual!==expected)throw new Error(`${label}: erwartet ${JSON.stringify(expected)}, war ${JSON.stringify(actual)}`)}
export function ok(cond,msg){if(!cond)throw new Error(msg)}

/* ---------- Ausführung ---------- */
export async function runFeature(feat,makeWorld){
  const out={name:feat.name,desc:feat.desc,file:feat.file,scenarios:[]};
  for(const sc of feat.scenarios){
    const w=makeWorld(),res={name:sc.name,line:sc.line,steps:[]};let failed=false;
    for(const st of [...(feat.background?feat.background.steps:[]),...sc.steps]){
      const e={kw:st.kw,text:st.text,table:st.table||null,line:st.line,status:'skipped'};res.steps.push(e);
      if(failed)continue;
      try{const {d,args}=match(st.text);if(st.table)args.push(st.table);await d.fn(w,...args);e.status='passed'}
      catch(err){e.status='failed';e.error=err.message;failed=true}}
    if(!failed&&w.after){try{await w.after()}catch(err){res.steps.push({kw:'',text:'(nach dem Szenario)',status:'failed',error:err.message});failed=true}}
    if(w.dispose)w.dispose();
    res.status=failed?'failed':'passed';out.scenarios.push(res)}
  return out}
