# ⚡ TimelineFlow - Daily Planner & Goals Calendar

Aplikasi timeline harian modern, super cepat, ringan, dan langsung pakai tanpa perlu server backend (`npm run dev` atau `php artisan serve`).

## ✨ Fitur Utama

1. **Card Timeline Harian (Senin - Minggu)**
   - Format waktu rapi: `08:00 - 10:00 : Task 1 - Cek Whatsapp`.
   - Card dapat diedit, ditambah, dihapus, dan diberi centang status selesai.
   - Sorotan otomatis pada hari ini (*Today Indicator*).
   - Pengurutan otomatis secara kronologis berdasarkan jam mulai.

2. **Multi-Plan Timeline System (Tab di Sisi Kanan)**
   - Membuat 2 atau lebih timeline plan yang berbeda (contoh: *Work Routine*, *Weekend Plan*, *Jadwal Belajar*).
   - Berpindah antar plan dengan 1 kali klik pada tab sisi kanan.
   - Mengganti nama plan atau menduplikasi plan yang ada.

3. **Goals & Milestones Calendar (Pop-Up Modal)**
   - Tombol **🎯 Goals Calendar** di header.
   - Kalender interaktif bulanan dengan navigasi bulan/tahun.
   - **Dot Berwarna Berdasarkan Prioritas**:
     - 🔴 **High / Urgent**
     - 🟡 **Medium**
     - 🟢 **Low / Routine**
     - 🟣 **Milestone Utama**
   - **Hover Information**: Arahkan kursor ke tanggal yang memiliki titik untuk memunculkan detail target, deskripsi, dan statusnya.
   - Form khusus untuk menambah dan mengedit target.

4. **Ringan, Cepat & Bebas Server**
   - Menggunakan teknologi murni Vanilla HTML5, CSS3, dan JavaScript modern.
   - Menggunakan memori minimal (0MB RAM saat tidak dibuka).
   - Tersimpan otomatis di `localStorage` perangkat.
   - Tersedia tombol **Backup (Export)** & **Restore (Import)** JSON.

## 🚀 Cara Menjalankan & Menginstal Aplikasi

### 1. File Installer Siap Pakai (di folder `dist/`)
Installer sudah dibuat dan berada di dalam folder **`dist/`**:
- 🍏 **macOS Installer (`.dmg`)**:
  - `dist/TimelineFlow-1.0.0.dmg`
  - Tinggal buka (double-click) lalu drag **TimelineFlow** ke folder **Applications**.
- 🪟 **Windows Installer (`.exe`)**:
  - `dist/TimelineFlow Setup 1.0.0.exe` (Installer NSIS dengan shortcut Desktop & Start Menu).
  - `dist/TimelineFlow 1.0.0.exe` (Portable EXE, langsung jalan tanpa install).

---

### 2. Mode Pengembangan / Menjalankan Langsung (Desktop App)
```bash
# Jalankan aplikasi desktop secara langsung
npm start
```

---

### 3. Perintah Build Ulang Installer
Jika Anda melakukan perubahan kode di masa mendatang, cukup jalankan perintah berikut untuk mengompilasi installer baru:

```bash
# Build installer macOS (.dmg & .zip)
npm run build:mac

# Build installer Windows (.exe NSIS & Portable)
npm run build:win

# Build semua platform sekaligus
npm run build:all
```

---

### 4. Alternatif Web / Browser Standalone
- **Browser Langsung**: Buka file `index.html` di browser apa pun.
- **macOS App Shortcut**: Buka `Timeline.app` atau `launch.command`.
