/* ===== FALLBACK: kalau CDN animasi (GSAP/Lenis/confetti) gagal dimuat, situs tetap tampil tanpa animasi ===== */
(() => {
  const libs = ['gsap', 'ScrollTrigger', 'SplitText', 'Flip', 'Draggable', 'InertiaPlugin', 'Observer', 'confetti'];
  if (libs.every(k => window[k]) && window.Lenis) return;
  console.warn('Library animasi gagal dimuat (cek internet). Situs berjalan tanpa animasi.');
  const chain = new Proxy(function () { }, { get: (t, k) => k === Symbol.toPrimitive ? () => 0 : k === 'then' ? undefined : chain, apply: () => chain, construct: () => chain });
  libs.forEach(k => window[k] = chain);
  window.Lenis = class { on() { } raf() { } scrollTo(h) { document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' }); } };
  document.getElementById('pre')?.remove();
  document.querySelectorAll('[data-n]').forEach(e => e.textContent = e.dataset.n);
})();

/* ===== DATA ===== nama|kelas|status|asal  (nomor = urutan baris) */
const M = `Abdurrahman Afif|10A|aktif|SMP-A
Arqam Wadud Affandi|10B|aktif|SMP-A
Azka Nibras Farras Harjono|-|keluar|SMP-A
Azzam Al Ghifary|10A|aktif|SMP-A
Faiz Abdurrahman|-|keluar|SMP-A
Fatih Safa Lukman|-|keluar|SMP-A
Geniova Zaidan Ash-Shiddiq|-|keluar|SMP-A
Ghaisan Raqilla Manan|10A|aktif|SMP-A
Haidar Mahya Sabillilah|10A|aktif|SMP-A
Hilmi Romzi Nagib|10A|aktif|SMP-A
Hiraki Prayata Annangadipa|10A|aktif|SMP-A
Ibrahim Omar|10A|aktif|SMP-A
Keanu Abizar Al-Ghifari|-|keluar|SMP-A
Muhammad Akmal Arinzki|-|keluar|SMP-A
Muhammad Bahtiar Almer Tajusa|10B|aktif|SMP-A
Muhammad Rhafif Ash-Shiddiq|10A|aktif|SMP-A
Vittorio Veneto Setiantara|10A|aktif|SMP-A
Abdurrahman Sholeh|-|keluar|SMP-B
Akhdan Al Faruq|-|keluar|SMP-B
Banu Rafif Shaky|-|keluar|SMP-B
Cholid|-|keluar|SMP-B
Fajri Ahmad|10B|aktif|SMP-B
Farras Arkan Abdurrahman|-|keluar|SMP-B
Muhammad bin Donald|10B|aktif|SMP-B
Muhammad Fakhril Fakih|10A|aktif|SMP-B
Muhammad Miqdam Izyan|-|keluar|SMP-B
Nabigh Habibie Ghany|10A|aktif|SMP-B
Reiki Fereti Hamid|-|keluar|SMP-B
Restu Putra Surya Dinata|-|keluar|SMP-B
Reza Khoirul Azzam|10A|aktif|SMP-B
Satria Rupawan|10A|aktif|SMP-B
Syalendra Ebrahim Kamil|10A|aktif|SMP-B
Thoriq Ibaddurahman|-|keluar|SMP-B
Ahmad Alfathussholih|10B|baru|SMA
Akmal Luqman Syamlan|10B|baru|SMA
Fatih Akbar Dhiya Ul-Haq|10B|baru|SMA
Muhammad Fadhli|10B|baru|SMA
Muhammad Faqih Alzawawi|10B|baru|SMA
Muhammad Qaishar Resendrya|10B|baru|SMA
Rafi Ardhani|10B|baru|SMA
Yusuf Putra Rinadi|10B|baru|SMA`.split('\n').map((l, i) => { const [name, kelas, status, origin] = l.split('|'); return { no: i + 1, name, kelas, status, origin }; });

// PORTOFOLIO 10A. Format: [no anggota, peran, moto, URL portofolio]
// URL kosong ('') = tombol "Segera hadir". Isi URL asli lalu simpan, selesai.
// TODO: ganti moto dummy dengan moto asli masing-masing.
const PF = [
  [1, 'Web Developer', 'jangan hidup di dalam zona nyaman karena manusia butuh pengalaman', 'https://afifaja.vercel.app/'],
  [4, 'UI Designer', 'Fokus pada tujuan sendiri, bukan kesibukan orang lain.', 'https://portofolio-azam.vercel.app/'],
  [8, 'Front-End Dev', 'Sedikit demi sedikit, jadi aplikasi.', 'https://raqilla.vercel.app/'],
  [9, 'Motion Designer', 'Dream big', ''],
  [10, 'Backend Enthusiast', 'Apa yang ditabur dengan sabar, akan dituai pada waktu yang tepat.', 'https://portofolio-hilmi-v2.vercel.app/'],
  [11, 'Illustrator', 'To be a star, you must burn.', 'https://hirakoyy.github.io/Portfolio/'],
  [12, 'Game Dev', 'You never FAIL until You Stop Trying.', 'https://omarinspace.github.io/IbrahimOmar-Portfolio-V2/'],
  [16, 'Full-Stack Dev', 'Keep learning, keep growing.', 'https://murhfif.github.io/Portofolio/'],
  [17, 'Photo & Video', 'hanya meraka yang berani gagal, yang meraih banyak hal', 'https://veneto-portfolio.vercel.app/'],
  [25, 'Data Enthusiast', 'Upgrade your life in silence.', 'https://fakeeh.vercel.app/'],
  [27, 'Content Creator',    'Bercerita dengan sepenuh hati.',          'https://nabigh-portofolio.vercel.app/'],
  [30, 'Cyber Security',     'Aman itu kebiasaan.',                     'https://rejaajha.github.io/New-Portfolio/'],
  [31, 'AI & ML',            'Belajar dari setiap kesalahan.',          'https://my-portfolio-zeta-blush-13.vercel.app/'],
  [32, '3D & WebGL', 'BELIEVE IN YOUR DREAM', 'https://syaelndr-portfolio-rhrj.vercel.app/'],
];
const URLS = {}, MOTO = {}; PF.forEach(([no, , moto, url]) => { URLS[no] = url; MOTO[no] = moto; });
const TASKS = ['Menyapu lantai', 'Mengepel', 'Membersihkan papan tulis', 'Merapikan meja', 'Membuang sampah'];
const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const act = M.filter(m => m.kelas === '10A' && m.status === 'aktif');
const JADWAL = DAYS.map((d, i) => ({ d, p: [act[i * 2].name, act[i * 2 + 1].name] })); // TODO: ganti data asli
const CATS = ['Kegiatan', 'Kebersamaan', 'Behind the scene'];

/* ===== HELPER ===== */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, Draggable, InertiaPlugin, Observer);
if (reduce) gsap.globalTimeline.timeScale(100); // animasi jadi instan, konten langsung terlihat
const live = no => URLS[no] && URLS[no] !== '#';
// Foto anggota: taruh di folder foto/ dengan nama nomor anggota (1.jpg, 2.jpg, ...). Kalau belum ada, tampil inisial.
const EXT = ['jpg', 'jpeg', 'png', 'webp'];
const MEMBER_PHOTOS = {
  1: 'afif', 4: 'azam', 8: 'ghaisan', 9: 'haidar', 10: 'hilmi',
  11: 'hiraki', 12: 'omar', 16: 'rhafif', 17: 'vitto', 25: 'fakih',
  27: 'nabigh', 30: 'reza', 31: 'satria', 32: 'kamil'
};
const memberPhotoSrc = m => MEMBER_PHOTOS[m.no] ? `foto/${MEMBER_PHOTOS[m.no]}.webp` : (FOTO?.[m.no] || `foto/${m.no}.jpg`);
const ph = n => { const d = document.createElement('div'); d.className = 'coming-soon-card flex h-full w-full flex-col items-center justify-center gap-2'; d.innerHTML = '<span class="coming-soon-title font-display text-3xl">Coming Soon</span><span class="coming-soon-label font-mono text-[10px] tracking-[.25em]">FOTO BELUM ADA</span>'; return d; };
window.fb = img => { const k = +(img.dataset.k || 0) + 1; if (k < EXT.length) { img.dataset.k = k; img.src = `foto/${img.dataset.no}.${EXT[k]}`; } else img.replaceWith(ph(img.dataset.name)); };
const photo = (m, c = '') => `<div class="${c} overflow-hidden bg-sage-light"><img src="${memberPhotoSrc(m)}" data-no="${m.no}" data-name="${m.name}" alt="Foto ${m.name}, siswa ${m.kelas}" loading="lazy" onerror="fb(this)" class="h-full w-full object-cover"></div>`;
const pfBtn = no => live(no) ? `<a href="${URLS[no]}" target="_blank" rel="noopener noreferrer" aria-label="Buka portofolio ${M[no - 1].name} di tab baru" class="pf-card-link pb mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-all duration-300">Lihat Portofolio <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 9l6-6M4 3h5v5"/></svg></a>`
  : '<span class="pf-card-soon mt-4 inline-flex cursor-not-allowed rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider" aria-disabled="true">Segera hadir</span>';
const pill = (el, items, on) => {
  el.innerHTML = items.map((t, i) => `<button data-v="${t}" aria-pressed="${!i}"></button>`).join('');
  const paint = () => $$('button', el).forEach(b => { b.className = 'rounded-full px-4 py-2 transition ' + (b.getAttribute('aria-pressed') === 'true' ? 'bg-ink text-canvas' : 'text-ink-soft hover:bg-surface-2'); });
  $$('button', el).forEach(b => b.textContent = b.dataset.v); paint();
  el.onclick = e => { const b = e.target.closest('button'); if (!b) return; $$('button', el).forEach(x => x.setAttribute('aria-pressed', x === b)); paint(); on(b.dataset.v); };
};
const mag = (el, s = 6) => { const x = gsap.quickTo(el, 'x', { duration: .4, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: .4, ease: 'power3' }), c = gsap.utils.clamp(-s, s);
  el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(); x(c((e.clientX - r.left - r.width / 2) * .3)); y(c((e.clientY - r.top - r.height / 2) * .3)); });
  el.addEventListener('mouseleave', () => { x(0); y(0); }); };
const dlg = $('#dlg'); $('#dx').onclick = () => dlg.close(); dlg.onclick = e => { if (e.target === dlg) dlg.close(); };
const openProfile = m => { $('#db').innerHTML = `${photo(m, 'mb-5 aspect-[4/5] rounded-3xl')}<p class="font-mono text-xs text-clay">No. ${String(m.no).padStart(2, '0')}</p><p class="mt-2 font-display text-5xl leading-none">${m.name}</p>
  <p class="mt-3 text-ink-soft">Kelas ${m.kelas} · Asal ${m.origin}</p>${MOTO[m.no] ? `<p class="mt-4 font-display text-2xl italic text-sage-deep">“${MOTO[m.no]}”</p>` : ''}${PF.some(p => p[0] === m.no) ? pfBtn(m.no) : ''}`;
  dlg.showModal(); gsap.from(dlg, { y: 24, opacity: 0, duration: .4, ease: 'power3.out' }); $$('.pb', dlg).forEach(b => mag(b)); };

/* ===== LENIS + SCROLL ===== */
let lenis;
if (!reduce) { lenis = new Lenis({ duration: 1.1 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
const go = h => lenis ? lenis.scrollTo(h) : $(h).scrollIntoView({ behavior: 'smooth' });
document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href') === '#') return; e.preventDefault(); $('#mnav').classList.replace('flex', 'hidden'); go(a.getAttribute('href')); });
gsap.to('#prog', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true } });

/* ===== PRELOADER ===== */
const o = { v: 0 };
const LOADER_PHOTOS = [
  'kenangan/foto hero section.webp',
  'kenangan/kebersamaan 1.jpg',
  'kenangan/kegiatan 1.jpg',
  'kenangan/Behind the scene 1.jpg',
  'kenangan/kebersamaan 2.jpg'
];
$('#ldPhotos').innerHTML = LOADER_PHOTOS.map((src, i) => `<img class="ld-photo" data-load="${i}" src="${src}" alt="" loading="eager">`).join('');
gsap.timeline({ onComplete: hero })
  .set('.ld-photo[data-load="0"]', { opacity: 1, scale: 1.06 })
  .to(o, { v: 100, duration: 1.25, ease: 'power2.inOut' })
  .to('#pb', { scaleX: 1, duration: 1.25, ease: 'power2.inOut' }, 0)
  .to('.ld-photo[data-load="0"]', { scale: 1, duration: 1.25, ease: 'power2.out' }, 0)
  .to('.ld-photo[data-load="1"]', { opacity: 1, scale: 1.04, duration: .32 }, .18)
  .to('.ld-photo[data-load="1"]', { opacity: 0, duration: .18 }, .46)
  .to('.ld-photo[data-load="2"]', { opacity: 1, scale: 1.04, duration: .32 }, .48)
  .to('.ld-photo[data-load="2"]', { opacity: 0, duration: .18 }, .76)
  .to('.ld-photo[data-load="3"]', { opacity: 1, scale: 1.04, duration: .32 }, .78)
  .to('.ld-photo[data-load="3"]', { opacity: 0, duration: .18 }, 1.02)
  .to('.ld-photo[data-load="4"]', { opacity: 1, scale: 1.04, duration: .32 }, 1.04)
  .to('.ld-brand', { y: 24, opacity: 0, duration: .24 }, 1.12)
  .to('#pre', { opacity: 0, duration: .28, ease: 'power2.in' })
  .set('#pre', { display: 'none' });

/* ===== HERO: collage foto bareng-bareng =====
   HERO_MEMORY memakai foto dari folder kenangan/. */
const HERO_MEMORY = [
  ['kenangan/kebersamaan 1.jpg', 'KENANGAN', '-rotate-6 -mt-3'],
  ['kenangan/kegiatan 1.jpg', 'KEBERSAMAAN', 'rotate-3 mt-3'],
  ['kenangan/foto hero section.webp', 'INVICTUS GEN 3', '-rotate-2 -mt-5'],
  ['kenangan/Behind the scene 1.jpg', 'BERSAMA', 'rotate-5 mt-2'],
  ['kenangan/kebersamaan 2.jpg', 'CERITA KITA', '-rotate-4 -mt-2']
];
$('#hf').innerHTML = HERO_MEMORY.map(([src, label, tilt], i) => `
  <figure class="hf group relative shrink-0 cursor-grab touch-none select-none rounded-[1.25rem] border-4 border-canvas bg-surface shadow-lift ${tilt} ${i === 2 ? 'z-20 w-28 sm:w-44 md:w-52' : 'z-10 w-16 sm:w-24 md:w-36'}" style="aspect-ratio:4/5">
    <img src="${src}" alt="${label}" loading="lazy" draggable="false" class="pointer-events-none h-full w-full rounded-[.75rem] object-cover">
    <figcaption class="absolute inset-x-2 bottom-2 rounded-full bg-canvas/90 px-2 py-1 text-center font-mono text-[9px] tracking-wider opacity-0 backdrop-blur transition group-hover:opacity-100">${label}</figcaption>
  </figure>`).join('');
gsap.set('.hf', { transformOrigin: '50% 70%' });
function heroPhotos() {
  gsap.from('.hf', { y: 100, opacity: 0, rotation: 0, duration: 1.2, ease: 'power4.out', stagger: .1, delay: .35 });
  Draggable.create('.hf', { type: 'x,y', inertia: true, onPress() { gsap.set(this.target, { zIndex: 20 }); }, onRelease() { gsap.to(this.target, { x: 0, y: 0, duration: 1.6, ease: 'elastic.out(1,.4)', overwrite: true, onComplete: () => gsap.set(this.target, { zIndex: 'auto' }) }); } });
}

/* ===== HERO ===== */
function hero() {
  heroPhotos();
  const s = SplitText.create('#judul', { type: 'words,chars', charsClass: 'ch' });
  gsap.from(s.chars, { yPercent: 110, opacity: 0, duration: 1.1, ease: 'power4.out', stagger: .03 });
  Draggable.create(s.chars, { type: 'x,y', inertia: true, onRelease() { gsap.to(this.target, { x: 0, y: 0, duration: 1.6, ease: 'elastic.out(1,.4)', overwrite: true }); } });
  if (!reduce) gsap.to('#judul', { y: -80, ease: 'none', scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true } });
}
if (!reduce) {
  const bx = gsap.quickTo('#blob', 'x', { duration: 1.2, ease: 'power3' }), by = gsap.quickTo('#blob', 'y', { duration: 1.2, ease: 'power3' });
  addEventListener('pointermove', e => { bx(e.clientX - 160); by(e.clientY - 160); });
  gsap.to('#blob', { backgroundColor: 'rgba(142,166,184,.3)', duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  const t = 'FROM SMP TO SMA ✦ 41 NAMES ✦ 8 NEW SOULS ✦ 14 PORTFOLIOS ✦ TWO CLASSES ✦ ONE STORY ✦ ';
  $('#mq').innerHTML = `<span>${t.repeat(3)}</span><span>${t.repeat(3)}</span>`;
  gsap.to('#mq', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
}

/* ===== STATS ===== */
$$('[data-n]').forEach(el => { const v = { n: 0 }; gsap.to(v, { n: +el.dataset.n, duration: 1.6, ease: 'power3.out', snap: { n: 1 }, onUpdate: () => el.textContent = v.n, scrollTrigger: { trigger: el, start: 'top 85%', once: true } }); });
gsap.fromTo(SplitText.create('#narasi', { type: 'words' }).words, { opacity: .1, y: 14 }, { opacity: 1, y: 0, stagger: .03, ease: 'power2.out', immediateRender: false, scrollTrigger: { trigger: '#narasi', start: 'top 85%', once: true } });

/* ===== ANGGOTA ===== */
let F = 'Semua', Q = '';
const pass = m => (F === 'Keluar' ? m.status === 'keluar' : m.status !== 'keluar') && (F === 'Baru' ? m.status === 'baru' : /^10/.test(F) ? m.kelas === F : true) && m.name.toLowerCase().includes(Q);
const card = m => m.status === 'keluar'
  ? `<li data-flip-id="m${m.no}" class="member-card p-5 opacity-35 grayscale"><p class="member-card-meta font-mono text-[10px] tracking-widest">NO. ${String(m.no).padStart(2,'0')}</p><p class="mt-8 font-display text-2xl leading-tight text-[#F2F0EA]">${m.name}</p><p class="mt-3 font-mono text-[10px] text-[#aaa69d]">SUDAH BERPINDAH</p></li>`
  : `<li data-flip-id="m${m.no}"><button data-no="${m.no}" class="member-card relative block w-full text-left shadow-soft transition hover:-translate-y-1 hover:shadow-lift">${photo(m, 'member-card-photo w-full overflow-hidden')}
  ${m.status === 'baru' ? '<span class="absolute right-4 top-4 rounded-full border border-[#AFA4FF]/30 bg-[#111113]/90 px-2.5 py-1 font-mono text-[9px] text-[#AFA4FF] backdrop-blur">BARU</span>' : ''}
  <span class="member-card-body block"><span class="member-card-meta block font-mono text-[10px] tracking-widest">NO. ${String(m.no).padStart(2,'0')} · KELAS ${m.kelas}</span><span class="member-card-name mt-2 block font-display">${m.name}</span>${MOTO[m.no] ? `<span class="member-card-motto mt-2 block line-clamp-2 text-sm leading-snug italic">“${MOTO[m.no]}”</span>` : ''}</span></button></li>`;
const renderM = anim => { const st = Flip.getState('#mg li'); $('#mg').innerHTML = M.filter(pass).map(card).join('') || '<li class="text-muted">Tidak ada nama yang cocok.</li>';
  if (anim) Flip.from(st, { duration: .6, ease: 'power3.inOut', stagger: .02, absolute: true, onEnter: e => gsap.from(e, { opacity: 0, scale: .92, duration: .4 }) }); };
pill($('#mf'), ['Semua', '10A', '10B', 'Baru', 'Keluar'], v => { F = v; renderM(true); });
$('#q').oninput = e => { Q = e.target.value.trim().toLowerCase(); renderM(true); };
$('#mg').onclick = e => { const b = e.target.closest('button'); if (b) openProfile(M[b.dataset.no - 1]); };
renderM(false);
$('#left').innerHTML = M.filter(m => m.status === 'keluar').map(m => `<li class="rounded-full bg-surface px-4 py-2 text-sm text-redup">${m.name}</li>`).join('');

/* ===== PORTFOLIO HUB 10A ===== */
$('#pg').innerHTML = PF.map(([no, role, moto], i) => { const m = M[no - 1];
  return `<article class="pf member-card group shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
  <div class="aspect-[3/4] overflow-hidden [&_img]:transition-all [&_img]:duration-700 [&_img]:grayscale-[30%] group-hover:[&_img]:scale-105 group-hover:[&_img]:grayscale-0">${photo(m, 'h-full w-full')}</div>
  <div class="pf-card-head min-h-[13.5rem] p-5"><p class="member-card-meta font-mono text-[10px] tracking-widest">NO. ${String(i + 1).padStart(2, '0')}</p><h3 class="pf-card-name mt-2 font-display text-xl leading-tight">${m.name}</h3><p class="pf-card-role mt-1 font-mono text-[10px]">${role.toUpperCase()}</p>
  <p class="pf-card-motto mt-3 font-display text-base italic leading-snug">“${moto}”</p><div class="mt-4">${pfBtn(no)}</div></div></article>`; }).join('');
gsap.fromTo('.pf', { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .9, ease: 'power3.out', immediateRender: false, scrollTrigger: { trigger: '#pg', start: 'top 90%', once: true } });
$$('.pb').forEach(b => { mag(b); b.addEventListener('click', () => gsap.fromTo(b, { scale: .95 }, { scale: 1, duration: .2 })); });

/* ===== PERJALANAN: section scroll horizontal (pin + scrub) ===== */
const mm = gsap.matchMedia();
mm.add('(min-width:768px) and (prefers-reduced-motion:no-preference)', () => {
  const wrap = $('#jwrap'), tr = $('#track'); wrap.classList.add('hz');
  const dist = () => tr.scrollWidth - innerWidth;
  const tw = gsap.to(tr, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#jalan', pin: true, scrub: 1, refreshPriority: 1, end: () => '+=' + dist(), invalidateOnRefresh: true } });
  gsap.to('#jbar', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '#jalan', start: 'top top', end: () => '+=' + dist(), scrub: true } });
  $$('.pn').forEach(p => { gsap.from($('.big', p), { yPercent: 35, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left 85%', toggleActions: 'play none none reverse' } }); });
  return () => wrap.classList.remove('hz');
});
mm.add('(max-width:767px), (prefers-reduced-motion:reduce)', () => { gsap.fromTo('.pn', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: .1, immediateRender: false, scrollTrigger: { trigger: '#track', start: 'top 85%', once: true } }); });

/* ===== PIKET ===== */
const iso = new Date().toLocaleDateString('sv-SE'), KEY = 'piket-progress-' + iso, dw = new Date().getDay(), today = dw === 0 ? -1 : dw - 1;
let S = {}; try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { }
$('#pk').innerHTML = JADWAL.map((j, d) => `<div class="rounded-3xl border p-6 ${d === today ? 'border-sage bg-sage-light/30' : 'border-surface-2 bg-surface'}">
  <div class="flex items-center justify-between"><h3 class="font-display text-3xl">${j.d}</h3>${d === today ? '<span class="animate-pulse rounded-full bg-sage px-3 py-1 font-mono text-xs text-canvas">Hari ini</span>' : ''}</div>
  <div class="my-3 h-1 rounded bg-surface-2"><div class="db h-1 origin-left scale-x-0 rounded bg-sage" data-d="${d}"></div></div>
  ${j.p.map((n, p) => `<div class="mt-4"><div class="flex justify-between text-sm"><span>${n}</span><span class="pc font-mono text-xs text-muted" data-p="${d}-${p}">0/5 selesai</span></div>
  <ul class="mt-2 space-y-1">${TASKS.map((t, k) => `<li><button role="checkbox" aria-checked="false" data-id="${d}-${p}-${k}" class="ck-b flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left text-sm"><span class="flex h-5 w-5 items-center justify-center rounded border border-sage"><svg class="ck h-3.5 w-3.5 text-sage-deep" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 8.5l3.2 3L13 4.5"/></svg></span><span>${t}</span></button></li>`).join('')}</ul></div>`).join('')}</div>`).join('');
const sync = () => { $$('.ck-b').forEach(b => { const on = !!S[b.dataset.id]; b.setAttribute('aria-checked', on); b.classList.toggle('line-through', on); b.classList.toggle('text-muted', on); });
  for (let d = 0; d < 6; d++) { let tot = 0; for (let p = 0; p < 2; p++) { let c = 0; for (let k = 0; k < 5; k++) c += S[`${d}-${p}-${k}`] ? 1 : 0; tot += c; $(`[data-p="${d}-${p}"]`).textContent = `${c}/5 selesai`; }
    gsap.to($(`.db[data-d="${d}"]`), { scaleX: tot / 10, duration: .5 }); } };
const done = () => today >= 0 && Array.from({ length: 10 }, (_, i) => S[`${today}-${i / 5 | 0}-${i % 5}`]).every(Boolean);
const boom = () => confetti({ particleCount: 120, spread: 80, origin: { y: .7 }, colors: ['#A3B18A', '#8EA6B8', '#C4A99A'] });
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
$('#pk').onclick = e => { const b = e.target.closest('.ck-b'); if (!b) return; const id = b.dataset.id, on = !S[id]; S[id] = on; save();
  b.setAttribute('aria-checked', on); gsap.fromTo($('path', b), { strokeDashoffset: on ? 24 : 0 }, { strokeDashoffset: on ? 0 : 24, duration: .4 }); sync(); if (on && done()) boom(); };
$('#allDone').onclick = () => { const d = today < 0 ? 0 : today; for (let p = 0; p < 2; p++) for (let k = 0; k < 5; k++) S[`${d}-${p}-${k}`] = true; save(); sync(); boom(); };
sync();
gsap.fromTo('#pk > div', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .8, ease: 'power3.out', immediateRender: false, scrollTrigger: { trigger: '#pk', start: 'top 90%', once: true } });

/* ===== GALERI + LIGHTBOX: otomatis membaca folder kenangan/ =====
   Upload foto bernama 1.jpg, 2.jpg, 3.jpg, ... (jpg/jpeg/png/webp) ke folder kenangan/. Selesai.
   Opsional: kenangan/info.json -> {"1":{"cat":"Kegiatan","t":"Study tour"}} untuk kategori & keterangan. */
let G = [], GF = 'Semua', cur = 0, list = [];
const probe = base => new Promise(res => { let i = 0; const t = () => { if (i >= EXT.length) return res(null); const im = new Image(), u = `${base}.${EXT[i++]}`; im.onload = () => res(u); im.onerror = t; im.src = u; }; t(); });
const demoSvg = (i, h) => { const c = [['#C8D3BC', '#A3B18A'], ['#E7D9D1', '#C4A99A'], ['#C9D6E0', '#8EA6B8']][i % 3]; return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='${h}' viewBox='0 0 600 ${h}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c[0]}'/><stop offset='1' stop-color='${c[1]}'/></linearGradient></defs><rect width='600' height='${h}' fill='url(#g)'/><text x='300' y='${h / 2 + 24}' font-family='serif' font-size='72' text-anchor='middle' fill='#F7F5F0' fill-opacity='.85'>G03</text></svg>`); };
async function loadG() {
  let info = {}; try { info = await (await fetch('kenangan/info.json')).json(); } catch (e) { }
  const found = [];
  for (let s = 1; s <= 240; s += 12) { const r = await Promise.all(Array.from({ length: 12 }, (_, i) => probe(`kenangan/${s + i}`).then(u => u && { n: s + i, src: u })));
    found.push(...r.filter(Boolean)); if (!r.some(Boolean)) break; }
  if (found.length) G = found.map(f => ({ src: f.src, cat: info[f.n]?.cat || 'Kenangan', t: info[f.n]?.t || `Kenangan ${f.n}` }));
  else { G = Array.from({ length: 10 }, (_, i) => { const h = [600, 800, 500, 700][i % 4]; return { demo: 1, cat: CATS[i % 3], t: `${CATS[i % 3]} ${Math.floor(i / 3) + 1}`, src: demoSvg(i, h) }; });
    $('#gnote').textContent = 'Ini foto contoh. Taruh fotomu di folder kenangan/ (1.jpg, 2.jpg, ...) dan halaman ini otomatis memakainya.'; }
  const cats = [...new Set(G.map(g => g.cat))];
  if (cats.length > 1) pill($('#gf'), ['Semua', ...cats], v => { GF = v; renderG(true); }); else $('#gf').remove();
  renderG(false); ScrollTrigger.refresh();
}
const renderG = anim => { const st = Flip.getState('#gg li'); list = G.filter(g => GF === 'Semua' || g.cat === GF);
  $('#gg').innerHTML = list.map(g => `<li data-flip-id="g${G.indexOf(g)}" class="gallery-card break-inside-avoid"><button data-i="${list.indexOf(g)}" class="group relative block w-full overflow-hidden" aria-label="Buka foto ${g.t}"><img src="${g.src}" alt="${g.t}" loading="lazy" class="transition duration-700 group-hover:scale-105">
  <span class="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-60 transition group-hover:opacity-90"></span><span class="gallery-card-label"><span class="gallery-card-cat">${g.cat}</span><span class="gallery-card-title">${g.t}</span></span></button></li>`).join('');
  if (anim) Flip.from(st, { duration: .6, ease: 'power3.inOut', absolute: true, onEnter: e => gsap.from(e, { opacity: 0, duration: .4 }) }); };
const lb = $('#lb'), show = i => { cur = (i + list.length) % list.length; const g = list[cur]; $('#li').src = g.src; $('#li').alt = g.t; $('#lc').textContent = `${g.t} · ${cur + 1}/${list.length}`; };
$('#gg').onclick = e => { const b = e.target.closest('button'); if (!b) return; show(+b.dataset.i); lb.showModal(); gsap.from('#li', { scale: .92, opacity: 0, duration: .5, ease: 'power3.out' }); };
$('#lx').onclick = () => lb.close(); $('#lp').onclick = () => show(cur - 1); $('#ln').onclick = () => show(cur + 1);
lb.onclick = e => { if (e.target === lb) lb.close(); };
addEventListener('keydown', e => { if (!lb.open) return; if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
loadG();

/* ===== COMMAND PALETTE (Ctrl/Cmd + K) ===== */
const cmd = $('#cmd'), ci = $('#ci'), cr = $('#cr');
const ITEMS = [...['Anggota', 'Portofolio', 'Piket', 'Galeri', 'Kontak'].map(t => ({ t: 'Ke ' + t, go: () => go('#' + t.toLowerCase()) })),
  ...PF.map(([no]) => ({ t: 'Buka portofolio ' + M[no - 1].name, go: () => live(no) ? open(URLS[no], '_blank', 'noopener') : go('#portofolio') })),
  ...M.filter(m => m.status !== 'keluar').map(m => ({ t: 'Anggota: ' + m.name, go: () => openProfile(m) }))];
let hits = [];
const find = () => { const q = ci.value.toLowerCase(); hits = ITEMS.filter(i => i.t.toLowerCase().includes(q)).slice(0, 8);
  cr.innerHTML = hits.map((h, i) => `<li><button data-i="${i}" class="w-full rounded-xl px-4 py-2 text-left hover:bg-surface">${h.t}</button></li>`).join('') || '<li class="px-4 py-2 text-muted">Tidak ada hasil.</li>'; };
const run = i => { const h = hits[i]; if (!h) return; cmd.close(); h.go(); };
const openCmd = () => { ci.value = ''; find(); cmd.showModal(); ci.focus(); };
addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmd.open ? cmd.close() : openCmd(); } });
$('#kbtn').onclick = openCmd; ci.oninput = find; ci.onkeydown = e => { if (e.key === 'Enter') run(0); };
cr.onclick = e => { const b = e.target.closest('button'); if (b) run(+b.dataset.i); };
cmd.onclick = e => { if (e.target === cmd) cmd.close(); };

/* ===== NAVBAR, MENU, FOOTER ===== */
const nav = $('#nav');
const updateNav = () => nav.classList.toggle('is-scrolled', scrollY > 120);
updateNav();
addEventListener('scroll', updateNav, { passive: true });
$('#burger').onclick = e => { const m = $('#mnav'), open = m.classList.contains('hidden'); m.classList.toggle('hidden', !open); m.classList.toggle('flex', open); e.target.setAttribute('aria-expanded', open); e.target.textContent = open ? 'Tutup' : 'Menu';
  if (open) gsap.from('#mnav a', { y: 40, opacity: 0, stagger: .07, duration: .6, ease: 'power3.out' }); };
mag($('#top-btn'), 12); $('#top-btn').onclick = () => go('#top');

addEventListener('load', () => ScrollTrigger.refresh()); // hitung ulang posisi setelah semua gambar & font selesai

const cursor = $('#invictus-cursor');
if (cursor && matchMedia('(pointer:fine)').matches) {
  addEventListener('pointermove', e => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: .18, overwrite: true });
  });
  document.querySelectorAll('a,button,[role="button"],.hf').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}
