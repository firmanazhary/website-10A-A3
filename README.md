# INVICTUS — Generasi 03

Buku tahunan interaktif angkatan INVICTUS: dua kelas, dua puluh enam anggota,
satu gaya tarik. *Tak terkalahkan.*

Situsnya statis — satu `index.html` dan beberapa berkas di `assets/`. Tidak ada
langkah build, tidak ada server, tidak ada `npm install`.

## Isi halaman

| Bagian | Yang terjadi |
| --- | --- |
| **Orbit** | Logo IVCS tersusun dari ribuan partikel. Kursor menariknya, klik melepasnya. |
| **Jatuh** | Gulir turun dari ketinggian 35.786 km sampai mendarat, diiringi manifesto angkatan. |
| **Mendarat** | Huruf INVICTUS jatuh dan bisa diseret, dilempar, ditumpuk. Gravitasi bisa dibalik atau dimatikan; di HP bisa mengikuti kemiringan. |
| **Anggota** | Foto 26 anggota mengorbit kelasnya masing-masing (10A dan 10B). Klik untuk membuka profil, atau jatuhkan semuanya. |
| **Waktu SMP** | Daftar kelas waktu SMP: siapa yang lanjut, siapa yang keluar, siapa yang baru bergabung di SMA. |
| **Jadwal piket** | Senin–Sabtu per kelas, hari ini ditandai, centang muncul begitu petugasnya selesai. |
| **Galeri kenangan** | Foto dan video angkatan dengan filter kategori, layar penuh, dan geser kiri-kanan. |
| **Penutup** | Tulisan grafiti yang bisa disapu kursor, dan tombol yang meruntuhkan halaman kalau ditahan. |

Pintasan: tekan **G** untuk meruntuhkan halaman, **Esc** untuk menutup profil atau
foto, **panah kiri/kanan** untuk pindah anggota atau foto.

## Menjalankan di komputer

Klik dua kali `index.html`. Semua fitur jalan, kecuali konten terbit di
`data/konten.json` yang hanya terbaca lewat server. Untuk server lokal:

```bash
npx serve -l 5178
```

lalu buka `http://localhost:5178`.

## Deploy ke Vercel

1. Di Vercel: **Add New → Project**, lalu import repo ini.
2. **Framework Preset:** Other. Kosongkan *Build Command* dan *Output Directory*.
3. Klik **Deploy**.

Setiap push ke `main` otomatis memperbarui situsnya.

## Mengubah isi

**Foto anggota.** Taruh di folder `foto/` dengan nama lengkap, huruf kecil, spasi
diganti tanda hubung, akhiran `.jpg`. Contoh: `foto/abdurrahman-afif.jpg`,
`foto/muhammad-rhafif-ash-shiddiq.jpg`. Selama fotonya belum ada, yang tampil
kartu inisial.

**Daftar anggota.** Ada di `index.html`, konstanta `KELAS` (SMA) dan `KELAS_SMP`.
Status "lanjut" di bagian Waktu SMP dihitung otomatis dari nama yang sama persis
di kedua daftar, jadi ejaannya harus identik.

**Nama kelas.** `KELAS_NAMA` di `index.html` mengatur label yang tampil
("Kelas 10A", "Kelas 10B").

**Jadwal piket dan galeri.** Diatur lewat panel admin (tombol *Admin* di bagian
paling bawah, atau buka `/#admin`). Cara kerja, batasan, dan cara menerbitkan
perubahan untuk semua pengunjung dijelaskan di [ADMIN.md](ADMIN.md).

## Struktur berkas

```
index.html            halaman, gaya dasar, data anggota, dan semua animasi
assets/fitur.css      jadwal piket, galeri, layar penuh, panel admin
assets/fitur.js       data, piket, galeri, admin
assets/tipografi.css  pembagian peran huruf
ADMIN.md              panduan panel admin dan data
```

## Dibuat dengan

[GSAP](https://gsap.com) dan ScrollTrigger untuk animasi,
[Lenis](https://lenis.darkroom.engineering) untuk gulir halus,
[Matter.js](https://brm.io/matter-js/) untuk fisika.
Huruf: Unbounded, Instrument Serif, dan IBM Plex Mono.

---

© 2026 INVICTUS, Generasi 03.
