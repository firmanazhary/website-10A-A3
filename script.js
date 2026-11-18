document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("navContainer");
  const mainNav = document.getElementById("mainNav");
  const menuToggleBtn = document.getElementById("menuToggleBtn");
  const navMenuPanel = document.getElementById("navMenuPanel");
  const barTop = document.getElementById("barTop");
  const barMid = document.getElementById("barMid");
  const barBot = document.getElementById("barBot");
  const menuLinks = Array.from(document.querySelectorAll(".nav-menu-link"));

  const heroContent = document.getElementById("heroStackContent");
  const jelajahiStack = document.getElementById("jelajahiStack");
  const untilWhenBtn = document.getElementById("untilWhenBtn");
  const marqueeTrack = document.getElementById("taglineMarqueeTrack");
  const marqueeGroup = marqueeTrack?.querySelector("[data-marquee-group]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Elemen transisi scroll About -> Anggota & Carousel 33 Anggota
  const scrollWrapper = document.getElementById("jelajahi");
  const stickyStage = document.getElementById("stickyStage");
  const photoSlot = document.getElementById("photoSlot");
  const aboutTextCol = document.getElementById("aboutTextCol");
  const expandingPhotoBox = document.getElementById("expandingPhotoBox");
  const expandingPhotoImg = document.getElementById("expandingPhotoImg");
  const scrollCue = document.getElementById("scrollCue");
  const navLabelAbout = document.getElementById("navLabelAbout");
  const navLabelAnggota = document.getElementById("navLabelAnggota");
  const anggotaCard = document.getElementById("anggotaCard");
  const anggotaPill = document.getElementById("anggotaPill");
  const titleWords = Array.from(document.querySelectorAll("[data-title-word]"));
  const carouselViewport = document.getElementById("carouselViewport");
  const carouselTrack = document.getElementById("carouselTrack");
  const carouselProgressBar = document.getElementById("carouselProgressBar");
  const prevMemberBtn = document.getElementById("prevMemberBtn");
  const nextMemberBtn = document.getElementById("nextMemberBtn");

  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
  const clamp01 = (value) => clamp(value, 0, 1);
  const segmentProgress = (progress, start, end) =>
    clamp01((progress - start) / (end - start));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  let lastScrollY = window.scrollY;
  let scrollBoost = 0;
  let isMenuOpen = false;
  let activeNavKey = "home";

  // -----------------------------------------------------------------
  // 1. Hamburger Menu Toggle & Sinkronisasi Menu Aktif
  // -----------------------------------------------------------------
  function highlightNavLink(targetKey) {
    if (activeNavKey === targetKey) return;
    activeNavKey = targetKey;
    menuLinks.forEach((item) => {
      const badge = item.querySelector("span:last-child");
      const isCurrent = item.dataset.navTarget === targetKey;
      item.className = isCurrent
        ? "nav-menu-link flex items-center justify-between rounded-2xl bg-white px-4 py-2.5 text-xs font-semibold text-neutral-950 transition"
        : "nav-menu-link flex items-center justify-between rounded-2xl px-4 py-2.5 text-xs font-medium text-white/90 transition hover:bg-white/10";
      if (badge) {
        badge.className = isCurrent
          ? "font-mono text-[10px] opacity-60"
          : "font-mono text-[10px] text-neutral-500";
      }
    });
  }

  function setMenuOpen(open) {
    isMenuOpen = open;
    menuToggleBtn?.setAttribute("aria-expanded", String(open));

    if (barTop && barMid && barBot) {
      barTop.classList.toggle("translate-y-1.5", open);
      barTop.classList.toggle("rotate-45", open);
      barMid.classList.toggle("opacity-0", open);
      barBot.classList.toggle("-translate-y-1.5", open);
      barBot.classList.toggle("-rotate-45", open);
    }

    if (navMenuPanel) {
      navMenuPanel.classList.toggle("pointer-events-none", !open);
      navMenuPanel.classList.toggle("pointer-events-auto", open);
      navMenuPanel.classList.toggle("opacity-0", !open);
      navMenuPanel.classList.toggle("opacity-100", open);
      navMenuPanel.classList.toggle("scale-95", !open);
      navMenuPanel.classList.toggle("scale-100", open);
    }
  }

  menuToggleBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenuOpen(!isMenuOpen);
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (link.dataset.navTarget) {
        highlightNavLink(link.dataset.navTarget);
      }
      setMenuOpen(false);
    });
  });

  document.addEventListener("click", (e) => {
    if (isMenuOpen && navContainer && !navContainer.contains(e.target)) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen) {
      setMenuOpen(false);
    }
  });

  // -----------------------------------------------------------------
  // 2. Render 33 Kartu Anggota & Pengukuran Posisi Foto
  // -----------------------------------------------------------------
  const TOTAL_MEMBERS = 33;
  const CARD_WIDTH = 190;
  const CARD_GAP = 28;
  const CARD_STEP = CARD_WIDTH + CARD_GAP;
  const cardItems = [];

  if (carouselTrack) {
    for (let i = 0; i < TOTAL_MEMBERS; i++) {
      const numStr = String(i + 1).padStart(2, "0");

      const item = document.createElement("article");
      item.className =
        "absolute left-0 top-1/2 flex w-[190px] -translate-y-1/2 flex-col items-center select-none will-change-transform";

      const frame = document.createElement("div");
      frame.className =
        "relative h-[250px] w-[190px] overflow-hidden rounded-[36px] bg-neutral-200 shadow-md will-change-transform";

      const img = document.createElement("img");
      img.src = `./assets/member-${numStr}.jpg`;
      img.alt = `Anggota ${numStr}`;
      img.loading = "lazy";
      img.className = "h-full w-full object-cover object-center";

      const overlay = document.createElement("div");
      overlay.className =
        "pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-center gap-2 bg-gradient-to-t from-black/65 via-black/25 to-transparent pb-3.5 opacity-0 will-change-transform";
      overlay.innerHTML = `
        <span class="grid h-7 w-7 place-items-center rounded-full bg-white/30 text-white backdrop-blur-md">
          <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4a3.9 3.9 0 0 1-1.4-.9 3.9 3.9 0 0 1-.9-1.4c-.2-.4-.4-1.1-.4-2.2-.1-1.3-.1-1.6-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.2-.4 1.3-.1 1.6-.1 4.9-.1zm0 3.4a6.4 6.4 0 1 0 0 12.8 6.4 6.4 0 0 0 0-12.8zm0 10.5a4.1 4.1 0 1 1 0-8.2 4.1 4.1 0 0 1 0 8.2zm6.7-12.3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
          </svg>
        </span>
        <span class="grid h-7 w-7 place-items-center rounded-full bg-white/30 text-white backdrop-blur-md">
          <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4z"/>
          </svg>
        </span>
        <span class="grid h-7 w-7 place-items-center rounded-full bg-white/30 text-white backdrop-blur-md">
          <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.2 2.25h3.3l-7.2 8.23L22.8 21.75h-6.6l-5.2-6.8-5.9 6.8H1.8l7.7-8.8L1.3 2.25h6.8l4.7 6.2 5.4-6.2z"/>
          </svg>
        </span>
      `;

      frame.appendChild(img);
      frame.appendChild(overlay);

      const meta = document.createElement("div");
      meta.className =
        "mt-3 flex flex-col items-center text-center will-change-transform";
      meta.innerHTML = `
        <p class="text-xs font-semibold text-neutral-900">[Nama Anggota]</p>
        <p class="mt-0.5 text-[11px] font-medium text-neutral-500">[Jabatan]</p>
      `;

      item.appendChild(frame);
      item.appendChild(meta);
      carouselTrack.appendChild(item);

      cardItems.push({ item, frame, overlay, meta });
    }
  }

  let slotMetrics = { left: 0, top: 0, width: 400, height: 300 };
  let stageMetrics = { width: window.innerWidth, height: window.innerHeight };
  let viewportWidth =
    carouselViewport?.clientWidth || window.innerWidth * 0.85;
  let groupWidth = marqueeGroup?.offsetWidth || 0;

  function measureLayout() {
    if (stickyStage && photoSlot) {
      const stageRect = stickyStage.getBoundingClientRect();
      const slotRect = photoSlot.getBoundingClientRect();
      stageMetrics = {
        width: stageRect.width,
        height: stageRect.height,
      };
      slotMetrics = {
        left: slotRect.left - stageRect.left,
        top: slotRect.top - stageRect.top,
        width: slotRect.width,
        height: slotRect.height,
      };
    }
    if (carouselViewport) {
      viewportWidth = carouselViewport.clientWidth || stageMetrics.width * 0.85;
    }
    if (marqueeGroup) {
      groupWidth = marqueeGroup.offsetWidth;
    }
  }

  window.addEventListener("resize", measureLayout, { passive: true });
  measureLayout();

  // Kontrol gerak otomatis ke arah kanan & tombol navigasi 33 anggota
  let driftOffset = 0;
  let targetDriftOffset = 0;
  let isHoveringCarousel = false;

  carouselViewport?.addEventListener("mouseenter", () => {
    isHoveringCarousel = true;
  });
  carouselViewport?.addEventListener("mouseleave", () => {
    isHoveringCarousel = false;
  });

  prevMemberBtn?.addEventListener("click", () => {
    targetDriftOffset = Math.round(targetDriftOffset) - 1;
  });

  nextMemberBtn?.addEventListener("click", () => {
    targetDriftOffset = Math.round(targetDriftOffset) + 1;
  });

  // -----------------------------------------------------------------
  // 3. Loop Utama requestAnimationFrame
  // -----------------------------------------------------------------
  let posX = -groupWidth;
  let lastFrameTime = performance.now();
  const baseMarqueeSpeed = 48;

  function animateFrame(now) {
    const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
    lastFrameTime = now;

    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    // Akselerasi marquee saat scroll
    const deltaY = Math.abs(scrollY - lastScrollY);
    lastScrollY = scrollY;
    if (deltaY > 0) {
      scrollBoost = Math.min(950, scrollBoost + deltaY * 7.5);
    }

    // Navbar Glass Pill saat di-scroll
    if (navContainer) {
      const isScrolled = scrollY > 24;
      navContainer.classList.toggle("max-w-4xl", isScrolled);
      navContainer.classList.toggle("max-w-7xl", !isScrolled);
    }

    if (mainNav) {
      const showPill = scrollY > 24 || isMenuOpen;
      mainNav.classList.toggle("border-white/15", showPill);
      mainNav.classList.toggle("border-transparent", !showPill);
      mainNav.classList.toggle("bg-black/65", showPill);
      mainNav.classList.toggle("bg-transparent", !showPill);
      mainNav.classList.toggle("backdrop-blur-xl", showPill);
      mainNav.classList.toggle("shadow-[0_12px_40px_rgba(0,0,0,0.6)]", showPill);
    }

    // Efek bertumpuk Hero -> JelajahiStack
    if (heroContent && jelajahiStack && vh > 0) {
      if (reducedMotion.matches) {
        heroContent.style.transform = "scale(1)";
        heroContent.style.filter = "brightness(1)";
      } else {
        const heroProgress = clamp01(
          1 - jelajahiStack.getBoundingClientRect().top / vh,
        );
        heroContent.style.transform = `scale(${(1 - heroProgress * 0.08).toFixed(4)})`;
        heroContent.style.filter = `brightness(${(1 - heroProgress * 0.45).toFixed(4)})`;
      }
    }

    // Infinite Marquee bergerak ke kanan
    if (marqueeTrack && groupWidth > 0) {
      if (!reducedMotion.matches) {
        const currentSpeed = baseMarqueeSpeed + scrollBoost;
        posX += currentSpeed * dt;
        if (posX >= 0) {
          posX -= groupWidth;
        }
        scrollBoost *= Math.pow(0.04, dt);
        if (scrollBoost < 0.5) scrollBoost = 0;
        marqueeTrack.style.transform = `translate3d(${posX.toFixed(2)}px, 0, 0)`;
      } else {
        marqueeTrack.style.transform = "translate3d(0, 0, 0)";
      }
    }

    // Transisi Scroll: About -> Anggota (progress 0..1)
    if (scrollWrapper && stickyStage && expandingPhotoBox && anggotaCard) {
      const rect = scrollWrapper.getBoundingClientRect();
      const maxScroll = scrollWrapper.offsetHeight - vh;
      const progress = maxScroll > 0 ? clamp01(-rect.top / maxScroll) : 0;

      if (rect.top > vh * 0.4) {
        highlightNavLink("home");
      } else if (progress < 0.55) {
        highlightNavLink("about");
      } else {
        highlightNavLink("members");
      }

      // Petunjuk SCROLL ↓
      if (scrollCue) {
        const cueT = segmentProgress(progress, 0, 0.08);
        scrollCue.style.opacity = String(1 - cueT);
        scrollCue.style.transform = `translate3d(-50%, ${cueT * 12}px, 0)`;
      }

      // TAHAP 1 (0 - 0.4): Teks About naik & memudar, foto membesar fullscreen
      const textOutT = easeOutCubic(segmentProgress(progress, 0, 0.28));
      if (aboutTextCol) {
        aboutTextCol.style.opacity = String(1 - textOutT);
        aboutTextCol.style.transform = `translate3d(0, ${-textOutT * 80}px, 0)`;
      }

      const expandT = easeOutCubic(segmentProgress(progress, 0, 0.4));
      const curLeft = slotMetrics.left + (0 - slotMetrics.left) * expandT;
      const curTop = slotMetrics.top + (0 - slotMetrics.top) * expandT;
      const curWidth =
        slotMetrics.width + (stageMetrics.width - slotMetrics.width) * expandT;
      const curHeight =
        slotMetrics.height +
        (stageMetrics.height - slotMetrics.height) * expandT;
      const curRadius = 32 * (1 - expandT);

      expandingPhotoBox.style.left = `${curLeft}px`;
      expandingPhotoBox.style.top = `${curTop}px`;
      expandingPhotoBox.style.width = `${curWidth}px`;
      expandingPhotoBox.style.height = `${curHeight}px`;
      expandingPhotoBox.style.borderRadius = `${curRadius}px`;

      // TAHAP 2 (0.3 - 0.5): Foto menggelap (brightness 1 -> 0.3) & label ganti
      const darkenT = segmentProgress(progress, 0.3, 0.5);
      const brightnessVal = 1 - 0.7 * darkenT;
      if (expandingPhotoImg) {
        expandingPhotoImg.style.filter = `brightness(${brightnessVal.toFixed(3)})`;
      }

      const labelT = easeInOutCubic(segmentProgress(progress, 0.34, 0.48));
      if (navLabelAbout && navLabelAnggota) {
        navLabelAbout.style.opacity = String(1 - labelT);
        navLabelAbout.style.transform = `translate3d(0, ${-labelT * 8}px, 0)`;
        navLabelAnggota.style.opacity = String(labelT);
        navLabelAnggota.style.transform = `translate3d(0, ${(1 - labelT) * 8}px, 0)`;
      }

      // TAHAP 3 (0.5 - 0.68): Kartu putih membulat naik dari bawah layar
      const cardInT = easeOutCubic(segmentProgress(progress, 0.5, 0.68));
      const cardTranslateY = (1 - cardInT) * 105;
      anggotaCard.style.transform = `translate3d(0, ${cardTranslateY}vh, 0)`;

      // TAHAP 4 (0.64 - 0.8): Pill & Judul "Meet the Invictus Minds" kata demi kata
      const pillT = easeOutCubic(segmentProgress(progress, 0.64, 0.72));
      if (anggotaPill) {
        anggotaPill.style.opacity = String(pillT);
        anggotaPill.style.transform = `translate3d(0, ${(1 - pillT) * 14}px, 0)`;
      }

      for (let w = 0; w < titleWords.length; w++) {
        const wordStart = 0.64 + w * 0.028;
        const wordEnd = Math.min(0.8, wordStart + 0.085);
        const wt = easeOutCubic(segmentProgress(progress, wordStart, wordEnd));
        const yPercent = (1 - wt) * 110;
        titleWords[w].style.transform = `translate3d(0, ${yPercent}%, 0)`;
      }

      // TAHAP 5 (0.66 - 1.0): Carousel 33 anggota meluncur mengikuti scroll,
      // kartu ke-3 di tengah saat progress = 1, lalu otomatis berjalan ke kanan
      const carouselT = easeOutCubic(segmentProgress(progress, 0.66, 1.0));

      if (progress >= 0.985) {
        if (!isHoveringCarousel && !reducedMotion.matches) {
          targetDriftOffset -= dt * 0.45;
        }
      } else {
        targetDriftOffset = 0;
      }

      driftOffset += (targetDriftOffset - driftOffset) * Math.min(1, dt * 8);

      const activeIndex =
        (((2 + driftOffset) % TOTAL_MEMBERS) + TOTAL_MEMBERS) % TOTAL_MEMBERS;
      const enterFromRightOffset = (1 - carouselT) * (viewportWidth * 0.75);
      const focusRadius = CARD_STEP * 1.15;

      for (let i = 0; i < TOTAL_MEMBERS; i++) {
        let rel = i - activeIndex;
        while (rel > TOTAL_MEMBERS / 2) rel -= TOTAL_MEMBERS;
        while (rel < -TOTAL_MEMBERS / 2) rel += TOTAL_MEMBERS;

        const cardCenterX =
          viewportWidth / 2 + rel * CARD_STEP + enterFromRightOffset;
        const cardLeftX = cardCenterX - CARD_WIDTH / 2;
        const distFromCenter = Math.abs(cardCenterX - viewportWidth / 2);

        const rawFocus = clamp01(1 - distFromCenter / focusRadius);
        const focus = easeInOutCubic(rawFocus);

        const scale = 1 + 0.45 * focus;
        const grayscale = 1 - focus;
        const labelOpacity = 0.45 + 0.55 * focus;
        const metaTranslateY = focus * 56;

        const entry = cardItems[i];
        entry.item.style.transform = `translate3d(${cardLeftX.toFixed(2)}px, -50%, 0)`;
        entry.frame.style.transform = `scale(${scale.toFixed(4)})`;
        entry.frame.style.filter = `grayscale(${grayscale.toFixed(3)})`;
        entry.overlay.style.opacity = focus.toFixed(3);
        entry.meta.style.opacity = labelOpacity.toFixed(3);
        entry.meta.style.transform = `translate3d(0, ${metaTranslateY.toFixed(2)}px, 0)`;
      }

      if (carouselProgressBar) {
        const barProgress =
          progress < 0.985
            ? carouselT
            : clamp(
                ((Math.round(activeIndex) % TOTAL_MEMBERS) + 1) / TOTAL_MEMBERS,
                0.04,
                1,
              );
        carouselProgressBar.style.transform = `scaleX(${barProgress.toFixed(4)})`;
      }
    }

    window.requestAnimationFrame(animateFrame);
  }

  window.requestAnimationFrame(animateFrame);

  // -----------------------------------------------------------------
  // 4. Tombol "Until when?" Scroll ke Section Jelajahi
  // -----------------------------------------------------------------
  untilWhenBtn?.addEventListener("click", () => {
    jelajahiStack?.scrollIntoView({ behavior: "smooth" });
  });
});