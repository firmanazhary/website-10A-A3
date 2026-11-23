
'use strict';

/* ============================================================
   DATA ANGGOTA — GANTI DENGAN NAMA ASLI
   Status:
   - continuing = santri lama yang lanjut SMA di pondok
   - new        = teman baru saat SMA
   - moved      = teman yang pindah dan melanjutkan di sekolah lain
   Kelas 10A: 14 santri lama
   Kelas 10B: 4 santri lama + 8 teman baru
   ============================================================ */
const members = [
  { id: 1, name: '[Nama Santri 1]', status: 'continuing', className: '10A' },
  { id: 2, name: '[Nama Santri 2]', status: 'continuing', className: '10A' },
  { id: 3, name: '[Nama Santri 3]', status: 'continuing', className: '10A' },
  { id: 4, name: '[Nama Santri 4]', status: 'continuing', className: '10A' },
  { id: 5, name: '[Nama Santri 5]', status: 'continuing', className: '10A' },
  { id: 6, name: '[Nama Santri 6]', status: 'continuing', className: '10A' },
  { id: 7, name: '[Nama Santri 7]', status: 'continuing', className: '10A' },
  { id: 8, name: '[Nama Santri 8]', status: 'continuing', className: '10A' },
  { id: 9, name: '[Nama Santri 9]', status: 'continuing', className: '10A' },
  { id: 10, name: '[Nama Santri 10]', status: 'continuing', className: '10A' },
  { id: 11, name: '[Nama Santri 11]', status: 'continuing', className: '10A' },
  { id: 12, name: '[Nama Santri 12]', status: 'continuing', className: '10A' },
  { id: 13, name: '[Nama Santri 13]', status: 'continuing', className: '10A' },
  { id: 14, name: '[Nama Santri 14]', status: 'continuing', className: '10A' },
  { id: 15, name: '[Nama Santri 15]', status: 'continuing', className: '10B' },
  { id: 16, name: '[Nama Santri 16]', status: 'continuing', className: '10B' },
  { id: 17, name: '[Nama Santri 17]', status: 'continuing', className: '10B' },
  { id: 18, name: '[Nama Santri 18]', status: 'continuing', className: '10B' },

  { id: 19, name: '[Nama Santri 19]', status: 'moved', className: null },
  { id: 20, name: '[Nama Santri 20]', status: 'moved', className: null },
  { id: 21, name: '[Nama Santri 21]', status: 'moved', className: null },
  { id: 22, name: '[Nama Santri 22]', status: 'moved', className: null },
  { id: 23, name: '[Nama Santri 23]', status: 'moved', className: null },
  { id: 24, name: '[Nama Santri 24]', status: 'moved', className: null },
  { id: 25, name: '[Nama Santri 25]', status: 'moved', className: null },
  { id: 26, name: '[Nama Santri 26]', status: 'moved', className: null },
  { id: 27, name: '[Nama Santri 27]', status: 'moved', className: null },
  { id: 28, name: '[Nama Santri 28]', status: 'moved', className: null },
  { id: 29, name: '[Nama Santri 29]', status: 'moved', className: null },
  { id: 30, name: '[Nama Santri 30]', status: 'moved', className: null },
  { id: 31, name: '[Nama Santri 31]', status: 'moved', className: null },
  { id: 32, name: '[Nama Santri 32]', status: 'moved', className: null },
  { id: 33, name: '[Nama Santri 33]', status: 'moved', className: null },

  { id: 34, name: '[Nama Santri Baru 1]', status: 'new', className: '10B' },
  { id: 35, name: '[Nama Santri Baru 2]', status: 'new', className: '10B' },
  { id: 36, name: '[Nama Santri Baru 3]', status: 'new', className: '10B' },
  { id: 37, name: '[Nama Santri Baru 4]', status: 'new', className: '10B' },
  { id: 38, name: '[Nama Santri Baru 5]', status: 'new', className: '10B' },
  { id: 39, name: '[Nama Santri Baru 6]', status: 'new', className: '10B' },
  { id: 40, name: '[Nama Santri Baru 7]', status: 'new', className: '10B' },
  { id: 41, name: '[Nama Santri Baru 8]', status: 'new', className: '10B' }
];

/* ============================================================
   KONFIGURASI JADWAL PIKET — MUDAH DIEDIT
   Data petugas diambil dari array members di atas supaya nama
   tidak perlu ditulis ulang pada data jadwal.
   ============================================================ */
const dutyConfig = {
  days: [
    { key: 'mon', label: 'Senin' },
    { key: 'tue', label: 'Selasa' },
    { key: 'wed', label: 'Rabu' },
    { key: 'thu', label: 'Kamis' },
    { key: 'fri', label: 'Jumat' },
    { key: 'sat', label: 'Sabtu' }
  ],
  petugasPerHari: 2,
  // Senin, 5 Januari 2026 menjadi titik awal rotasi mingguan.
  rotationBaseMonday: '2026-01-05'
};

const statusInfo = {
  continuing: { label: 'Lanjut SMA', badge: 'Lanjut', badgeClass: 'bg-forest/10 text-forest' },
  new: { label: 'Teman baru saat SMA', badge: 'Baru', badgeClass: 'bg-gold/20 text-[#805D27]' },
  moved: { label: 'Melanjutkan di sekolah lain', badge: 'Pindah', badgeClass: 'bg-ink/10 text-muted' }
};

const escapeHTML = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

/* ------------------------- NAVIGASI ------------------------- */
function initNavigation() {
  const toggle = document.getElementById('menu-toggle');
  const panel = document.getElementById('menu-panel');
  const label = document.getElementById('menu-toggle-label');
  const lineOne = document.getElementById('menu-line-one');
  const lineTwo = document.getElementById('menu-line-two');
  const links = Array.from(panel.querySelectorAll('a'));

  if (!toggle || !panel) return;

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  function closeMenu({ returnFocus = false } = {}) {
    if (!isOpen()) return;
    toggle.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    label.textContent = 'Menu';
    lineOne.classList.remove('translate-y-[3px]', 'rotate-45');
    lineTwo.classList.remove('-translate-y-[3px]', '-rotate-45');
    if (returnFocus) toggle.focus();
  }

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    label.textContent = 'Tutup';
    lineOne.classList.add('translate-y-[3px]', 'rotate-45');
    lineTwo.classList.add('-translate-y-[3px]', '-rotate-45');
    links[0]?.focus();
  }

  toggle.addEventListener('click', () => {
    if (isOpen()) closeMenu();
    else openMenu();
  });

  links.forEach((link) => link.addEventListener('click', () => closeMenu()));

  document.addEventListener('pointerdown', (event) => {
    if (isOpen() && !panel.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu({ returnFocus: true });
      return;
    }
    if (event.key === 'Tab' && links.length) {
      const first = links[0];
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

/* ----------------------- DAFTAR ANGGOTA --------------------- */
function initMemberDirectory() {
  const list = document.getElementById('member-list');
  const search = document.getElementById('member-search');
  const statusFilter = document.getElementById('member-filter');
  const classFilter = document.getElementById('member-class-filter');
  const count = document.getElementById('member-count');
  if (!list || !search || !statusFilter || !count) return;

  function renderMembers() {
    const keyword = search.value.trim().toLocaleLowerCase('id-ID');
    const selectedStatus = statusFilter.value;
    const selectedClass = classFilter ? classFilter.value : 'all';

    const filtered = members.filter((member) => {
      const matchesName = member.name.toLocaleLowerCase('id-ID').includes(keyword);
      const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;
      const matchesClass = selectedClass === 'all'
        || (selectedClass === 'none' && !member.className)
        || member.className === selectedClass;
      return matchesName && matchesStatus && matchesClass;
    });

    count.textContent = `Menampilkan ${filtered.length} dari ${members.length} anggota`;

    if (!filtered.length) {
      list.innerHTML = '<div class="col-span-full rounded-2xl border border-dashed border-ink/15 bg-paper/70 px-5 py-12 text-center"><p class="font-semibold text-ink">Nama tidak ditemukan.</p><p class="mt-2 text-xs text-muted">Coba kata kunci atau filter yang lain.</p></div>';
      return;
    }

    list.innerHTML = filtered.map((member) => {
      const info = statusInfo[member.status];
      const movedClass = member.status === 'moved' ? 'is-moved' : '';
      const classLabel = member.className ? `Kelas ${escapeHTML(member.className)}` : 'Di sekolah lain';
      return `
        <article class="member-card ${movedClass} soft-card flex min-h-[142px] flex-col justify-between p-4 transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:min-h-[158px] sm:p-5">
          <div class="flex items-start justify-between gap-2">
            <span class="grid h-8 w-8 place-items-center rounded-xl bg-mist font-display text-[10px] font-extrabold text-forest">${String(member.id).padStart(2, '0')}</span>
            <span class="rounded-full px-2.5 py-1 text-[9px] font-bold ${info.badgeClass}">${info.badge}</span>
          </div>
          <div class="mt-5">
            <h3 class="break-words text-xs font-bold leading-5 text-ink sm:text-sm">${escapeHTML(member.name)}</h3>
            <p class="mt-1.5 text-[10px] text-muted">${classLabel}</p>
          </div>
        </article>`;
    }).join('');
  }

  search.addEventListener('input', renderMembers);
  statusFilter.addEventListener('change', renderMembers);
  classFilter?.addEventListener('change', renderMembers);
  renderMembers();
}

/* ------------------------- JADWAL PIKET --------------------- */
function initDutySchedule() {
  const scheduleContainer = document.getElementById('duty-schedule');
  const weekLabel = document.getElementById('week-label');
  const weekRange = document.getElementById('week-range');
  const classCount = document.getElementById('duty-class-count');
  const weekNote = document.getElementById('week-note');
  const previousButton = document.getElementById('week-prev');
  const nextButton = document.getElementById('week-next');
  const tabs = Array.from(document.querySelectorAll('.class-tab'));

  if (!scheduleContainer || !weekLabel || !weekRange) return;

  let selectedClass = '10A';
  let weekOffset = 0;

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  function startOfMonday(date) {
    const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const daysSinceMonday = (result.getDay() + 6) % 7;
    result.setDate(result.getDate() - daysSinceMonday);
    return result;
  }

  function addDays(date, amount) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
  }

  function utcDayNumber(date) {
    return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  }

  function formatDate(date, options) {
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  }

  function isSameDate(a, b) {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  function getClassMembers(className) {
    return members.filter((member) => member.className === className);
  }

  function positiveModulo(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function renderSchedule() {
    const currentMonday = startOfMonday(todayStart);
    const shownMonday = addDays(currentMonday, weekOffset * 7);
    const shownSaturday = addDays(shownMonday, 5);
    const baseParts = dutyConfig.rotationBaseMonday.split('-').map(Number);
    const baseMonday = new Date(baseParts[0], baseParts[1] - 1, baseParts[2]);
    const weekIndex = Math.floor((utcDayNumber(shownMonday) - utcDayNumber(baseMonday)) / 7);
    const classMembers = getClassMembers(selectedClass);
    const poolSize = classMembers.length;

    weekLabel.textContent = weekOffset === 0
      ? 'Minggu berjalan'
      : weekOffset < 0 ? `${Math.abs(weekOffset)} minggu sebelumnya` : `${weekOffset} minggu berikutnya`;

    const sameMonth = shownMonday.getMonth() === shownSaturday.getMonth();
    const sameYear = shownMonday.getFullYear() === shownSaturday.getFullYear();
    const startText = formatDate(shownMonday, { day: 'numeric', month: 'long' });
    const endText = formatDate(shownSaturday, { day: 'numeric', month: 'long', year: 'numeric' });
    weekRange.textContent = sameMonth
      ? `${formatDate(shownMonday, { day: 'numeric' })}–${endText}`
      : `${startText} – ${endText}`;
    if (!sameYear) {
      weekRange.textContent = `${formatDate(shownMonday, { day: 'numeric', month: 'long', year: 'numeric' })} – ${endText}`;
    }

    classCount.textContent = `${poolSize} anggota`;
    weekNote.textContent = selectedClass === '10A'
      ? 'Kelas 10A: 14 santri lama. Dua petugas mendapat giliran setiap hari; rotasi berputar dari minggu ke minggu.'
      : 'Kelas 10B: 4 santri lama dan 8 teman baru. Seluruh anggota mendapat giliran satu kali dalam satu minggu.';

    if (!poolSize) {
      scheduleContainer.innerHTML = '<p class="py-8 text-center text-sm text-muted">Belum ada anggota untuk kelas ini. Periksa data anggota di js/main.js.</p>';
      return;
    }

    scheduleContainer.innerHTML = dutyConfig.days.map((day, dayIndex) => {
      const date = addDays(shownMonday, dayIndex);
      const isToday = isSameDate(date, todayStart);
      const firstSlot = weekIndex * dutyConfig.petugasPerHari + dayIndex * dutyConfig.petugasPerHari;
      const assigned = Array.from({ length: dutyConfig.petugasPerHari }, (_, slotIndex) => {
        const memberIndex = positiveModulo(firstSlot + slotIndex, poolSize);
        return classMembers[memberIndex];
      });

      const peopleHTML = assigned.map((member) => `
        <span class="inline-flex items-center gap-2 rounded-lg bg-forest/[.06] px-2.5 py-2 text-[10px] font-semibold text-forest sm:text-xs">
          <span class="grid h-5 w-5 place-items-center rounded-md bg-forest/10 text-[8px] font-extrabold">${String(member.id).padStart(2, '0')}</span>
          ${escapeHTML(member.name)}
        </span>`).join('');

      return `
        <article class="flex flex-col gap-3 rounded-xl border ${isToday ? 'border-gold/60 bg-[#FBF6EA]' : 'border-ink/5 bg-paper'} p-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
          <div class="flex min-w-[6.5rem] items-center gap-3 sm:block">
            <div>
              <p class="text-xs font-bold ${isToday ? 'text-[#805D27]' : 'text-ink'}">${day.label}</p>
              <p class="mt-1 text-[10px] ${isToday ? 'font-semibold text-[#9B773D]' : 'text-muted'}">${formatDate(date, { day: 'numeric', month: 'short' })}</p>
            </div>
            ${isToday ? '<span class="rounded-full bg-gold/20 px-2 py-1 text-[8px] font-extrabold uppercase tracking-wider text-[#805D27] sm:hidden">Hari ini</span>' : ''}
          </div>
          <div class="flex flex-1 flex-wrap gap-2">${peopleHTML}</div>
          ${isToday ? '<span class="hidden rounded-full bg-gold/20 px-2.5 py-1 text-[9px] font-bold text-[#805D27] sm:inline-flex">Hari ini</span>' : '<span class="hidden w-[4.2rem] sm:block"></span>'}
        </article>`;
    }).join('');
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      selectedClass = tab.dataset.class;
      tabs.forEach((item) => {
        const active = item === tab;
        item.setAttribute('aria-pressed', String(active));
        item.classList.toggle('bg-forest', active);
        item.classList.toggle('text-white', active);
        item.classList.toggle('text-muted', !active);
        item.classList.toggle('hover:text-ink', !active);
        item.classList.toggle('shadow-sm', active);
      });
      renderSchedule();
    });
  });

  previousButton?.addEventListener('click', () => {
    weekOffset -= 1;
    renderSchedule();
  });
  nextButton?.addEventListener('click', () => {
    weekOffset += 1;
    renderSchedule();
  });
  renderSchedule();
}

/* ------------------------- GALERI --------------------------- */
function initGalleryLightbox() {
  const dialog = document.getElementById('lightbox');
  const image = document.getElementById('lightbox-image');
  const caption = document.getElementById('lightbox-caption');
  const closeButton = document.getElementById('lightbox-close');
  const galleryButtons = Array.from(document.querySelectorAll('.gallery-button'));
  if (!dialog || !image || !caption || !closeButton) return;

  let lastTrigger = null;

  galleryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const thumbnail = button.querySelector('img');
      lastTrigger = button;
      image.src = button.dataset.full || thumbnail?.src || '';
      image.alt = thumbnail?.alt || 'Foto kenangan INVICTUS';
      caption.textContent = button.dataset.caption || 'Foto kenangan INVICTUS';
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        // Fallback sederhana untuk browser lama yang belum mendukung dialog.
        dialog.setAttribute('open', '');
      }
      closeButton.focus();
    });
  });

  function closeDialog() {
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
    image.removeAttribute('src');
    lastTrigger?.focus();
  }

  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener('cancel', () => {
    // Event cancel bawaan terjadi saat tombol Escape ditekan.
    image.removeAttribute('src');
  });
}

/* -------------------- ANIMASI SAAT SCROLL ------------------ */
function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  elements.forEach((element) => observer.observe(element));
}

/* ----------------------- COUNTER STATISTIK ------------------ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setFinalValue(element) {
    element.textContent = element.dataset.count;
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    counters.forEach(setFinalValue);
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const duration = 900;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.round(target * eased));
        if (progress < 1) window.requestAnimationFrame(tick);
        else element.textContent = String(target);
      }

      window.requestAnimationFrame(tick);
      currentObserver.unobserve(element);
    });
  }, { threshold: 0.65 });

  counters.forEach((counter) => observer.observe(counter));
}

/* --------------------------- INIT -------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMemberDirectory();
  initDutySchedule();
  initGalleryLightbox();
  initRevealAnimations();
  initCounters();

  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());
});
