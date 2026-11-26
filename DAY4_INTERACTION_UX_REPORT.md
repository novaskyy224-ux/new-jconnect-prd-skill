# Day 4 — Interaction & UX Improvement Report

## 1. Tujuan

Meningkatkan kejelasan tahapan transfer, umpan balik validasi, dan koreksi data tanpa mengubah ruang lingkup simulasi. Perubahan ditelusurkan ke FR-05/FR-06 dan AC-FR05-03/AC-FR06-02 (ringkasan dan koreksi tujuan), AC-FR02-03 (peringatan duplikat), AC-FR01-01/AC-FR04-01 (status dan indikator proses), AC-A11Y-04/AC-A11Y-05 (pesan dan fokus), serta AC-RSP-01/AC-RSP-02 (responsivitas dan overflow).

## 2. Temuan sebelum perubahan

- Form tujuan belum menunjukkan bahwa itu langkah pertama, sedangkan layar metode dan konfirmasi sudah menyebut langkah 2/3 dan 3/3.
- Untuk pasangan rekening-bank yang tidak cocok, teks masalah muncul pada panel verifikasi dan sekali lagi sebagai pesan error dekat input.
- Setelah validasi gagal, perubahan rekening/bank menghapus pesan dan penanda invalid tanpa menghitung ulang apakah data sudah benar.
- Implementasi sebelumnya sudah memiliki label input, validasi dasar, kontrol koreksi, status simulasi, penyimpanan riwayat lokal, dan gaya fokus. Fitur-fitur tersebut dipertahankan.

## 3. Perbaikan

- Menambahkan indikator tahap 1/3 pada form tujuan dengan komponen dan token langkah yang telah digunakan.
- Memisahkan status verifikasi singkat dari pesan koreksi spesifik, agar kesalahan tujuan tidak berulang.
- Mempertahankan pesan serta status invalid selama pengguna memperbaiki input, lalu menghitung ulang pesan terkait tanpa memindahkan fokus.
- Memastikan pesan ketidakcocokan rekening-bank tidak bertumpuk dengan pesan input non-angka; instruksi menyebut perbaikan yang dapat dilakukan.
- Tetap mempertahankan nilai form ketika pengguna kembali dari konfirmasi untuk mengoreksi tujuan.
- Tidak mengubah data/status simulasi, biaya, metode, penyimpanan transaksi, atau integrasi eksternal.

## 4. File yang diubah

- `app.js` — state validasi, pesan verifikasi/koreksi, pembaruan ulang feedback saat input diedit, dan indikator langkah pertama.
- `styles.css` — jarak bawah indikator langkah menggunakan token spacing yang sudah tersedia.
- `DAY4_INTERACTION_UX_REPORT.md` — laporan dan bukti validasi Day 4.

## 5. Pengujian dan hasil aktual

| Pemeriksaan | Hasil |
|---|---|
| `node --check app.js` | **PASS** |
| `git diff --check` | **PASS** |
| Server lokal: halaman `index.html`, `styles.css`, `app.js` | **PASS** — ketiganya merespons HTTP 200 |
| Form kosong, pesan wajib, fokus ke input pertama | **PASS** |
| Rekening-bank simulasi tidak cocok | **PASS** — satu pesan koreksi spesifik; status verifikasi tidak mengulang pesan |
| Koreksi bank setelah validasi gagal | **PASS** — pesan/invalid diperbarui, penerima terverifikasi, nominal yang telah diisi tetap ada |
| Metode wajib dipilih sebelum lanjut | **PASS** |
| Koreksi tujuan dari konfirmasi | **PASS** — rekening, bank, dan nominal tetap terisi |
| Ringkasan konfirmasi | **PASS** — enam rincian wajib tampil |
| Status diproses/berhasil/gagal | **PASS** — ketiganya ditampilkan dengan teks dan ikon |
| Status diproses | **PASS** — spinner tampil; aksi “Transfer Baru” tidak ditawarkan |
| Peringatan transfer serupa | **PASS** — peringatan tampil sebelum simulasi duplikat; lanjut hanya melalui pilihan eksplisit |
| Nomor referensi | **PASS** — semua transaksi uji tidak memiliki referensi dan tidak menampilkan nomor palsu |
| Riwayat dan persistensi | **PASS** — daftar/status tersimpan di `localStorage` dan transaksi muncul kembali setelah reload |
| Empty state riwayat | **PASS** — pesan “Belum ada transaksi” tampil |
| Error penyimpanan/riwayat rusak | **PASS** — data JSON rusak menampilkan pesan kendala; data valid dapat dipulihkan |
| Offline | **PASS, simulasi event browser** — peringatan tampil dan status transaksi tetap diproses |
| Loading | **PASS** — indikator hanya terlihat pada status diproses |
| Keyboard/fokus | **PASS** — Tab mencapai tombol kembali; outline fokus 3px terlihat |
| Label aksesibel kontrol utama | **PASS** — nama kontrol dan input terbaca pada snapshot browser |
| Responsive 360×800, 390×844, 1280×900 | **PASS** — form, metode, dan konfirmasi tidak memiliki horizontal overflow |
| Kontras token yang digunakan pada putih | **PASS, pengukuran programatis** — primary 7.21:1; success 5.19:1; warning 4.60:1; danger 6.57:1; teks sekunder 5.36:1; fokus 3.24:1 |
| Browser console/page errors pada reload verifikasi | **PASS** — 0 console error dan 0 page error pada pemeriksaan tersebut |
| Customer Service/riwayat nyata, pembaca layar nyata, usability pengguna | **NOT TESTED** |
| Aksi salin/copy | **NOT APPLICABLE** — tidak ada aksi copy pada implementasi saat ini |

Peringatan offline diuji dengan event browser, bukan pemutusan jaringan nyata. Pengujian keyboard terbatas pada alur dan kontrol yang dijalankan; ini bukan sertifikasi aksesibilitas.

## 6. Status acceptance dan batasan tersisa

- **PASS (cek teknis/fungsional yang dijalankan):** perubahan validasi/koreksi, navigasi tahapan, enam detail konfirmasi, tiga status, pencegahan duplikat, persistensi riwayat, state loading/empty/error/offline, fokus keyboard, serta viewport yang diuji.
- **PARTIAL:** validasi aksesibilitas belum mencakup pembaca layar nyata dan seluruh urutan tab pada semua layar/peramban.
- **NOT TESTED:** usability dengan peserta, perangkat fisik, zoom teks, koneksi buruk nyata, dan regresi lintas peramban.
- Biaya, kecepatan, ketentuan, batas nominal, total debit, serta nomor referensi tetap `TBD` sesuai dokumentasi. Tidak dibuat data atau kebijakan baru untuk menutup kekosongan tersebut.

## 7. Perbandingan dengan progress sebelumnya

Laporan Week 2 dan commit Day 3 menunjukkan bahwa alur transfer, metode, konfirmasi, status, riwayat, dan refinement visual sudah tersedia. Day 4 tidak mengganti desain atau mengulang fitur tersebut; perubahan menangani celah spesifik yang ditemukan pada source/browser: tahap form pertama belum ditandai, feedback tujuan berulang, dan status validasi tidak dihitung ulang konsisten saat data dikoreksi. `WEEK2_VALIDATION_REPORT.md` tidak tersedia di repository, sehingga hasil Day 4 didasarkan pada pengujian yang dijalankan pada sesi ini, bukan klaim dari laporan tersebut.

## 8. Batas simulasi dan dokumentasi

Semua rekening, penerima, status, serta transaksi di sini adalah simulasi lokal; tidak ada rekening, API transaksi, atau sistem perbankan nyata yang digunakan. `PRD.md`, `UX-SPEC.md`, `DESIGN-SYS.md`, `INTERACTION.md`, `ACCEPTANCE.md`, dan `AGENTS.md` tidak diubah. Tidak ada dependency, framework, maupun fitur layanan baru yang ditambahkan.
