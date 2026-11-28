# Day 6 — End-to-End UX & Accessibility Improvement Report

## 1. Tujuan

Meningkatkan kejelasan, aksesibilitas, dan konsistensi alur transfer simulasi dari beranda hingga detail transaksi tanpa menambah layanan atau integrasi di luar ruang lingkup.

Traceability utama: FR-01, FR-02, FR-05, FR-06; AC-FR01-01, AC-FR02-03, AC-FR05-03, AC-FR06-02, AC-A11Y-04, AC-A11Y-05, AC-RSP-01, dan AC-RSP-02.

## 2. Kondisi Repository Sebelum Perubahan

- Branch `main`; `HEAD` dan `origin/main` sama-sama berada pada commit Day 5 `8240ef9`.
- Worktree bersih sebelum pekerjaan Day 6; tidak ada konflik atau pekerjaan Day 5 yang tertunda.
- Implementasi menggunakan vanilla HTML/CSS/JavaScript dan penyimpanan simulasi lokal.
- Dokumen yang diwajibkan dibaca: `PRD.md`, `UX-SPEC.md`, `DESIGN-SYS.md`, `INTERACTION.md`, `ACCEPTANCE.md`, dan `AGENTS.md`.
- Laporan tersedia: laporan Week 2, Day 4, dan Day 5. `WEEK2_VALIDATION_REPORT.md` dan laporan Day 3 terpisah tidak ditemukan.

## 3. Temuan Sebelum Perubahan

- Field wajib belum menyampaikan status wajib secara konsisten melalui label dan semantik HTML/ARIA.
- Pesan validasi pilihan metode belum terhubung ke grup radio dan state invalid belum diekspos.
- Navigasi SPA merender halaman baru tanpa memindahkan fokus ke judul halaman.
- Akses transfer dari beranda dapat menghapus draft ketika pengguna seharusnya dapat melanjutkan input.
- Belum ada konfirmasi sebelum draft transfer dibatalkan.
- Beberapa target sentuh pada navigasi dan aksi lebih kecil daripada target praktis 44px.

## 4. Perbaikan yang Diimplementasikan

- Menambahkan penanda wajib yang terlihat serta atribut `required`/`aria-required` pada rekening, bank, nominal, dan metode.
- Menghubungkan grup metode dengan pesan validasi; mengatur `aria-invalid`, feedback visual, dan state pilihan yang tetap menggunakan radio native.
- Memindahkan fokus ke heading halaman setelah navigasi dan memberi indikator fokus yang terlihat.
- Mempertahankan draft saat pengguna kembali ke Transfer dari beranda; transfer baru setelah transaksi dibuat tetap membuka formulir kosong.
- Menambahkan konfirmasi pembatalan draft; isian hanya dihapus setelah pengguna menyetujui pembatalan.
- Menyesuaikan target sentuh terpilih ke minimal 44px/48px.
- Tidak mengubah data/status transaksi, menambah biaya atau referensi, mengubah desain di luar lingkup, maupun menambah integrasi/dependency.

## 5. File yang Diubah

- `app.js` — semantik field wajib, validasi metode, fokus navigasi, kelanjutan draft, dan konfirmasi pembatalan.
- `styles.css` — fokus heading/kartu metode serta target sentuh.
- `DAY6_END_TO_END_UX_ACCESSIBILITY_REPORT.md` — laporan ini.

## 6. Hasil Pengujian

Semua alur transaksi dan fixture yang digunakan adalah simulasi lokal; tidak ada transaksi yang dikirim ke bank.

| Skenario / pemeriksaan | Hasil |
|---|---|
| Form kosong, pesan koreksi, dan fokus ke field pertama | **PASS** |
| Format rekening tidak valid dan rekening simulasi tidak cocok | **PASS** |
| Penerima simulasi ditampilkan; perubahan bank membatalkan verifikasi lama | **PASS** |
| Nominal nol ditolak; pesan memberi arahan koreksi | **PASS** |
| Tidak memilih metode: pesan ditautkan ke radiogroup dan state invalid tampil | **PASS** |
| Metode dapat dipilih; ringkasan konfirmasi memuat enam rincian wajib | **PASS** |
| Kembali antar tahap dan koreksi tujuan mempertahankan isian yang relevan | **PASS** |
| Status diproses ditampilkan setelah persetujuan simulasi; tidak menawarkan pengulangan | **PASS** |
| Status berhasil dan tindakan riwayat/beranda | **PASS** |
| Status gagal dan tindakan formulir/riwayat | **PASS** |
| Status gagal sama pada detail dan riwayat | **PASS** |
| Peringatan koneksi buruk tidak mengubah status tersimpan | **PASS** — diuji dengan event browser, bukan pemutusan jaringan nyata |
| Peringatan transfer duplikat berstatus diproses muncul sebelum transaksi baru disimpan | **PASS** |
| Membatalkan dialog duplikat mempertahankan draft dan tidak menambah riwayat | **PASS** |
| Customer Service dapat dijangkau dari beranda dan menyediakan akses riwayat | **PASS** |
| Tab berpindah melalui field transfer; radio dapat dipilih dengan Space; tombol lanjut dapat diaktifkan dengan Enter | **PASS** — alur mencapai layar konfirmasi |
| Heading halaman menerima fokus setelah navigasi; fokus keyboard terlihat | **PASS** |
| Label field wajib dapat dibaca pada snapshot browser | **PASS** |
| Empty history, pencarian tanpa hasil, filter status, dan reset filter | **PASS pada validasi Day 5**; tidak dijalankan ulang pada sesi Day 6 |
| Persistensi dan pembaruan status lintas-tab | **PASS pada validasi Day 5**; tidak dijalankan ulang pada sesi Day 6 |
| Responsif pada 360, 390, 768, 1280, dan 1440px | **PASS** — 35 kombinasi halaman/viewport diperiksa; tidak ditemukan horizontal overflow |
| Target sentuh pada form 360px | **PASS** — tidak ada kontrol non-radio terlihat di bawah 44px |
| Browser console/page errors pada alur yang dimonitor | **PASS** — tidak ada error aplikasi yang terdeteksi |
| `node --check app.js` | **PASS** |
| `git diff --check` | **PASS** |
| HTTP lokal untuk halaman, `app.js`, dan `styles.css` | **PASS** — HTTP 200 |
| Pembaca layar nyata, pengujian dengan pengguna, perangkat fisik, dan lintas-browser | **NOT TESTED** |

### Klasifikasi Keseluruhan

- **PASS:** perubahan semantik/validasi form, fokus dan navigasi keyboard yang diuji, preservasi draft, alur konfirmasi, arahan status, perlindungan transaksi duplikat, pemeriksaan responsif, dan pemeriksaan teknis.
- **PARTIAL:** aksesibilitas dinilai melalui struktur browser, keyboard, dan fokus; belum mencakup pembaca layar nyata, seluruh kombinasi browser, atau evaluasi pengguna.
- **NOT TESTED:** perangkat fisik, koneksi buruk nyata, pembaca layar, usability dengan peserta, serta pengujian ulang skenario riwayat Day 5 pada sesi ini.
- **FAIL:** tidak ada kegagalan aplikasi yang diketahui dari pemeriksaan yang dilakukan. Beberapa assertion awal pada skrip uji memakai nama/jumlah heading yang tidak sesuai dengan konten aktual; halaman dan alur diperiksa ulang menggunakan heading serta kontrol yang benar.

## 7. Batasan yang Tersisa

- Seluruh pengalaman adalah simulasi lokal; tidak ada rekening nyata, API transaksi, integrasi bank, atau pembaruan status otomatis.
- Biaya, total debit, batas, ketentuan, dan nomor referensi tetap belum tersedia jika data simulasi tidak menyediakannya.
- Peringatan offline diuji dengan event browser, bukan kehilangan koneksi sungguhan.
- Pengujian ini bukan sertifikasi WCAG; pembaca layar, kontras komprehensif, zoom, perangkat fisik, dan lintas-browser belum diuji.
- `WEEK2_VALIDATION_REPORT.md` serta laporan Day 3 terpisah tidak tersedia; perbandingan progres memakai artefak Week 2, Day 4, Day 5, dan source aktual.

## 8. Perbandingan dengan Progres Sebelumnya

- Laporan Week 2 serta progres Day 3 menunjukkan fondasi alur, komponen, dan navigasi telah tersedia.
- Day 4 memperbaiki validasi dan koreksi tujuan; Day 5 menambahkan rincian status dan pencarian/filter riwayat.
- Day 6 mempertahankan kemampuan tersebut dan menangani celah aksesibilitas form, fokus navigasi, preservasi draft, pembatalan yang disengaja, serta target sentuh. Tidak ada perubahan pada cakupan transaksi maupun status simulasi.

## 9. Dokumentasi dan Batas Simulasi

`PRD.md`, `UX-SPEC.md`, `DESIGN-SYS.md`, `INTERACTION.md`, `ACCEPTANCE.md`, dan `AGENTS.md` tidak diubah. Tidak ada framework, dependency, layanan perbankan, atau data transaksi nyata yang ditambahkan. Status dan penerima yang ditampilkan tetap berasal dari data simulasi lokal.
