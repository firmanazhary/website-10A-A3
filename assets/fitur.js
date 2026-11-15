/* =========================================================
   INVICTUS G3 — Jadwal Piket, Galeri Kenangan, Panel Admin
   ---------------------------------------------------------
   Dimuat SETELAH skrip utama index.html, jadi bisa memakai
   KELAS, gsap, ScrollTrigger, lenis, setCursor, REDUCED.

   ARSITEKTUR DATA (lihat ADMIN.md)
   1. data/konten.json  -> konten TERBIT, dibaca semua pengunjung
                           (hanya bisa di-fetch lewat http/https).
   2. IndexedDB browser -> perubahan admin di perangkat ini.
   3. Seed bawaan       -> rotasi piket awal dari daftar KELAS,
                           galeri kosong (tidak ada foto palsu).
   Urutan baca: lokal (jika admin pernah menyimpan) > terbit > seed.
   Seluruh baca/tulis lewat objek `Store` + `loadAll()`, sehingga
   mengganti ke backend sungguhan cukup di dua titik itu.
   ========================================================= */
(() => {
  'use strict';

  /* ---------- util ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const clone = o => JSON.parse(JSON.stringify(o));
  const RM = typeof REDUCED !== 'undefined' ? REDUCED : matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = window.gsap || null;
  const LN = () => (typeof lenis !== 'undefined' ? lenis : null);
  const cur = s => { try { setCursor(s); } catch (e) { } };
  const refreshST = () => { try { window.ScrollTrigger && ScrollTrigger.refresh(); } catch (e) { } };
  const ICON_CHECK = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 6.5 4.8 9 10 3"/></svg>';
  const ICON_PLAY = '<svg viewBox="0 0 10 10" fill="currentColor"><path d="M1 0v10l9-5z"/></svg>';
  const ICON_L = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M11 3 5 9l6 6"/></svg>';
  const ICON_R = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m7 3 6 6-6 6"/></svg>';

  /* ---------- tanggal ---------- */
  const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const BLN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fmtDate = (s, short) => {
    if (!s) return '';
    const [y, m, d] = s.split('-').map(Number); if (!y || !m || !d) return esc(s);
    return `${d} ${short ? BLN[m - 1].slice(0, 3) : BLN[m - 1]} ${y}`;
  };
  const today = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
  /** Tanggal Senin–Sabtu pekan berjalan. Pada hari Minggu dipakai pekan berikutnya. */
  function weekDates(base = today()) {
    const d = new Date(base), dow = d.getDay(), mon = new Date(d);
    mon.setDate(d.getDate() + (dow === 0 ? 1 : 1 - dow));
    return [1, 2, 3, 4, 5, 6].map(i => { const x = new Date(mon); x.setDate(mon.getDate() + i - 1); return x; });
  }

  /* =========================================================
     STORE — IndexedDB dengan cadangan memori
     ========================================================= */
  const Store = (() => {
    const mem = { kv: new Map(), media: new Map() };
    let dbp = null, persistent = true;
    function open() {
      if (dbp) return dbp;
      dbp = new Promise(res => {
        try {
          const rq = indexedDB.open('invictus-g3', 1);
          rq.onupgradeneeded = () => { const db = rq.result; db.createObjectStore('kv'); db.createObjectStore('media', { keyPath: 'id' }); };
          rq.onsuccess = () => res(rq.result);
          rq.onerror = rq.onblocked = () => { persistent = false; res(null); };
        } catch (e) { persistent = false; res(null); }
      });
      return dbp;
    }
    async function run(store, mode, fn) {
      const db = await open();
      if (!db) return fn(null);
      return new Promise((res, rej) => {
        const t = db.transaction(store, mode), s = t.objectStore(store); let out;
        const r = fn(s); if (r) r.onsuccess = () => { out = r.result; };
        t.oncomplete = () => res(out);
        t.onerror = t.onabort = () => rej(t.error || new Error('Transaksi gagal'));
      });
    }
    return {
      get persistent() { return persistent; },
      ready: open,
      get: k => run('kv', 'readonly', s => s ? s.get(k) : (void 0)).then(v => v === undefined && !persistent ? mem.kv.get(k) : v),
      set: (k, v) => run('kv', 'readwrite', s => s ? s.put(v, k) : (mem.kv.set(k, v), null)),
      del: k => run('kv', 'readwrite', s => s ? s.delete(k) : (mem.kv.delete(k), null)),
      allMedia: () => run('media', 'readonly', s => s ? s.getAll() : null).then(v => v || [...mem.media.values()]),
      putMedia: m => run('media', 'readwrite', s => s ? s.put(m) : (mem.media.set(m.id, m), null)),
      delMedia: id => run('media', 'readwrite', s => s ? s.delete(id) : (mem.media.delete(id), null)),
      clearMedia: () => run('media', 'readwrite', s => s ? s.clear() : (mem.media.clear(), null))
    };
  })();

  /* =========================================================
     MODEL
     ========================================================= */
  const DEFAULT_TASKS = [
    { id: 'sapu', name: 'Menyapu' },
    { id: 'pel', name: 'Mengepel' },
    { id: 'papan', name: 'Membersihkan papan tulis' },
    { id: 'meja', name: 'Merapikan meja dan kursi' },
    { id: 'sampah', name: 'Membuang sampah' }
  ];
  const CATS = [
    { id: 'all', name: 'Semua Kenangan' },
    { id: 'kegiatan', name: 'Kegiatan' },
    { id: 'kebersamaan', name: 'Kebersamaan' },
    { id: 'acara', name: 'Acara' },
    { id: 'bts', name: 'Di Balik Layar' },
    { id: 'spesial', name: 'Momen Spesial' }
  ];
  const catName = id => (CATS.find(c => c.id === id) || CATS[1]).name;
  const ROSTER = (() => { try { return KELAS; } catch (e) { return { A: [], B: [] }; } })();
  /* label tampil "Kelas 10A/10B" dari index.html; kunci data tetap A/B */
  const kn = k => { try { return namaKelas(k); } catch (e) { return 'Kelas ' + k; } };

  /** Rotasi awal: anggota dibagi rata ke Senin–Sabtu, lima tugas dibagi rata ke petugas hari itu. */
  function seedSchedule() {
    const classes = {};
    ['A', 'B'].forEach(k => {
      const roster = (ROSTER[k] || []).map(m => m.nama);
      const days = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
      roster.forEach((name, i) => days[(i % 6) + 1].push({ name, tasks: [] }));
      Object.values(days).forEach(crew => DEFAULT_TASKS.forEach((t, j) => crew.length && crew[j % crew.length].tasks.push(t.id)));
      classes[k] = { roster, days };
    });
    return { version: 1, seeded: true, tasks: clone(DEFAULT_TASKS), classes, done: {}, updatedAt: null };
  }
  function normalizeSchedule(s) {
    const base = seedSchedule();
    if (!s || typeof s !== 'object') return base;
    const out = { version: 1, seeded: !!s.seeded, tasks: [], classes: {}, done: {}, updatedAt: s.updatedAt || null };
    out.tasks = Array.isArray(s.tasks) ? s.tasks.filter(t => t && t.id && t.name).map(t => ({ id: String(t.id), name: String(t.name) })) : base.tasks;
    ['A', 'B'].forEach(k => {
      const c = (s.classes && s.classes[k]) || base.classes[k];
      const roster = Array.isArray(c.roster) ? [...new Set(c.roster.map(String).filter(Boolean))] : base.classes[k].roster;
      const days = {};
      for (let d = 1; d <= 6; d++) {
        const list = (c.days && Array.isArray(c.days[d])) ? c.days[d] : [];
        const seen = new Set();
        days[d] = list.filter(a => a && a.name && !seen.has(a.name) && seen.add(a.name))
          .map(a => ({ name: String(a.name), tasks: (Array.isArray(a.tasks) ? a.tasks : []).filter(id => out.tasks.some(t => t.id === id)) }));
      }
      out.classes[k] = { roster, days };
    });
    if (s.done && typeof s.done === 'object') Object.entries(s.done).forEach(([date, v]) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !v) return;
      out.done[date] = { A: Array.isArray(v.A) ? v.A.map(String) : [], B: Array.isArray(v.B) ? v.B.map(String) : [] };
    });
    return out;
  }
  function normalizeMedia(m, i = 0) {
    if (!m || typeof m !== 'object') return null;
    const type = m.type === 'video' ? 'video' : 'image';
    const hasBlob = m.blob instanceof Blob, src = typeof m.src === 'string' ? m.src : '';
    if (!hasBlob && !src) return null;
    return {
      id: String(m.id || uid()), type,
      title: String(m.title || ''), desc: String(m.desc || ''),
      date: /^\d{4}-\d{2}-\d{2}$/.test(m.date || '') ? m.date : '',
      category: CATS.some(c => c.id === m.category && c.id !== 'all') ? m.category : 'kegiatan',
      blob: hasBlob ? m.blob : null, src: hasBlob ? '' : src,
      thumb: m.thumb instanceof Blob ? m.thumb : null,
      poster: typeof m.poster === 'string' ? m.poster : '',
      w: +m.w || 0, h: +m.h || 0, dur: +m.dur || 0,
      order: Number.isFinite(+m.order) ? +m.order : i,
      added: m.added || new Date().toISOString()
    };
  }

  const Data = { schedule: seedSchedule(), media: [], src: { schedule: 'seed', gallery: 'kosong' }, galleryLocal: false, published: null };

  async function loadAll() {
    let pub = null;
    if (location.protocol !== 'file:') {
      try { const r = await fetch('data/konten.json', { cache: 'no-cache' }); if (r.ok) pub = await r.json(); } catch (e) { }
    }
    Data.published = pub;
    let local = null; try { local = await Store.get('schedule'); } catch (e) { }
    if (local) { Data.schedule = normalizeSchedule(local); Data.src.schedule = 'lokal'; }
    else if (pub && pub.schedule) { Data.schedule = normalizeSchedule(pub.schedule); Data.src.schedule = 'terbit'; }
    else { Data.schedule = seedSchedule(); Data.src.schedule = 'seed'; }

    let galLocal = false; try { galLocal = !!(await Store.get('galleryLocal')); } catch (e) { }
    Data.galleryLocal = galLocal;
    if (galLocal) { Data.media = (await Store.allMedia()).map(normalizeMedia).filter(Boolean); Data.src.gallery = 'lokal'; }
    else if (pub && Array.isArray(pub.gallery)) { Data.media = pub.gallery.map(normalizeMedia).filter(Boolean); Data.src.gallery = 'terbit'; }
    else { Data.media = []; Data.src.gallery = 'kosong'; }
    Data.media.sort((a, b) => a.order - b.order);
  }
  async function saveSchedule(s) {
    s.updatedAt = new Date().toISOString(); s.seeded = false;
    await Store.set('schedule', s);
    Data.schedule = normalizeSchedule(s); Data.src.schedule = 'lokal';
    Piket.render();
  }
  async function ensureLocalGallery() {
    if (Data.galleryLocal) return;
    for (const m of Data.media) await Store.putMedia(m);
    await Store.set('galleryLocal', true);
    Data.galleryLocal = true; Data.src.gallery = 'lokal';
  }

  /* ---------- URL media (object URL dibuat malas & di-cache) ---------- */
  const urlCache = new Map();
  function blobURL(key, blob) { if (!urlCache.has(key)) urlCache.set(key, URL.createObjectURL(blob)); return urlCache.get(key); }
  function dropURLs(id) { [id + ':f', id + ':t'].forEach(k => { if (urlCache.has(k)) { URL.revokeObjectURL(urlCache.get(k)); urlCache.delete(k); } }); }
  function fullURL(m) { return m.blob ? blobURL(m.id + ':f', m.blob) : m.src; }
  function thumbURL(m) {
    if (m.thumb) return blobURL(m.id + ':t', m.thumb);
    if (m.poster) return m.poster;
    return m.type === 'image' ? fullURL(m) : '';
  }
  const fmtDur = s => s ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}` : 'Video';

  /* =========================================================
     JADWAL PIKET (publik)
     ========================================================= */
  const Piket = (() => {
    const root = $('#piket'); if (!root) return { render() { } };
    const elToday = $('#pkToday'), elWeek = $('#pkWeek'), elTasks = $('#pkTasks'), elLabel = $('#pkWeekLabel');
    let k = 'A';
    try { const v = localStorage.getItem('inv-piket-kelas'); if (v === 'A' || v === 'B') k = v; } catch (e) { }

    function statusOf(kk, d, date) {
      const S = Data.schedule, crew = S.classes[kk].days[d] || [];
      const key = ymd(date), done = ((S.done[key] || {})[kk]) || [];
      const n = crew.length, c = crew.filter(a => done.includes(a.name)).length;
      const t = ymd(today()), rel = key < t ? 'past' : key > t ? 'future' : 'today';
      let s, label;
      if (!n) { s = 'empty'; label = 'Belum ada petugas'; }
      else if (c === n) { s = 'done'; label = 'Selesai'; }
      else if (rel === 'future') { s = 'plan'; label = 'Terjadwal'; }
      else if (rel === 'today') { s = c ? 'going' : 'wait'; label = c ? `Berjalan ${c}/${n}` : 'Belum dimulai'; }
      else { s = c ? 'partial' : 'missed'; label = c ? `Sebagian ${c}/${n}` : 'Belum dicatat'; }
      return { crew, done, n, c, rel, s, label, key };
    }
    const taskNames = ids => ids.map(id => (Data.schedule.tasks.find(t => t.id === id) || {}).name).filter(Boolean);

    function renderToday(dates) {
      const now = today(), dow = now.getDay();
      if (dow === 0) {
        const st = statusOf(k, 1, dates[0]);
        elToday.innerHTML = `
          <div><span class="pk-t-kicker">Hari ini · ${kn(k)}</span><span class="pk-t-day">Minggu.</span><span class="pk-t-date">Libur piket. Kelas istirahat dulu.</span></div>
          <div><p class="pk-t-kicker" style="margin-bottom:10px">Besok, Senin ${fmtDate(ymd(dates[0]), true)}</p>${crewList(st, true)}</div>
          <div class="pk-ring" style="--p:0"><span>${st.n}<small>petugas besok</small></span></div>`;
        return;
      }
      const st = statusOf(k, dow, now), pct = st.n ? Math.round(st.c / st.n * 100) : 0;
      elToday.innerHTML = `
        <div><span class="pk-t-kicker">Hari ini · ${kn(k)}</span><span class="pk-t-day">${HARI[dow]}.</span><span class="pk-t-date">${fmtDate(st.key)} · ${esc(st.label)}</span></div>
        <div>${crewList(st, false)}</div>
        <div class="pk-ring" style="--p:${pct}" role="img" aria-label="${st.c} dari ${st.n} petugas selesai"><span>${st.c}/${st.n}<small>selesai</small></span></div>`;
    }
    function crewList(st, preview) {
      if (!st.n) return '<p class="pk-off">Belum ada petugas untuk hari ini. Admin bisa menambahkannya.</p>';
      return `<ul class="pk-t-crew">${st.crew.map(a => {
        const on = !preview && st.done.includes(a.name);
        return `<li><span class="pk-check${on ? ' on' : ''}" aria-label="${on ? 'Selesai' : 'Belum selesai'}">${ICON_CHECK}</span>
          <span><b>${esc(a.name)}</b><small>${esc(taskNames(a.tasks).join(' · ') || 'Belum ada tugas')}</small></span></li>`;
      }).join('')}</ul>`;
    }
    function renderWeek(dates) {
      const tKey = ymd(today());
      elWeek.innerHTML = dates.map((date, i) => {
        const d = i + 1, st = statusOf(k, d, date), isToday = st.key === tKey;
        return `<article class="pk-day fx-rise${isToday ? ' is-today' : ''}${st.rel === 'past' ? ' is-past' : ''}" ${isToday ? 'aria-current="date"' : ''} aria-label="${HARI[d]}, ${fmtDate(st.key)}, ${esc(st.label)}">
          <div class="pk-dtop"><div><span class="pk-dname">${HARI[d]}</span><span class="pk-ddate">${fmtDate(st.key, true)}</span></div>${isToday ? '<span class="pk-now">Hari ini</span>' : ''}</div>
          ${st.n ? `<ul class="pk-crew">${st.crew.map(a => {
          const on = st.done.includes(a.name);
          return `<li><div><b>${esc(a.name)}</b><div class="pk-chips">${taskNames(a.tasks).map(n => `<span class="pk-chip">${esc(n)}</span>`).join('')}</div></div>
              <span class="pk-check${on ? ' on' : ''}" title="${on ? 'Selesai' : 'Belum'}">${ICON_CHECK}</span></li>`;
        }).join('')}</ul>` : '<p class="pk-empty">Belum ada petugas.</p>'}
          <div class="pk-badge" data-s="${st.s}"><i></i>${esc(st.label)}</div>
        </article>`;
      }).join('');
      // HP: geser ke kartu hari ini
      const t = $('.pk-day.is-today', elWeek);
      if (t && matchMedia('(max-width:640px)').matches) elWeek.scrollLeft = t.offsetLeft - (elWeek.clientWidth - t.clientWidth) / 2;
      reveal($$('.fx-rise', elWeek));
    }
    function renderTasks() {
      const S = Data.schedule, dow = today().getDay();
      const crew = dow ? (S.classes[k].days[dow] || []) : [];
      elTasks.innerHTML = `<h3>Tugas harian<small>Setiap petugas memegang satu atau lebih tugas. Daftar tugas diatur oleh admin.</small></h3>
        <ol>${S.tasks.map((t, i) => {
        const who = crew.filter(a => a.tasks.includes(t.id)).map(a => a.name);
        return `<li><span>${String(i + 1).padStart(2, '0')}</span><b>${esc(t.name)}</b><small>${dow ? (who.length ? 'Hari ini: ' + esc(who.join(', ')) : 'Hari ini belum ada yang memegang') : 'Minggu libur'}</small></li>`;
      }).join('')}</ol>`;
    }
    function render() {
      const dates = weekDates();
      elLabel.innerHTML = `<span>Pekan <b>${fmtDate(ymd(dates[0]), true)} – ${fmtDate(ymd(dates[5]), true)}</b></span><span>${kn(k)} · ${Data.schedule.classes[k].roster.length} anggota</span>`;
      $$('.pk-tabs button', root).forEach(b => b.setAttribute('aria-selected', b.dataset.k === k));
      renderToday(dates); renderWeek(dates); renderTasks();
      refreshST();
    }
    $$('.pk-tabs button', root).forEach(b => b.addEventListener('click', () => {
      if (b.dataset.k === k) return; k = b.dataset.k;
      try { localStorage.setItem('inv-piket-kelas', k); } catch (e) { }
      if (G && !RM) {
        G.to([elToday, elWeek], { opacity: 0, y: 16, duration: .22, ease: 'power2.in', onComplete: () => { render(); G.fromTo([elToday, elWeek], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .55, ease: 'expo.out', stagger: .06, clearProps: 'opacity,transform' }); } });
      } else render();
    }));
    // keyboard: panah kiri/kanan di tablist
    $('.pk-tabs', root).addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const bs = $$('.pk-tabs button', root), i = bs.indexOf(document.activeElement); if (i < 0) return;
      const n = bs[(i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length]; n.focus(); n.click();
    });
    // pergantian hari saat halaman dibiarkan terbuka
    let lastDay = ymd(today());
    setInterval(() => { const t = ymd(today()); if (t !== lastDay) { lastDay = t; render(); } }, 60000);
    return { render };
  })();

  /* ---------- reveal ---------- */
  const revealIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
    let n = 0;
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target; revealIO.unobserve(el);
      el.style.transitionDelay = RM ? '0s' : (n++ * .07).toFixed(2) + 's';
      requestAnimationFrame(() => el.classList.add('in'));
      setTimeout(() => { el.style.transitionDelay = ''; }, 1600);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .01 }) : null;
  function reveal(els) { els.forEach(el => revealIO ? revealIO.observe(el) : el.classList.add('in')); }

  /* =========================================================
     GALERI (publik)
     ========================================================= */
  const Galeri = (() => {
    const root = $('#galeri'); if (!root) return { render() { } };
    const grid = $('#glGrid'), vgrid = $('#glVgrid'), empty = $('#glEmpty'), filters = $('#glFilters'), count = $('#glCount'), vcount = $('#glVcount');
    let cat = 'all';
    const lazyIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { lazyIO.unobserve(e.target); hydrate(e.target); }
    }), { rootMargin: '600px 0px' }) : null;

    const list = type => Data.media.filter(m => m.type === type && (cat === 'all' || m.category === cat));

    function renderFilters() {
      filters.innerHTML = CATS.map(c => {
        const n = c.id === 'all' ? Data.media.length : Data.media.filter(m => m.category === c.id).length;
        return `<button class="fx-pill" data-cat="${c.id}" aria-pressed="${c.id === cat}"${!n && c.id !== 'all' && c.id !== cat ? ' disabled' : ''}>${esc(c.name)}<sup>${n}</sup></button>`;
      }).join('');
    }
    function itemHTML(m, i, set) {
      const ar = m.w && m.h ? m.w / m.h : (m.type === 'video' ? 16 / 9 : 4 / 3);
      const label = (m.type === 'video' ? 'Putar video: ' : 'Buka foto: ') + (m.title || 'Tanpa judul');
      return `<div class="gl-item" data-id="${esc(m.id)}" data-set="${set}" data-i="${i}" data-ar="${ar.toFixed(4)}" style="--ar:${ar.toFixed(4)}">
        <button class="gl-card" aria-label="${esc(label)}">
          <span class="gl-frame">${m.type === 'video' ? `<span class="gl-play">${ICON_PLAY}${fmtDur(m.dur)}</span>` : ''}<span class="gl-open">${m.type === 'video' ? 'Putar' : 'Lihat penuh'}</span></span>
          <span class="gl-cap"><span class="gl-cap-t"><b>${esc(m.title || 'Tanpa judul')}</b>${m.desc ? `<i>${esc(m.desc)}</i>` : ''}</span>
          <span class="gl-cap-m"><em>${esc(catName(m.category))}</em>${m.date ? '<br>' + fmtDate(m.date, true) : ''}</span></span>
        </button></div>`;
    }
    /** Lazy load: gambar/video baru dipasang saat kartunya mendekati layar. */
    function hydrate(el) {
      const m = Data.media.find(x => x.id === el.dataset.id); if (!m) return;
      const frame = $('.gl-frame', el), src = thumbURL(m);
      if (src) {
        const img = new Image(); img.alt = ''; img.decoding = 'async';
        img.onload = () => {
          img.classList.add('ok');
          if (!m.w && img.naturalWidth) { m.w = img.naturalWidth; m.h = img.naturalHeight; el.dataset.ar = (m.w / m.h).toFixed(4); el.style.setProperty('--ar', el.dataset.ar); queueLayout(); }
        };
        img.onerror = () => frame.insertAdjacentHTML('beforeend', '<span class="lb-loading">Berkas tidak ditemukan</span>');
        img.src = src; frame.prepend(img);
      } else if (m.type === 'video') {
        const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.preload = 'metadata';
        v.onloadeddata = () => v.classList.add('ok'); v.src = fullURL(m) + '#t=0.5'; frame.prepend(v);
      }
    }
    let layoutQ = 0;
    const queueLayout = () => { cancelAnimationFrame(layoutQ); layoutQ = requestAnimationFrame(layout); };
    /** Masonry editorial: kolom dengan lebar berbeda + kolom genap turun sedikit.
        Tiap kartu masuk ke kolom terpendek, jadi tidak ada lubang. */
    function layout() {
      const W = grid.clientWidth; if (!W) return;
      const spec = W >= 1300 ? [1.3, 1, 1.15, .85] : W >= 900 ? [1.25, 1, .85] : W >= 560 ? [1.15, 1] : [1, 1];
      const gap = W >= 900 ? 28 : W >= 560 ? 18 : 12, off = W >= 900 ? 120 : W >= 560 ? 70 : 36;
      grid.style.setProperty('--gap', gap + 'px');
      const items = $$('.gl-item', grid).sort((a, b) => a.dataset.i - b.dataset.i);
      /* tanpa foto, jangan sisakan kolom kosong yang ikut memakan tinggi */
      if (!items.length) { $$(':scope > .gl-col', grid).forEach(c => grid.removeChild(c)); return; }
      let cols = $$(':scope > .gl-col', grid);
      if (cols.length !== spec.length) {
        cols.forEach(c => grid.removeChild(c));
        cols = spec.map(() => { const c = document.createElement('div'); c.className = 'gl-col'; grid.appendChild(c); return c; });
      }
      const sum = spec.reduce((a, b) => a + b, 0), avail = W - gap * (spec.length - 1);
      const widths = spec.map(f => avail * f / sum), heights = spec.map((f, i) => i % 2 ? off : 0);
      cols.forEach((c, i) => { c.style.flex = `${spec[i]} 1 0`; c.style.paddingTop = (i % 2 ? off : 0) + 'px'; });
      items.forEach(el => {
        const ar = Math.min(1.9, Math.max(.7, +el.dataset.ar || 1.33));
        el.style.setProperty('--ar', ar.toFixed(4));
        let b = 0; heights.forEach((h, i) => { if (h < heights[b] - 1) b = i; });
        cols[b].appendChild(el);
        heights[b] += widths[b] / ar + 64 + gap;
      });
      refreshST();
    }
    if ('ResizeObserver' in window) { let lw = 0; new ResizeObserver(() => { if (grid.clientWidth !== lw) { lw = grid.clientWidth; queueLayout(); } }).observe(grid); }
    else addEventListener('resize', queueLayout);

    function renderItems() {
      const photos = list('image'), videos = list('video');
      grid.innerHTML = photos.map((m, i) => itemHTML(m, i, 'image')).join('');
      vgrid.innerHTML = videos.length ? videos.map((m, i) => itemHTML(m, i, 'video')).join('')
        : `<div class="gl-empty"><div><b>Belum ada video${cat !== 'all' ? ' di kategori ini' : ''}.</b><p>Video yang diunggah admin akan tampil di sini.</p></div></div>`;
      const total = Data.media.length;
      empty.hidden = photos.length > 0;
      empty.innerHTML = total
        ? `<div><b>Belum ada foto di ${esc(catName(cat))}.</b><p>Coba kategori lain, atau tunggu admin menambahkan kenangan baru.</p></div>`
        : `<div><b>Arsip masih kosong.</b><p>Galeri ini hanya memuat foto dan video asli Generasi 03. Kenangan akan muncul di sini setelah admin mengunggahnya.</p></div>`;
      const np = Data.media.filter(m => m.type === 'image').length, nv = total - np;
      count.textContent = `${np} foto · ${nv} video`;
      vcount.textContent = `${videos.length} video${cat !== 'all' ? ' · ' + catName(cat) : ''}`;
      const items = $$('.gl-item', root);
      items.forEach(el => lazyIO ? lazyIO.observe(el) : hydrate(el));
      layout(); reveal(items);
    }
    function render() { renderFilters(); renderItems(); }
    function setCat(c) {
      if (c === cat) return; cat = c;
      $$('button', filters).forEach(b => b.setAttribute('aria-pressed', b.dataset.cat === c));
      const old = $$('.gl-item', root);
      if (G && !RM && old.length) {
        G.to(old, { opacity: 0, y: 40, scale: .96, filter: 'blur(6px)', duration: .38, ease: 'power2.in', stagger: { each: .02, from: 'random' }, onComplete: renderItems });
      } else renderItems();
    }
    filters.addEventListener('click', e => { const b = e.target.closest('button[data-cat]'); if (b) setCat(b.dataset.cat); });
    root.addEventListener('click', e => {
      const card = e.target.closest('.gl-card'); if (!card) return;
      const it = card.parentElement, set = it.dataset.set;
      Lightbox.open(list(set), +it.dataset.i, card);
    });
    // kursor "view" + pratinjau video saat hover
    root.addEventListener('pointerover', e => {
      const c = e.target.closest('.gl-card'); if (!c || c.contains(e.relatedTarget)) return;
      cur('view'); const v = $('video', c); if (v && matchMedia('(pointer:fine)').matches) v.play().catch(() => { });
    });
    root.addEventListener('pointerout', e => {
      const c = e.target.closest('.gl-card'); if (!c || c.contains(e.relatedTarget)) return;
      cur(''); const v = $('video', c); if (v) v.pause();
    });
    return { render, list };
  })();

  /* =========================================================
     LIGHTBOX
     ========================================================= */
  const Lightbox = (() => {
    const el = document.createElement('div');
    el.className = 'lb'; el.id = 'lightbox'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'lbTitle');
    el.setAttribute('data-lenis-prevent', '');
    el.innerHTML = `
      <div class="lb-top"><p class="lb-count" id="lbCount" aria-live="polite"></p><button class="lb-btn" id="lbClose">Tutup</button></div>
      <div class="lb-stage" id="lbStage">
        <button class="lb-arrow lb-prev" id="lbPrev" aria-label="Sebelumnya">${ICON_L}</button>
        <button class="lb-arrow lb-next" id="lbNext" aria-label="Berikutnya">${ICON_R}</button>
      </div>
      <div class="lb-cap"><div><h3 id="lbTitle"></h3><p id="lbDesc"></p></div><p class="lb-meta" id="lbMeta"></p></div>`;
    document.body.appendChild(el);
    const stage = $('#lbStage', el), title = $('#lbTitle', el), desc = $('#lbDesc', el), meta = $('#lbMeta', el), cnt = $('#lbCount', el);
    let items = [], idx = 0, isOpen = false, lastFocus = null, slide = null;

    function build(m) {
      const s = document.createElement('div'); s.className = 'lb-slide';
      if (m.type === 'video') {
        const v = document.createElement('video'); v.controls = true; v.playsInline = true; v.preload = 'metadata';
        const p = thumbURL(m); if (p) v.poster = p; v.src = fullURL(m); s.appendChild(v);
      } else {
        const img = new Image(); img.alt = m.title || 'Foto kenangan'; img.decoding = 'async';
        const ld = document.createElement('span'); ld.className = 'lb-loading'; ld.textContent = 'Memuat';
        s.appendChild(ld);
        img.onload = () => ld.remove(); img.onerror = () => { ld.textContent = 'Berkas tidak dapat dimuat'; };
        img.src = fullURL(m); s.appendChild(img);
      }
      return s;
    }
    function caption(m) {
      title.textContent = m.title || 'Tanpa judul';
      desc.textContent = m.desc || ''; desc.hidden = !m.desc;
      meta.innerHTML = `<em>${esc(catName(m.category))}</em>${m.date ? '<br>' + fmtDate(m.date) : ''}<br>${m.type === 'video' ? 'Video' : 'Foto'}`;
      cnt.innerHTML = `<b>${String(idx + 1).padStart(2, '0')}</b> / ${String(items.length).padStart(2, '0')}`;
      const multi = items.length > 1; $('#lbPrev', el).hidden = $('#lbNext', el).hidden = !multi;
    }
    function preload(i) { const m = items[(i + items.length) % items.length]; if (m && m.type === 'image') { const p = new Image(); p.src = fullURL(m); } }
    function show(i, dir = 0) {
      idx = (i + items.length) % items.length; const m = items[idx];
      const next = build(m), old = slide; slide = next;
      stage.insertBefore(next, stage.firstChild);
      caption(m);
      if (old) { const v = $('video', old); if (v) v.pause(); }
      if (G && !RM && dir) {
        G.fromTo(next, { xPercent: dir * 14, opacity: 0, scale: .94, filter: 'blur(14px)' }, { xPercent: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: .85, ease: 'expo.out' });
        if (old) G.to(old, { xPercent: -dir * 14, opacity: 0, scale: .94, filter: 'blur(14px)', duration: .55, ease: 'power3.in', onComplete: () => old.remove() });
        G.fromTo([title, desc, meta], { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'expo.out', stagger: .05 });
      } else if (old) old.remove();
      if (m.type === 'video' && isOpen && dir) { const v = $('video', next); v && v.play().catch(() => { }); }
      preload(idx + 1); preload(idx - 1);
    }
    function open(list, i, origin) {
      if (!list.length) return;
      items = list; lastFocus = document.activeElement; isOpen = true;
      el.classList.add('open'); document.body.classList.add('locked', 'inv-modal'); const l = LN(); l && l.stop(); cur('');
      $$('.lb-slide', stage).forEach(s => s.remove()); slide = null;
      show(i, 0);
      const r = origin ? origin.getBoundingClientRect() : null, W = innerWidth, H = innerHeight;
      const x = Math.min(W, Math.max(0, r ? r.left + r.width / 2 : W / 2)), y = Math.min(H, Math.max(0, r ? r.top + r.height / 2 : H / 2));
      const R = Math.ceil(Math.hypot(Math.max(x, W - x), Math.max(y, H - y))) + 20;
      if (G) {
        G.fromTo(el, { clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${R}px at ${x}px ${y}px)`, duration: RM ? .01 : 1, ease: 'expo.inOut', onComplete: () => { el.style.clipPath = 'none'; } });
        if (!RM) { G.fromTo(slide, { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.3, ease: 'expo.out', delay: .2 }); G.fromTo([title, desc, meta], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'expo.out', stagger: .07, delay: .45 }); }
      } else el.style.clipPath = 'none';
      $('#lbClose', el).focus({ preventScroll: true });
    }
    function close() {
      if (!isOpen) return; isOpen = false;
      $$('video', stage).forEach(v => v.pause());
      const done = () => {
        el.classList.remove('open'); $$('.lb-slide', stage).forEach(s => s.remove()); slide = null;
        if (!$('.adm.open')) { document.body.classList.remove('locked', 'inv-modal'); const l = LN(); l && l.start(); }
        lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
      };
      const W = innerWidth, H = innerHeight, R = Math.ceil(Math.hypot(W, H) / 2) + 20;
      if (G) G.fromTo(el, { clipPath: `circle(${R}px at ${W / 2}px ${H / 2}px)` }, { clipPath: `circle(0px at ${W / 2}px ${H / 2}px)`, duration: RM ? .01 : .8, ease: 'expo.inOut', onComplete: done }); else done();
    }
    $('#lbClose', el).onclick = close;
    $('#lbPrev', el).onclick = () => show(idx - 1, -1);
    $('#lbNext', el).onclick = () => show(idx + 1, 1);
    addEventListener('keydown', e => {
      if (!isOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowRight' && items.length > 1) show(idx + 1, 1);
      else if (e.key === 'ArrowLeft' && items.length > 1) show(idx - 1, -1);
      else if (e.key === 'Tab') { // fokus tetap di dalam dialog
        const f = $$('button:not([hidden]), video[controls]', el); if (!f.length) return;
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    }, true);
    // geser di layar sentuh
    let sx = 0, sy = 0, sw = false;
    stage.addEventListener('pointerdown', e => { if (e.target.closest('button, video')) return; sx = e.clientX; sy = e.clientY; sw = true; });
    stage.addEventListener('pointerup', e => {
      if (!sw) return; sw = false; const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) && items.length > 1) show(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
    stage.addEventListener('pointercancel', () => { sw = false; });
    return { open, close, get isOpen() { return isOpen; } };
  })();

  /* =========================================================
     AUTENTIKASI ADMIN (gerbang sisi klien — lihat ADMIN.md)
     ========================================================= */
  const DEFAULT_HASH = 'da577dfaf8c09e90a0d593c61887bc0643f6fa075f3080f3fa7b0f0db4c1d925';
  const SALT = 'invictus|';
  const SESSION_KEY = 'inv-admin-session', SESSION_MS = 2 * 60 * 60 * 1000;
  async function sha256(str) {
    const bytes = new TextEncoder().encode(str);
    if (window.crypto && crypto.subtle) {
      try { const h = await crypto.subtle.digest('SHA-256', bytes); return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join(''); } catch (e) { }
    }
    return sha256Fallback(bytes);
  }
  /* SHA-256 murni untuk konteks tanpa crypto.subtle (mis. sebagian browser di file://) */
  function sha256Fallback(bytes) {
    const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
    const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const l = bytes.length, n = ((l + 9 + 63) >> 6) << 6, m = new Uint8Array(n); m.set(bytes); m[l] = 0x80;
    const dv = new DataView(m.buffer); dv.setUint32(n - 4, l * 8); dv.setUint32(n - 8, Math.floor(l / 0x20000000));
    const w = new Uint32Array(64), r = (x, k) => (x >>> k) | (x << (32 - k));
    for (let o = 0; o < n; o += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(o + i * 4);
      for (let i = 16; i < 64; i++) { const s0 = r(w[i - 15], 7) ^ r(w[i - 15], 18) ^ (w[i - 15] >>> 3), s1 = r(w[i - 2], 17) ^ r(w[i - 2], 19) ^ (w[i - 2] >>> 10); w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0; }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0, t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0; H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    return H.map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
  }
  const Auth = (() => {
    let authed = false, fails = 0, lockUntil = 0;
    try { const s = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); if (s && s.exp > Date.now()) authed = true; } catch (e) { }
    const currentHash = async () => (await Store.get('authHash').catch(() => null)) || DEFAULT_HASH;
    return {
      get ok() { return authed; },
      get locked() { return Math.max(0, lockUntil - Date.now()); },
      async login(pw) {
        if (Date.now() < lockUntil) return false;
        const good = (await sha256(SALT + pw)) === (await currentHash());
        if (good) { authed = true; fails = 0; try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ exp: Date.now() + SESSION_MS })); } catch (e) { } }
        else if (++fails >= 5) { lockUntil = Date.now() + 30000; fails = 0; }
        return good;
      },
      async change(oldPw, newPw) {
        if ((await sha256(SALT + oldPw)) !== (await currentHash())) return false;
        await Store.set('authHash', await sha256(SALT + newPw)); return true;
      },
      async isDefault() { return (await currentHash()) === DEFAULT_HASH; },
      logout() { authed = false; try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { } }
    };
  })();

  /* =========================================================
     PEMROSESAN BERKAS
     ========================================================= */
  const MAX_VIDEO = 300 * 1024 * 1024;
  function toBlob(src, sw, sh, max, q) {
    const k = Math.min(1, max / Math.max(sw, sh)), c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(sw * k)); c.height = Math.max(1, Math.round(sh * k));
    const g = c.getContext('2d'); g.fillStyle = '#0c0a14'; g.fillRect(0, 0, c.width, c.height); g.drawImage(src, 0, 0, c.width, c.height);
    return new Promise((res, rej) => c.toBlob(b => b ? res(b) : rej(new Error('Gagal mengompres gambar')), 'image/jpeg', q));
  }
  function loadImgEl(url) { return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Format gambar tidak didukung browser ini')); i.src = url; }); }
  async function processImage(file) {
    let src, url;
    try { src = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch (e) { url = URL.createObjectURL(file); src = await loadImgEl(url).finally(() => { }); }
    const w = src.width || src.naturalWidth, h = src.height || src.naturalHeight;
    if (!w || !h) throw new Error('Gambar kosong atau rusak');
    const keepOriginal = /gif|svg/.test(file.type) || (Math.max(w, h) <= 2400 && file.size <= 3.5e6);
    const blob = keepOriginal ? file : await toBlob(src, w, h, 2400, .88);
    const thumb = await toBlob(src, w, h, 960, .82);
    if (src.close) src.close(); if (url) URL.revokeObjectURL(url);
    const k = keepOriginal ? 1 : Math.min(1, 2400 / Math.max(w, h));
    return { blob, thumb, w: Math.round(w * k), h: Math.round(h * k) };
  }
  async function processVideo(file) {
    if (file.size > MAX_VIDEO) throw new Error('Video lebih dari 300 MB. Potong atau kompres dulu.');
    const url = URL.createObjectURL(file), v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = url;
    try {
      await new Promise((res, rej) => { v.onloadedmetadata = res; v.onerror = () => rej(new Error('Format video tidak didukung browser ini')); setTimeout(() => rej(new Error('Video terlalu lama dimuat')), 20000); });
      const w = v.videoWidth || 1600, h = v.videoHeight || 900, dur = isFinite(v.duration) ? v.duration : 0;
      let thumb = null;
      try {
        v.currentTime = Math.min(1, dur / 3 || 0);
        await new Promise(res => { v.onseeked = res; setTimeout(res, 5000); });
        if (v.readyState >= 2) thumb = await toBlob(v, w, h, 960, .8);
      } catch (e) { thumb = null; }
      return { blob: file, thumb, w, h, dur };
    } finally { URL.revokeObjectURL(url); }
  }
  const blobToDataURL = b => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(r.error); r.readAsDataURL(b); });
  const fmtBytes = n => n > 1e9 ? (n / 1e9).toFixed(2) + ' GB' : n > 1e6 ? (n / 1e6).toFixed(1) + ' MB' : Math.round(n / 1e3) + ' KB';

  /* =========================================================
     PANEL ADMIN
     ========================================================= */
  const Admin = (() => {
    const el = document.createElement('div');
    el.className = 'adm'; el.id = 'admin'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Panel admin INVICTUS');
    el.setAttribute('data-lenis-prevent', '');
    document.body.appendChild(el);
    const toastEl = document.createElement('div'); toastEl.className = 'adm-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl);
    let tab = 'jadwal', draft = null, dirty = false, dk = 'A', isOpen = false, lastFocus = null, toastT = 0;

    function toast(msg, bad) { toastEl.textContent = msg; toastEl.classList.toggle('bad', !!bad); toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 2600); }

    function open() {
      if (isOpen) { render(); return; }
      isOpen = true; lastFocus = document.activeElement;
      el.classList.add('open'); document.body.classList.add('locked', 'inv-modal'); const l = LN(); l && l.stop(); cur('');
      render();
      if (G && !RM) G.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .8, ease: 'expo.inOut', clearProps: 'clipPath' });
    }
    function close() {
      if (!isOpen) return;
      if (dirty && !confirm('Ada perubahan jadwal yang belum disimpan. Tutup dan buang perubahan?')) return;
      isOpen = false; dirty = false; draft = null;
      const done = () => {
        el.classList.remove('open'); el.innerHTML = '';
        document.body.classList.remove('locked', 'inv-modal'); const l = LN(); l && l.start();
        if (location.hash === '#admin') history.replaceState(null, '', location.pathname + location.search);
        lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
        refreshST();
      };
      if (G && !RM) G.to(el, { clipPath: 'inset(100% 0 0 0)', duration: .6, ease: 'expo.inOut', onComplete: () => { done(); G.set(el, { clearProps: 'clipPath' }); } }); else done();
    }
    addEventListener('keydown', e => { if (isOpen && e.key === 'Escape' && !Lightbox.isOpen) close(); });

    function render() { if (!Auth.ok) renderLogin(); else renderPanel(); }

    /* ---------- login ---------- */
    function renderLogin() {
      el.innerHTML = `<div class="adm-login"><form id="admLogin" autocomplete="on">
        <p class="pk-t-kicker">INVICTUS · Generasi 03</p>
        <h2>Masuk admin.</h2>
        <p>Area ini untuk pengurus kelas yang mengelola jadwal piket dan galeri. Kontrol penyuntingan hanya muncul setelah masuk.</p>
        <input type="text" name="username" value="admin" autocomplete="username" hidden>
        <label>Kata sandi<input type="password" name="pw" required autocomplete="current-password" autofocus></label>
        <p class="adm-err" id="admErr" role="alert"></p>
        <div class="adm-row"><button class="adm-b pri" type="submit">Masuk</button><button class="adm-b" type="button" data-act="close">Kembali ke situs</button></div>
      </form></div>`;
      const f = $('#admLogin', el), err = $('#admErr', el);
      setTimeout(() => f.pw.focus(), 50);
      f.addEventListener('submit', async e => {
        e.preventDefault();
        if (Auth.locked) { err.textContent = `Terlalu banyak percobaan. Tunggu ${Math.ceil(Auth.locked / 1000)} detik.`; return; }
        const ok = await Auth.login(f.pw.value);
        if (ok) { toast('Berhasil masuk'); renderPanel(); }
        else { err.textContent = Auth.locked ? 'Terlalu banyak percobaan. Tunggu 30 detik.' : 'Kata sandi salah.'; f.pw.select(); }
      });
      $('[data-act="close"]', el).onclick = close;
    }

    /* ---------- kerangka panel ---------- */
    function renderPanel() {
      const tabs = [['jadwal', 'Jadwal piket'], ['galeri', 'Galeri'], ['setelan', 'Data & keamanan']];
      el.innerHTML = `<div class="adm-bar">
          <div class="adm-brand">Panel admin<small>Sumber jadwal: ${Data.src.schedule} · galeri: ${Data.src.gallery}</small></div>
          <div class="adm-tabs" role="tablist">${tabs.map(([id, n]) => `<button class="adm-b" role="tab" data-tab="${id}" aria-selected="${tab === id}">${n}</button>`).join('')}</div>
          <div class="adm-row"><button class="adm-b" data-act="logout">Keluar</button><button class="adm-b" data-act="close">Tutup</button></div>
        </div><div class="adm-body" id="admBody"></div>`;
      $$('[data-tab]', el).forEach(b => b.onclick = () => {
        if (b.dataset.tab === tab) return;
        if (dirty && !confirm('Perubahan jadwal belum disimpan. Pindah tab dan buang perubahan?')) return;
        dirty = false; draft = null; tab = b.dataset.tab; renderPanel();
      });
      $('[data-act="close"]', el).onclick = close;
      $('[data-act="logout"]', el).onclick = () => {
        if (dirty && !confirm('Perubahan jadwal belum disimpan. Keluar dan buang perubahan?')) return;
        dirty = false; draft = null; Auth.logout(); toast('Sudah keluar'); renderLogin();
      };
      const body = $('#admBody', el);
      if (tab === 'jadwal') renderJadwal(body); else if (tab === 'galeri') renderGaleri(body); else renderSetelan(body);
    }

    /* ---------- JADWAL ---------- */
    function renderJadwal(body) {
      if (!draft) { draft = normalizeSchedule(clone(Data.schedule)); dirty = false; }
      const S = draft, C = S.classes[dk], dates = weekDates(), tKey = ymd(today());
      const assignedDays = name => Object.entries(C.days).filter(([, l]) => l.some(a => a.name === name)).map(([d]) => HARI[d].slice(0, 3));
      body.innerHTML = `
        <div class="adm-card">
          <div class="adm-row" style="justify-content:space-between">
            <div><h3>Jadwal piket mingguan</h3><p class="adm-note">Pekan ${fmtDate(ymd(dates[0]), true)} – ${fmtDate(ymd(dates[5]), true)}. Tandai petugas yang sudah selesai, ubah tugas, atau pindahkan ke hari lain.${S.seeded ? ' Jadwal ini masih rotasi awal otomatis dari daftar anggota.' : ''}</p></div>
            <div class="adm-row" role="tablist">${['A', 'B'].map(x => `<button class="adm-b" role="tab" data-k="${x}" aria-selected="${dk === x}">${kn(x)}</button>`).join('')}</div>
          </div>
          <div class="adm-week">${dates.map((date, i) => {
        const d = i + 1, key = ymd(date), list = C.days[d], done = ((S.done[key] || {})[dk]) || [], future = key > tKey;
        const free = C.roster.filter(n => !list.some(a => a.name === n));
        return `<section class="adm-day${key === tKey ? ' is-today' : ''}" aria-label="${HARI[d]}">
              <h4>${HARI[d]}<small>${fmtDate(key, true)}${key === tKey ? ' · hari ini' : ''}</small></h4>
              ${list.map((a, ai) => `<div class="adm-as">
                <div class="adm-as-top"><b>${esc(a.name)}</b>
                  <select data-act="move" data-d="${d}" data-ai="${ai}" aria-label="Pindahkan ${esc(a.name)} ke hari lain">${[1, 2, 3, 4, 5, 6].map(x => `<option value="${x}"${x === d ? ' selected' : ''}>${HARI[x]}</option>`).join('')}</select>
                  <button class="adm-x" data-act="rm" data-d="${d}" data-ai="${ai}" aria-label="Hapus ${esc(a.name)} dari ${HARI[d]}">×</button></div>
                <div class="adm-tasks">${S.tasks.map(t => `<label class="adm-tog"><input type="checkbox" data-act="task" data-d="${d}" data-ai="${ai}" value="${esc(t.id)}"${a.tasks.includes(t.id) ? ' checked' : ''}>${esc(t.name)}</label>`).join('')}</div>
                <div class="adm-tasks"><label class="adm-tog done" title="${future ? 'Belum bisa ditandai, harinya belum tiba' : ''}"><input type="checkbox" data-act="done" data-key="${key}" data-name="${esc(a.name)}"${done.includes(a.name) ? ' checked' : ''}${future ? ' disabled' : ''}>Sudah selesai</label></div>
              </div>`).join('') || '<p class="adm-note">Belum ada petugas.</p>'}
              <select data-act="add" data-d="${d}" aria-label="Tambah petugas ${HARI[d]}"><option value="">+ Tambah petugas</option>${free.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('')}</select>
            </section>`;
      }).join('')}</div>
        </div>
        <div class="adm-grid2" style="margin-top:16px">
          <div class="adm-card" style="margin:0">
            <h3>Anggota ${kn(dk)}</h3><p>Menghapus anggota juga mengeluarkannya dari semua hari piket.</p>
            <div class="adm-chips">${C.roster.map((n, i) => `<span class="adm-chip">${esc(n)}<small style="color:var(--haze)">${assignedDays(n).join(', ') || 'belum dijadwalkan'}</small><button class="adm-x" data-act="rmRoster" data-i="${i}" aria-label="Hapus ${esc(n)}">×</button></span>`).join('')}</div>
            <form class="adm-row" data-act="addRoster" style="margin-top:14px"><input name="n" placeholder="Nama anggota baru" maxlength="60" required><button class="adm-b" type="submit">Tambah</button></form>
          </div>
          <div class="adm-card" style="margin:0">
            <h3>Tugas kebersihan</h3><p>Berlaku untuk kedua kelas. Mengubah nama tidak mengubah siapa yang memegangnya.</p>
            <div style="display:grid;gap:8px;margin-top:12px">${S.tasks.map((t, i) => `<div class="adm-row"><input value="${esc(t.name)}" data-act="renameTask" data-i="${i}" maxlength="60" aria-label="Nama tugas ${i + 1}"><button class="adm-x" data-act="rmTask" data-i="${i}" aria-label="Hapus tugas ${esc(t.name)}">×</button></div>`).join('')}</div>
            <form class="adm-row" data-act="addTask" style="margin-top:12px"><input name="n" placeholder="Tugas baru, mis. Menyiram tanaman" maxlength="60" required><button class="adm-b" type="submit">Tambah</button></form>
          </div>
        </div>
        <div class="adm-save${dirty ? ' dirty' : ''}"><span class="adm-note">${dirty ? 'Ada perubahan yang belum disimpan.' : 'Semua perubahan sudah tersimpan.'}</span>
          <div class="adm-row"><button class="adm-b" data-act="revert"${dirty ? '' : ' disabled'}>Batalkan</button><button class="adm-b pri" data-act="save"${dirty ? '' : ' disabled'}>Simpan jadwal</button></div></div>`;

      const touch = (rerender = true) => { dirty = true; if (rerender) { const y = el.scrollTop; renderJadwal(body); el.scrollTop = y; } else markDirty(); };
      const markDirty = () => { const s = $('.adm-save', body); s.classList.add('dirty'); $('.adm-note', s).textContent = 'Ada perubahan yang belum disimpan.'; $$('button', s).forEach(b => b.disabled = false); };
      $$('[data-k]', body).forEach(b => b.onclick = () => { dk = b.dataset.k; const y = el.scrollTop; renderJadwal(body); el.scrollTop = y; });
      body.onchange = e => {
        const t = e.target, act = t.dataset.act, d = +t.dataset.d, ai = +t.dataset.ai;
        if (act === 'task') { const a = C.days[d][ai]; a.tasks = t.checked ? [...new Set([...a.tasks, t.value])] : a.tasks.filter(x => x !== t.value); a.tasks.sort((x, y) => S.tasks.findIndex(q => q.id === x) - S.tasks.findIndex(q => q.id === y)); touch(false); }
        else if (act === 'done') {
          const key = t.dataset.key, name = t.dataset.name; S.done[key] = S.done[key] || { A: [], B: [] };
          const arr = new Set(S.done[key][dk]); t.checked ? arr.add(name) : arr.delete(name); S.done[key][dk] = [...arr]; touch(false);
        }
        else if (act === 'move') {
          const to = +t.value, a = C.days[d][ai]; if (to === d) return;
          if (C.days[to].some(x => x.name === a.name)) { toast(`${a.name} sudah piket di hari ${HARI[to]}`, true); t.value = d; return; }
          C.days[d].splice(ai, 1); C.days[to].push(a); touch();
        }
        else if (act === 'add' && t.value) { C.days[d].push({ name: t.value, tasks: [] }); touch(); }
        else if (act === 'renameTask') { const v = t.value.trim(); if (!v) { t.value = S.tasks[+t.dataset.i].name; return; } S.tasks[+t.dataset.i].name = v; touch(false); }
      };
      body.onclick = e => {
        const b = e.target.closest('button[data-act]'); if (!b) return; const act = b.dataset.act;
        if (act === 'rm') { C.days[+b.dataset.d].splice(+b.dataset.ai, 1); touch(); }
        else if (act === 'rmRoster') {
          const n = C.roster[+b.dataset.i]; if (!confirm(`Hapus ${n} dari daftar piket ${kn(dk)}?`)) return;
          C.roster.splice(+b.dataset.i, 1); Object.values(C.days).forEach(l => { const i = l.findIndex(a => a.name === n); if (i >= 0) l.splice(i, 1); }); touch();
        }
        else if (act === 'rmTask') {
          const t = S.tasks[+b.dataset.i]; if (S.tasks.length <= 1) { toast('Minimal harus ada satu tugas', true); return; }
          if (!confirm(`Hapus tugas "${t.name}" dari semua jadwal?`)) return;
          S.tasks.splice(+b.dataset.i, 1); ['A', 'B'].forEach(x => Object.values(S.classes[x].days).forEach(l => l.forEach(a => a.tasks = a.tasks.filter(id => id !== t.id)))); touch();
        }
        else if (act === 'revert') { draft = null; dirty = false; renderJadwal(body); toast('Perubahan dibatalkan'); }
        else if (act === 'save') {
          b.disabled = true;
          saveSchedule(clone(S)).then(() => { dirty = false; draft = null; renderJadwal(body); toast('Jadwal tersimpan'); updateBrand(); })
            .catch(err => { b.disabled = false; toast('Gagal menyimpan: ' + err.message, true); });
        }
      };
      body.onsubmit = e => {
        e.preventDefault(); const f = e.target, v = f.n.value.trim().replace(/\s+/g, ' '); if (!v) return;
        if (f.dataset.act === 'addRoster') {
          if (C.roster.some(n => n.toLowerCase() === v.toLowerCase())) { toast(`${v} sudah ada di ${kn(dk)}`, true); return; }
          C.roster.push(v); touch();
        } else if (f.dataset.act === 'addTask') {
          if (S.tasks.some(t => t.name.toLowerCase() === v.toLowerCase())) { toast('Tugas itu sudah ada', true); return; }
          S.tasks.push({ id: 't-' + uid(), name: v }); touch();
        }
      };
    }
    function updateBrand() { const s = $('.adm-brand small', el); if (s) s.textContent = `Sumber jadwal: ${Data.src.schedule} · galeri: ${Data.src.gallery}`; }

    /* ---------- GALERI ---------- */
    let upDefaults = { category: 'kegiatan', date: ymd(today()) };
    function catOptions(sel) { return CATS.filter(c => c.id !== 'all').map(c => `<option value="${c.id}"${c.id === sel ? ' selected' : ''}>${esc(c.name)}</option>`).join(''); }
    function renderGaleri(body) {
      updateBrand();
      const media = [...Data.media].sort((a, b) => a.order - b.order);
      body.innerHTML = `
        <div class="adm-card">
          <h3>Unggah foto dan video</h3>
          <p>Gunakan hanya foto dan video asli Generasi 03. Foto besar otomatis dikecilkan ke 2400 px. Video maksimal 300 MB (MP4/WebM paling aman).</p>
          <div class="adm-grid2" style="margin-top:14px">
            <label>Kategori awal<select id="upCat">${catOptions(upDefaults.category)}</select></label>
            <label>Tanggal acara<input type="date" id="upDate" value="${upDefaults.date}"></label>
          </div>
          <label class="adm-drop" id="upDrop" style="margin-top:14px">
            <b>Seret berkas ke sini</b><span class="adm-note">atau klik untuk memilih foto/video dari perangkat</span>
            <input type="file" id="upFile" accept="image/*,video/*" multiple class="sr-only">
          </label>
          <div class="adm-progress" id="upProg" hidden><i></i></div><p class="adm-note" id="upMsg" aria-live="polite"></p>
        </div>
        <div class="adm-card">
          <h3>Tambah dari folder proyek</h3>
          <p>Untuk berkas yang sudah ada di repositori, mis. <code>galeri/pentas-seni.jpg</code>. Cara ini paling cocok untuk konten yang akan diterbitkan ke semua pengunjung.</p>
          <form class="adm-row" id="pathForm" style="margin-top:12px">
            <input name="p" placeholder="galeri/nama-berkas.jpg" required pattern="[^<>\\s].*" aria-label="Jalur berkas">
            <select name="t" style="flex:0 0 120px" aria-label="Jenis"><option value="image">Foto</option><option value="video">Video</option></select>
            <button class="adm-b" type="submit">Tambahkan</button>
          </form>
        </div>
        <div class="adm-card">
          <div class="adm-row" style="justify-content:space-between"><div><h3>Kelola media</h3><p class="adm-note">${media.length} berkas. Perubahan judul, keterangan, tanggal, dan kategori tersimpan otomatis.</p></div></div>
          <div class="adm-media" id="admMedia">${media.length ? media.map(mediaCard).join('') : '<p class="adm-note">Belum ada media.</p>'}</div>
        </div>`;

      $('#upCat', body).onchange = e => upDefaults.category = e.target.value;
      $('#upDate', body).onchange = e => upDefaults.date = e.target.value;
      const drop = $('#upDrop', body), input = $('#upFile', body);
      input.onchange = () => { upload([...input.files], body); input.value = ''; };
      ['dragenter', 'dragover'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('over'); }));
      ['dragleave', 'drop'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove('over'); }));
      drop.addEventListener('drop', e => upload([...e.dataTransfer.files], body));
      $('#pathForm', body).onsubmit = async e => {
        e.preventDefault(); const f = e.target, p = f.p.value.trim();
        if (/^(javascript|data:text)/i.test(p)) { toast('Jalur tidak valid', true); return; }
        await ensureLocalGallery();
        const m = normalizeMedia({ id: uid(), type: f.t.value, src: p, title: p.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '), category: upDefaults.category, date: upDefaults.date, order: minOrder() - 1 });
        await Store.putMedia(m); Data.media.unshift(m); publicRefresh(); renderGaleri(body); toast('Media ditambahkan');
      };

      const list = $('#admMedia', body);
      const saveT = new Map();
      const onEdit = e => {
        const t = e.target, card = t.closest('.adm-m'); if (!card || !t.name) return;
        const m = Data.media.find(x => x.id === card.dataset.id); if (!m) return;
        m[t.name] = t.name === 'date' ? (t.value || '') : t.value;
        clearTimeout(saveT.get(m.id));
        saveT.set(m.id, setTimeout(async () => {
          try { await ensureLocalGallery(); await Store.putMedia(m); publicRefresh(); if (e.type === 'change') toast('Tersimpan'); } catch (err) { toast('Gagal menyimpan: ' + err.message, true); }
        }, e.type === 'change' ? 0 : 500));
      };
      list.addEventListener('input', onEdit); list.addEventListener('change', onEdit);
      list.addEventListener('click', async e => {
        const b = e.target.closest('button[data-act]'); if (!b) return;
        const card = b.closest('.adm-m'), id = card.dataset.id, sorted = [...Data.media].sort((a, c) => a.order - c.order), i = sorted.findIndex(x => x.id === id), m = sorted[i];
        if (b.dataset.act === 'del') {
          if (!confirm(`Hapus "${m.title || 'media ini'}" dari galeri? Tindakan ini tidak bisa dibatalkan.`)) return;
          await ensureLocalGallery(); await Store.delMedia(id); dropURLs(id);
          Data.media = Data.media.filter(x => x.id !== id); publicRefresh(); renderGaleri(body); toast('Media dihapus');
        } else if (b.dataset.act === 'up' || b.dataset.act === 'down') {
          const j = i + (b.dataset.act === 'up' ? -1 : 1); if (j < 0 || j >= sorted.length) return;
          [sorted[i], sorted[j]] = [sorted[j], sorted[i]]; sorted.forEach((x, k) => x.order = k);
          await ensureLocalGallery(); for (const x of sorted) await Store.putMedia(x);
          Data.media = sorted; publicRefresh(); const y = el.scrollTop; renderGaleri(body); el.scrollTop = y;
        }
      });
    }
    const minOrder = () => Data.media.reduce((a, m) => Math.min(a, m.order), 0);
    function mediaCard(m) {
      const t = thumbURL(m);
      return `<article class="adm-m" data-id="${esc(m.id)}">
        <div class="adm-m-thumb">${t ? `<img src="${esc(t)}" alt="" loading="lazy">` : (m.type === 'video' ? `<video src="${esc(fullURL(m))}#t=0.5" muted preload="metadata"></video>` : '')}<span>${m.type === 'video' ? 'Video' : 'Foto'}${m.blob ? ' · ' + fmtBytes(m.blob.size) : ' · ' + esc(m.src.startsWith('data:') ? 'tersemat' : m.src)}</span></div>
        <div class="adm-m-body">
          <label>Judul<input name="title" value="${esc(m.title)}" maxlength="90"></label>
          <label>Keterangan<textarea name="desc" maxlength="400">${esc(m.desc)}</textarea></label>
          <div class="adm-grid2" style="gap:10px"><label>Tanggal acara<input type="date" name="date" value="${esc(m.date)}"></label><label>Kategori<select name="category">${catOptions(m.category)}</select></label></div>
          <div class="adm-m-foot"><div class="adm-row"><button class="adm-b" data-act="up" aria-label="Geser ke depan">↑</button><button class="adm-b" data-act="down" aria-label="Geser ke belakang">↓</button></div><button class="adm-b warn" data-act="del">Hapus</button></div>
        </div></article>`;
    }
    async function upload(files, body) {
      files = files.filter(f => /^(image|video)\//.test(f.type));
      if (!files.length) { toast('Pilih berkas foto atau video', true); return; }
      const prog = $('#upProg', body), bar = $('i', prog), msg = $('#upMsg', body);
      prog.hidden = false; bar.style.width = '0%';
      try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { }
      await ensureLocalGallery();
      let ok = 0; const errs = [], base = minOrder() - files.length - 1;
      for (let i = 0; i < files.length; i++) {
        const f = files[i]; msg.textContent = `Memproses ${i + 1}/${files.length}: ${f.name}`;
        try {
          const isVid = f.type.startsWith('video/'), r = isVid ? await processVideo(f) : await processImage(f);
          const m = normalizeMedia({ id: uid(), type: isVid ? 'video' : 'image', ...r, title: f.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim(), category: upDefaults.category, date: upDefaults.date, order: base + i });
          await Store.putMedia(m); Data.media.push(m); ok++;
        } catch (err) { errs.push(`${f.name}: ${err.message || 'gagal'}`); }
        bar.style.width = ((i + 1) / files.length * 100) + '%';
      }
      Data.media.sort((a, b) => a.order - b.order);
      publicRefresh(); renderGaleri(body);
      const m2 = $('#upMsg', body); if (m2) m2.textContent = errs.length ? `Gagal: ${errs.join(' · ')}` : '';
      toast(ok ? `${ok} berkas ditambahkan${errs.length ? `, ${errs.length} gagal` : ''}` : 'Tidak ada berkas yang berhasil', !ok);
    }

    /* ---------- DATA & KEAMANAN ---------- */
    async function renderSetelan(body) {
      let est = null; try { est = navigator.storage && navigator.storage.estimate ? await navigator.storage.estimate() : null; } catch (e) { }
      const isDef = await Auth.isDefault();
      body.innerHTML = `
        <div class="adm-grid2">
          <div class="adm-card" style="margin:0">
            <h3>Ganti kata sandi</h3>
            <p>${isDef ? '<b style="color:#ff8c78">Masih memakai kata sandi bawaan.</b> Segera ganti.' : 'Kata sandi khusus aktif di browser ini.'} Kata sandi baru hanya berlaku di browser ini.</p>
            <form id="pwForm" style="display:grid;gap:10px;margin-top:12px">
              <input type="text" name="username" value="admin" autocomplete="username" hidden>
              <label>Kata sandi sekarang<input type="password" name="o" required autocomplete="current-password"></label>
              <label>Kata sandi baru (min. 10 karakter)<input type="password" name="n" required minlength="10" autocomplete="new-password"></label>
              <label>Ulangi kata sandi baru<input type="password" name="c" required minlength="10" autocomplete="new-password"></label>
              <button class="adm-b pri" type="submit" style="justify-self:start">Simpan kata sandi</button>
            </form>
          </div>
          <div class="adm-card" style="margin:0">
            <h3>Cadangan dan penerbitan</h3>
            <p>Ekspor menghasilkan <code>konten.json</code> berisi jadwal dan galeri (foto/video unggahan ikut tersemat). Taruh di folder <code>data/</code> situs agar semua pengunjung melihatnya.</p>
            <dl class="adm-kv"><dt>Jadwal</dt><dd>${Data.src.schedule}</dd><dt>Galeri</dt><dd>${Data.src.gallery} · ${Data.media.length} media</dd>
            <dt>Penyimpanan</dt><dd>${Store.persistent ? 'IndexedDB' : 'memori sementara (hilang saat halaman ditutup)'}${est ? ` · terpakai ${fmtBytes(est.usage || 0)} dari ${fmtBytes(est.quota || 0)}` : ''}</dd>
            <dt>Konten terbit</dt><dd>${Data.published ? 'data/konten.json ditemukan' : location.protocol === 'file:' ? 'tidak dibaca (halaman dibuka sebagai file lokal)' : 'belum ada data/konten.json'}</dd></dl>
            <div class="adm-row" style="margin-top:14px">
              <button class="adm-b pri" data-act="export">Ekspor konten.json</button>
              <label class="adm-b" style="display:inline-block;color:inherit;font-size:12px">Impor cadangan<input type="file" accept="application/json,.json" id="impFile" class="sr-only"></label>
              <button class="adm-b warn" data-act="reset">Hapus data lokal</button>
            </div>
            <p class="adm-note" id="expMsg" aria-live="polite" style="margin-top:10px"></p>
          </div>
        </div>
        <div class="adm-card">
          <h3>Integrasi backend yang masih dibutuhkan</h3>
          <p>Situs ini statis, jadi panel admin menyimpan perubahan di browser perangkat yang dipakai admin. Agar perubahan langsung tampil untuk semua pengunjung, perlu:</p>
          <ol class="adm-list">
            <li><b>Database bersama</b> untuk jadwal, status selesai, dan data galeri (mis. Supabase, Firebase, atau API sendiri). Ganti fungsi <code>Store</code> dan <code>loadAll()</code> di <code>assets/fitur.js</code>.</li>
            <li><b>Penyimpanan berkas</b> (object storage) untuk foto dan video, karena IndexedDB hanya ada di satu browser.</li>
            <li><b>Autentikasi di server</b>. Gerbang kata sandi saat ini berjalan di browser, cukup untuk menyembunyikan kontrol dari pengunjung biasa, tetapi bisa dilewati orang yang paham teknis.</li>
            <li><b>Aturan izin tulis</b> di server, sehingga hanya akun admin yang boleh mengubah data.</li>
          </ol>
          <p style="margin-top:10px">Sampai itu tersedia: sunting di sini, ekspor <code>konten.json</code>, lalu unggah ke folder <code>data/</code> bersama situs.</p>
        </div>`;

      $('#pwForm', body).onsubmit = async e => {
        e.preventDefault(); const f = e.target;
        if (f.n.value !== f.c.value) { toast('Kata sandi baru tidak sama', true); return; }
        if (await Auth.change(f.o.value, f.n.value)) { f.reset(); toast('Kata sandi diganti'); renderSetelan(body); } else toast('Kata sandi sekarang salah', true);
      };
      $('[data-act="export"]', body).onclick = async e => {
        const b = e.target, msg = $('#expMsg', body); b.disabled = true; msg.textContent = 'Menyiapkan berkas…';
        try {
          const gallery = [];
          for (const m of [...Data.media].sort((a, c) => a.order - c.order)) {
            gallery.push({
              id: m.id, type: m.type, title: m.title, desc: m.desc, date: m.date, category: m.category, w: m.w, h: m.h, dur: m.dur, order: m.order, added: m.added,
              src: m.blob ? await blobToDataURL(m.blob) : m.src, poster: m.thumb ? await blobToDataURL(m.thumb) : m.poster
            });
          }
          const out = { format: 'invictus-g3-konten', version: 1, exportedAt: new Date().toISOString(), schedule: Data.schedule, gallery };
          const blob = new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' }), a = document.createElement('a');
          a.href = URL.createObjectURL(blob); a.download = 'konten.json'; document.body.appendChild(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(a.href), 4000);
          msg.textContent = `konten.json diunduh (${fmtBytes(blob.size)}).`;
        } catch (err) { msg.textContent = 'Gagal mengekspor: ' + err.message; }
        b.disabled = false;
      };
      $('#impFile', body).onchange = async e => {
        const file = e.target.files[0]; e.target.value = ''; if (!file) return;
        try {
          const j = JSON.parse(await file.text());
          if (!j || (!j.schedule && !Array.isArray(j.gallery))) throw new Error('Bukan berkas konten INVICTUS');
          if (!confirm('Impor akan MENGGANTI jadwal dan galeri lokal dengan isi berkas ini. Lanjutkan?')) return;
          if (j.schedule) await saveSchedule(normalizeSchedule(j.schedule));
          if (Array.isArray(j.gallery)) {
            await Store.clearMedia(); [...urlCache.keys()].forEach(k => URL.revokeObjectURL(urlCache.get(k))); urlCache.clear();
            const items = [];
            for (const [i, g] of j.gallery.entries()) {
              const raw = { ...g }; if (typeof g.src === 'string' && g.src.startsWith('data:')) { raw.blob = await (await fetch(g.src)).blob(); delete raw.src; }
              if (typeof g.poster === 'string' && g.poster.startsWith('data:')) { raw.thumb = await (await fetch(g.poster)).blob(); delete raw.poster; }
              const m = normalizeMedia(raw, i); if (m) { await Store.putMedia(m); items.push(m); }
            }
            await Store.set('galleryLocal', true); Data.galleryLocal = true; Data.src.gallery = 'lokal';
            Data.media = items.sort((a, b) => a.order - b.order);
          }
          publicRefresh(); updateBrand(); renderSetelan(body); toast('Impor selesai');
        } catch (err) { toast('Impor gagal: ' + err.message, true); }
      };
      $('[data-act="reset"]', body).onclick = async () => {
        if (!confirm('Hapus semua jadwal dan media yang tersimpan di browser ini? Situs kembali ke konten terbit. Foto/video unggahan yang belum diekspor akan hilang permanen.')) return;
        await Store.del('schedule'); await Store.del('galleryLocal'); await Store.clearMedia();
        [...urlCache.keys()].forEach(k => URL.revokeObjectURL(urlCache.get(k))); urlCache.clear();
        await loadAll(); draft = null; dirty = false; Piket.render(); publicRefresh(); updateBrand(); renderSetelan(body); toast('Data lokal dihapus');
      };
    }

    return { open, close, get isOpen() { return isOpen; } };
  })();

  let pubT = 0;
  function publicRefresh() { clearTimeout(pubT); pubT = setTimeout(() => Galeri.render(), 60); }

  /* ---------- pintu masuk admin ---------- */
  const admBtn = $('#admLink'); if (admBtn) admBtn.addEventListener('click', () => Admin.open());
  const checkHash = () => { if (location.hash === '#admin') Admin.open(); };
  addEventListener('hashchange', checkHash);

  /* ---------- mulai ---------- */
  loadAll().catch(err => console.warn('[INVICTUS] gagal memuat data', err)).finally(() => {
    Piket.render(); Galeri.render(); checkHash();
  });
})();
