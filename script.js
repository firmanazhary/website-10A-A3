/* Cadangan: kalau GSAP gagal dimuat (offline / CDN diblokir), website tetap berfungsi tanpa animasi GSAP */
if (!window.gsap) {
  const isDom = t => typeof t === 'string' || t instanceof Element || t instanceof NodeList || Array.isArray(t);
  const run = (t, v) => { if (t && !isDom(t)) Object.keys(v).forEach(k => { if (typeof v[k] === 'number') t[k] = v[k]; }); v.onUpdate && v.onUpdate(); setTimeout(() => v.onComplete && v.onComplete(), 0); };
  const tl = { from() { return tl; }, to() { return tl; } };
  window.gsap = { registerPlugin() {}, to: (t, v) => run(t, v), from() {}, fromTo(t, a, b) { run(null, b); }, timeline: () => tl };
}
'use strict';
/* ===== INVICTUS — Tahap 1: struktur, homepage, animasi dasar ===== */
const CONFIG = { prefersReduced: matchMedia('(prefers-reduced-motion: reduce)').matches };
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* Preloader 0–100% */
function initPreloader() {
  const num = $('#preNum'), bar = $('#preBar'), pre = $('#preloader');
  document.body.classList.add('loading');
  const state = { v: 0 };
  const done = () => {
    gsap.to(pre, { opacity: 0, duration: .8, onComplete: () => { pre.remove(); document.body.classList.remove('loading'); } });
    heroIntro();
  };
  gsap.to(state, {
    v: 100, duration: CONFIG.prefersReduced ? .3 : 2.2, ease: 'power2.inOut',
    onUpdate: () => { const n = Math.round(state.v); num.textContent = n; bar.style.width = n + '%'; },
    onComplete: done
  });
}

/* Hero: letter-by-letter */
function splitTitle() {
  const t = $('#heroTitle'); const text = t.textContent.trim();
  t.textContent = '';
  [...text].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.setAttribute('aria-hidden', 'true'); s.textContent = c; t.appendChild(s); });
}
function heroIntro() {
  if (CONFIG.prefersReduced) return;
  const tl = gsap.timeline();
  tl.from('.hero-logo', { opacity: 0, scale: .8, filter: 'blur(14px)', duration: 1.1, ease: 'power3.out' })
    .from('.ch', { yPercent: 120, opacity: 0, rotateX: -80, filter: 'blur(12px)', stagger: .09, duration: 1, ease: 'power4.out' }, '-=.6')
    .from('.tagline', { opacity: 0, letterSpacing: '.7em', duration: 1.2, ease: 'power3.out' }, '-=.4')
    .from(['.hero-info', '.btn'], { opacity: 0, y: 20, stagger: .15, duration: .8 }, '-=.6');
}

/* Navbar */
function initNav() {
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu'), ind = $('#navInd');
  const links = $$('a', menu);
  addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 40), { passive: true });
  const setOpen = o => { menu.classList.toggle('open', o); burger.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); document.body.style.overflow = o ? 'hidden' : ''; };
  burger.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  links.forEach(a => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  const moveInd = a => { ind.style.width = a.offsetWidth + 'px'; ind.style.transform = `translateX(${a.offsetLeft}px)`; };
  const setActive = id => {
    links.forEach(a => { const on = a.getAttribute('href') === '#' + id; a.classList.toggle('active', on); if (on) moveInd(a); });
  };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section[id]').forEach(s => io.observe(s));
  addEventListener('resize', () => { const a = $('a.active', menu); if (a) moveInd(a); });
  setActive('home');
}

/* Mouse spotlight + parallax + magnetic button */
function initHeroFx() {
  const hero = $('#home'), sp = $('#spotlight');
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    sp.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    sp.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
  if (CONFIG.prefersReduced) return;
  if (!window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.to('#heroBg', { yPercent: 15, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-inner', { yPercent: -12, opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'center top', end: 'bottom top', scrub: true } });
  if (matchMedia('(hover:hover)').matches) {
    $$('.magnetic').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .3 }); });
      b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' }));
    });
  }
}

/* Floating white particles (canvas) */
function initParticles() {
  const c = $('#particles'), ctx = c.getContext('2d');
  let w, h, ps = [], raf;
  const resize = () => {
    const d = Math.min(devicePixelRatio || 1, 2);
    w = c.width = innerWidth * d; h = c.height = innerHeight * d;
    const n = innerWidth < 700 ? 30 : 60;
    ps = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 1.6 + .4) * d, vy: -(Math.random() * .3 + .1) * d, vx: (Math.random() - .5) * .15 * d, a: Math.random() * .5 + .15 }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    ps.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = `rgba(255,255,255,${p.a})`; ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  };
  resize(); addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); if (!document.hidden && !CONFIG.prefersReduced) draw(); });
  CONFIG.prefersReduced ? draw() : draw();
  if (CONFIG.prefersReduced) { cancelAnimationFrame(raf); }
}

/* Count-up stats */
function initStats() {
  const io = new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting) return; o.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, s = { v: 0 };
    gsap.to(s, { v: end, duration: CONFIG.prefersReduced ? .1 : 2, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(s.v) });
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => io.observe(el));
}

/* Back to top */
function initToTop() {
  const b = $('#toTop');
  addEventListener('scroll', () => b.classList.toggle('show', scrollY > 600), { passive: true });
  b.addEventListener('click', () => scrollTo({ top: 0, behavior: CONFIG.prefersReduced ? 'auto' : 'smooth' }));
}


/* ===== Tahap 2: Member Directory =====
   Data CONTOH — ganti sesuai anggota asli. Foto: assets/images/members/<file> */
const MEMBERS = [
  { id: 1, name: 'Hiraki', group: 'XII A', photo: 'hiraki-prayata-annangadipa.jpg', bio: 'Deskripsi singkat Hiraki.', quote: 'Tulis motto di sini.', area: 'Kota / Kecamatan' },
  { id: 2, name: 'Hilmi', group: 'XII A', photo: 'hilmi-romzi-nagib.webp', bio: 'Deskripsi singkat Hilmi.', quote: 'Tulis motto di sini.', area: 'Kota / Kecamatan' },
  { id: 3, name: 'Nabigh', group: 'XII A', photo: 'nabigh-habibie-ghany.jpg', bio: 'Deskripsi singkat Nabigh.', quote: 'Tulis motto di sini.', area: 'Kota / Kecamatan' },
  { id: 4, name: 'Raqilla', group: 'XII A', photo: 'ghaisan-raqilla-manan.jpeg', bio: 'Deskripsi singkat Raqilla.', quote: 'Tulis motto di sini.', area: 'Kota / Kecamatan' },
  { id: 5, name: 'Reza', group: 'XII A', photo: 'reza-khoirul-azzam.png', bio: 'Deskripsi singkat Reza.', quote: 'Tulis motto di sini.', area: 'Kota / Kecamatan' },
  { id: 6, name: 'Baim', group: 'XII A', photo: 'syaelendra-ebrahim-kamil.png', bio: 'Deskripsi singkat Baim.', quote: 'Tulis motto di sini.', area: 'Kota / Kecamatan' },
  { id: 7, name: 'Haidar', group: 'XII A', photo: 'haidar-mahya-sabillilah.png', bio: 'Deskripsi singkat Haidar.', quote: 'Tulis motto di sini.', area: 'Kota / Kecamatan' },
  { id: 8, name: 'Azzam', group: 'XII B', photo: 'azzam-al-ghifary.png', bio: 'Deskripsi singkat Azzam.', quote: 'Tulis motto di sini.', area: 'Kota / Kecamatan' },
  { id: 9, name: 'Satria', group: 'XII B', photo: 'satria-rupawan.png', bio: 'Deskripsi singkat Satria.', quote: 'Tulis motto di sini.', area: 'Kota / Kecamatan' },
  { id: 10, name: 'Fakih', group: 'XII B', photo: 'muhammad-fakhril-fakih.jpg', bio: 'Deskripsi singkat Fakih.', quote: 'Tulis motto di sini.', area: 'Kota / Kecamatan' },
  { id: 11, name: 'Afif', group: 'XII B', photo: 'abdurrahman-afif.jpg', bio: 'Deskripsi singkat Afif.', quote: 'Tulis motto di sini.', area: 'Kota / Kecamatan' },
  { id: 12, name: 'Rhafif', group: 'XII B', photo: 'muhammad-rhafif-ash-shiddiq.png', bio: 'Deskripsi singkat Rhafif.', quote: 'Tulis motto di sini.', area: 'Kota / Kecamatan' },
  { id: 13, name: 'Ibam', group: 'XII B', photo: 'ibrahim-omar.png', bio: 'Deskripsi singkat Ibam.', quote: 'Tulis motto di sini.', area: 'Kota / Kecamatan' },
  { id: 14, name: 'Vitto', group: 'XII B', photo: 'vittorio-veneto-setiantara.png', bio: 'Deskripsi singkat Vitto.', quote: 'Tulis motto di sini.', area: 'Kota / Kecamatan' }
];

function photoEl(m) {
  const wrap = document.createDocumentFragment();
  const ini = document.createElement('span'); ini.className = 'ini'; ini.textContent = m.name[0];
  const img = new Image(); img.loading = 'lazy'; img.alt = 'Foto ' + m.name; img.src = 'assets/images/members/' + m.photo;
  img.addEventListener('error', () => img.replaceWith(ini));
  wrap.appendChild(img); return wrap;
}

function initMembers() {
  const grid = $('#mGrid'), search = $('#mSearch'), filters = $('#mFilters'), count = $('#mCount'), empty = $('#mEmpty');
  const modal = $('#mModal'); let group = 'Semua', lastFocus = null;

  ['Semua', ...new Set(MEMBERS.map(m => m.group))].forEach(g => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip' + (g === group ? ' on' : ''); b.textContent = g;
    b.addEventListener('click', () => { group = g; $$('.chip', filters).forEach(c => c.classList.toggle('on', c === b)); render(); });
    filters.appendChild(b);
  });

  function render(first) {
    const q = search.value.trim().toLowerCase();
    const list = MEMBERS.filter(m => (group === 'Semua' || m.group === group) && m.name.toLowerCase().includes(q));
    grid.replaceChildren();
    list.forEach(m => {
      const c = document.createElement('button'); c.type = 'button'; c.className = 'm-card';
      c.setAttribute('aria-label', 'Lihat profil ' + m.name);
      const img = document.createElement('div'); img.className = 'm-img'; img.appendChild(photoEl(m));
      const info = document.createElement('div'); info.className = 'm-info';
      info.innerHTML = '<h3></h3><p class="grp"></p><p></p>';
      info.children[0].textContent = m.name; info.children[1].textContent = m.group; info.children[2].textContent = m.bio.length > 70 ? m.bio.slice(0, 70) + '…' : m.bio;
      c.append(img, info);
      c.addEventListener('click', () => openModal(m, c));
      tilt(c); grid.appendChild(c);
    });
    count.textContent = list.length + ' dari ' + MEMBERS.length + ' anggota';
    empty.hidden = list.length > 0;
    if (!CONFIG.prefersReduced && list.length) gsap.from('.m-card', { opacity: 0, y: 40, scale: .95, stagger: .08, duration: .7, ease: 'power3.out', clearProps: 'opacity,transform' });
  }

  function tilt(el) {
    if (CONFIG.prefersReduced || !matchMedia('(hover:hover)').matches) return;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      gsap.to(el, { rotateY: x * 14, rotateX: -y * 14, duration: .3, ease: 'power2.out', transformPerspective: 800 });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: .6, ease: 'power3.out' }));
  }

  function openModal(m, trigger) {
    lastFocus = trigger;
    $('#mdPhoto').replaceChildren(photoEl(m));
    $('#mdName').textContent = m.name; $('#mdGroup').textContent = m.group;
    $('#mdBio').textContent = m.bio; $('#mdQuote').textContent = '“' + m.quote + '”'; $('#mdArea').textContent = m.area;
    modal.hidden = false; document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => { modal.classList.add('show'); $('#mClose').focus(); });
  }
  function closeModal() {
    modal.classList.remove('show'); document.body.style.overflow = '';
    setTimeout(() => { modal.hidden = true; lastFocus && lastFocus.focus(); }, CONFIG.prefersReduced ? 0 : 350);
  }
  $('#mClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  modal.addEventListener('keydown', e => { if (e.key === 'Tab') { e.preventDefault(); $('#mClose').focus(); } });

  search.addEventListener('input', () => render());
  render();
}

/* ===== Tahap 3: Memory Gallery =====
   Data CONTOH — ganti caption/kategori/tanggal. Foto: assets/images/gallery/<nama>.jpg dan <nama>-thumb.jpg */
const GALLERY = [
  { id: 'lapangan', cat: 'Kelas', title: 'Kumpul di lapangan', date: '', w: 1800, h: 2400 },
  { id: 'aula', cat: 'Kelas', title: 'Foto bareng di aula', date: '2025-05-24', w: 1350, h: 2400 },
  { id: 'tangga', cat: 'Acara', title: 'Malam di tangga', date: '2024-10-27', w: 2400, h: 1350 },
  { id: 'asrama', cat: 'Asrama', title: 'Satu kamar, satu keluarga', date: '', w: 480, h: 363 },
  { id: 'renang', cat: 'Seru-seruan', title: 'Berenang bareng', date: '', w: 2400, h: 1800 },
  { id: 'kelas', cat: 'Kelas', title: 'Foto di depan kelas', date: '', w: 2400, h: 1800 },
  { id: 'kawahratu', cat: 'Petualangan', title: 'Kawah Ratu', date: '', w: 2400, h: 1800 }
];
/* Folder foto dicari berurutan; kalau foto kamu ditaruh sejajar index.html pun tetap terbaca */
const GALLERY_DIRS = ['assets/images/gallery/', 'gallery/', 'images/', ''];
const fmtDate = d => d ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d)) : 'Tanggal belum diisi';

function initGallery() {
  const grid = $('#gGrid'), fl = $('#gFilters'), empty = $('#gEmpty'), lb = $('#lb');
  let cat = 'Semua', visible = [], idx = 0, lastFocus = null;

  ['Semua', ...new Set(GALLERY.map(g => g.cat))].forEach(c => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip' + (c === cat ? ' on' : ''); b.textContent = c;
    b.addEventListener('click', () => { cat = c; $$('.chip', fl).forEach(x => x.classList.toggle('on', x === b)); applyFilter(); });
    fl.appendChild(b);
  });

  const items = GALLERY.map((g, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'g-item'; b.dataset.cat = g.cat;
    b.setAttribute('aria-label', 'Buka foto: ' + g.title);
    b.style.setProperty('--ar', (g.w / g.h).toFixed(4));
    const img = new Image(); img.loading = 'lazy'; img.alt = g.title; img.width = g.w; img.height = g.h; const tries = GALLERY_DIRS.flatMap(d => [`${d}${g.id}-thumb.jpg`, `${d}${g.id}.jpg`]); let ti = 0; img.src = tries[0];
    img.addEventListener('load', () => img.classList.add('loaded'));
    img.addEventListener('error', () => { if (++ti < tries.length) img.src = tries[ti]; else { img.remove(); b.classList.add('missing'); b.innerHTML = '<span>Foto belum ditemukan<br><small>' + g.id + '.jpg</small></span>'; } });
    const cap = document.createElement('div'); cap.className = 'g-cap';
    cap.innerHTML = '<span></span><small></small>'; cap.children[0].textContent = g.title; cap.children[1].textContent = fmtDate(g.date);
    b.append(img, cap); b.addEventListener('click', () => { if (!b.classList.contains('missing')) open(g, b); }); grid.appendChild(b);
    return { g, el: b };
  });

  function applyFilter() {
    visible = items.filter(i => cat === 'Semua' || i.g.cat === cat);
    items.forEach(i => { i.el.style.display = visible.includes(i) ? '' : 'none'; });
    empty.hidden = visible.length > 0;
    if (!CONFIG.prefersReduced) gsap.fromTo(visible.map(i => i.el), { opacity: 0, y: 30, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', stagger: .1, duration: .8, ease: 'power3.out', clearProps: 'clipPath,opacity,transform' });
  }

  function show(n) {
    idx = (n + visible.length) % visible.length; const g = visible[idx].g;
    const img = $('#lbImg');
    const set = () => { img.src = (visible[idx].el.querySelector('img').src.replace('-thumb.jpg', '.jpg')); img.alt = g.title; $('#lbCap').textContent = g.title; $('#lbMeta').textContent = g.cat + ' • ' + fmtDate(g.date); };
    if (CONFIG.prefersReduced) return set();
    gsap.to(img, { opacity: 0, scale: .96, filter: 'blur(10px)', duration: .2, onComplete: () => { set(); gsap.to(img, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .6, ease: 'power3.out' }); } });
  }
  function open(g, trigger) {
    lastFocus = trigger; idx = visible.findIndex(i => i.g === g);
    lb.hidden = false; document.body.style.overflow = 'hidden'; show(idx);
    requestAnimationFrame(() => { lb.classList.add('show'); $('#lbClose').focus(); });
  }
  function close() {
    lb.classList.remove('show'); document.body.style.overflow = '';
    setTimeout(() => { lb.hidden = true; lastFocus && lastFocus.focus(); }, CONFIG.prefersReduced ? 0 : 400);
  }
  $('#lbClose').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', () => show(idx - 1));
  $('#lbNext').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1);
  });
  applyFilter();
}

/* ===== Tahap 4: Journey Timeline (versi baru, tanpa foto) =====
   Data CONTOH — ganti dengan kegiatan angkatan yang sebenarnya.
   title: judul | desc: ringkasan di kartu | detail: cerita lengkap di jendela detail.
   (Tanggal sengaja dikosongkan dulu; nanti bisa ditambah lagi.) */
const JOURNEY = [
  { title: 'Hari Pertama', desc: 'Awal perjalanan kita bersama.', detail: 'Ganti dengan cerita hari pertama angkatan: siapa saja yang hadir, apa yang paling diingat.' },
  { title: 'Saling Mengenal', desc: 'Dari asing jadi akrab.', detail: 'Ganti dengan momen ketika angkatan mulai terasa seperti keluarga.' },
  { title: 'INVICTUS Lahir', desc: 'Nama, logo, dan identitas angkatan.', detail: 'Ganti dengan cerita bagaimana nama INVICTUS dipilih dan siapa yang membuat logonya.' },
  { title: 'Petualangan Pertama', desc: 'Kegiatan seru yang tak terlupakan.', detail: 'Ganti dengan detail kegiatan: tempat, panitia, dan momen yang paling berkesan.' },
  { title: 'Kelas XII', desc: 'Tahun terakhir bersama.', detail: 'Ganti dengan target, rencana, dan harapan angkatan di tahun terakhir.' },
  { title: 'Menuju Kelulusan', desc: 'Bab baru dimulai, kenangan tetap tinggal.', detail: 'Ganti dengan rencana perpisahan dan pesan penutup angkatan.' }
];

function initJourney() {
  const tl = $('#tl'), modal = $('#jModal'); let lastFocus = null;

  /* 1. Bangun kartu momen */
  JOURNEY.forEach((m, i) => {
    const it = document.createElement('button'); it.type = 'button'; it.className = 'tl-item';
    it.setAttribute('aria-label', 'Lihat detail: ' + m.title);
    const t = document.createElement('div'); t.className = 'tl-txt';
    t.innerHTML = '<span class="tl-no"></span><h3></h3><p></p>';
    t.children[0].textContent = String(i + 1).padStart(2, '0');
    t.children[1].textContent = m.title; t.children[2].textContent = m.desc;
    it.appendChild(t); it.addEventListener('click', () => openJ(m, it));
    tl.appendChild(it);
  });
  const items = $$('.tl-item', tl);

  /* 2. Momen yang sedang di tengah layar menyala */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) items.forEach(x => x.classList.toggle('active', x === e.target));
  }), { rootMargin: '-45% 0px -45% 0px' });
  items.forEach(i => io.observe(i));

  /* 3. Garis yang terisi saat di-scroll + animasi muncul (hanya jika GSAP tersedia) */
  if (CONFIG.prefersReduced || !window.ScrollTrigger) {
    $('#tlFill').style.transform = 'scaleY(1)';
  } else {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('#tlFill', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: tl, start: 'top 60%', end: 'bottom 60%', scrub: true } });
    items.forEach(it => gsap.from(it, { opacity: 0, y: 60, filter: 'blur(10px)', duration: .9, ease: 'power3.out', clearProps: 'filter', scrollTrigger: { trigger: it, start: 'top 85%', once: true } }));
  }

  /* 4. Jendela detail */
  function openJ(m, trigger) {
    lastFocus = trigger;
    $('#jdPhoto').replaceChildren();
    $('#jdDate').textContent = ''; $('#jdTitle').textContent = m.title; $('#jdDetail').textContent = m.detail;
    modal.hidden = false; document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => { modal.classList.add('show'); $('#jClose').focus(); });
  }
  function closeJ() {
    modal.classList.remove('show'); document.body.style.overflow = '';
    setTimeout(() => { modal.hidden = true; lastFocus && lastFocus.focus(); }, CONFIG.prefersReduced ? 0 : 350);
  }
  $('#jClose').addEventListener('click', closeJ);
  modal.addEventListener('click', e => { if (e.target === modal) closeJ(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeJ(); });
  modal.addEventListener('keydown', e => { if (e.key === 'Tab') { e.preventDefault(); $('#jClose').focus(); } });
}

/* ===== Tahap 6: Member Map (Leaflet + OpenStreetMap) =====
   Data CONTOH — ganti region dan koordinat dengan wilayah UMUM (pusat kota/kecamatan).
   Jangan pakai alamat rumah atau koordinat presisi tanpa persetujuan anggota. */
const MAP_MEMBERS = [
  { name: 'Raqilla', group: 'XII A', region: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { name: 'Azzam', group: 'XII A', region: 'Bogor', lat: -6.5950, lng: 106.8166 },
  { name: 'Afif', group: 'XII B', region: 'Depok', lat: -6.4025, lng: 106.7942 },
  { name: 'Ibam', group: 'XII B', region: 'Tangerang', lat: -6.1783, lng: 106.6319 },
  { name: 'Nabigh', group: 'XII B', region: 'Bekasi', lat: -6.2383, lng: 106.9756 }
];

function initMap() {
  const el = $('#leafletMap');
  if (!window.L) { el.innerHTML = '<p class="map-fail">Peta belum bisa dimuat. Periksa koneksi internet, lalu muat ulang halaman.</p>'; return; }

  const search = $('#mapSearch'), filters = $('#mapFilters'), count = $('#mapCount'), statsEl = $('#mapStats'), empty = $('#mapEmpty');
  const regions = [...new Set(MAP_MEMBERS.map(m => m.region))];
  let region = 'Semua';

  const map = L.map(el, { scrollWheelZoom: false }).setView([-6.3, 106.8], 9);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; kontributor <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
  const layer = L.layerGroup().addTo(map);
  map.on('focus', () => map.scrollWheelZoom.enable());
  map.on('blur', () => map.scrollWheelZoom.disable());
  addEventListener('resize', () => map.invalidateSize());

  /* Satu marker per anggota; digeser sedikit agar marker di wilayah yang sama tidak menumpuk */
  const seen = {};
  const items = MAP_MEMBERS.map(m => {
    const k = seen[m.region] = (seen[m.region] || 0) + 1;
    const ang = k * 1.26, off = k === 1 ? 0 : 0.012;
    const marker = L.marker([m.lat + Math.sin(ang) * off, m.lng + Math.cos(ang) * off], {
      title: m.name, alt: m.name, riseOnHover: true,
      icon: L.divIcon({ className: 'pin-wrap', html: '<span class="pin"></span>', iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -12] })
    });
    const pop = document.createElement('div'); pop.className = 'map-pop';
    pop.innerHTML = '<b></b><span></span>';
    pop.children[0].textContent = m.name; pop.children[1].textContent = m.group + ' • ' + m.region;
    marker.bindPopup(pop, { closeButton: true, autoPanPadding: [30, 30] });
    return { m, marker };
  });

  regions.forEach(r => addChip(r));
  addChip('Semua', true, true);
  function addChip(label, on, first) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip' + (on ? ' on' : ''); b.textContent = label;
    b.addEventListener('click', () => setRegion(label));
    first ? filters.prepend(b) : filters.appendChild(b);
  }
  function setRegion(r) {
    region = r; $$('.chip', filters).forEach(c => c.classList.toggle('on', c.textContent === r)); render();
  }

  /* Statistik per wilayah (klik baris = filter wilayah) */
  const max = Math.max(1, ...regions.map(r => MAP_MEMBERS.filter(m => m.region === r).length));
  regions.forEach(r => {
    const n = MAP_MEMBERS.filter(m => m.region === r).length;
    const row = document.createElement('button'); row.type = 'button'; row.className = 'ms-row';
    row.innerHTML = '<span class="ms-name"></span><span class="ms-n"></span><i class="ms-bar"><b></b></i>';
    row.children[0].textContent = r; row.children[1].textContent = n; row.querySelector('b').style.width = (n / max * 100) + '%';
    row.addEventListener('click', () => setRegion(region === r ? 'Semua' : r));
    statsEl.appendChild(row);
  });

  function render() {
    const q = search.value.trim().toLowerCase();
    const vis = items.filter(i => (region === 'Semua' || i.m.region === region) && i.m.name.toLowerCase().includes(q));
    layer.clearLayers();
    vis.forEach((i, k) => { i.marker.addTo(layer); const p = i.marker.getElement(); if (p && p.firstChild) p.firstChild.style.animationDelay = (k * 90) + 'ms'; });
    count.textContent = vis.length + ' dari ' + MAP_MEMBERS.length + ' anggota di peta';
    empty.hidden = vis.length > 0;
    $$('.ms-row', statsEl).forEach(r => r.classList.toggle('on', r.children[0].textContent === region));
    if (!vis.length) return;
    const opt = { animate: !CONFIG.prefersReduced };
    if (vis.length === 1) { map.flyTo(vis[0].marker.getLatLng(), 11, { animate: opt.animate, duration: .9 }); vis[0].marker.openPopup(); }
    else map.fitBounds(L.latLngBounds(vis.map(i => i.marker.getLatLng())).pad(.4), { maxZoom: 12, animate: opt.animate });
  }
  search.addEventListener('input', render);
  render();
}

document.addEventListener('DOMContentLoaded', () => {
  splitTitle(); initNav(); initParticles(); initHeroFx(); initStats(); initMembers(); initGallery(); initJourney(); initMap(); initToTop(); initPreloader();
});
