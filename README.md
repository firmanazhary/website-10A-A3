# INVICTUS — One Generation, Endless Memories

Status: **Tahap 1–4 selesai** (homepage, Members, Gallery, Journey). Tahap 5–7 menyusul.

## Menjalankan di VS Code
1. Buka folder `invictus` di VS Code.
2. Pasang ekstensi **Live Server**, klik kanan `index.html` → *Open with Live Server*.
3. Opsional: taruh foto angkatan di `assets/images/background/hero.jpg` (otomatis dijadikan grayscale).

## Mengubah angka statistik
Di `index.html`, ubah atribut `data-count` pada elemen `.stat b` (nilai awal hanya contoh).

## Struktur
`index.html`, `style.css`, `script.js`, `assets/images/{members,gallery,background}`, `assets/icons`

## Mengganti data & foto anggota
Edit array `MEMBERS` di `script.js` (nama, kelas/kelompok, bio, motto, wilayah umum).
Taruh foto di `assets/images/members/` sesuai nama file di `photo`. Tanpa foto, kartu menampilkan inisial.

## Menambah foto galeri
Simpan dua versi di `assets/images/gallery/`: `nama.jpg` (HD, sisi terpanjang ~2400px) dan `nama-thumb.jpg` (~900px).
Lalu tambahkan satu baris di array `GALLERY` di `script.js` (id = nama file tanpa `.jpg`, kategori, judul, tanggal `YYYY-MM-DD`, lebar, tinggi).

## Mengubah timeline
Edit array `JOURNEY` di `script.js` (tanggal `YYYY-MM-DD`, judul, deskripsi singkat, detail, dan nama foto galeri — boleh dikosongkan).

## Member Map
Edit array `MAP_MEMBERS` di `script.js` (nama, kelompok, region, lat, lng).
Pakai koordinat pusat kota/kecamatan saja, jangan alamat rumah atau titik presisi tanpa persetujuan anggota.
Peta butuh internet (Leaflet dan tile OpenStreetMap dimuat dari CDN).
