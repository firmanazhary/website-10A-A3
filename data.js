/* Data dummy INVICTUS Batch 03 — ganti nama, bio, dan link dengan data asli. */
(function () {
  var namesA = ["Aditya Pratama","Bintang Maheswara","Citra Lestari","Dimas Saputra","Eka Wulandari","Fajar Ramadhan","Gita Anindya","Hafiz Alvaro","Intan Permata","Joko Santoso","Kirana Dewi","Lukman Hakim","Maya Safitri","Naufal Rizki"];
  var namesB = ["Oktaviani Putri","Putra Nugraha","Qori Amalia","Rafli Kurniawan","Salsabila Nur","Taufik Hidayat","Ulfa Maharani","Vino Alamsyah","Wulan Cahyani","Xavier Pangestu","Yusuf Ramli","Zahra Kamila"];
  var bios = [
    "Suka bikin hal aneh yang ternyata jalan.",
    "Kopi dulu, baru kode.",
    "Percaya semua masalah bisa diselesaikan dengan satu sprint lagi.",
    "Pixel perfectionist yang sering telat gara-gara kerning.",
    "Debugging jam 2 pagi adalah bahasa cintanya.",
    "Ide liar, eksekusi rapi.",
    "Hobi mengoleksi tab browser yang tidak pernah ditutup.",
    "Diam-diam paling rajin di grup.",
    "Mencari bug, menemukan teman.",
    "Satu kalimat: ship it."
  ];
  var tones = ["#C6FF00", "#7C3AED", "#FAFAFA", "#8B8B8B"];

  // Avatar SVG buatan sendiri (data URI), karena gambar dari luar diblokir di preview.
  function avatar(id, name) {
    var h = 0;
    for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    var c1 = tones[h % 4], c2 = tones[(h >> 3) % 4];
    var ini = name.split(" ").map(function (w) { return w[0]; }).join("").slice(0, 2);
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'><rect width='400' height='500' fill='#1A1A1A'/>" +
      "<circle cx='" + (60 + h % 280) + "' cy='" + (80 + (h >> 4) % 120) + "' r='150' fill='" + c1 + "' opacity='.9'/>" +
      "<rect x='" + (120 + (h >> 5) % 180) + "' y='260' width='220' height='320' fill='" + c2 + "' opacity='.75' transform='rotate(" + (-20 + h % 40) + " 250 400)'/>" +
      "<text x='28' y='470' font-family='Space Grotesk,Arial' font-weight='700' font-size='120' fill='#0A0A0A' letter-spacing='-6'>" + ini + "</text></svg>";
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  var members = [];
  [["A", namesA], ["B", namesB]].forEach(function (p) {
    p[1].forEach(function (name, i) {
      var id = p[0] + "-" + String(i + 1).padStart(2, "0");
      members.push({
        id: id,
        slug: "m-" + id.toLowerCase(),
        name: name,
        cls: p[0],
        photo: avatar(id, name),
        portfolio: "https://example.com/portfolio-" + id.toLowerCase(),
        bio: bios[(i + (p[0] === "B" ? 3 : 0)) % bios.length]
      });
    });
  });

  // Piket: 26 orang / 6 hari = 5,5,4,4,4,4, kelas A dan B selang-seling.
  var days = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
  var sizes = [5, 5, 4, 4, 4, 4];
  var A = members.filter(function (m) { return m.cls === "A"; });
  var B = members.filter(function (m) { return m.cls === "B"; });
  var pool = [];
  for (var k = 0; k < Math.max(A.length, B.length); k++) {
    if (A[k]) pool.push(A[k]);
    if (B[k]) pool.push(B[k]);
  }
  var cur = 0;
  var piket = days.map(function (d, i) {
    var crew = pool.slice(cur, cur + sizes[i]);
    cur += sizes[i];
    return { day: d, crew: crew };
  });

  window.INV = { members: members, piket: piket };
})();
