document.addEventListener("DOMContentLoaded", () => {
  // =================================================================
  // KONFIGURASI UTAMA ANIMASI & STORAGE KEYS (TERHUBUNG KE ADMIN.HTML)
  // =================================================================
  const STORAGE_KEYS = {
    members: "invictus_admin_members_v1",
    piket: "invictus_admin_piket_v1",
    customPhotos: "invictus_custom_member_photos_v1",
  };

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

  // Foto cadangan jika file foto per anggota belum diisi di folder asset/members/
  const DEFAULT_MEMBER_LOGO = "./asset/IVCS Logo (4).jpg";

  // =================================================================
  // DATA DEFAULT 33 ANGGOTA INVICTUS (DAPAT DIEDIT LEWAT ADMIN.HTML)
  // =================================================================
  function createDefaultMembers() {
    return Array.from({ length: 33 }, (_, idx) => {
      const numStr = String(idx + 1).padStart(2, "0");
      return {
        number: numStr,
        name: `[Nama Anggota ${numStr}]`,
        role: "[Jabatan]",
        motto:
          "Tak terkalahkan bukan berarti tak pernah jatuh, tapi selalu bangkit bersama.",
        photo: `./asset/members/${numStr}.jpg`,
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
  }

  function loadCustomMemberPhotos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.customPhotos);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveCustomMemberPhotos(map) {
    try {
      localStorage.setItem(STORAGE_KEYS.customPhotos, JSON.stringify(map));
    } catch {
      // Abaikan jika kuota storage penuh
    }
  }

  let customMemberPhotos = loadCustomMemberPhotos();

  function loadMembersData() {
    const defaults = createDefaultMembers();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.members);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return defaults;
      return parsed.map((item, i) => ({
        ...defaults[i % defaults.length],
        ...item,
        number: String(
          item.number || String(i + 1).padStart(2, "0"),
        ).padStart(2, "0"),
      }));
    } catch {
      return defaults;
    }
  }

  function saveMembersData(list) {
    try {
      localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(list));
    } catch {
      // Abaikan jika kuota storage penuh
    }
  }

  // =================================================================
  // DATA DEFAULT JADWAL PIKET (DAPAT DIKONTROL LEWAT ADMIN.HTML)
  // =================================================================
  const PIKET_DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  function createDefaultPiket() {
    return {
      note: "Piket dilaksanakan pukul 06.45 WIB sebelum jam pelajaran pertama dimulai.",
      schedule: {
        Senin: [
          { memberNumber: "01", customName: "", task: "Sapu Lantai" },
          { memberNumber: "02", customName: "", task: "Pel & Papan Tulis" },
          { memberNumber: "03", customName: "", task: "Buang Sampah" },
          { memberNumber: "04", customName: "", task: "Rapikan Meja" },
          { memberNumber: "05", customName: "", task: "Cek Kebersihan" },
          { memberNumber: "06", customName: "", task: "Jendela & Kipas" },
        ],
        Selasa: [
          { memberNumber: "07", customName: "", task: "Sapu Lantai" },
          { memberNumber: "08", customName: "", task: "Pel & Papan Tulis" },
          { memberNumber: "09", customName: "", task: "Buang Sampah" },
          { memberNumber: "10", customName: "", task: "Rapikan Meja" },
          { memberNumber: "11", customName: "", task: "Cek Kebersihan" },
          { memberNumber: "12", customName: "", task: "Jendela & Kipas" },
        ],
        Rabu: [
          { memberNumber: "13", customName: "", task: "Sapu Lantai" },
          { memberNumber: "14", customName: "", task: "Pel & Papan Tulis" },
          { memberNumber: "15", customName: "", task: "Buang Sampah" },
          { memberNumber: "16", customName: "", task: "Rapikan Meja" },
          { memberNumber: "17", customName: "", task: "Cek Kebersihan" },
          { memberNumber: "18", customName: "", task: "Jendela & Kipas" },
        ],
        Kamis: [
          { memberNumber: "19", customName: "", task: "Sapu Lantai" },
          { memberNumber: "20", customName: "", task: "Pel & Papan Tulis" },
          { memberNumber: "21", customName: "", task: "Buang Sampah" },
          { memberNumber: "22", customName: "", task: "Rapikan Meja" },
          { memberNumber: "23", customName: "", task: "Cek Kebersihan" },
          { memberNumber: "24", customName: "", task: "Jendela & Kipas" },
        ],
        Jumat: [
          { memberNumber: "25", customName: "", task: "Sapu Lantai" },
          { memberNumber: "26", customName: "", task: "Pel & Papan Tulis" },
          { memberNumber: "27", customName: "", task: "Buang Sampah" },
          { memberNumber: "28", customName: "", task: "Rapikan Meja" },
          { memberNumber: "29", customName: "", task: "Cek Kebersihan" },
        ],
        Sabtu: [
          { memberNumber: "30", customName: "", task: "Sabtu Bersih" },
          { memberNumber: "31", customName: "", task: "Pel & Papan Tulis" },
          { memberNumber: "32", customName: "", task: "Buang Sampah" },
          { memberNumber: "33", customName: "", task: "Rapikan Kelas" },
        ],
      },
    };
  }

  function loadPiketData() {
    const defaults = createDefaultPiket();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.piket);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      return {
        note: parsed.note || defaults.note,
        schedule: {
          ...defaults.schedule,
          ...(parsed.schedule || {}),
        },
      };
    } catch {
      return defaults;
    }
  }

  let MEMBERS_DATA = loadMembersData();
  let PIKET_DATA = loadPiketData();

  // =================================================================
  // DATA 6 KEPING GALERI MOMEN (MUDAH DIGANTI FOTO, JUDUL, & KATEGORI)
  // =================================================================
  const GALLERY_ITEMS = [
    {
      number: "01",
      title: "[Judul momen]",
      category: "Acara",
      description: "[Deskripsi singkat momen kebersamaan angkatan Invictus]",
      photo: GALLERY_CONFIG.batchPhotoUrl,
    },
    {
      number: "02",
      title: "[Judul momen]",
      category: "Kelas",
      description: "[Deskripsi singkat momen kebersamaan angkatan Invictus]",
      photo: GALLERY_CONFIG.batchPhotoUrl,
    },
    {
      number: "03",
      title: "[Judul momen]",
      category: "Momen",
      description: "[Deskripsi singkat momen kebersamaan angkatan Invictus]",
      photo: GALLERY_CONFIG.batchPhotoUrl,
    },
    {
      number: "04",
      title: "[Judul momen]",
      category: "Acara",
      description: "[Deskripsi singkat momen kebersamaan angkatan Invictus]",
      photo: GALLERY_CONFIG.batchPhotoUrl,
    },
    {
      number: "05",
      title: "[Judul momen]",
      category: "Kelas",
      description: "[Deskripsi singkat momen kebersamaan angkatan Invictus]",
      photo: GALLERY_CONFIG.batchPhotoUrl,
    },
    {
      number: "06",
      title: "[Judul momen]",
      category: "Momen",
      description: "[Deskripsi singkat momen kebersamaan angkatan Invictus]",
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

  const scrollWrapper = document.getElementById("jelajahi");
  const stickyStage = document.getElementById("stickyStage");
  const aboutStageLayer = document.getElementById("aboutStageLayer");
  const photoSlot = document.getElementById("photoSlot");
  const aboutTextCol = document.getElementById("aboutTextCol");
  const expandingPhotoBox = document.getElementById("expandingPhotoBox");
  const expandingPhotoImg = document.getElementById("expandingPhotoImg");
  const scrollCue = document.getElementById("scrollCue");
  const navLabelAbout = document.getElementById("navLabelAbout");
  const navLabelAnggota = document.getElementById("navLabelAnggota");
  const navLabelGaleri = document.getElementById("navLabelGaleri");

  const anggotaCard = document.getElementById("anggotaCard");
  const membersHeader = document.getElementById("membersHeader");
  const anggotaPill = document.getElementById("anggotaPill");
  const titleWords = Array.from(document.querySelectorAll("[data-title-word]"));
  const membersGridWrapper = document.getElementById("membersGridWrapper");
  const membersGrid = document.getElementById("membersGrid");

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

  // Elemen Jadwal Piket
  const piketSection = document.getElementById("piket");
  const piketNoteDisplay = document.getElementById("piketNoteDisplay");
  const piketDayFilterBar = document.getElementById("piketDayFilterBar");
  const piketCardsGrid = document.getElementById("piketCardsGrid");

  // Elemen Modal Detail Profil Anggota
  const memberModalBackdrop = document.getElementById("memberModalBackdrop");
  const memberModalCard = document.getElementById("memberModalCard");
  const closeMemberModalBtn = document.getElementById("closeMemberModalBtn");
  const modalMemberPhoto = document.getElementById("modalMemberPhoto");
  const modalMemberBadge = document.getElementById("modalMemberBadge");
  const modalMemberName = document.getElementById("modalMemberName");
  const modalMemberRole = document.getElementById("modalMemberRole");
  const modalMemberMotto = document.getElementById("modalMemberMotto");
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
  const changeMemberPhotoBtn = document.getElementById("changeMemberPhotoBtn");
  const resetMemberPhotoBtn = document.getElementById("resetMemberPhotoBtn");
  const memberPhotoFileInput = document.getElementById("memberPhotoFileInput");

  // Elemen Lightbox Modal Galeri Momen
  const galleryLightboxBackdrop = document.getElementById(
    "galleryLightboxBackdrop",
  );
  const galleryLightboxCard = document.getElementById("galleryLightboxCard");
  const closeLightboxBtn = document.getElementById("closeLightboxBtn");
  const lightboxPhoto = document.getElementById("lightboxPhoto");
  const lightboxNumber = document.getElementById("lightboxNumber");
  const lightboxCategory = document.getElementById("lightboxCategory");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDesc = document.getElementById("lightboxDesc");
  const lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
  const lightboxNextBtn = document.getElementById("lightboxNextBtn");

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
  let currentLightboxIndex = -1;
  let activePiketFilter = "Semua";

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalizeExternalUrl(url) {
    if (!url || url === "#") return "#";
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  }

  function formatPortfolioLabel(url, fallbackLabel) {
    if (!url || url === "#") return fallbackLabel || "-";
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      return (
        parsed.hostname.replace(/^www\./, "") +
        (parsed.pathname !== "/" ? parsed.pathname : "")
      );
    } catch {
      return url;
    }
  }

  // -----------------------------------------------------------------
  // Penyimpanan & Helper Foto Per-Card Anggota
  // -----------------------------------------------------------------
  function getMemberPhotoSource(member) {
    return customMemberPhotos[member.number] || member.photo;
  }

  function applyMemberImgFallback(imgEl, member) {
    const num = member?.number || "01";
    imgEl.dataset.fallbackStep = "0";
    imgEl.onerror = function () {
      const step = Number(this.dataset.fallbackStep || "0");
      if (step === 0 && this.getAttribute("src") !== DEFAULT_MEMBER_LOGO) {
        this.dataset.fallbackStep = "1";
        this.src = DEFAULT_MEMBER_LOGO;
      } else {
        this.onerror = null;
        this.src = `https://picsum.photos/seed/invictus-${num}/500/680`;
      }
    };
    imgEl.src = member ? getMemberPhotoSource(member) : DEFAULT_MEMBER_LOGO;
  }

  function resizeImageToDataUrl(file, maxDimension = 720) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const tempImg = new Image();
        tempImg.onload = () => {
          const ratio = Math.min(
            1,
            maxDimension / Math.max(tempImg.width, tempImg.height),
          );
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(tempImg.width * ratio);
          canvas.height = Math.round(tempImg.height * ratio);
          const ctx = canvas.getContext("2d");
          ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        tempImg.onerror = reject;
        tempImg.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // -----------------------------------------------------------------
  // 1. Modal Profil Anggota & Lightbox Galeri
  // -----------------------------------------------------------------
  const gridCardElements = [];
  const gridCardImgElements = [];

  function openMemberModal(index) {
    const total = MEMBERS_DATA.length;
    if (total === 0) return;
    const safeIdx = ((index % total) + total) % total;
    currentModalIndex = safeIdx;
    const member = MEMBERS_DATA[safeIdx];

    if (modalMemberPhoto) {
      modalMemberPhoto.alt = `Foto ${member.name}`;
      applyMemberImgFallback(modalMemberPhoto, member);
    }
    if (resetMemberPhotoBtn) {
      const hasCustom = Boolean(customMemberPhotos[member.number]);
      resetMemberPhotoBtn.classList.toggle("hidden", !hasCustom);
    }
    if (modalMemberBadge) {
      modalMemberBadge.textContent = `INVICTUS • #${member.number}`;
    }
    if (modalMemberName) {
      modalMemberName.textContent = member.name;
    }
    if (modalMemberRole) {
      modalMemberRole.textContent = member.role || "Anggota Invictus";
    }
    if (modalMemberMotto) {
      modalMemberMotto.textContent = member.motto
        ? `“${member.motto}”`
        : "“Tak terkalahkan bersama Invictus.”";
    }
    if (modalMemberDob) {
      modalMemberDob.textContent = member.birthDate || "-";
    }
    if (modalMemberAge) {
      modalMemberAge.textContent = member.age || "-";
    }
    if (modalMemberPortfolio) {
      modalMemberPortfolio.href = normalizeExternalUrl(member.portfolioUrl);
    }
    if (modalMemberPortfolioLabel) {
      modalMemberPortfolioLabel.textContent = formatPortfolioLabel(
        member.portfolioUrl,
        member.portfolioLabel,
      );
    }
    if (modalMemberLinkedin) {
      modalMemberLinkedin.href = normalizeExternalUrl(member.linkedinUrl);
    }
    if (modalMemberLinkedinLabel) {
      modalMemberLinkedinLabel.textContent = member.linkedinLabel || "LinkedIn";
    }
    if (modalMemberIg) {
      modalMemberIg.href = normalizeExternalUrl(member.instagramUrl);
    }
    if (modalMemberIgLabel) {
      modalMemberIgLabel.textContent = member.instagramLabel || "Instagram";
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

  // Event ganti foto per satuan card langsung dari Modal (tersinkron ke Admin juga)
  changeMemberPhotoBtn?.addEventListener("click", () => {
    if (currentModalIndex >= 0) {
      memberPhotoFileInput?.click();
    }
  });

  memberPhotoFileInput?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file || currentModalIndex < 0) return;

    const member = MEMBERS_DATA[currentModalIndex];
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      customMemberPhotos[member.number] = dataUrl;
      saveCustomMemberPhotos(customMemberPhotos);

      MEMBERS_DATA[currentModalIndex].photo = dataUrl;
      saveMembersData(MEMBERS_DATA);

      if (modalMemberPhoto) {
        modalMemberPhoto.onerror = null;
        modalMemberPhoto.src = dataUrl;
      }
      const cardImg = gridCardImgElements[currentModalIndex];
      if (cardImg) {
        cardImg.onerror = null;
        cardImg.src = dataUrl;
      }
      resetMemberPhotoBtn?.classList.remove("hidden");
      renderPiketSection();
    } finally {
      memberPhotoFileInput.value = "";
    }
  });

  resetMemberPhotoBtn?.addEventListener("click", () => {
    if (currentModalIndex < 0) return;
    const member = MEMBERS_DATA[currentModalIndex];
    delete customMemberPhotos[member.number];
    saveCustomMemberPhotos(customMemberPhotos);

    const defaultPhotoPath = `./asset/members/${member.number}.jpg`;
    MEMBERS_DATA[currentModalIndex].photo = defaultPhotoPath;
    saveMembersData(MEMBERS_DATA);

    if (modalMemberPhoto) {
      applyMemberImgFallback(modalMemberPhoto, MEMBERS_DATA[currentModalIndex]);
    }
    const cardImg = gridCardImgElements[currentModalIndex];
    if (cardImg) {
      applyMemberImgFallback(cardImg, MEMBERS_DATA[currentModalIndex]);
    }
    resetMemberPhotoBtn.classList.add("hidden");
    renderPiketSection();
  });

  function openGalleryLightbox(index) {
    const total = GALLERY_ITEMS.length;
    const safeIdx = ((index % total) + total) % total;
    currentLightboxIndex = safeIdx;
    const item = GALLERY_ITEMS[safeIdx];

    if (lightboxPhoto) {
      lightboxPhoto.src =
        item.photo === GALLERY_CONFIG.batchPhotoUrl
          ? resolvedPhotoUrl
          : item.photo;
      lightboxPhoto.alt = item.title;
      lightboxPhoto.onerror = function () {
        this.onerror = null;
        this.src = GALLERY_CONFIG.batchPhotoFallback;
      };
    }
    if (lightboxNumber) {
      lightboxNumber.textContent = `${item.number} / ${String(total).padStart(2, "0")}`;
    }
    if (lightboxCategory) {
      lightboxCategory.textContent = item.category;
    }
    if (lightboxTitle) {
      lightboxTitle.textContent = item.title;
    }
    if (lightboxDesc) {
      lightboxDesc.textContent = item.description || "";
    }

    if (galleryLightboxBackdrop && galleryLightboxCard) {
      galleryLightboxBackdrop.classList.remove(
        "pointer-events-none",
        "opacity-0",
      );
      galleryLightboxBackdrop.classList.add(
        "pointer-events-auto",
        "opacity-100",
      );
      galleryLightboxCard.classList.remove("scale-95", "opacity-0");
      galleryLightboxCard.classList.add("scale-100", "opacity-100");
    }
  }

  function closeGalleryLightbox() {
    currentLightboxIndex = -1;
    if (galleryLightboxBackdrop && galleryLightboxCard) {
      galleryLightboxBackdrop.classList.add("pointer-events-none", "opacity-0");
      galleryLightboxBackdrop.classList.remove(
        "pointer-events-auto",
        "opacity-100",
      );
      galleryLightboxCard.classList.add("scale-95", "opacity-0");
      galleryLightboxCard.classList.remove("scale-100", "opacity-100");
    }
  }

  closeMemberModalBtn?.addEventListener("click", closeMemberModal);
  memberModalBackdrop?.addEventListener("click", (e) => {
    if (e.target === memberModalBackdrop) closeMemberModal();
  });
  modalPrevBtn?.addEventListener("click", () => {
    if (currentModalIndex >= 0) openMemberModal(currentModalIndex - 1);
  });
  modalNextBtn?.addEventListener("click", () => {
    if (currentModalIndex >= 0) openMemberModal(currentModalIndex + 1);
  });

  closeLightboxBtn?.addEventListener("click", closeGalleryLightbox);
  galleryLightboxBackdrop?.addEventListener("click", (e) => {
    if (e.target === galleryLightboxBackdrop) closeGalleryLightbox();
  });
  lightboxPrevBtn?.addEventListener("click", () => {
    if (currentLightboxIndex >= 0)
      openGalleryLightbox(currentLightboxIndex - 1);
  });
  lightboxNextBtn?.addEventListener("click", () => {
    if (currentLightboxIndex >= 0)
      openGalleryLightbox(currentLightboxIndex + 1);
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
      if (currentLightboxIndex >= 0) {
        closeGalleryLightbox();
      } else if (currentModalIndex >= 0) {
        closeMemberModal();
      } else if (isMenuOpen) {
        setMenuOpen(false);
      }
    } else if (currentLightboxIndex >= 0 && e.key === "ArrowLeft") {
      openGalleryLightbox(currentLightboxIndex - 1);
    } else if (currentLightboxIndex >= 0 && e.key === "ArrowRight") {
      openGalleryLightbox(currentLightboxIndex + 1);
    } else if (currentModalIndex >= 0 && e.key === "ArrowLeft") {
      openMemberModal(currentModalIndex - 1);
    } else if (currentModalIndex >= 0 && e.key === "ArrowRight") {
      openMemberModal(currentModalIndex + 1);
    }
  });

  // -----------------------------------------------------------------
  // 3. Render Semua 33 Kartu Anggota dalam Grid Terpandang Sekaligus
  // -----------------------------------------------------------------
  const HERO_MEMBER_INDEX = 16; // Kartu #17 (tengah baris ke-2)

  function renderMembersGrid() {
    if (!membersGrid) return;
    membersGrid.innerHTML = "";
    gridCardElements.length = 0;
    gridCardImgElements.length = 0;

    for (let i = 0; i < MEMBERS_DATA.length; i++) {
      const member = MEMBERS_DATA[i];

      const cardBtn = document.createElement("button");
      cardBtn.type = "button";
      if (i === HERO_MEMBER_INDEX) {
        cardBtn.id = "hero-member";
      }
      cardBtn.setAttribute("aria-label", `Lihat profil ${member.name}`);
      cardBtn.className =
        "group flex w-full cursor-pointer flex-col items-center text-center select-none will-change-transform focus:outline-none";

      const frame = document.createElement("div");
      frame.className =
        "relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:rounded-[20px] bg-neutral-200 shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:ring-neutral-950/20";

      const img = document.createElement("img");
      img.alt = member.name;
      img.loading = "lazy";
      img.className =
        "h-full w-full object-cover object-center grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0";
      applyMemberImgFallback(img, member);

      const badge = document.createElement("span");
      badge.className =
        "pointer-events-none absolute top-1.5 left-1.5 rounded-full bg-black/55 px-1.5 py-0.5 font-mono text-[9px] font-semibold leading-none text-white backdrop-blur-md transition-opacity duration-300 opacity-80 group-hover:opacity-100";
      badge.textContent = `#${member.number}`;

      frame.appendChild(img);
      frame.appendChild(badge);

      const meta = document.createElement("div");
      meta.className = "mt-1.5 w-full px-0.5 text-center";
      meta.innerHTML = `
        <p class="truncate text-[10px] sm:text-[11px] font-semibold leading-tight text-neutral-900 transition-colors group-hover:text-black">${escapeHtml(member.name)}</p>
        <p class="truncate text-[9px] sm:text-[10px] font-medium leading-tight text-neutral-500">${escapeHtml(member.motto || member.role)}</p>
      `;

      cardBtn.appendChild(frame);
      cardBtn.appendChild(meta);

      cardBtn.addEventListener("click", () => {
        openMemberModal(i);
      });

      membersGrid.appendChild(cardBtn);
      gridCardElements.push(cardBtn);
      gridCardImgElements.push(img);
    }
  }

  renderMembersGrid();

  // -----------------------------------------------------------------
  // 4. Render Jadwal Piket Kelas (Dinamis dari PIKET_DATA & MEMBERS_DATA)
  // -----------------------------------------------------------------
  function getTodayIndonesianDay() {
    const map = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return map[new Date().getDay()] || "Senin";
  }

  function renderPiketSection() {
    if (piketNoteDisplay) {
      piketNoteDisplay.textContent =
        PIKET_DATA.note ||
        "Piket dilaksanakan pukul 06.45 WIB sebelum jam pelajaran pertama dimulai.";
    }

    const todayName = getTodayIndonesianDay();

    if (piketDayFilterBar) {
      const filters = ["Semua", ...PIKET_DAYS];
      piketDayFilterBar.innerHTML = "";
      filters.forEach((day) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `piket-day-btn ${activePiketFilter === day ? "is-active" : ""}`;
        btn.textContent = day === "Semua" ? "Semua Hari" : day;
        if (day === todayName) {
          const dot = document.createElement("span");
          dot.style.cssText =
            "width:6px;height:6px;border-radius:999px;background:#22c55e;display:inline-block;";
          btn.appendChild(dot);
        }
        btn.addEventListener("click", () => {
          activePiketFilter = day;
          renderPiketSection();
        });
        piketDayFilterBar.appendChild(btn);
      });
    }

    if (piketCardsGrid) {
      piketCardsGrid.innerHTML = "";
      const visibleDays =
        activePiketFilter === "Semua"
          ? PIKET_DAYS
          : PIKET_DAYS.filter((d) => d === activePiketFilter);

      visibleDays.forEach((day) => {
        const entries = PIKET_DATA.schedule[day] || [];
        const isToday = day === todayName;

        const card = document.createElement("article");
        card.className = `piket-day-card ${isToday ? "is-today" : ""}`;

        const head = document.createElement("div");
        head.className = "piket-card-head";
        head.innerHTML = `
          <div>
            <span class="piket-day-name">${day}</span>
            ${isToday ? '<span class="piket-today-badge">Hari Ini</span>' : ""}
          </div>
          <span class="piket-count-badge">${entries.length} Petugas</span>
        `;
        card.appendChild(head);

        const list = document.createElement("div");
        list.className = "piket-staff-list";

        if (entries.length === 0) {
          const empty = document.createElement("div");
          empty.className = "piket-empty";
          empty.textContent = "Belum ada petugas piket yang dijadwalkan.";
          list.appendChild(empty);
        } else {
          entries.forEach((entry) => {
            const memberIdx = MEMBERS_DATA.findIndex(
              (m) => m.number === entry.memberNumber,
            );
            const linkedMember = memberIdx >= 0 ? MEMBERS_DATA[memberIdx] : null;
            const displayName = linkedMember
              ? linkedMember.name
              : entry.customName || "Anggota Invictus";
            const subLabel = linkedMember
              ? `#${linkedMember.number}`
              : "Petugas";

            const row = document.createElement("div");
            row.className = `piket-staff-item ${linkedMember ? "is-clickable" : ""}`;
            if (linkedMember) {
              row.title = `Klik untuk melihat profil ${displayName}`;
              row.addEventListener("click", () => openMemberModal(memberIdx));
            }

            const left = document.createElement("div");
            left.className = "piket-staff-left";

            const avatar = document.createElement("img");
            avatar.className = "piket-avatar";
            avatar.alt = displayName;
            applyMemberImgFallback(avatar, linkedMember);

            const info = document.createElement("div");
            info.className = "piket-staff-info";
            info.innerHTML = `
              <div class="piket-staff-name">${escapeHtml(displayName)}</div>
              <div class="piket-staff-num">${escapeHtml(subLabel)}</div>
            `;

            left.appendChild(avatar);
            left.appendChild(info);

            const taskBadge = document.createElement("span");
            taskBadge.className = "piket-task-tag";
            taskBadge.textContent = entry.task || "Piket Kelas";

            row.appendChild(left);
            row.appendChild(taskBadge);
            list.appendChild(row);
          });
        }

        card.appendChild(list);
        piketCardsGrid.appendChild(card);
      });
    }
  }

  renderPiketSection();

  // Sinkronisasi otomatis antar-tab saat Admin menyimpan perubahan
  window.addEventListener("storage", (e) => {
    if (
      e.key === STORAGE_KEYS.members ||
      e.key === STORAGE_KEYS.customPhotos
    ) {
      customMemberPhotos = loadCustomMemberPhotos();
      MEMBERS_DATA = loadMembersData();
      renderMembersGrid();
      renderPiketSection();
      measureLayout();
    } else if (e.key === STORAGE_KEYS.piket) {
      PIKET_DATA = loadPiketData();
      renderPiketSection();
    }
  });

  // -----------------------------------------------------------------
  // 5. Setup Galeri Momen (6 Keping 3 Kolom + Filter Kategori + Lightbox)
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

  const tileNodes = [];
  if (galeriTilesLayer) {
    GALLERY_ITEMS.forEach((item, idx) => {
      const colIdx = Math.floor(idx / 2);
      const rowIdx = idx % 2;

      const tileOuter = document.createElement("article");
      tileOuter.className =
        "absolute overflow-hidden bg-neutral-900 shadow-2xl will-change-transform";
      tileOuter.dataset.category = item.category;
      tileOuter.setAttribute("role", "button");
      tileOuter.setAttribute("tabindex", "0");
      tileOuter.setAttribute(
        "aria-label",
        `Buka foto ${item.number}: ${item.title}`,
      );

      const tileFilterWrap = document.createElement("div");
      tileFilterWrap.className =
        "relative h-full w-full transition-opacity duration-300";

      const tileImgLayer = document.createElement("div");
      tileImgLayer.className =
        "galeri-tile-img absolute -inset-[18px] bg-no-repeat will-change-transform";
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

      tileOuter.addEventListener("click", () => {
        openGalleryLightbox(idx);
      });
      tileOuter.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openGalleryLightbox(idx);
        }
      });

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
  // 6. Pengukuran Layout & Geometri
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

    const headerH = galeriHeaderContainer
      ? galeriHeaderContainer.offsetHeight
      : 220;
    const sidePad = Math.max(24, Math.min(64, vw * 0.05));
    const areaLeft = sidePad;
    const areaW = vw - sidePad * 2;
    const areaTop = Math.max(headerH + 18, Math.min(vh * 0.36, headerH + 28));
    const areaBottom = vh - Math.max(24, vh * 0.045);
    const areaH = Math.max(220, areaBottom - areaTop);

    galleryMetrics = {
      vw,
      vh,
      coverW,
      coverH,
      offsetFotoX,
      offsetFotoY,
      heroRect,
      areaLeft,
      areaTop,
      areaW,
      areaH,
    };
  }

  window.addEventListener("resize", measureLayout, { passive: true });
  measureLayout();

  // -----------------------------------------------------------------
  // 7. Loop Utama requestAnimationFrame
  // -----------------------------------------------------------------
  let posX = -groupWidth;
  let lastFrameTime = performance.now();
  const baseMarqueeSpeed = 48;

  function animateFrame(now) {
    const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
    lastFrameTime = now;

    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    const deltaY = Math.abs(scrollY - lastScrollY);
    lastScrollY = scrollY;
    if (deltaY > 0) {
      scrollBoost = Math.min(950, scrollBoost + deltaY * 7.5);
    }

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

    if (scrollWrapper && stickyStage && expandingPhotoBox && anggotaCard) {
      const rect = scrollWrapper.getBoundingClientRect();
      const maxScroll = scrollWrapper.offsetHeight - vh;
      const totalProgress = maxScroll > 0 ? clamp01(-rect.top / maxScroll) : 0;
      const rm = reducedMotion.matches;

      const progress = clamp01(totalProgress / 0.31);
      const gProgress = clamp01((totalProgress - 0.36) / 0.64);

      const piketTop = piketSection
        ? piketSection.getBoundingClientRect().top
        : Infinity;

      if (piketTop <= vh * 0.45) {
        highlightNavLink("piket");
      } else if (rect.top > vh * 0.4) {
        highlightNavLink("home");
      } else if (totalProgress < 0.18) {
        highlightNavLink("about");
      } else if (totalProgress < 0.56) {
        highlightNavLink("members");
      } else {
        highlightNavLink("gallery");
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

      if (aboutStageLayer) {
        aboutStageLayer.style.opacity = gProgress > 0.12 ? "0" : "1";
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

      const membersExitT = rm
        ? gProgress > 0
          ? 1
          : 0
        : easeInOutCubic(segmentProgress(gProgress, 0, 0.22));

      if (membersHeader) {
        membersHeader.style.opacity = String(1 - membersExitT);
        membersHeader.style.transform = `translate3d(0, ${-membersExitT * 18}px, 0)`;
      }

      const heroCardFadeOut = rm
        ? gProgress > 0.04
          ? 1
          : 0
        : segmentProgress(gProgress, 0.02, 0.1);

      const gridBaseT = segmentProgress(progress, 0.72, 0.98);
      const totalMembers = gridCardElements.length || 33;
      for (let i = 0; i < gridCardElements.length; i++) {
        const staggerStart = (i / totalMembers) * 0.45;
        const itemInT = easeOutCubic(
          clamp01((gridBaseT - staggerStart) / (1 - staggerStart)),
        );

        if (i === HERO_MEMBER_INDEX) {
          const op = itemInT * (1 - heroCardFadeOut);
          gridCardElements[i].style.opacity = String(op);
          gridCardElements[i].style.transform = `translate3d(0, ${(1 - itemInT) * 18}px, 0) scale(1)`;
        } else {
          const op = itemInT * (1 - membersExitT);
          const sc = 1 - 0.26 * membersExitT;
          gridCardElements[i].style.opacity = String(op);
          gridCardElements[i].style.transform = `translate3d(0, ${(1 - itemInT) * 18}px, 0) scale(${sc.toFixed(4)})`;
        }
      }

      const whiteCardFade =
        1 -
        (rm
          ? gProgress > 0.25
            ? 1
            : 0
          : easeOutCubic(segmentProgress(gProgress, 0.16, 0.42)));

      anggotaCard.style.opacity = String(whiteCardFade);
      anggotaCard.style.pointerEvents =
        progress > 0.7 && gProgress < 0.18 ? "auto" : "none";

      const bgDarkT = rm
        ? gProgress > 0.2
          ? 1
          : 0
        : easeInOutCubic(segmentProgress(gProgress, 0.16, 0.42));
      const bgChannel = Math.round(255 - (255 - 11) * bgDarkT);
      stickyStage.style.backgroundColor = `rgb(${bgChannel}, ${bgChannel}, ${bgChannel})`;

      const aboutToAnggotaT = easeInOutCubic(segmentProgress(progress, 0.36, 0.52));
      const anggotaToGaleriT = rm
        ? gProgress > 0.55
          ? 1
          : 0
        : easeInOutCubic(segmentProgress(gProgress, 0.5, 0.6));

      if (navLabelAbout && navLabelAnggota && navLabelGaleri) {
        navLabelAbout.style.opacity = String(1 - aboutToAnggotaT);
        navLabelAbout.style.transform = `translate3d(0, ${-aboutToAnggotaT * 8}px, 0)`;

        navLabelAnggota.style.opacity = String(
          aboutToAnggotaT * (1 - anggotaToGaleriT),
        );
        navLabelAnggota.style.transform = `translate3d(0, ${(1 - aboutToAnggotaT) * 8 - anggotaToGaleriT * 8}px, 0)`;

        navLabelGaleri.style.opacity = String(anggotaToGaleriT);
        navLabelGaleri.style.transform = `translate3d(0, ${(1 - anggotaToGaleriT) * 8}px, 0)`;
      }

      if (galleryMetrics) {
        const {
          vw,
          vh: stageH,
          coverW,
          coverH,
          offsetFotoX,
          offsetFotoY,
          heroRect,
          areaLeft,
          areaTop,
          areaW,
          areaH,
        } = galleryMetrics;

        const gridScrollTop = membersGridWrapper?.scrollTop || 0;
        const startLeft = heroRect.left;
        const startTop = heroRect.top - gridScrollTop;

        const morphInOpacity = rm
          ? gProgress > 0
            ? 1
            : 0
          : segmentProgress(gProgress, 0.0, 0.08);

        const expandGalleryT = rm
          ? gProgress > 0.12
            ? 1
            : 0
          : easeOutCubic(segmentProgress(gProgress, 0.12, 0.45));

        const curHeroLeft = startLeft + (0 - startLeft) * expandGalleryT;
        const curHeroTop = startTop + (0 - startTop) * expandGalleryT;
        const curHeroW =
          heroRect.width + (vw - heroRect.width) * expandGalleryT;
        const curHeroH =
          heroRect.height + (stageH - heroRect.height) * expandGalleryT;
        const curHeroRadius = heroRect.radius * (1 - expandGalleryT);

        const zoomFactorStart = GALLERY_CONFIG.heroInitialZoom;
        const startBgW = coverW * zoomFactorStart;
        const startBgH = coverH * zoomFactorStart;
        const startBgX =
          heroRect.width * GALLERY_CONFIG.heroFaceFocusX -
          startBgW * GALLERY_CONFIG.heroFaceFocusX;
        const startBgY =
          heroRect.height * GALLERY_CONFIG.heroFaceFocusY -
          startBgH * GALLERY_CONFIG.heroFaceFocusY;

        const curBgW = startBgW + (coverW - startBgW) * expandGalleryT;
        const curBgH = startBgH + (coverH - startBgH) * expandGalleryT;
        const curBgX = startBgX + (offsetFotoX - startBgX) * expandGalleryT;
        const curBgY = startBgY + (offsetFotoY - startBgY) * expandGalleryT;

        if (morphHeroPhoto) {
          morphHeroPhoto.style.opacity =
            gProgress > 0 && gProgress < 0.45 ? String(morphInOpacity) : "0";
          morphHeroPhoto.style.left = `${curHeroLeft}px`;
          morphHeroPhoto.style.top = `${curHeroTop}px`;
          morphHeroPhoto.style.width = `${curHeroW}px`;
          morphHeroPhoto.style.height = `${curHeroH}px`;
          morphHeroPhoto.style.borderRadius = `${curHeroRadius}px`;
          morphHeroPhoto.style.backgroundSize = `${curBgW}px ${curBgH}px`;
          morphHeroPhoto.style.backgroundPosition = `${curBgX}px ${curBgY}px`;
        }

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

        if (galeriTilesLayer) {
          galeriTilesLayer.style.opacity = gProgress >= 0.45 ? "1" : "0";
          galeriTilesLayer.classList.toggle("is-active", gProgress >= 0.55);
        }

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

        if (galeriHeaderContainer) {
          galeriHeaderContainer.style.opacity = gProgress >= 0.58 ? "1" : "0";
        }

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
          galeriFilterBar.classList.toggle("is-active", gProgress >= 0.76);
        }
      }
    }

    window.requestAnimationFrame(animateFrame);
  }

  window.requestAnimationFrame(animateFrame);

  // -----------------------------------------------------------------
  // 8. Tombol "Until when?" Scroll ke Section Jelajahi
  // -----------------------------------------------------------------
  untilWhenBtn?.addEventListener("click", () => {
    jelajahiStack?.scrollIntoView({ behavior: "smooth" });
  });
});
