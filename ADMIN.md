# Admin INVICTUS G3: Jadwal Piket & Galeri Kenangan

## Berkas

| Berkas | Isi |
| --- | --- |
| `index.html` | Bagian `#piket` dan `#galeri`, tautan nav/footer, tombol **Admin** di footer |
| `assets/fitur.css` | Gaya Jadwal Piket, Galeri, Lightbox, Panel Admin |
| `assets/fitur.js` | Data, tampilan publik, lightbox, autentikasi, panel admin |
| `data/konten.json` | *(opsional)* konten terbit yang dibaca semua pengunjung |

## Masuk admin

- Klik **Admin** di bagian paling bawah halaman, atau buka `index.html#admin`.
- Kata sandi bawaan tidak ditulis di repo publik ini; tanyakan ke pengurus.
  Kata sandi yang diganti di tab *Data & keamanan* hanya berlaku di browser itu.
- Untuk mengganti kata sandi bawaan untuk semua perangkat, ganti nilai
  `DEFAULT_HASH` di `assets/fitur.js` dengan SHA-256 dari `invictus|` + kata sandi baru.
- Sesi berlaku 2 jam per tab. Lima kali salah sandi → terkunci 30 detik.
- Pengunjung biasa tidak melihat kontrol penyuntingan apa pun. Kontrol baru dibuat setelah login berhasil.

## Yang bisa dilakukan admin

**Jadwal piket** (per Kelas A / B, Senin–Sabtu)
- Tandai petugas yang sudah selesai (hari ini dan hari yang sudah lewat pada pekan berjalan).
- Tambah atau hapus petugas di tiap hari, pindahkan petugas ke hari lain.
- Atur tugas tiap petugas; tambah, ubah nama, atau hapus jenis tugas.
- Tambah atau hapus anggota dari daftar piket kelas.
- Perubahan dikumpulkan dulu, lalu ditulis saat menekan **Simpan jadwal**.

Jadwal awal adalah rotasi otomatis dari daftar `KELAS` di `index.html` (anggota dibagi rata
ke 6 hari, 5 tugas dibagi rata ke petugas). Sesuaikan dengan jadwal kelas yang sebenarnya.

**Galeri**
- Unggah foto/video (seret atau pilih berkas). Foto > 2400 px dikecilkan otomatis, thumbnail dibuat otomatis.
  Video maksimal 300 MB; MP4 (H.264) atau WebM paling aman.
- Tambah media dari folder proyek lewat jalurnya, mis. `galeri/pentas-seni.jpg`.
- Ubah judul, keterangan, tanggal acara, kategori (tersimpan otomatis), ubah urutan, hapus.

Galeri sengaja dimulai **kosong**. Isi hanya dengan foto dan video asli Generasi 03.

## Arsitektur data saat ini (tanpa backend)

Urutan baca saat halaman dibuka:

1. **IndexedDB browser ini**, jika admin pernah menyimpan di perangkat ini.
2. **`data/konten.json`**, konten terbit untuk semua pengunjung (hanya terbaca jika situs dibuka lewat
   `http://` atau `https://`, tidak lewat `file://`).
3. **Seed bawaan**: rotasi piket otomatis dan galeri kosong.

Artinya: **perubahan admin hanya tersimpan di browser perangkat admin.** Pengunjung lain belum melihatnya.

### Cara menerbitkan perubahan (tanpa backend)

1. Sunting di panel admin.
2. Tab *Data & keamanan* → **Ekspor konten.json**.
3. Taruh berkas itu di `data/konten.json` lalu unggah/deploy ulang situs.

Foto dan video unggahan ikut tersemat di dalam JSON (base64), jadi berkasnya bisa besar.
Untuk galeri besar, lebih baik simpan media sebagai berkas di folder `galeri/` lalu tambahkan
lewat *Tambah dari folder proyek*, sehingga `konten.json` hanya berisi jalur berkas.

## Integrasi backend yang masih dibutuhkan

Agar perubahan admin langsung tampil untuk semua pengunjung dan aman:

1. **Database bersama** untuk jadwal, status selesai, dan metadata galeri
   (mis. Supabase, Firebase, atau API sendiri).
2. **Object storage** untuk berkas foto dan video.
3. **Autentikasi di server.** Gerbang kata sandi sekarang berjalan di browser: cukup untuk
   menyembunyikan kontrol dari pengunjung biasa, tetapi **bukan keamanan sungguhan**. Siapa pun yang
   paham teknis bisa melewatinya, namun hanya mengubah salinan data di browsernya sendiri.
4. **Aturan izin tulis** di server, hanya akun admin yang boleh menulis.

Titik yang perlu diganti di `assets/fitur.js`:

- `Store` (get/set/del/allMedia/putMedia/delMedia/clearMedia) → panggil API.
- `loadAll()` → ambil jadwal & galeri dari API.
- `Auth` → ganti dengan login server (session/JWT), kirim token di setiap penulisan.
- `processImage` / `processVideo` → unggah hasilnya ke object storage, simpan URL-nya di `src`/`poster`.

Format data (`schedule` dan item `gallery`) bisa dilihat di hasil ekspor `konten.json`.
