# INVICTUS — Generasi 03

Identitas digital, buku tahunan interaktif, dan arsip kenangan angkatan.
Arah visual: **graffiti vandalism × brutalist editorial**.

## Struktur berkas

| Berkas | Isi |
| --- | --- |
| `index.html` | Struktur halaman saja (9 bagian), tanpa CSS/JS sebaris |
| `assets/wall.css` | Sistem visual: token warna, tipografi, tekstur, loader, kursor, menu, hero, cerita, jalanan, anggota, profil, footer |
| `assets/fitur.css` | Piket, jejak, galeri, lightbox, tembok, panel admin |
| `assets/engine.js` | Data anggota, logo asli, mesin situs (kanvas, fisika, orbit, profil, footer) |
| `assets/fitur.js` | Data & fitur: piket, jejak, galeri, tembok, panel admin |
| `data/konten.json` | *(opsional)* konten terbit yang dibaca semua pengunjung |
| `foto/` | Foto anggota, nama file mengikuti kolom `foto` di `KELAS` |
| `galeri/` | *(opsional)* foto & video galeri sebagai berkas biasa |

Dua logo asli proyek disimpan sebagai base64 di `assets/engine.js`
(`LOGO_SRC` = lambang IVCS, `WM_SRC` = wordmark grafiti INVICTUS). **Jangan diganti
teks atau gambar lain.** Lambang IVCS juga dipakai sebagai favicon di `index.html`.

## Peta halaman

| # | Bagian | Interaksi |
| --- | --- | --- |
| 01 | Generasi (hero) | Partikel logo IVCS mengikuti kursor, klik menyemprot cat, stiker bisa diseret, huruf judul bereaksi |
| 02 | Cerita | Tembok yang makin penuh coretan saat digulir, manifesto muncul bergantian |
| 03 | Jalanan | Huruf stiker Matter.js: seret, lempar, balik gravitasi, kemiringan HP |
| 04 | Anggota | Tiga tampilan (Tembok / Putaran / Lempar), cari nama, saring kelas, profil layar penuh |
| 05 | Jejak | Garis waktu yang bisa dibuka satu per satu |
| 06 | Piket | Jadwal Senin–Sabtu per kelas, sorotan hari ini, status selesai |
| 07 | Galeri | Masonry editorial, filter kategori, lightbox, galeri video |
| 08 | Tembok | Pesan angkatan + kanvas semprot yang bisa dicoret pengunjung |
| 09 | Warisan | Pita berjalan, wordmark grafiti yang bisa disapu, tahan untuk menghancurkan halaman |

Pintasan papan tombol: `G` meruntuhkan/menegakkan halaman, ketik `invictus` untuk
telur paskah, `Esc` menutup profil/menu/lightbox, panah kiri-kanan di profil dan lightbox.

## Masuk admin

- Klik **Admin** di bagian paling bawah halaman, atau buka `index.html#admin`.
- Kata sandi bawaan: `invictus-g3-admin`. **Ganti segera** di tab *Data & keamanan*.
  Kata sandi baru disimpan (sebagai hash SHA-256) di browser itu saja.
- Sesi berlaku 2 jam per tab. Lima kali salah sandi → terkunci 30 detik.
- Pengunjung biasa tidak melihat kontrol penyuntingan apa pun.

## Yang bisa dilakukan admin

**Jadwal piket** (Kelas A / B, Senin–Sabtu)
- Tandai petugas yang sudah selesai (hari ini dan hari yang sudah lewat).
- Tambah/hapus petugas per hari, pindahkan ke hari lain.
- Atur tugas tiap petugas; tambah, ubah nama, atau hapus jenis tugas.
- Tambah/hapus anggota dari daftar piket kelas.
- Perubahan dikumpulkan dulu, ditulis saat menekan **Simpan jadwal**.

**Jejak** — tambah entri garis waktu (tanggal, judul, keterangan) dan pilih fotonya
dari galeri yang sudah diunggah. Urutan bisa digeser.

**Galeri** — unggah foto/video (foto > 2400 px dikecilkan otomatis, thumbnail dibuat
otomatis, video maks. 300 MB), atau tambahkan berkas yang sudah ada di folder proyek
lewat jalurnya. Judul, keterangan, tanggal, kategori, urutan, dan hapus.

**Tembok** — tambah pesan/kutipan anggota beserta nama penulisnya.

**Data & keamanan** — ganti kata sandi, ekspor/impor `konten.json`, hapus data lokal.

### Aturan isi

Jadwal awal adalah **rotasi otomatis** dari daftar `KELAS` (anggota dibagi rata ke enam
hari, lima tugas dibagi rata). Sesuaikan dengan jadwal kelas yang sebenarnya.

Galeri, jejak, dan tembok sengaja **dimulai kosong**. Isi hanya dengan foto, tanggal,
kegiatan, dan pesan yang benar-benar ada. Jangan mengarang kenangan atau ucapan.

Coretan di kanvas Tembok adalah milik pengunjung: tersimpan di browser masing-masing
(`localStorage`), tidak dikirim ke mana pun, dan bisa dihapus lewat tombol **Bersihkan**.

## Arsitektur data (tanpa backend)

Urutan baca saat halaman dibuka:

1. **IndexedDB browser ini**, jika admin pernah menyimpan di perangkat ini.
2. **`data/konten.json`**, konten terbit untuk semua pengunjung (hanya terbaca lewat
   `http://` atau `https://`, tidak lewat `file://`).
3. **Bawaan**: rotasi piket otomatis; galeri, jejak, dan tembok kosong.

Artinya: **perubahan admin hanya tersimpan di browser perangkat admin.**

### Cara menerbitkan perubahan

1. Sunting di panel admin.
2. Tab *Data & keamanan* → **Ekspor konten.json** (berisi `schedule`, `timeline`,
   `notes`, dan `gallery`).
3. Taruh berkas itu di `data/konten.json` lalu unggah/deploy ulang situs.

Foto dan video unggahan ikut tersemat di JSON (base64), jadi berkasnya bisa besar.
Untuk galeri besar, simpan media sebagai berkas di `galeri/` lalu tambahkan lewat
*Tambah dari folder proyek*, sehingga `konten.json` hanya berisi jalur berkas.

## Integrasi backend yang masih dibutuhkan

1. **Database bersama** untuk jadwal, status selesai, jejak, pesan tembok, dan
   metadata galeri (mis. Supabase, Firebase, atau API sendiri).
2. **Object storage** untuk berkas foto dan video.
3. **Autentikasi di server.** Gerbang kata sandi sekarang berjalan di browser: cukup
   untuk menyembunyikan kontrol dari pengunjung biasa, tetapi **bukan keamanan
   sungguhan**. Orang yang paham teknis bisa melewatinya, namun hanya mengubah salinan
   data di browsernya sendiri.
4. **Aturan izin tulis** di server, hanya akun admin yang boleh menulis.

Titik yang perlu diganti di `assets/fitur.js`:

- `Store` (get/set/del/allMedia/putMedia/delMedia/clearMedia) → panggil API.
- `loadAll()` → ambil jadwal, jejak, tembok, dan galeri dari API.
- `saveSchedule()` / `saveList()` → kirim perubahan ke API.
- `Auth` → ganti dengan login server (session/JWT), kirim token di setiap penulisan.
- `processImage` / `processVideo` → unggah hasilnya ke object storage, simpan URL-nya
  di `src`/`poster`.

Format datanya bisa dilihat di hasil ekspor `konten.json`.

## Menjalankan secara lokal

Klik dua kali `index.html` sudah cukup untuk semua fitur, kecuali `data/konten.json`
yang hanya terbaca lewat server. Untuk menjalankan server lokal dari folder proyek:

```
npx serve -l 5178
```

lalu buka `http://localhost:5178`.
