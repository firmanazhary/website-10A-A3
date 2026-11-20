const SB=(window.IVCS_CFG&&IVCS_CFG.url&&!/XXXX/.test(IVCS_CFG.url)&&window.supabase)?supabase.createClient(IVCS_CFG.url,IVCS_CFG.key):null;window.SB=SB;
window.IVCS_READY=(async()=>{let DATA={};try{if(SB){const {data}=await SB.from('site_content').select('data').eq('id',1).maybeSingle();DATA=(data&&data.data)||{}}}catch(e){}
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],R=document.documentElement;
// loader
let p=0;const lt=setInterval(()=>{p+=Math.ceil(Math.random()*9);if(p>=100){p=100;clearInterval(lt);setTimeout(()=>$('#ld').classList.add('x'),250)}$('#lp').textContent=p},50);
// theme
const cur=()=>R.dataset.theme||(matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');
try{const t=localStorage.getItem('th');if(t)R.dataset.theme=t}catch(e){}
$('#tg').onclick=()=>{const n=cur()=='dark'?'light':'dark';R.dataset.theme=n;try{localStorage.setItem('th',n)}catch(e){}};
// hero letters (gravity drop, click to re-drop)
const iv=$('#iv');const drop=()=>{iv.innerHTML=[...'INVICTUS'].map((c,i)=>`<span style="--n:${i};--r:${(Math.random()*80-40)|0}deg">${c}</span>`).join('')};drop();iv.onclick=drop;
const lg=$('#lg');$('#hero').addEventListener('pointermove',e=>{const x=(e.clientX/innerWidth-.5)*40,y=(e.clientY/innerHeight-.5)*40;lg.style.transform=`translate(${x}px,${y}px) rotate(${x/6}deg)`});
// scroll: altitude + top button
const h=$('#hero'),alt=$('#alt'),tp=$('#top');addEventListener('scroll',()=>{const f=Math.min(1,scrollY/h.offsetHeight);alt.textContent=Math.round(35786*(1-f)).toLocaleString('id-ID');tp.classList.toggle('v',scrollY>600)},{passive:true});
tp.onclick=$('#up').onclick=()=>scrollTo({top:0});
// members (26 = 14 in 10A + 12 in 10B)
const CATS=['Kegiatan','Kebersamaan','Pondok','Acara'],HH=[420,300,520,360,480,320,400,280,440],arr=(a,d)=>Array.isArray(a)?a:d;
const E={
m:arr(DATA.m,Array.from({length:26},(_,i)=>({n:'Anggota '+String(i+1).padStart(2,'0')}))).map((x,i)=>({n:x.n||'',r:x.r||'',p:x.p||'',k:x.k||(i<14?'10A':'10B'),ig:x.ig||'',li:x.li||'',gh:x.gh||'',pf:x.pf||'',mt:x.mt||''})),
piket:{},
g:arr(DATA.g,Array.from({length:9},()=>({}))).map((x,i)=>({c:x.c||CATS[i%4],t:x.t||'',p:x.p||''})),
a:arr(DATA.a,['Akademik','Non-akademik','Kompetisi','Kontribusi untuk pondok'].map(t=>({t,v:''}))),
q:arr(DATA.q,[['[Pesan dari anggota.]','Santri · [Nama]'],['[Pesan dari ustadz.]','Ustadz · [Nama]'],['[Pesan untuk generasi berikutnya.]','Alumni · [Nama]']].map(([q,w])=>({q,w}))),
s:Object.assign({t:33,k:18,l:15,n:8},DATA.s||{})};
['10A','10B'].forEach(k=>E.piket[k]=[0,1,2,3,4,5].map(i=>String(((DATA.piket||{})[k]||[])[i]||'')));
const PN=(k,i)=>{const a=(E.piket[k][i]||'').split(',').map(x=>x.trim()).filter(Boolean);return a.length?a:['[Petugas]']};
// reveal + counters + dots (dipindah ke sini — butuh E sudah dideklarasi)
const ST=E.s,dots=$('#dots');for(let i=0;i<ST.t+ST.n;i++)dots.insertAdjacentHTML('beforeend',`<i style="--k:${i}" class="${i<ST.k?'on':i>=ST.t?'nw':''}"></i>`);
$('#s1').textContent=ST.t;$('#s2').textContent=ST.k;$$('.st b').forEach((b,i)=>b.dataset.n=[ST.t,ST.k,ST.l,ST.n][i]);
$$('.st b').forEach(b=>b.dataset.d=0);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;t.classList.add('in');if(t.dataset.n){const n=+t.dataset.n,s=performance.now();(function f(now){const k=Math.min(1,(now-s)/1200);t.textContent=Math.round(n*k);if(k<1)requestAnimationFrame(f)})(s)}io.unobserve(t)}),{threshold:.25});
$$('.rv,#dots,.st b').forEach(e=>io.observe(e));
const M=E.m.map((x,i)=>({...x,n:x.n||'Anggota '+String(i+1).padStart(2,'0'),i:i+1}));
$('#hc').textContent=M.length;$('#f0').textContent='Semua · '+M.length;$('#f1').textContent='Kelas 10A · '+M.filter(m=>m.k=='10A').length;$('#f2').textContent='Kelas 10B · '+M.filter(m=>m.k=='10B').length;
let mf='';const gm=$('#gm');const rm=()=>{const q=$('#sq').value.toLowerCase();gm.innerHTML=M.filter(m=>(!mf||m.k==mf)&&m.n.toLowerCase().includes(q)).map(m=>`<button class="m" style="--d:${m.i%6}" data-i="${m.i}"><div class="ph">${m.p?`<img src="${m.p}" alt="" style="width:100%;height:100%;object-fit:cover">`:`<b>${String(m.i).padStart(2,'0')}</b>`}</div><h3>${esc(m.n)}</h3><p>Kelas ${m.k}${m.r?' · '+esc(m.r):''}</p></button>`).join('')||'<p class="mu">Tidak ada anggota yang cocok.</p>'};rm();
$('#sq').oninput=rm;$$('[data-f]').forEach(b=>b.onclick=()=>{mf=b.dataset.f;$$('[data-f]').forEach(x=>x.classList.toggle('on',x==b));rm()});
gm.onclick=e=>{const b=e.target.closest('.m');if(b){const m=M[b.dataset.i-1];openPm(m)}};
// piket
const D=['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],td=(new Date().getDay()+6)%7;let pk='10A';
const rp=()=>$('#dy').innerHTML=D.map((d,i)=>`<div class="dc${i==td?' td':''}"><h3>${d}</h3>${PN(pk,i).map(n=>`<label><input type="checkbox"> ${esc(n)}</label>`).join('')}</div>`).join('');rp();
$$('[data-k]').forEach(b=>b.onclick=()=>{pk=b.dataset.k;$$('[data-k]').forEach(x=>x.classList.toggle('on',x==b));rp()});
// gallery + lightbox
const G=E.g.map((x,i)=>({c:x.c,h:HH[i%9],i,t:x.t,p:x.p}));let gc='',gv=[],gi=0;
const rg=()=>{gv=G.filter(g=>!gc||g.c==gc);$('#gl').innerHTML=gv.map((g,j)=>`<button data-j="${j}"><div class="ph" style="${g.p?'':'height:'+g.h+'px'}">${g.p?`<img src="${g.p}" alt="" style="width:100%;height:auto;display:block">`:`<small>Foto ${String(g.i+1).padStart(2,'0')} — placeholder</small>`}</div><small class="k">${g.c}${g.t?' · '+esc(g.t):''}</small></button>`).join('')};rg();
$('#gf').innerHTML=['',...new Set([...CATS,...G.map(g=>g.c).filter(Boolean)])].map(c=>`<button class="c${c?'':' on'}" data-c="${c}">${c||'Semua'}</button>`).join('');
$('#gf').onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;gc=b.dataset.c;$$('[data-c]').forEach(x=>x.classList.toggle('on',x==b));rg()};
const lb=$('#lb');function openLb(t,c,n,p){$('#lbt').textContent=t;$('#lbt').style.display=p?'none':'';$('#lbp').style.background=p?`center/contain no-repeat url(${p})`:'';$('#lbc').textContent=c;lb.classList.add('o');lb.dataset.g=n==null?'':1}
const showG=()=>{const g=gv[gi];openLb(g.t||'Foto '+String(g.i+1).padStart(2,'0')+' — placeholder',`${g.c} · ${gi+1} / ${gv.length}`,1,g.p)};
$('#gl').onclick=e=>{const b=e.target.closest('[data-j]');if(b){gi=+b.dataset.j;showG()}};
const mv=d=>{if(lb.dataset.g){gi=(gi+d+gv.length)%gv.length;showG()}};$('#pv').onclick=()=>mv(-1);$('#nx').onclick=()=>mv(1);$('#cl').onclick=()=>lb.classList.remove('o');lb.onclick=e=>{if(e.target==lb)lb.classList.remove('o')};
addEventListener('keydown',e=>{if(!lb.classList.contains('o'))return;if(e.key=='Escape')lb.classList.remove('o');if(e.key=='ArrowLeft')mv(-1);if(e.key=='ArrowRight')mv(1)});
// profil anggota: klik kartu → modal foto besar + moto + tautan (portofolio ditonjolkan, lalu IG/LinkedIn/GitHub)
const pmEl=document.createElement('div');pmEl.id='pm';pmEl.className='pm';pmEl.innerHTML='<div class="pm-card"><button class="pm-x" aria-label="Tutup profil">×</button><div class="pm-ph"></div><div class="pm-info"><div class="pm-meta"></div><h3 class="pm-n"></h3><p class="pm-mt"></p><div class="pm-links"></div></div></div>';document.body.appendChild(pmEl);
const pml=(l,u,c)=>u?'<a class="pm-l '+(c||'')+'" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">'+l+'</a>':'';
function openPm(m){pmEl.querySelector('.pm-ph').innerHTML=m.p?'<img src="'+m.p+'" alt="">':'<b>'+String(m.i).padStart(2,'0')+'</b>';pmEl.querySelector('.pm-n').textContent=m.n;pmEl.querySelector('.pm-meta').textContent='Kelas '+m.k+(m.r?' · '+m.r:'');const mt=pmEl.querySelector('.pm-mt');if(m.mt){mt.textContent='"'+m.mt+'"';mt.hidden=false}else mt.hidden=true;pmEl.querySelector('.pm-links').innerHTML=pml('Portofolio',m.pf,'pm-pf')+pml('Instagram',m.ig)+pml('LinkedIn',m.li)+pml('GitHub',m.gh);pmEl.classList.add('o');document.body.style.overflow='hidden'}
pmEl.addEventListener('click',e=>{if(e.target==pmEl||e.target.closest('.pm-x')){pmEl.classList.remove('o');document.body.style.overflow=''}});
addEventListener('keydown',e=>{if(e.key=='Escape'&&pmEl.classList.contains('o')){pmEl.classList.remove('o');document.body.style.overflow=''}});
// ---- admin (hanya pemilik/editor; menerbitkan ulang halaman dengan data tertanam)
const ra=()=>{$('#acl').innerHTML=E.a.map(a=>`<div class="ac"><b>${esc(a.t)}</b><span>${esc(a.v||'[data belum tersedia]')}</span></div>`).join('');$('#qsl').innerHTML=E.q.map(q=>`<div class="q"><p>“${esc(q.q)}”</p><small>${esc(q.w)}</small></div>`).join('')};ra();
// WIB clock
setInterval(()=>$('#clk').textContent=new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Jakarta',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date()).replace(/:/g,'.'),1000);
return {E,G,D,M,ra,CATS};})();
