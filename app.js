(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var members = window.INV.members, piket = window.INV.piket;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- split text + marquee ---------- */
  function split(el, text, stagger, delay, cls) {
    el.innerHTML = text.split("").map(function (c, i) {
      return "<span class='" + (cls ? "fmask" : "mask") + "' aria-hidden='true'><span class='ch" + (cls ? " fl" : "") + "' style='animation-delay:" + (delay + i * stagger) + "s'>" + c + "</span></span>";
    }).join("");
  }
  split($("#heroTitle"), "INVICTUS", 0.05, 0.2);
  var footIO = new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) { split($("#footTitle"), "INVICTUS", 0.06, 0, true); footIO.disconnect(); }
  }, { threshold: 0.3 });
  footIO.observe($("#footTitle"));

  function marqueeHTML(text) {
    var row = ""; for (var i = 0; i < 8; i++) row += "<span class='px-6'>" + text + "</span>";
    return "<div class='overflow-hidden border-y border-line bg-accent py-3 text-bg'><div class='marquee-track flex w-max whitespace-nowrap font-display text-3xl font-bold tracking-[-0.03em] md:text-5xl'><div class='flex'>" + row + "</div><div class='flex' aria-hidden='true'>" + row + "</div></div></div>";
  }
  function fillMarquees(root) { $$("[data-marquee]", root).forEach(function (el) { el.innerHTML = marqueeHTML(el.getAttribute("data-marquee")); }); }
  fillMarquees(document);

  /* ---------- counters ---------- */
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, to = +el.getAttribute("data-count"), t0 = performance.now();
      (function step(t) { var p = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(t0);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach(function (el) { cio.observe(el); });

  /* ---------- members: tabs + grid ---------- */
  var filter = "ALL";
  function cardHTML(m) {
    var badge = m.cls === "A" ? "bg-accent text-bg" : "bg-violet text-fg";
    return "<a href='#" + m.slug + "' data-go='" + m.slug + "' data-cursor='BUKA' class='card pop group relative block'>" +
      "<div class='card-inner relative overflow-hidden rounded-2xl border border-line bg-surface'>" +
        "<div class='relative aspect-[4/5] overflow-hidden bg-surface2'>" +
          "<img src=\"" + m.photo + "\" alt='" + m.name + "' class='card-photo h-full w-full object-cover'>" +
          "<div class='spot'></div><div class='frame'></div>" +
          "<span class='absolute left-3 top-3 rounded-full bg-bg/80 px-3 py-1 font-mono text-[10px] tracking-widest backdrop-blur'>" + m.id + "</span>" +
          "<span class='absolute right-3 top-3 rounded-full px-3 py-1 font-mono text-[10px] font-bold tracking-widest " + badge + "'>KELAS " + m.cls + "</span>" +
          "<div class='drawer'><p class='text-sm leading-snug text-fg/90'>" + m.bio + "</p><p class='mt-3 font-mono text-[11px] tracking-widest text-accent'>BUKA PROFIL →</p></div>" +
        "</div>" +
        "<div class='p-4'><h3 class='font-display text-lg font-bold leading-tight tracking-[-0.03em] transition-colors group-hover:text-accent md:text-xl'>" + m.name + "</h3></div>" +
      "</div></a>";
  }
  function renderGrid() {
    var list = members.filter(function (m) { return filter === "ALL" || m.cls === filter; });
    $("#grid").innerHTML = list.map(cardHTML).join("");
    $$("#grid > a").forEach(function (el, i) { el.style.animationDelay = (i * 0.03) + "s"; });
  }
  function renderTabs() {
    var cnt = { ALL: 26, A: 14, B: 12 }, labels = { ALL: "SEMUA", A: "KELAS A", B: "KELAS B" };
    $("#tabs").innerHTML = ["ALL", "A", "B"].map(function (k) {
      var on = filter === k;
      return "<button data-tab='" + k + "' class='rounded-full border px-5 py-2.5 font-mono text-xs tracking-widest transition-colors " + (on ? "border-accent bg-accent text-bg" : "border-line text-fg hover:border-fg") + "'>" + labels[k] + " (" + cnt[k] + ")</button>";
    }).join("");
  }
  function setFilter(k) { filter = k; renderTabs(); renderGrid(); }
  $("#tabs").addEventListener("click", function (e) {
    var t = e.target.closest("[data-tab]"); if (t) setFilter(t.getAttribute("data-tab"));
  });
  renderTabs(); renderGrid();

  // 3D tilt + spotlight mengikuti kursor
  var grid = $("#grid");
  grid.addEventListener("mousemove", function (e) {
    var card = e.target.closest(".card"); if (!card) return;
    var inner = $(".card-inner", card), r = card.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    inner.classList.remove("leaving");
    inner.style.setProperty("--ry", ((px - 0.5) * 12).toFixed(2) + "deg");
    inner.style.setProperty("--rx", ((0.5 - py) * 12).toFixed(2) + "deg");
    inner.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
    inner.style.setProperty("--my", (py * 100).toFixed(1) + "%");
  });
  grid.addEventListener("mouseout", function (e) {
    var card = e.target.closest(".card"); if (!card || card.contains(e.relatedTarget)) return;
    var inner = $(".card-inner", card);
    inner.classList.add("leaving"); inner.style.setProperty("--rx", "0deg"); inner.style.setProperty("--ry", "0deg");
  });

  /* ---------- piket ---------- */
  $("#piketGrid").innerHTML = piket.map(function (p) {
    return "<article class='group rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-violet'>" +
      "<div class='mb-6 flex items-start justify-between gap-3'><h3 class='font-mono text-4xl font-bold tracking-tight transition-colors group-hover:text-accent md:text-5xl'>" + p.day + "</h3>" +
      "<span class='shrink-0 pt-2 font-mono text-xs text-muted'>" + p.crew.length + " ORANG</span></div>" +
      "<ul class='flex flex-wrap gap-2'>" + p.crew.map(function (m) {
        return "<li><a href='#" + m.slug + "' data-go='" + m.slug + "' class='inline-flex items-center gap-2 rounded-full border border-line bg-surface2 px-3.5 py-1.5 text-sm transition-all hover:border-accent hover:bg-accent hover:text-bg'><span class='font-mono text-[10px] opacity-60'>" + m.id + "</span>" + m.name + "</a></li>";
      }).join("") + "</ul></article>";
  }).join("");

  /* ---------- detail view ---------- */
  function detailHTML(m) {
    var i = members.indexOf(m), prev = members[(i + members.length - 1) % members.length], next = members[(i + 1) % members.length];
    return "<section class='grid min-h-screen grid-cols-1 gap-10 gutter pb-20 pt-28 md:grid-cols-2 md:gap-16'>" +
      "<div class='reveal-photo relative aspect-[4/5] w-full max-w-full overflow-hidden rounded-3xl border border-line bg-surface2 md:sticky md:top-24 md:self-start'><img src=\"" + m.photo + "\" alt='" + m.name + "' class='h-full w-full object-cover'>" +
      "<span class='absolute left-4 top-4 rounded-full bg-bg/80 px-3 py-1 font-mono text-xs tracking-widest backdrop-blur'>" + m.id + "</span></div>" +
      "<div class='flex min-w-0 flex-col justify-center'>" +
      "<a href='#home' data-go='home' data-section='members' class='mb-10 inline-flex w-fit items-center gap-2 font-mono text-xs tracking-widest text-muted transition-colors hover:text-accent'>← BACK TO MEMBERS</a>" +
      "<p class='mb-4 font-mono text-xs tracking-[0.3em] text-accent'>KELAS " + m.cls + " — BATCH 03</p>" +
      "<h1 class='fade-up font-display text-6xl font-bold leading-[0.9] tracking-[-0.04em] md:text-8xl' style='animation-delay:.5s;text-wrap:balance'>" + m.name + "</h1>" +
      "<p class='fade-up mt-8 max-w-md text-lg text-muted' style='animation-delay:.8s'>" + m.bio + "</p>" +
      "<div class='fade-up mt-10 flex flex-wrap gap-3' style='animation-delay:.95s'>" +
      ["INSTAGRAM", "GITHUB", "LINKEDIN"].map(function (s) { return "<a href='https://example.com' target='_blank' rel='noopener noreferrer' class='rounded-full border border-line px-5 py-3 font-mono text-xs tracking-widest transition-colors hover:border-accent hover:bg-accent hover:text-bg'>" + s + "</a>"; }).join("") + "</div>" +
      "<div class='fade-up mt-14' style='animation-delay:1.1s'><div data-magnetic class='inline-block'><a href='" + m.portfolio + "' target='_blank' rel='noopener noreferrer' data-cursor='OPEN' class='inline-block rounded-full bg-accent px-8 py-5 font-display text-2xl font-bold tracking-[-0.03em] text-bg transition-colors hover:bg-violet hover:text-fg md:px-10 md:py-6 md:text-4xl'>VISIT PORTFOLIO →</a></div></div>" +
      "</div></section>" +
      "<div data-marquee='" + m.name.toUpperCase() + " • " + m.id + " • INVICTUS •'></div>" +
      "<nav class='grid grid-cols-2 border-b border-line'>" +
      "<a href='#" + prev.slug + "' data-go='" + prev.slug + "' class='pn gutter flex min-w-0 flex-col gap-2 border-r border-line py-10'><span class='pn-sub font-mono text-[11px] tracking-widest text-muted'>← SEBELUMNYA · " + prev.id + "</span><span class='font-display text-2xl font-bold tracking-[-0.03em] md:text-5xl'>" + prev.name + "</span></a>" +
      "<a href='#" + next.slug + "' data-go='" + next.slug + "' class='pn gutter flex min-w-0 flex-col items-end gap-2 py-10 text-right'><span class='pn-sub font-mono text-[11px] tracking-widest text-muted'>BERIKUTNYA · " + next.id + " →</span><span class='font-display text-2xl font-bold tracking-[-0.03em] md:text-5xl'>" + next.name + "</span></a>" +
      "</nav>";
  }
  function initMagnetic(root) {
    $$("[data-magnetic]", root).forEach(function (el) {
      el.style.transition = "transform .25s ease-out";
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.35 + "px," + (e.clientY - r.top - r.height / 2) * 0.35 + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- routing + transitions ---------- */
  var lenis = null;
  try { if (typeof Lenis !== "undefined") { lenis = new Lenis({ duration: 1.15 }); (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0); } } catch (e) {}
  function toTop() { if (lenis) lenis.scrollTo(0, { immediate: true }); window.scrollTo(0, 0); }
  function scrollToSection(id) {
    var el = document.getElementById(id); if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0 }); else el.scrollIntoView({ behavior: "smooth" });
  }
  function show(hash) {
    var m = members.filter(function (x) { return x.slug === hash; })[0];
    if (m) {
      $("#detail").innerHTML = detailHTML(m); fillMarquees($("#detail")); initMagnetic($("#detail"));
      $("#home").hidden = true; $("#detail").hidden = false; document.title = m.name + " — INVICTUS";
    } else {
      $("#home").hidden = false; $("#detail").hidden = true; document.title = "INVICTUS Batch 03";
    }
  }
  window.addEventListener("hashchange", function () { show(location.hash.slice(1)); toTop(); });

  var busy = false, curtain = $("#curtain");
  function afterSwitch(target, section) {
    try { location.hash = target; } catch (e) {}
    show(target); toTop();
    if (section) setTimeout(function () { var el = document.getElementById(section); if (el) window.scrollTo(0, el.offsetTop); }, 30);
  }
  // Tirai lime: dipakai nav, chip piket, tombol kembali.
  function goCurtain(target, section) {
    if (busy) return; busy = true;
    curtain.classList.remove("exit"); curtain.classList.add("cover");
    setTimeout(function () {
      afterSwitch(target, section);
      setTimeout(function () {
        curtain.classList.remove("cover"); curtain.classList.add("exit");
        setTimeout(function () { curtain.style.transition = "none"; curtain.classList.remove("exit"); void curtain.offsetWidth; curtain.style.transition = ""; busy = false; }, 750);
      }, 200);
    }, 720);
  }
  // Foto kartu membuka jadi layar penuh, lalu profil muncul di bawahnya.
  function goOpen(m, rect) {
    if (busy) return; busy = true;
    var o = document.createElement("div"); o.id = "opener";
    o.style.cssText = "left:" + rect.left + "px;top:" + rect.top + "px;width:" + rect.width + "px;height:" + rect.height + "px";
    o.innerHTML = "<img alt=''><div class='op-shade'></div><div class='op-label'></div>";
    $("img", o).src = m.photo; $(".op-label", o).textContent = m.id;
    document.body.appendChild(o); void o.offsetWidth; o.classList.add("open");
    setTimeout(function () {
      afterSwitch(m.slug);
      o.classList.add("done");
      setTimeout(function () { o.remove(); busy = false; }, 650);
    }, 900);
  }
  function go(target, section, card) {
    var m = members.filter(function (x) { return x.slug === target; })[0];
    if (m && card && !reduce) goOpen(m, $(".aspect-\\[4\\/5\\]", card).getBoundingClientRect());
    else goCurtain(target, section);
  }

  document.addEventListener("click", function (e) {
    var f = e.target.closest("[data-filter]");
    if (f) {
      e.preventDefault(); var k = f.getAttribute("data-filter");
      if ($("#home").hidden) { goCurtain("home", "members"); setTimeout(function () { setFilter(k); }, 760); } else { setFilter(k); scrollToSection("members"); }
      return;
    }
    var nav = e.target.closest("[data-section]");
    if (nav && nav.closest("header, footer")) {
      e.preventDefault();
      if ($("#home").hidden) goCurtain("home", nav.getAttribute("data-section")); else scrollToSection(nav.getAttribute("data-section"));
      return;
    }
    if (e.target.closest("#toTop")) { if (lenis) lenis.scrollTo(0, { duration: 1.6 }); else window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    var g = e.target.closest("[data-go]");
    if (g) { e.preventDefault(); go(g.getAttribute("data-go"), g.getAttribute("data-section"), g.classList.contains("card") ? g : null); }
  });

  /* ---------- footer clock ---------- */
  function tick() {
    try { $("#clock").textContent = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()).replace(/\./g, ":"); } catch (e) {}
  }
  tick(); setInterval(tick, 1000);

  /* ---------- custom cursor ---------- */
  if (window.matchMedia("(pointer: fine)").matches) {
    document.documentElement.classList.add("has-cursor");
    var dot = $("#dot"), rw = $("#ringwrap"), ring = $("#ring");
    dot.style.display = rw.style.display = "block";
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY; dot.style.transform = "translate(" + mx + "px," + my + "px)";
      var el = e.target.closest ? e.target.closest("a, button, [data-cursor]") : null;
      var label = el && el.getAttribute("data-cursor");
      var size = label ? 84 : el ? 56 : 34;
      ring.style.width = ring.style.height = size + "px";
      ring.style.margin = (-size / 2) + "px 0 0 " + (-size / 2) + "px";
      ring.style.background = label ? "#C6FF00" : el ? "rgba(198,255,0,.2)" : "transparent";
      ring.textContent = label || "";
    });
    (function loop() { rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16; rw.style.transform = "translate(" + rx + "px," + ry + "px)"; requestAnimationFrame(loop); })();
  }

  show(location.hash.slice(1)); toTop();
})();
