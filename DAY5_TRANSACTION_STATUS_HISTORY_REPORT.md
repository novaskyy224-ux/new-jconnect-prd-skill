# Day 5 — Transaction Status & History Enhancement Report

## 1. Tujuan

Meningkatkan kejelasan status dan detail transaksi simulasi serta memudahkan pencarian riwayat, tanpa mengubah batas produk atau menghubungkan aplikasi ke layanan perbankan nyata.

Traceability utama:

- **FR-01 / AC-FR01-01, AC-FR01-02:** status sesuai data terbaru dan pembaruan status.
- **FR-02 / AC-FR02-01, AC-FR02-03, AC-UX-02:** arahan aman dan perlindungan transfer duplikat yang masih diproses.
- **FR-03 / AC-FR03-01, AC-FR03-02, AC-UX-03:** referensi hanya ditampilkan jika tersedia.
- **FR-05 / AC-FR05-01:** rincian transaksi dapat dipindai; biaya dan total tetap tidak diketahui jika datanya belum tersedia.
- **AC-RSP-01, AC-RSP-02, AC-A11Y-02, AC-A11Y-05:** layout responsif dan fokus keyboard terlihat.

## 2. Temuan Implementasi Sebelum Day 5

- Status berhasil, sedang diproses, dan gagal sudah disimpan pada riwayat lokal, tetapi halaman status belum menyajikan keseluruhan rincian transaksi.
- Detail status belum menunjukkan nomor rekening yang dimask, biaya/total yang belum tersedia, atau waktu simulasi.
- Riwayat menampilkan nama penerima, bank, nominal, metode, status, dan referensi bila ada, tetapi belum memiliki pencarian, filter status, indikator filter, atau state tanpa hasil.
- Penyimpanan `localStorage`, pembaruan lintas-tab melalui event `storage`, pemeriksaan transaksi duplikat berstatus diproses, dan pembuangan referensi sintetis `SIM-*` sudah ada sebelum Day 5.
- Data transaksi lama belum memiliki waktu pembuatan. Laporan Day 2/Day 3 terpisah tidak tersedia; progres sebelumnya ditinjau melalui laporan Week 2, laporan Day 4, commit Day 3, dan commit Day 4.

## 3. Masalah yang Ditangani

- Pengguna belum dapat memeriksa rincian transaksi secara konsisten dari layar status/detail.
- Tidak ada cara untuk menyaring atau mencari transaksi yang tersedia di riwayat.
- Panduan tindakan belum menjelaskan secara cukup tegas perbedaan tindakan untuk status berhasil, diproses, dan gagal.
- Untuk transaksi lama tanpa waktu, antarmuka memerlukan fallback yang jujur, bukan tanggal yang dibuat-buat.

## 4. Perbaikan yang Diimplementasikan

- Halaman detail menampilkan status, penerima, bank tujuan, rekening dimask, nominal, metode, dan waktu simulasi.
- Biaya administrasi, total debit, dan referensi menampilkan keterangan belum tersedia bila tidak ada nilainya. Referensi hanya menampilkan nilai yang sudah ada pada data simulasi; tidak ada nomor baru yang dibuat.
- Transaksi baru menyimpan waktu simulasi aktual saat dibuat. Riwayat lama tetap dipertahankan dan diberi keterangan waktu tidak tersedia bila timestamp tidak ada atau tidak valid.
- Arahan dan tombol tindak lanjut disesuaikan dengan status:
  - **Berhasil:** akses riwayat atau kembali ke beranda.
  - **Sedang diproses:** periksa riwayat/bantuan dan jangan mengulang transfer yang sama.
  - **Gagal:** tinjau rincian atau kembali ke formulir simulasi; pesan menegaskan bahwa dana sungguhan tidak dipindahkan/dikembalikan.
- Riwayat memiliki heading dan deskripsi, pencarian berdasarkan informasi transaksi yang tersedia, filter tiga status, ringkasan filter aktif/jumlah hasil, aksi reset, empty state, dan no-results state.
- Pemeriksaan konsistensi mengonfirmasi status detail mengikuti perubahan `localStorage`, termasuk perubahan dari tab lain. Perlindungan transaksi duplikat yang masih diproses tetap menggunakan mekanisme sebelumnya.
- Semua transaksi uji browser merupakan fixture simulasi lokal dan dibersihkan setelah pengujian.

## 5. File yang Diubah

- `app.js` — data waktu simulasi, penyajian detail dan panduan status, pencarian/filter/reset riwayat, dan fallback data lama.
- `styles.css` — styling detail, kontrol riwayat, indikator filter, dan state status.
- `DAY5_TRANSACTION_STATUS_HISTORY_REPORT.md` — laporan temuan dan bukti Day 5.

## 6. Skenario dan Hasil Aktual

Pemeriksaan browser dilakukan pada server lokal menggunakan fixture `localStorage`; bukan transaksi bank. **PASS** berarti skenario yang tercantum benar-benar dijalankan pada sesi ini.

| # | Skenario / pemeriksaan | Hasil |
|---|---|---|
| 1 | Riwayat kosong menampilkan empty state | **PASS** |
| 2 | Riwayat memuat transaksi berhasil | **PASS** |
| 3 | Riwayat memuat transaksi sedang diproses | **PASS** |
| 4 | Riwayat memuat transaksi gagal | **PASS** |
| 5 | Pencarian berdasarkan nama penerima | **PASS** |
| 6 | Pencarian tanpa hasil menampilkan no-results state | **PASS** |
| 7 | Filter berhasil, sedang diproses, dan gagal | **PASS** |
| 8 | Reset pencarian dan filter status | **PASS** |
| 9 | Membuka detail dari item riwayat | **PASS** |
| 10 | Status detail sama dengan status riwayat dan perubahan lintas-tab | **PASS** |
| 11 | Riwayat dan perubahan status bertahan setelah reload | **PASS** |
| 12 | Transfer duplikat tertahan saat transaksi serupa masih diproses | **PASS** |
| 13 | Arahan dan aksi sesuai status berhasil/diproses/gagal | **PASS** |
| 14 | Referensi tidak tersedia tidak menghasilkan nomor palsu | **PASS**; skenario referensi valid tersedia **NOT TESTED** |
| 15 | Detail dan riwayat pada lebar 360px, 390px, dan desktop tanpa overflow horizontal | **PASS** |
| 16 | Fokus terlihat setelah navigasi keyboard (outline 3px) | **PASS**; pengujian pembaca layar nyata **NOT TESTED** |
| 17 | Browser console/page errors selama alur yang dimonitor | **PASS** — 0 error |
| 18 | Tidak ada horizontal overflow pada viewport yang diuji | **PASS** |
| Teknis | `node --check app.js` | **PASS** |
| Teknis | `git diff --check` | **PASS** |
| Teknis | HTTP lokal untuk `index.html`, `app.js`, dan `styles.css` | **PASS** — HTTP 200 |
| Data lama | Riwayat tanpa timestamp tetap tampil dengan waktu berlabel belum tersedia | **PASS** |

Catatan pengujian: dua percobaan awal untuk duplikat/persistensi menggunakan fixture yang keliru (status fixture sudah berubah dan satu fixture tersusun sebagai array bertingkat). Fixture diperbaiki dan kedua skenario dijalankan ulang hingga **PASS**; kegagalan setup tersebut bukan kegagalan aplikasi.

### Status keseluruhan

- **PASS:** implementasi dan pemeriksaan fungsional yang dilakukan untuk empty/history states, pencarian/filter, status, detail, persistensi, duplikat, responsivitas, fokus, dan pemeriksaan teknis.
- **PARTIAL:** referensi yang tersedia tidak dapat diuji karena tidak ada referensi valid dalam data simulasi. Biaya administrasi dan total debit juga tetap belum tersedia sesuai data/dokumentasi.
- **NOT TESTED:** pembaca layar nyata, usability dengan peserta, perangkat fisik, pengujian lintas-browser, dan koneksi buruk nyata.
- **FAIL:** tidak ada kegagalan aplikasi yang tersisa pada skenario yang dilaporkan.

## 7. Perbandingan dengan Progres Sebelumnya

- Laporan Week 2 mencatat alur transfer, tiga status, riwayat lokal, pembaruan lintas-tab, referensi yang tidak dikarang, dan duplikat sebagai kemampuan yang sudah ada.
- Commit Day 3 berfokus pada refinement UI/UX berbasis design system; laporan Week 2 memuat pemeriksaan fitur dan visual sebelumnya.
- Day 4 memperbaiki feedback interaksi, validasi, dan koreksi tujuan.
- Day 5 tidak mengganti fondasi status/persistensi atau mendesain ulang halaman lain. Perubahan memperkaya detail transaksi dan menyediakan filter/pencarian riwayat yang sebelumnya belum tersedia.
- Laporan Day 2 dan Day 3 yang terpisah tidak ditemukan di repository; perbandingan dibatasi pada artefak dan source yang tersedia.

## 8. Batasan yang Tersisa

- Seluruh pengalaman tetap merupakan simulasi lokal. Tidak ada rekening, data nasabah nyata, API transaksi, integrasi bank, atau pembaruan status otomatis dari bank.
- Referensi tidak tersedia dalam fixture yang sah; jalur menampilkan referensi valid belum diuji.
- Biaya, total debit, kecepatan, ketentuan, dan batas metode tetap `TBD` atau belum tersedia. Tidak ada nilai kebijakan baru yang ditambahkan.
- Pembaca layar, usability pengguna, perangkat fisik, dan validasi lintas-browser belum diuji.

## 9. Dokumentasi dan Ruang Lingkup

`PRD.md`, `UX-SPEC.md`, `DESIGN-SYS.md`, `INTERACTION.md`, `ACCEPTANCE.md`, dan `AGENTS.md` tetap tidak diubah. Tidak ada framework, dependency, layanan perbankan, atau fitur di luar ruang lingkup Day 5 yang ditambahkan.
