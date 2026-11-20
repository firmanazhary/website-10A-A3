// src/main.js
import gsap from "../node_modules/gsap/index.js";
import { ScrollTrigger } from "../node_modules/gsap/ScrollTrigger.js";

import {
  INVICTUS_MEMBERS,
  generatePiketSchedule,
  INVICTUS_TIMELINE,
  INVICTUS_GALLERY,
  INVICTUS_ACHIEVEMENTS,
  INVICTUS_QUOTES,
  INVICTUS_FAQ,
} from "./data.js";

gsap.registerPlugin(ScrollTrigger);

// ==========================================================
// 1. STARFIELD CANVAS ENGINE (PRELOADER + BACKGROUND)
// ==========================================================
function initStarfield(canvasId, starCount = 130, speedMultiplier = 0.25) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.6 + 0.3,
    alpha: Math.random() * 0.8 + 0.2,
    speed: (Math.random() * 0.6 + 0.15) * speedMultiplier,
    twinkle: Math.random() * 0.02 + 0.005,
  }));

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      star.y -= star.speed;
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }
      star.alpha += star.twinkle;
      if (star.alpha > 1 || star.alpha < 0.2) star.twinkle *= -1;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224, 242, 254, ${star.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(render);
  }
  render();
}

// ==========================================================
// 2. CINEMATIC PRELOADER TIMELINE
// ==========================================================
function runPreloader() {
  initStarfield("preloader-stars", 150, 1.4);
  initStarfield("space-canvas", 160, 0.22);

  const preloader = document.getElementById("preloader");
  const bar = document.getElementById("loader-bar");
  const percentEl = document.getElementById("loader-percent");
  const logo = document.getElementById("loader-logo");
  const badge = document.getElementById("loader-badge");
  const status = document.getElementById("loader-status");

  const progressObj = { val: 0 };

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.classList.remove("is-loading");
      preloader.style.display = "none";
      animateHeroEntrance();
    },
  });

  tl.to(badge, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" })
    .to(
      logo,
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "expo.out",
      },
      "-=0.2"
    )
    .to(status, { opacity: 1, duration: 0.4 }, "-=0.4")
    .to(
      progressObj,
      {
        val: 100,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: () => {
          const current = Math.round(progressObj.val);
          percentEl.textContent = `${current}%`;
          bar.style.width = `${current}%`;
          if (current > 40 && current < 85) {
            status.textContent = "Syncing 41 Personnel...";
          } else if (current >= 85) {
            status.textContent = "Orbit Ready // INVICTUS";
          }
        },
      },
      "-=0.2"
    )
    .to([badge, logo, status, bar.parentElement.parentElement], {
      y: -25,
      opacity: 0,
      duration: 0.45,
      stagger: 0.05,
      ease: "power2.in",
    })
    .to(
      preloader,
      {
        yPercent: -100,
        duration: 0.85,
        ease: "expo.inOut",
      },
      "-=0.15"
    );
}

// ==========================================================
// 3. HERO ENTRANCE & SCROLL PARALLAX
// ==========================================================
function animateHeroEntrance() {
  gsap.fromTo(
    ".hero-reveal",
    { y: 36, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
    }
  );
}

function initParallaxAndNavbar() {
  const navbar = document.getElementById("navbar");
  const scrollProgress = document.getElementById("scroll-progress");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (scrollProgress) scrollProgress.style.width = `${progress}%`;

    if (scrollY > 40) {
      navbar.classList.add(
        "bg-space-950/80",
        "backdrop-blur-xl",
        "border-white/10",
        "shadow-lg"
      );
    } else {
      navbar.classList.remove(
        "bg-space-950/80",
        "backdrop-blur-xl",
        "border-white/10",
        "shadow-lg"
      );
    }
  });

  // Parallax Orbs
  document.querySelectorAll("[data-parallax]").forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || "0.15");
    gsap.to(el, {
      y: () => speed * 250,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
  });

  // Mobile Menu Toggle
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  mobileBtn?.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
  });

  // Back to top
  document.getElementById("back-to-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ==========================================================
// 4. TEXT SCRAMBLE & COUNTER ANIMATION
// ==========================================================
function initTextScramble() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//✦";

  document.querySelectorAll(".scramble-title").forEach((el) => {
    const originalText = el.dataset.scramble || el.textContent.trim();

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        let iteration = 0;
        const interval = setInterval(() => {
          el.textContent = originalText
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) return originalText[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

          if (iteration >= originalText.length) {
            clearInterval(interval);
            el.textContent = originalText;
          }
          iteration += 1 / 2;
        }, 25);
      },
    });
  });
}

function initCounters() {
  document.querySelectorAll(".counter").forEach((counter) => {
    const target = parseInt(counter.dataset.target, 10);
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: counter,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            counter.textContent = Math.round(obj.val);
          },
        });
      },
    });
  });
}

// ==========================================================
// 5. RENDER & FILTER 41 MEMBERS + MODAL + 3D TILT
// ==========================================================
let activeFilter = "Semua";
let searchQuery = "";

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function renderMembers() {
  const grid = document.getElementById("members-grid");
  const emptyState = document.getElementById("empty-members");
  const visibleCountEl = document.getElementById("visible-count");

  const filtered = INVICTUS_MEMBERS.filter((m) => {
    const matchesFilter =
      activeFilter === "Semua" ||
      m.group === activeFilter ||
      m.status === activeFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.group.toLowerCase().includes(q) ||
      m.currentClass.toLowerCase().includes(q) ||
      m.status.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  visibleCountEl.textContent = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  grid.innerHTML = filtered
    .map((member) => {
      const isAktif = member.status === "Aktif";
      const badgeClass = isAktif
        ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
        : "border-rose-400/40 bg-rose-500/15 text-rose-300";

      const classDisplay = isAktif ? `Kelas ${member.currentClass}` : "Alumni / Keluar";

      return `
        <article
          data-member-id="${member.id}"
          class="member-card tilt-card space-card group relative cursor-pointer rounded-2xl p-5 flex flex-col justify-between"
        >
          <div class="tilt-inner">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-nebula-cyan/30 bg-gradient-to-br from-nebula-purple/30 to-nebula-cyan/20 font-heading text-lg tracking-wider text-white group-hover:border-nebula-cyan transition-colors">
                  ${getInitials(member.name)}
                </div>
                <div>
                  <span class="block font-mono text-[10px] tracking-[0.2em] text-slate-400">
                    ${member.id} // #${member.no}
                  </span>
                  <span class="inline-block mt-0.5 text-[11px] font-medium text-nebula-cyan">
                    ${member.group}
                  </span>
                </div>
              </div>

              <span class="rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${badgeClass}">
                ${member.status}
              </span>
            </div>

            <h3 class="mt-4 font-semibold text-base text-white leading-snug group-hover:text-nebula-cyan transition-colors">
              ${member.name}
            </h3>
          </div>

          <div class="tilt-inner mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>${classDisplay}</span>
            <span class="font-mono text-[10px] text-slate-500 group-hover:text-slate-300">
              DETAIL →
            </span>
          </div>
        </article>
      `;
    })
    .join("");

  gsap.fromTo(
    ".member-card",
    { y: 24, opacity: 0, scale: 0.97 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.45,
      stagger: 0.025,
      ease: "power2.out",
      clearProps: "transform",
    }
  );

  attachCardInteractions();
}

function attachCardInteractions() {
  document.querySelectorAll(".member-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    });

    card.addEventListener("click", () => {
      const id = card.dataset.memberId;
      const member = INVICTUS_MEMBERS.find((m) => m.id === id);
      if (member) openMemberModal(member);
    });
  });
}

function initFilterAndSearch() {
  const buttons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("member-search");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => {
        b.classList.remove("active", "bg-nebula-cyan", "text-space-950", "font-bold");
        b.classList.add("bg-white/5", "text-slate-300");
      });
      btn.classList.add("active", "bg-nebula-cyan", "text-space-950", "font-bold");
      btn.classList.remove("bg-white/5", "text-slate-300");

      activeFilter = btn.dataset.filter;
      renderMembers();
    });
  });

  searchInput?.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderMembers();
  });
}

// ==========================================================
// 6. MEMBER MODAL WITH GSAP TRANSITION
// ==========================================================
function openMemberModal(member) {
  const modal = document.getElementById("member-modal");
  const modalCard = document.getElementById("member-modal-card");
  const content = document.getElementById("modal-body-content");

  const isAktif = member.status === "Aktif";
  const statusBadge = isAktif
    ? `<span class="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">Status: Aktif (Masuk Jadwal Piket)</span>`
    : `<span class="rounded-full border border-rose-400/40 bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-300">Status: Keluar (Tidak Masuk Piket)</span>`;

  content.innerHTML = `
    <div class="flex items-center gap-4">
      <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-nebula-cyan/40 bg-gradient-to-br from-nebula-purple/40 to-nebula-cyan/20 font-heading text-2xl text-white">
        ${getInitials(member.name)}
      </div>
      <div>
        <span class="font-mono text-xs tracking-[0.2em] text-nebula-cyan uppercase">
          ${member.id} · ${member.callsign}
        </span>
        <h3 class="mt-1 font-heading text-2xl sm:text-3xl tracking-wide text-white uppercase">
          ${member.name}
        </h3>
      </div>
    </div>

    <div class="mt-5 flex flex-wrap gap-2">
      ${statusBadge}
    </div>

    <div class="mt-6 grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-space-950/70 p-4 text-xs">
      <div>
        <span class="block text-slate-400">Kelompok Asal</span>
        <strong class="mt-1 block text-sm text-white">${member.group}</strong>
      </div>
      <div>
        <span class="block text-slate-400">Kelas Saat Ini</span>
        <strong class="mt-1 block text-sm text-nebula-cyan">
          ${isAktif ? member.currentClass : "Tidak Aktif / Keluar"}
        </strong>
      </div>
      <div class="col-span-2 pt-2 border-t border-white/10">
        <span class="block text-slate-400">Peran / Klasifikasi</span>
        <strong class="mt-1 block text-sm text-slate-200">${member.role}</strong>
      </div>
    </div>

    <p class="mt-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
      ${member.bio}
    </p>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  gsap.fromTo(
    modalCard,
    { scale: 0.88, opacity: 0, y: 24 },
    { scale: 1, opacity: 1, y: 0, duration: 0.38, ease: "back.out(1.4)" }
  );
}

function initModalClose() {
  const modal = document.getElementById("member-modal");
  const closeBtn = document.getElementById("close-member-modal");

  const close = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  };

  closeBtn?.addEventListener("click", close);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
}

// ==========================================================
// 7. RENDER JADWAL PIKET (SENIN - JUMAT, HANYA AKTIF)
// ==========================================================
function renderPiketSchedule() {
  const grid = document.getElementById("piket-grid");
  const schedule = generatePiketSchedule(INVICTUS_MEMBERS);
  const todayIndex = new Date().getDay();

  grid.innerHTML = schedule
    .map((slot) => {
      const isToday = slot.dayIndex === todayIndex;
      const highlightClass = isToday
        ? "border-nebula-cyan shadow-[0_0_30px_rgba(0,240,255,0.2)] ring-1 ring-nebula-cyan/50"
        : "";

      const membersList = slot.members
        .map(
          (m, idx) => `
          <li class="flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-space-950/60 px-3 py-2.5 text-xs">
            <div class="truncate">
              <span class="font-mono text-[10px] text-nebula-cyan mr-1.5">0${idx + 1}.</span>
              <span class="font-medium text-slate-100">${m.name}</span>
            </div>
            <span class="shrink-0 rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
              ${m.currentClass}
            </span>
          </li>
        `
        )
        .join("");

      return `
        <div class="piket-card space-card rounded-2xl p-5 flex flex-col justify-between ${highlightClass}">
          <div>
            <div class="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <span class="block font-mono text-[10px] tracking-[0.2em] text-slate-400">
                  ${slot.code}
                </span>
                <h3 class="mt-0.5 font-heading text-2xl tracking-wider text-white uppercase">
                  ${slot.day}
                </h3>
              </div>
              ${
                isToday
                  ? `<span class="rounded-full bg-nebula-cyan px-2.5 py-1 text-[10px] font-bold tracking-wider text-space-950 uppercase">Hari Ini</span>`
                  : `<span class="rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] text-slate-400">${slot.members.length} Org</span>`
              }
            </div>

            <ul class="mt-4 space-y-2">
              ${membersList}
            </ul>
          </div>

          <div class="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>STATUS: AKTIF ONLY</span>
            <span>${slot.members.length} PERSONEL</span>
          </div>
        </div>
      `;
    })
    .join("");

  gsap.from(".piket-card", {
    y: 35,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#piket-grid",
      start: "top 82%",
      once: true,
    },
  });
}

// ==========================================================
// 8. RENDER SECTION TAMBAHAN
// ==========================================================
function renderExtraSections() {
  const timelineEl = document.getElementById("timeline-container");
  timelineEl.innerHTML = INVICTUS_TIMELINE.map(
    (item) => `
      <div class="timeline-item relative pl-8 sm:pl-10">
        <span class="absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full bg-nebula-cyan shadow-[0_0_12px_#00F0FF]"></span>
        <div class="space-card rounded-2xl p-6">
          <span class="font-mono text-xs tracking-[0.22em] text-nebula-cyan uppercase">${item.year}</span>
          <h3 class="mt-1 font-heading text-2xl tracking-wide text-white uppercase">${item.title}</h3>
          <p class="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">${item.desc}</p>
        </div>
      </div>
    `
  ).join("");

  const achEl = document.getElementById("achievements-grid");
  achEl.innerHTML = INVICTUS_ACHIEVEMENTS.map(
    (ach) => `
      <div class="space-card rounded-2xl p-7 flex flex-col justify-between reveal-up">
        <div>
          <span class="font-mono text-[11px] tracking-[0.22em] text-nebula-cyan uppercase">${ach.badge}</span>
          <div class="mt-4 font-heading text-4xl sm:text-5xl text-white">${ach.metric}</div>
          <h3 class="mt-2 font-heading text-xl tracking-wide text-slate-200 uppercase">${ach.title}</h3>
        </div>
        <p class="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed">${ach.detail}</p>
      </div>
    `
  ).join("");

  const galEl = document.getElementById("gallery-grid");
  galEl.innerHTML = INVICTUS_GALLERY.map(
    (gal) => `
      <button
        type="button"
        data-gal-id="${gal.id}"
        class="gallery-btn group relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br ${gal.gradient} p-5 text-left flex flex-col justify-between transition-all hover:border-nebula-cyan/60"
      >
        <div class="flex items-center justify-between text-[10px] font-mono tracking-widest text-slate-300">
          <span>${gal.category}</span>
          <span>${gal.date}</span>
        </div>

        <div class="my-auto mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
          <span class="font-heading text-xl tracking-widest text-nebula-cyan">IV</span>
        </div>

        <div>
          <span class="block font-mono text-[10px] text-slate-400">${gal.code}</span>
          <h3 class="mt-1 font-heading text-xl tracking-wide text-white uppercase group-hover:text-nebula-cyan transition-colors">
            ${gal.title}
          </h3>
        </div>
      </button>
    `
  ).join("");

  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxContent = document.getElementById("lightbox-content");
  document.querySelectorAll(".gallery-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = INVICTUS_GALLERY.find((g) => g.id === btn.dataset.galId);
      if (!item) return;
      lightboxContent.innerHTML = `
        <div class="aspect-video w-full bg-gradient-to-br ${item.gradient} flex flex-col items-center justify-center p-8 text-center">
          <div class="h-24 w-24 rounded-full border border-nebula-cyan/50 bg-nebula-cyan/10 flex items-center justify-center font-heading text-3xl text-nebula-cyan mb-4">
            INVICTUS
          </div>
          <span class="font-mono text-xs tracking-[0.25em] text-slate-300 uppercase">${item.code} · ${item.date}</span>
        </div>
        <div class="p-6">
          <span class="text-xs font-mono text-nebula-cyan uppercase">${item.category}</span>
          <h3 class="mt-1 font-heading text-2xl sm:text-3xl text-white uppercase">${item.title}</h3>
          <p class="mt-2 text-xs sm:text-sm text-slate-400">
            Dokumentasi arsip visual resmi angkatan INVICTUS. Siap diganti dengan foto resolusi tinggi kegiatan angkatan.
          </p>
        </div>
      `;
      lightbox.classList.remove("hidden");
      lightbox.classList.add("flex");
    });
  });

  document.getElementById("close-lightbox")?.addEventListener("click", () => {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
  });
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.add("hidden");
      lightbox.classList.remove("flex");
    }
  });

  const quotesEl = document.getElementById("quotes-container");
  quotesEl.innerHTML = INVICTUS_QUOTES.map(
    (q) => `
      <blockquote class="space-card rounded-2xl p-6">
        <p class="text-xs sm:text-sm italic text-slate-200 leading-relaxed">“${q.quote}”</p>
        <footer class="mt-4 flex items-center justify-between text-[11px] font-mono">
          <span class="text-nebula-cyan font-semibold">${q.author}</span>
          <span class="text-slate-500">${q.role}</span>
        </footer>
      </blockquote>
    `
  ).join("");

  const faqEl = document.getElementById("faq-container");
  faqEl.innerHTML = INVICTUS_FAQ.map(
    (item, index) => `
      <div class="faq-item space-card rounded-2xl overflow-hidden ${index === 0 ? "active" : ""}">
        <button
          type="button"
          class="faq-trigger flex w-full items-center justify-between gap-4 p-5 text-left font-medium text-sm sm:text-base text-white hover:text-nebula-cyan transition-colors"
        >
          <span>${item.q}</span>
          <span class="faq-icon font-mono text-lg text-nebula-cyan transition-transform duration-300">
            ${index === 0 ? "−" : "+"}
          </span>
        </button>
        <div class="faq-content">
          <div class="faq-inner px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
            ${item.a}
          </div>
        </div>
      </div>
    `
  ).join("");

  document.querySelectorAll(".faq-item").forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const icon = item.querySelector(".faq-icon");
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");
      document.querySelectorAll(".faq-item").forEach((el) => {
        el.classList.remove("active");
        el.querySelector(".faq-icon").textContent = "+";
      });
      if (!isOpen) {
        item.classList.add("active");
        icon.textContent = "−";
      }
    });
  });
}

// ==========================================================
// 9. MAGNETIC BUTTONS, RIPPLE CLICK, & CUSTOM CURSOR
// ==========================================================
function initMicroInteractions() {
  document.querySelectorAll(".magnetic-btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.28,
        y: y * 0.28,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    });
  });

  document.addEventListener("click", (e) => {
    const target = e.target.closest(".ripple-btn");
    if (!target) return;

    const circle = document.createElement("span");
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const rect = target.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
    circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
    circle.classList.add("ripple-circle");

    target.querySelector(".ripple-circle")?.remove();
    target.appendChild(circle);
  });

  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (dot && ring && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08 });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.24, ease: "power2.out" });
    });

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("a, button, .member-card")) {
        document.body.classList.add("cursor-hover");
      } else {
        document.body.classList.remove("cursor-hover");
      }
    });
  }

  gsap.utils.toArray(".reveal-up").forEach((el) => {
    gsap.from(el, {
      y: 32,
      opacity: 0,
      duration: 0.75,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 86%",
        once: true,
      },
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year-now");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  renderMembers();
  initFilterAndSearch();
  initModalClose();
  renderPiketSchedule();
  renderExtraSections();
  initParallaxAndNavbar();
  initTextScramble();
  initCounters();
  initMicroInteractions();
  runPreloader();
});
