# INVICTUS — Official Dark Space Generation Profile

Website profil resmi angkatan **INVICTUS** dengan tema **Dark Space**, dibangun menggunakan **HTML5, Tailwind CSS (CLI), JavaScript (ES Modules), dan GSAP + ScrollTrigger**.

## Struktur Folder

```text
invictus-profile/
├── dist/
│   └── output.css          # Hasil compile Tailwind CLI (dibuat saat npm run dev/build)
├── src/
│   ├── input.css           # Entry point Tailwind CSS & custom utilities
│   ├── data.js             # Data lengkap 41 anggota & generator jadwal piket Senin-Jumat
│   └── main.js             # Engine animasi GSAP, starfield, modal, filter, & interaktivitas
├── index.html              # Halaman utama
├── package.json            # Konfigurasi dependencies & scripts
├── tailwind.config.js      # Konfigurasi tema Dark Space & font
└── README.md               # Panduan instalasi & menjalankan project
```

## Cara Instalasi & Menjalankan

1. **Ekstrak file ZIP** dan buka terminal di dalam folder `invictus-profile`.
2. **Install dependencies (Tailwind CSS CLI & GSAP):**
   ```bash
   npm install
   ```
3. **Compile Tailwind CSS:**
   - Untuk mode development (auto-watch):
     ```bash
     npm run dev
     ```
   - Untuk build production (minified):
     ```bash
     npm run build
     ```
4. **Jalankan Local Server** (wajib karena menggunakan `<script type="module">`):
   ```bash
   npx serve .
   ```
   atau buka menggunakan **Live Server** di VS Code.
