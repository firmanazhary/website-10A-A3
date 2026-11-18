document.addEventListener("DOMContentLoaded", () => {
  // =================================================================
  // DATA 33 ANGGOTA INVICTUS (SILAKAN ISI / UBAH DATA DI SINI)
  // =================================================================
  const MEMBERS_DATA = Array.from({ length: 33 }, (_, i) => {
    const numStr = String(i + 1).padStart(2, "0");
    return {
      number: numStr,
      name: `[Nama Anggota ${numStr}]`,
      role: "[Jabatan]",
      photo: `./assets/member-${numStr}.jpg`,
      fallbackPhoto: `https://picsum.photos/seed/invictus-${numStr}/500/680`,
      birthDate: "[Tanggal Lahir]",
      age: "[Umur] Tahun",
      portfolioUrl: "https://example.com",
      portfolioLabel: `portfolio-${numStr}.invictus.id`,
      linkedinUrl: "https://linkedin.com",
      linkedinLabel: `in/anggota-${numStr}`,
      instagramUrl: "https://instagram.com",
      instagramLabel: `@invictus_${numStr}`,
    };
  });

  // =================================================================
  // REFERENSI ELEMEN DOM
  // =================================================================
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

  // Elemen Scroll Transition About -> Anggota & Carousel
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

  // Elemen Modal Detail Profil Anggota
  const memberModalBackdrop = document.getElementById("memberModalBackdrop");
  const memberModalCard = document.getElementById("memberModalCard");
  const closeMemberModalBtn = document.getElementById("closeMemberModalBtn");
  const modalMemberPhoto = document.getElementById("modalMemberPhoto");
  const modalMemberBadge = document.getElementById("modalMemberBadge");
  const modalMemberName = document.getElementById("modalMemberName");
  const modalMemberRole = document.getElementById("modalMemberRole");
  const modalMemberDob = document.getElementById("modalMemberDob");
  const modalMemberAge = document.getElementById("modalMemberAge");
  const modalMemberPortfolio = document.getElementById("modalMemberPortfolio");
  const modalMemberPortfolioLabel = document.getElementById(
    "modalMemberPortfolioLabel",
  );
  const modalMemberLinkedin = document.getElementById("modalMemberLinkedin");
  const modalMemberLinkedinLabel = document.getElementById(
    "modalMemberLinkedinLabel",
  );
  const modalMemberIg = document.getElementById("modalMemberIg");
  const modalMemberIgLabel = document.getElementById("modalMemberIgLabel");
  const modalPrevBtn = document.getElementById("modalPrevBtn");
  const modalNextBtn = document.getElementById("modalNextBtn");
  const modalCounterText = document.getElementById("modalCounterText");

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
  let currentModalIndex = -1;

  // -----------------------------------------------------------------
  // 1. Modal Profil Anggota (Buka / Tutup / Navigasi)
  // -----------------------------------------------------------------
  function openMemberModal(index) {
    const total = MEMBERS_DATA.length;
    const safeIdx = ((index % total) + total) % total;
    currentModalIndex = safeIdx;
    const member = MEMBERS_DATA[safeIdx];

    if (modalMemberPhoto) {
      modalMemberPhoto.src = member.photo;
      modalMemberPhoto.alt = `Foto ${member.name}`;
      modalMemberPhoto.onerror = function () {
        this.onerror = null;
        this.src = member.fallbackPhoto;
      };
    }
    if (modalMemberBadge) {
      modalMemberBadge.textContent = `INVICTUS • #${member.number}`;
    }
    if (modalMemberName) {
      modalMemberName.textContent = member.name;
    }
    if (modalMemberRole) {
      modalMemberRole.textContent = member.role;
    }
    if (modalMemberDob) {
      modalMemberDob.textContent = member.birthDate;
    }
    if (modalMemberAge) {
      modalMemberAge.textContent = member.age;
    }
    if (modalMemberPortfolio) {
      modalMemberPortfolio.href = member.portfolioUrl;
    }
    if (modalMemberPortfolioLabel) {
      modalMemberPortfolioLabel.textContent = member.portfolioLabel;
    }
    if (modalMemberLinkedin) {
      modalMemberLinkedin.href = member.linkedinUrl;
    }
    if (modalMemberLinkedinLabel) {
      modalMemberLinkedinLabel.textContent = member.linkedinLabel;
    }
    if (modalMemberIg) {
      modalMemberIg.href = member.instagramUrl;
    }
    if (modalMemberIgLabel) {
      modalMemberIgLabel.textContent = member.instagramLabel;
    }
    if (modalCounterText) {
      modalCounterText.textContent = `${member.number} / ${String(total).padStart(2, "0")}`;
    }

    if (memberModalBackdrop && memberModalCard) {
      memberModalBackdrop.classList.remove("pointer-events-none", "opacity-0");
      memberModalBackdrop.classList.add("pointer-events-auto", "opacity-100");
      memberModalCard.classList.remove("scale-95", "opacity-0");
      memberModalCard.classList.add("scale-100", "opacity-100");
    }
  }

  function closeMemberModal() {
    currentModalIndex = -1;
    if (memberModalBackdrop && memberModalCard) {
      memberModalBackdrop.classList.add("pointer-events-none", "opacity-0");
      memberModalBackdrop.classList.remove("pointer-events-auto", "opacity-100");
      memberModalCard.classList.add("scale-95", "opacity-0");
      memberModalCard.classList.remove("scale-100", "opacity-100");
    }
  }

  closeMemberModalBtn?.addEventListener("click", closeMemberModal);

  memberModalBackdrop?.addEventListener("click", (e) => {
    if (e.target === memberModalBackdrop) {
      closeMemberModal();
    }
  });

  modalPrevBtn?.addEventListener("click", () => {
    if (currentModalIndex >= 0) {
      openMemberModal(currentModalIndex - 1);
    }
  });

  modalNextBtn?.addEventListener("click", () => {
    if (currentModalIndex >= 0) {
      openMemberModal(currentModalIndex + 1);
    }
  });

  // -----------------------------------------------------------------
  // 2. Hamburger Menu Toggle & Sinkronisasi Menu Aktif
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
    if (e.key === "Escape") {
      if (currentModalIndex >= 0) {
        closeMemberModal();
      } else if (isMenuOpen) {
        setMenuOpen(false);
      }
    } else if (currentModalIndex >= 0 && e.key === "ArrowLeft") {
      openMemberModal(currentModalIndex - 1);
    } else if (currentModalIndex >= 0 && e.key === "ArrowRight") {
      openMemberModal(currentModalIndex + 1);
    }
  });

  // -----------------------------------------------------------------
  // 3. Render 33 Kartu Anggota Sejajar (Tanpa Nonjol, Klik -> Buka Modal)
  // -----------------------------------------------------------------
  const TOTAL_MEMBERS = MEMBERS_DATA.length;
  const CARD_WIDTH = 190;
  const CARD_GAP = 26;
  const CARD_STEP = CARD_WIDTH + CARD_GAP;
  const cardItems = [];

  if (carouselTrack) {
    for (let i = 0; i < TOTAL_MEMBERS; i++) {
      const member = MEMBERS_DATA[i];

      const item = document.createElement("button");
      item.type = "button";
      item.setAttribute("aria-label", `Lihat profil ${member.name}`);
      item.className =
        "group absolute left-0 top-1/2 flex w-[190px] -translate-y-1/2 cursor-pointer flex-col items-center text-center select-none will-change-transform focus:outline-none";

      const frame = document.createElement("div");
      frame.className =
        "relative h-[260px] w-[190px] overflow-hidden rounded-[36px] bg-neutral-200 shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl";

      const img = document.createElement("img");
      img.src = member.photo;
      img.alt = member.name;
      img.loading = "lazy";
      img.className =
        "h-full w-full object-cover object-center grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0";
      img.onerror = function () {
        this.onerror = null;
        this.src = member.fallbackPhoto;
      };

      const badge = document.createElement("span");
      badge.className =
        "pointer-events-none absolute top-3 left-3 rounded-full bg-black/50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100";
      badge.textContent = `#${member.number}`;

      frame.appendChild(img);
      frame.appendChild(badge);

      const meta = document.createElement("div");
      meta.className = "mt-3 flex flex-col items-center text-center";
      meta.innerHTML = `
        <p class="text-xs font-semibold text-neutral-900 transition-colors group-hover:text-black">${member.name}</p>
        <p class="mt-0.5 text-[11px] font-medium text-neutral-500">${member.role}</p>
      `;

      item.appendChild(frame);
      item.appendChild(meta);

      item.addEventListener("click", () => {
        openMemberModal(i);
      });

      carouselTrack.appendChild(item);
      cardItems.push({ item });
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

  // Kontrol pergeseran carousel (halus ke kanan & tombol panah < >)
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
  // 4. Loop Utama requestAnimationFrame
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

      // TAHAP 5 (0.66 - 1.0): Barisan 33 card sejajar rapi tanpa nonjol
      const carouselT = easeOutCubic(segmentProgress(progress, 0.66, 0.98));

      if (
        progress >= 0.985 &&
        !isHoveringCarousel &&
        currentModalIndex < 0 &&
        !reducedMotion.matches
      ) {
        targetDriftOffset -= dt * 0.35;
      } else if (progress < 0.985) {
        targetDriftOffset = 0;
      }

      driftOffset += (targetDriftOffset - driftOffset) * Math.min(1, dt * 8);

      const activeIndex =
        (((3 + driftOffset) % TOTAL_MEMBERS) + TOTAL_MEMBERS) % TOTAL_MEMBERS;
      const enterFromRightOffset = (1 - carouselT) * (viewportWidth * 0.75);

      for (let i = 0; i < TOTAL_MEMBERS; i++) {
        let rel = i - activeIndex;
        while (rel > TOTAL_MEMBERS / 2) rel -= TOTAL_MEMBERS;
        while (rel < -TOTAL_MEMBERS / 2) rel += TOTAL_MEMBERS;

        const cardCenterX =
          viewportWidth / 2 + rel * CARD_STEP + enterFromRightOffset;
        const cardLeftX = cardCenterX - CARD_WIDTH / 2;

        cardItems[i].item.style.transform = `translate3d(${cardLeftX.toFixed(2)}px, -50%, 0)`;
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
  // 5. Tombol "Until when?" Scroll ke Section Jelajahi
  // -----------------------------------------------------------------
  untilWhenBtn?.addEventListener("click", () => {
    jelajahiStack?.scrollIntoView({ behavior: "smooth" });
  });
});
