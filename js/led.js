/* 7-Segment-Anzeige als SVG */
const H=cy=>`9,${cy} 14,${cy-5} 46,${cy-5} 51,${cy} 46,${cy+5} 14,${cy+5}`;
const V=(cx,a,b)=>`${cx},${a} ${cx+5},${a+5} ${cx+5},${b-5} ${cx},${b} ${cx-5},${b-5} ${cx-5},${a+5}`;
const SG={a:H(6),b:V(54,9,49),c:V(54,55,95),d:H(98),e:V(6,55,95),f:V(6,9,49),g:H(52)};
const DIG={'0':'abcdef','1':'bc','2':'abged','3':'abgcd','4':'fgbc','5':'afgcd','6':'afgedc','7':'abc','8':'abcdefg','9':'abcdfg','-':'g',' ':''};

function ledSVG(str){let x=0,o='';for(const ch of str){
  if(ch===':'){o+=`<rect class="on" x="${x+4}" y="27" width="10" height="10" rx="2"/><rect class="on" x="${x+1}" y="67" width="10" height="10" rx="2"/>`;x+=20;continue}
  const on=DIG[ch]??'';for(const k in SG)o+=`<polygon class="${on.includes(k)?'on':'off'}" points="${SG[k]}" transform="translate(${x} 0)"/>`;x+=68}
  return `<svg viewBox="0 -2 ${x+6} 108" aria-hidden="true"><g transform="translate(9 0) skewX(-5)">${o}</g></svg>`}

/* zeichnet nur neu, wenn sich der Text geändert hat */
export function setLed(el,str){if(el._s===str)return;el._s=str;el.innerHTML=ledSVG(str);el.setAttribute('aria-label',str.trim())}
