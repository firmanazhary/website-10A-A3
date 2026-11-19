document.addEventListener("DOMContentLoaded", () => {
  // =================================================================
  // KONFIGURASI UTAMA ANIMASI & DATA (MUDAH DIUBAH)
  // =================================================================
  const GALLERY_CONFIG = {
    batchPhotoUrl: "./asset/DSC08675.JPG",
    batchPhotoFallback:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=85",
    heroInitialZoom: 2.35,
    heroFaceFocusX: 0.5,
    heroFaceFocusY: 0.36,
    columnHeightRatios: [
      [0.58, 0.42],
      [0.4, 0.6],
      [0.55, 0.45],
    ],
    tileGap: 16,
    tileRadius: 28,
    tileMaxRotateDeg: 2.5,
    colParallaxY: 20,
    imgParallaxY: 14,
    dimmedTileOpacity: 0.18,
  };

  // =================================================================
  // DATA 33 ANGGOTA INVICTUS (SILAKAN ISI / UBAH DATA DI SINI)
  // =================================================================
  const MEMBERS_DATA = Array.from({ length: 33 }, (_, i) => {
    const numStr = String(i + 1).padStart(2, "0");
    return {
      number: numStr,
      name: `[Nama Anggota ${numStr}]`,
      role: "[Jabatan]",
      photo: `asset/IVCS Logo (4).jpg`,
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
  // DATA 6 KEPING GALERI MOMEN (MUDAH DIGANTI FOTO, JUDUL, & KATEGORI)
  // =================================================================
  const GALLERY_ITEMS = [
    {
      number: "01",
      title: "[Judul momen]",
      category: "Acara",
      photo: GALLERY_CONFIG.batchPhotoUrl,
    },
    {
      number: "02",
      title: "[Judul momen]",
      category: "Kelas",
      photo: GALLERY_CONFIG.batchPhotoUrl,
    },
    {
      number: "03",
      title: "[Judul momen]",
      category: "Momen",
      photo: GALLERY_CONFIG.batchPhotoUrl,
    },
    {
      number: "04",
      title: "[Judul momen]",
      category: "Acara",
      photo: GALLERY_CONFIG.batchPhotoUrl,
    },
    {
      number: "05",
      title: "[Judul momen]",
      category: "Kelas",
      photo: GALLERY_CONFIG.batchPhotoUrl,
    },
    {
      number: "06",
      title: "[Judul momen]",
      category: "Momen",
      photo: GALLERY_CONFIG.batchPhotoUrl,
    },
  ];

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

  // Elemen Scroll Transition About -> Anggota & Grid 33 Anggota
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
  const membersGrid = document.getElementById("membersGrid");

  // Elemen Galeri & Transisi Members -> Galeri
  const gallerySection = document.getElementById("gallery");
  const galeriStickyStage = document.getElementById("galeriStickyStage");
  const morphMembersCard = document.getElementById("morphMembersCard");
  const morphSideCardsLayer = document.getElementById("morphSideCardsLayer");
  const morphHeroPhoto = document.getElementById("morphHeroPhoto");
  const galeriTilesLayer = document.getElementById("galeriTilesLayer");
  const galeriHeaderContainer = document.getElementById(
    "galeriHeaderContainer",
  );
  const galeriPill = document.getElementById("galeriPill");
  const galeriWords = Array.from(
    document.querySelectorAll("[data-galeri-word]"),
  );
  const galeriFilterBar = document.getElementById("galeriFilterBar");
  const filterButtons = Array.from(
    document.querySelectorAll(".galeri-filter-btn"),
  );
  const cornerAnggota = document.getElementById("galeriCornerAnggota");
  const cornerGaleri = document.getElementById("galeriCornerGaleri");

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
  // 3. Render Semua 33 Kartu Anggota dalam Grid Terpandang Sekaligus
  // -----------------------------------------------------------------
  const TOTAL_MEMBERS = MEMBERS_DATA.length;
  const gridCardElements = [];

  if (membersGrid) {
    for (let i = 0; i < TOTAL_MEMBERS; i++) {
      const member = MEMBERS_DATA[i];

      const cardBtn = document.createElement("button");
      cardBtn.type = "button";
      if (i === 16) {
        cardBtn.id = "hero-member";
      }
      cardBtn.setAttribute("aria-label", `Lihat profil ${member.name}`);
      cardBtn.className =
        "group flex w-full cursor-pointer flex-col items-center text-center select-none will-change-transform focus:outline-none";

      const frame = document.createElement("div");
      frame.className =
        "relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:rounded-[20px] bg-neutral-200 shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:ring-neutral-950/20";

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
        "pointer-events-none absolute top-1.5 left-1.5 rounded-full bg-black/55 px-1.5 py-0.5 font-mono text-[9px] font-semibold leading-none text-white backdrop-blur-md transition-opacity duration-300 opacity-80 group-hover:opacity-100";
      badge.textContent = `#${member.number}`;

      frame.appendChild(img);
      frame.appendChild(badge);

      const meta = document.createElement("div");
      meta.className = "mt-1.5 w-full px-0.5 text-center";
      meta.innerHTML = `
        <p class="truncate text-[10px] sm:text-[11px] font-semibold leading-tight text-neutral-900 transition-colors group-hover:text-black">${member.name}</p>
        <p class="truncate text-[9px] sm:text-[10px] font-medium leading-tight text-neutral-500">${member.role}</p>
      `;

      cardBtn.appendChild(frame);
      cardBtn.appendChild(meta);

      cardBtn.addEventListener("click", () => {
        openMemberModal(i);
      });

      membersGrid.appendChild(cardBtn);
      gridCardElements.push(cardBtn);
    }
  }

  // -----------------------------------------------------------------
  // 4. Setup Galeri Momen (6 Keping 3 Kolom + Filter Kategori)
  // -----------------------------------------------------------------
  let resolvedPhotoUrl = GALLERY_CONFIG.batchPhotoUrl;
  let photoNaturalRatio = 1.5;

  const preloadBatchImg = new Image();
  preloadBatchImg.onload = () => {
    if (preloadBatchImg.naturalWidth && preloadBatchImg.naturalHeight) {
      photoNaturalRatio =
        preloadBatchImg.naturalWidth / preloadBatchImg.naturalHeight;
    }
    resolvedPhotoUrl = preloadBatchImg.src;
    applyResolvedGalleryPhoto();
    measureLayout();
  };
  preloadBatchImg.onerror = () => {
    preloadBatchImg.onerror = null;
    preloadBatchImg.src = GALLERY_CONFIG.batchPhotoFallback;
  };
  preloadBatchImg.src = GALLERY_CONFIG.batchPhotoUrl;

  // 4 kartu samping untuk animasi runtuh ke tengah (Tahap 1 Galeri)
  const sideSourceCards = [
    gridCardElements[14],
    gridCardElements[15],
    gridCardElements[17],
    gridCardElements[18],
  ].filter(Boolean);

  const sideProxyNodes = [];
  if (morphSideCardsLayer) {
    sideSourceCards.forEach((origCard) => {
      const imgEl = origCard.querySelector("img");
      const proxy = document.createElement("div");
      proxy.className =
        "absolute overflow-hidden rounded-[20px] bg-neutral-200 shadow-md will-change-transform";
      if (imgEl) {
        const cloneImg = document.createElement("img");
        cloneImg.src = imgEl.currentSrc || imgEl.src;
        cloneImg.alt = "";
        cloneImg.className =
          "h-full w-full object-cover object-center grayscale";
        proxy.appendChild(cloneImg);
      }
      morphSideCardsLayer.appendChild(proxy);
      sideProxyNodes.push(proxy);
    });
  }

  // Render 6 keping foto galeri
  const tileNodes = [];
  if (galeriTilesLayer) {
    GALLERY_ITEMS.forEach((item, idx) => {
      const colIdx = Math.floor(idx / 2);
      const rowIdx = idx % 2;

      const tileOuter = document.createElement("article");
      tileOuter.className =
        "pointer-events-auto absolute overflow-hidden bg-neutral-900 shadow-2xl will-change-transform";
      tileOuter.dataset.category = item.category;

      const tileFilterWrap = document.createElement("div");
      tileFilterWrap.className =
        "relative h-full w-full transition-opacity duration-300";

      const tileImgLayer = document.createElement("div");
      tileImgLayer.className =
        "absolute -inset-[18px] bg-no-repeat will-change-transform";
      tileImgLayer.style.backgroundImage = `url('${item.photo}')`;

      const scrim = document.createElement("div");
      scrim.className =
        "pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/75 via-black/30 to-transparent";

      const label = document.createElement("div");
      label.className =
        "pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4 opacity-0 will-change-transform";
      label.innerHTML = `
        <span class="truncate text-xs font-medium tracking-wide text-white">
          <span class="font-mono text-[11px] text-white/70">${item.number} &middot;</span> ${item.title}
        </span>
        <span class="shrink-0 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-md">
          ${item.category}
        </span>
      `;

      tileFilterWrap.appendChild(tileImgLayer);
      tileFilterWrap.appendChild(scrim);
      tileFilterWrap.appendChild(label);
      tileOuter.appendChild(tileFilterWrap);
      galeriTilesLayer.appendChild(tileOuter);

      tileNodes.push({
        idx,
        colIdx,
        rowIdx,
        item,
        outer: tileOuter,
        filterWrap: tileFilterWrap,
        imgLayer: tileImgLayer,
        label,
      });
    });
  }

  function applyResolvedGalleryPhoto() {
    if (morphHeroPhoto) {
      morphHeroPhoto.style.backgroundImage = `url('${resolvedPhotoUrl}')`;
    }
    tileNodes.forEach((t) => {
      if (t.item.photo === GALLERY_CONFIG.batchPhotoUrl) {
        t.imgLayer.style.backgroundImage = `url('${resolvedPhotoUrl}')`;
      }
    });
  }
  applyResolvedGalleryPhoto();

  function setActiveGalleryFilter(category) {
    filterButtons.forEach((btn) => {
      const isSelected = btn.dataset.filter === category;
      btn.setAttribute("aria-pressed", String(isSelected));
      btn.className = isSelected
        ? "galeri-filter-btn min-h-[44px] min-w-[44px] cursor-pointer rounded-full bg-white px-5 py-2 text-xs font-semibold text-neutral-950 transition"
        : "galeri-filter-btn min-h-[44px] min-w-[44px] cursor-pointer rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-medium text-white/85 backdrop-blur-md transition hover:bg-white/20";
    });

    tileNodes.forEach((t) => {
      const matched = category === "Semua" || t.item.category === category;
      t.filterWrap.style.opacity = matched
        ? "1"
        : String(GALLERY_CONFIG.dimmedTileOpacity);
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActiveGalleryFilter(btn.dataset.filter || "Semua");
    });
  });

  // -----------------------------------------------------------------
  // 5. Pengukuran Layout & Geometri (Aman terhadap Transform & Resize)
  // -----------------------------------------------------------------
  let slotMetrics = { left: 0, top: 0, width: 400, height: 300 };
  let stageMetrics = { width: window.innerWidth, height: window.innerHeight };
  let groupWidth = marqueeGroup?.offsetWidth || 0;
  let galleryMetrics = null;

  function getOffsetInside(el, ancestor) {
    let left = 0;
    let top = 0;
    let cur = el;
    while (cur && cur !== ancestor) {
      left += cur.offsetLeft;
      top += cur.offsetTop;
      cur = cur.offsetParent;
    }
    return { left, top };
  }

  function measureLayout() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

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

    if (marqueeGroup) {
      groupWidth = marqueeGroup.offsetWidth;
    }

    // Ukuran foto angkatan "cover" seukuran viewport
    let coverW, coverH;
    if (vw / vh > photoNaturalRatio) {
      coverW = vw;
      coverH = vw / photoNaturalRatio;
    } else {
      coverH = vh;
      coverW = vh * photoNaturalRatio;
    }
    const offsetFotoX = (vw - coverW) / 2;
    const offsetFotoY = (vh - coverH) / 2;

    // Posisi alami kartu putih Members (tanpa terpengaruh translateY scroll)
    let cardRect = {
      left: vw * 0.03,
      top: vh * 0.035,
      width: vw * 0.94,
      height: vh * 0.93,
      radius: 44,
    };
    if (anggotaCard) {
      const cs = window.getComputedStyle(anggotaCard);
      cardRect = {
        left: anggotaCard.offsetLeft,
        top: anggotaCard.offsetTop,
        width: anggotaCard.offsetWidth,
        height: anggotaCard.offsetHeight,
        radius: parseFloat(cs.borderTopLeftRadius) || 44,
      };
    }

    const heroEl = document.getElementById("hero-member");
    let heroRect = {
      left: vw / 2 - 55,
      top: vh / 2 - 70,
      width: 110,
      height: 140,
      radius: 20,
    };
    if (heroEl && anggotaCard) {
      const frameEl = heroEl.querySelector("div") || heroEl;
      const off = getOffsetInside(frameEl, anggotaCard);
      const cs = window.getComputedStyle(frameEl);
      if (frameEl.offsetWidth > 10 && frameEl.offsetHeight > 10) {
        heroRect = {
          left: cardRect.left + off.left,
          top: cardRect.top + off.top,
          width: frameEl.offsetWidth,
          height: frameEl.offsetHeight,
          radius: parseFloat(cs.borderTopLeftRadius) || 20,
        };
      }
    }

    const sideRects = sideSourceCards.map((el) => {
      const frameEl = el.querySelector("div") || el;
      const off = anggotaCard
        ? getOffsetInside(frameEl, anggotaCard)
        : { left: 0, top: 0 };
      return {
        left: cardRect.left + off.left,
        top: cardRect.top + off.top,
        width: frameEl.offsetWidth,
        height: frameEl.offsetHeight,
      };
    });

    const headerH = galeriHeaderContainer
      ? galeriHeaderContainer.offsetHeight
      : 210;
    const sidePad = Math.max(24, Math.min(64, vw * 0.05));
    const areaLeft = sidePad;
    const areaW = vw - sidePad * 2;
    const areaTop = Math.min(vh * 0.34, Math.max(195, headerH + 20));
    const areaBottom = vh - Math.max(24, vh * 0.045);
    const areaH = Math.max(240, areaBottom - areaTop);

    galleryMetrics = {
      vw,
      vh,
      coverW,
      coverH,
      offsetFotoX,
      offsetFotoY,
      cardRect,
      heroRect,
      sideRects,
      areaLeft,
      areaTop,
      areaW,
      areaH,
    };
  }

  window.addEventListener("resize", measureLayout, { passive: true });
  measureLayout();

  // -----------------------------------------------------------------
  // 6. Loop Utama requestAnimationFrame
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
    const galRect = gallerySection?.getBoundingClientRect();
    const isInGallery = galRect ? galRect.top <= vh * 0.5 : false;

    if (scrollWrapper && stickyStage && expandingPhotoBox && anggotaCard) {
      const rect = scrollWrapper.getBoundingClientRect();
      const maxScroll = scrollWrapper.offsetHeight - vh;
      const progress = maxScroll > 0 ? clamp01(-rect.top / maxScroll) : 0;

      if (isInGallery) {
        highlightNavLink("gallery");
      } else if (rect.top > vh * 0.4) {
        highlightNavLink("home");
      } else if (progress < 0.52) {
        highlightNavLink("about");
      } else {
        highlightNavLink("members");
      }

      if (scrollCue) {
        const cueT = segmentProgress(progress, 0, 0.1);
        scrollCue.style.opacity = String(1 - cueT);
        scrollCue.style.transform = `translate3d(-50%, ${cueT * 12}px, 0)`;
      }

      const textOutT = easeOutCubic(segmentProgress(progress, 0, 0.3));
      if (aboutTextCol) {
        aboutTextCol.style.opacity = String(1 - textOutT);
        aboutTextCol.style.transform = `translate3d(0, ${-textOutT * 80}px, 0)`;
      }

      const expandT = easeOutCubic(segmentProgress(progress, 0, 0.42));
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

      const darkenT = segmentProgress(progress, 0.32, 0.54);
      const brightnessVal = 1 - 0.7 * darkenT;
      if (expandingPhotoImg) {
        expandingPhotoImg.style.filter = `brightness(${brightnessVal.toFixed(3)})`;
      }

      const labelT = easeInOutCubic(segmentProgress(progress, 0.36, 0.52));
      if (navLabelAbout && navLabelAnggota) {
        navLabelAbout.style.opacity = String(1 - labelT);
        navLabelAbout.style.transform = `translate3d(0, ${-labelT * 8}px, 0)`;
        navLabelAnggota.style.opacity = String(labelT);
        navLabelAnggota.style.transform = `translate3d(0, ${(1 - labelT) * 8}px, 0)`;
      }

      const cardInT = easeOutCubic(segmentProgress(progress, 0.52, 0.74));
      const cardTranslateY = (1 - cardInT) * 105;
      anggotaCard.style.transform = `translate3d(0, ${cardTranslateY}vh, 0)`;

      const pillT = easeOutCubic(segmentProgress(progress, 0.68, 0.78));
      if (anggotaPill) {
        anggotaPill.style.opacity = String(pillT);
        anggotaPill.style.transform = `translate3d(0, ${(1 - pillT) * 12}px, 0)`;
      }

      for (let w = 0; w < titleWords.length; w++) {
        const wordStart = 0.68 + w * 0.03;
        const wordEnd = Math.min(0.86, wordStart + 0.09);
        const wt = easeOutCubic(segmentProgress(progress, wordStart, wordEnd));
        const yPercent = (1 - wt) * 110;
        titleWords[w].style.transform = `translate3d(0, ${yPercent}%, 0)`;
      }

      const gridBaseT = segmentProgress(progress, 0.72, 0.98);
      for (let i = 0; i < gridCardElements.length; i++) {
        const staggerStart = (i / TOTAL_MEMBERS) * 0.45;
        const itemT = easeOutCubic(
          clamp01((gridBaseT - staggerStart) / (1 - staggerStart)),
        );
        gridCardElements[i].style.opacity = String(itemT);
        gridCardElements[i].style.transform = `translate3d(0, ${(1 - itemT) * 18}px, 0)`;
      }
    }

    // ---------------------------------------------------------------
    // Transisi Scroll: Members -> Galeri (progress 0..1)
    // ---------------------------------------------------------------
    if (gallerySection && galeriStickyStage && galleryMetrics) {
      const rect = gallerySection.getBoundingClientRect();
      const maxScroll = gallerySection.offsetHeight - vh;
      const gProgress = maxScroll > 0 ? clamp01(-rect.top / maxScroll) : 0;
      const rm = reducedMotion.matches;

      const {
        vw,
        vh: stageH,
        coverW,
        coverH,
        offsetFotoX,
        offsetFotoY,
        cardRect,
        heroRect,
        sideRects,
        areaLeft,
        areaTop,
        areaW,
        areaH,
      } = galleryMetrics;

      // TAHAP 1 (0 – 0.2): Kartu samping meluncur ke tengah, mengecil (0.6), & memudar
      const sideT = rm
        ? gProgress > 0
          ? 1
          : 0
        : easeInOutCubic(segmentProgress(gProgress, 0, 0.2));
      const heroCenterX = heroRect.left + heroRect.width / 2;
      const heroCenterY = heroRect.top + heroRect.height / 2;

      sideProxyNodes.forEach((proxy, i) => {
        const sr = sideRects[i];
        if (!sr) return;
        const sCenterX = sr.left + sr.width / 2;
        const sCenterY = sr.top + sr.height / 2;
        const dx = (heroCenterX - sCenterX) * sideT;
        const dy = (heroCenterY - sCenterY) * sideT;
        const sc = 1 - 0.4 * sideT;
        const op = 1 - sideT;

        proxy.style.left = `${sr.left}px`;
        proxy.style.top = `${sr.top}px`;
        proxy.style.width = `${sr.width}px`;
        proxy.style.height = `${sr.height}px`;
        proxy.style.opacity = String(op);
        proxy.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${sc})`;
      });

      // TAHAP 2 (0.15 – 0.45): Foto tengah membesar fullscreen & zoom-out ke foto angkatan
      const whiteCardFade =
        1 -
        (rm
          ? gProgress > 0.28
            ? 1
            : 0
          : easeOutCubic(segmentProgress(gProgress, 0.28, 0.42)));
      if (morphMembersCard) {
        morphMembersCard.style.left = `${cardRect.left}px`;
        morphMembersCard.style.top = `${cardRect.top}px`;
        morphMembersCard.style.width = `${cardRect.width}px`;
        morphMembersCard.style.height = `${cardRect.height}px`;
        morphMembersCard.style.borderRadius = `${cardRect.radius}px`;
        morphMembersCard.style.opacity = String(whiteCardFade);
      }

      const expandT = rm
        ? gProgress > 0.15
          ? 1
          : 0
        : easeOutCubic(segmentProgress(gProgress, 0.15, 0.45));
      const curHeroLeft = heroRect.left + (0 - heroRect.left) * expandT;
      const curHeroTop = heroRect.top + (0 - heroRect.top) * expandT;
      const curHeroW = heroRect.width + (vw - heroRect.width) * expandT;
      const curHeroH = heroRect.height + (stageH - heroRect.height) * expandT;
      const curHeroRadius = heroRect.radius * (1 - expandT);

      const zoomFactorStart = GALLERY_CONFIG.heroInitialZoom;
      const startBgW = coverW * zoomFactorStart;
      const startBgH = coverH * zoomFactorStart;
      const startBgX =
        heroRect.width * GALLERY_CONFIG.heroFaceFocusX -
        startBgW * GALLERY_CONFIG.heroFaceFocusX;
      const startBgY =
        heroRect.height * GALLERY_CONFIG.heroFaceFocusY -
        startBgH * GALLERY_CONFIG.heroFaceFocusY;

      const curBgW = startBgW + (coverW - startBgW) * expandT;
      const curBgH = startBgH + (coverH - startBgH) * expandT;
      const curBgX = startBgX + (offsetFotoX - startBgX) * expandT;
      const curBgY = startBgY + (offsetFotoY - startBgY) * expandT;

      if (morphHeroPhoto) {
        morphHeroPhoto.style.opacity = gProgress < 0.45 ? "1" : "0";
        morphHeroPhoto.style.left = `${curHeroLeft}px`;
        morphHeroPhoto.style.top = `${curHeroTop}px`;
        morphHeroPhoto.style.width = `${curHeroW}px`;
        morphHeroPhoto.style.height = `${curHeroH}px`;
        morphHeroPhoto.style.borderRadius = `${curHeroRadius}px`;
        morphHeroPhoto.style.backgroundSize = `${curBgW}px ${curBgH}px`;
        morphHeroPhoto.style.backgroundPosition = `${curBgX}px ${curBgY}px`;
      }

      // Label pojok atas: "002 · ANGGOTA" -> "003 · GALERI" (p > 0.55)
      const cornerT = rm
        ? gProgress > 0.55
          ? 1
          : 0
        : easeInOutCubic(segmentProgress(gProgress, 0.5, 0.6));
      if (cornerAnggota && cornerGaleri) {
        cornerAnggota.style.opacity = String(1 - cornerT);
        cornerAnggota.style.transform = `translate3d(0, ${-cornerT * 8}px, 0)`;
        cornerGaleri.style.opacity = String(cornerT);
        cornerGaleri.style.transform = `translate3d(0, ${(1 - cornerT) * 8}px, 0)`;
      }

      // TAHAP 3 (0.45 – 0.72) & TAHAP 5 (0.8 – 1): 6 Keping & Parallax
      const GAP = GALLERY_CONFIG.tileGap;
      const initColW = vw / 3;
      const targetColW = (areaW - GAP * 2) / 3;
      const targetAvailH = areaH - GAP;

      const parallaxT = rm
        ? gProgress > 0.8
          ? 1
          : 0
        : easeInOutCubic(segmentProgress(gProgress, 0.8, 1.0));
      const colDirections = [-1, 1, -1];

      tileNodes.forEach((tile) => {
        const { idx, colIdx, rowIdx, item, outer, imgLayer, label } = tile;
        const ratios = GALLERY_CONFIG.columnHeightRatios[colIdx];

        const initLeft = colIdx * initColW;
        const initTop = rowIdx === 0 ? 0 : stageH * ratios[0];
        const initW = initColW;
        const initH = stageH * ratios[rowIdx];

        const targetLeft = areaLeft + colIdx * (targetColW + GAP);
        const targetTop =
          rowIdx === 0
            ? areaTop
            : areaTop + targetAvailH * ratios[0] + GAP;
        const targetW = targetColW;
        const targetH = targetAvailH * ratios[rowIdx];

        const staggerStart = 0.45 + idx * 0.025;
        const staggerEnd = 0.66 + idx * 0.025;
        const rawTileT = rm
          ? gProgress > staggerStart
            ? 1
            : 0
          : segmentProgress(gProgress, staggerStart, staggerEnd);
        const tileT = rm ? rawTileT : easeOutCubic(rawTileT);

        const curLeft = initLeft + (targetLeft - initLeft) * tileT;
        const curTop = initTop + (targetTop - initTop) * tileT;
        const curW = initW + (targetW - initW) * tileT;
        const curH = initH + (targetH - initH) * tileT;
        const curRadius = GALLERY_CONFIG.tileRadius * tileT;

        const rotDir = colIdx % 2 === 0 ? 1 : -1;
        const rotateDeg =
          rotDir *
          GALLERY_CONFIG.tileMaxRotateDeg *
          Math.sin(rawTileT * Math.PI);

        const colDir = colDirections[colIdx];
        const colShiftY = colDir * GALLERY_CONFIG.colParallaxY * parallaxT;
        const imgShiftY = -colDir * GALLERY_CONFIG.imgParallaxY * parallaxT;

        outer.style.opacity = gProgress >= 0.45 ? "1" : "0";
        outer.style.left = `${curLeft}px`;
        outer.style.top = `${curTop}px`;
        outer.style.width = `${curW}px`;
        outer.style.height = `${curH}px`;
        outer.style.borderRadius = `${curRadius}px`;
        outer.style.transform = `translate3d(0, ${colShiftY}px, 0) rotate(${rotateDeg.toFixed(3)}deg)`;

        const BLEED = 18;
        if (item.photo === GALLERY_CONFIG.batchPhotoUrl) {
          imgLayer.style.backgroundSize = `${coverW}px ${coverH}px`;
          imgLayer.style.backgroundPosition = `${offsetFotoX - curLeft + BLEED}px ${offsetFotoY - curTop + BLEED}px`;
        } else {
          imgLayer.style.backgroundSize = "cover";
          imgLayer.style.backgroundPosition = "center";
        }
        imgLayer.style.transform = `translate3d(0, ${imgShiftY}px, 0)`;

        const labelT = rm
          ? gProgress > 0.72
            ? 1
            : 0
          : easeOutCubic(segmentProgress(gProgress, 0.72, 0.86));
        label.style.opacity = String(labelT);
        label.style.transform = `translate3d(0, ${(1 - labelT) * 10}px, 0)`;
      });

      // TAHAP 4 (0.6 – 0.86): Pill, Judul kata demi kata, & Filter Pills
      const pillT = rm
        ? gProgress > 0.6
          ? 1
          : 0
        : easeOutCubic(segmentProgress(gProgress, 0.6, 0.7));
      if (galeriPill) {
        galeriPill.style.opacity = String(pillT);
        galeriPill.style.transform = `translate3d(0, ${(1 - pillT) * 14}px, 0)`;
      }

      galeriWords.forEach((wordEl, wIdx) => {
        const wStart = 0.62 + wIdx * 0.04;
        const wEnd = wStart + 0.12;
        const wt = rm
          ? gProgress > wStart
            ? 1
            : 0
          : easeOutCubic(segmentProgress(gProgress, wStart, wEnd));
        wordEl.style.transform = `translate3d(0, ${(1 - wt) * 110}%, 0)`;
      });

      const filterT = rm
        ? gProgress > 0.74
          ? 1
          : 0
        : easeOutCubic(segmentProgress(gProgress, 0.74, 0.86));
      if (galeriFilterBar) {
        galeriFilterBar.style.opacity = String(filterT);
        galeriFilterBar.style.transform = `translate3d(0, ${(1 - filterT) * 14}px, 0)`;
      }
    }

    window.requestAnimationFrame(animateFrame);
  }

  window.requestAnimationFrame(animateFrame);

  // -----------------------------------------------------------------
  // 7. Tombol "Until when?" Scroll ke Section Jelajahi
  // -----------------------------------------------------------------
  untilWhenBtn?.addEventListener("click", () => {
    jelajahiStack?.scrollIntoView({ behavior: "smooth" });
  });
});