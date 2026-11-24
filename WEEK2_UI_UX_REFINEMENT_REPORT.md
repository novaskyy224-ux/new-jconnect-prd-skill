# Week 2 UI/UX Refinement Report

## 1. Ringkasan

Penyempurnaan ini merapikan presentasi aplikasi yang sudah berfungsi tanpa mengubah ruang lingkup produk, aturan simulasi, maupun alur transfer. Audit dan perubahan mengacu pada `PRD.md`, `UX-SPEC.md`, `DESIGN-SYS.md`, `INTERACTION.md`, `ACCEPTANCE.md`, `AGENTS.md`, dan `WEEK2_FEATURE_COMPLETION_REPORT.md`. Tidak ditemukan konflik dokumentasi yang memerlukan keputusan baru.

## 2. Kondisi Sebelum Penyempurnaan

- Beranda dan alur utama sudah dapat digunakan, tetapi kartu navigasi tampil sebagai baris polos dengan ikon kecil yang kurang menonjol.
- Hierarki kartu, status, dan jarak antar elemen belum konsisten di semua layar.
- Form desktop menggunakan bidang yang terlalu lebar dan menyisakan jarak yang tidak perlu ketika pesan verifikasi atau error masih kosong.
- Tampilan status dan riwayat belum cukup membedakan elemen penting selain melalui teks.
- Perilaku responsif dasar telah tersedia, tetapi belum diperiksa ulang untuk seluruh layar pada ukuran yang diminta.

## 3. Temuan Audit terhadap Dokumen UX

| Acuan | Temuan | Penjabaran yang diterapkan |
|---|---|---|
| DESIGN-SYS §3–7 | Sebagian token sudah dipakai, tetapi skala spacing, line-height, bobot font, dan border belum dinyatakan konsisten dalam stylesheet. | Menambahkan custom properties sesuai nilai token dokumentasi; tidak menambah palet warna atau radius baru. |
| DESIGN-SYS §8–12 | Kartu navigasi, pilihan metode, dan status membutuhkan affordance, fokus, dan hierarki yang lebih mudah dipindai. | Menata ikon, hover/pressed/focus, pilihan radio, dan lencana status dengan token yang ada. |
| UX-SPEC §8.1–8.7 | Jalur beranda, form, konfirmasi, hasil, riwayat, dan bantuan perlu konsisten saat berpindah ukuran layar. | Menyusun ulang layout responsif tanpa mengubah konten wajib atau tindakan. |
| INTERACTION §2–8, §12–18 | Koreksi dan feedback harus mudah ditemukan; state pemrosesan, gangguan, dan riwayat perlu tetap jelas. | Memperjelas jarak, permukaan komponen, dan status, serta mempertahankan kontrol dan microcopy yang telah ada. |
| ACCEPTANCE AC-RSP / AC-A11Y | Bukti responsive dan fokus keyboard perlu diperbarui setelah perubahan visual. | Menguji 10 tampilan utama pada tiga viewport serta fokus keyboard. |

## 4. Perbaikan yang Dilakukan

- Menggunakan token design system untuk skala spacing, line-height, bobot font, dan border, serta menerapkannya pada komponen yang sudah ada.
- Memperjelas kartu menu beranda dengan ikon berukuran konsisten, ruang interaksi, dan state hover/pressed; pada desktop tiga pintasan memakai grid tiga kolom.
- Merapikan form tujuan menjadi dua kolom pada desktop dan satu kolom pada mobile; verifikasi penerima dan nominal tetap menonjol. Pesan error kosong tidak lagi membuat celah tata letak.
- Menata kartu metode dan kontrol radio agar lebih jelas sebagai pilihan yang dapat diinteraksikan.
- Memperjelas ringkasan enam baris dan memberi penekanan tipografis pada total yang masih TBD.
- Menata ikon status dan lencana status riwayat dengan teks/ikon tetap tersedia; status proses tetap memakai permukaan putih untuk keterbacaan token warning.
- Menyelaraskan padding kartu, panel error/peringatan, empty state, dan navigasi bantuan.
- Menambahkan respons untuk `prefers-reduced-motion` agar transisi dan animasi diminimalkan sesuai preferensi perangkat.
- Mengganti gaya inline pada spacer header dan tombol koreksi dengan kelas stylesheet.

Tidak ada perubahan pada data simulasi, validasi, biaya/limit/kecepatan, metode, status yang diizinkan, peringatan duplikat, penyimpanan riwayat, atau integrasi eksternal.

## 5. Perbandingan Sebelum dan Sesudah

| Area | Sebelum | Sesudah |
|---|---|---|
| Beranda | Menu vertikal berupa baris sederhana; ikon kurang terbedakan. | Ikon berada dalam wadah visual konsisten; menu memakai tiga kolom pada desktop dan tetap satu kolom pada mobile. |
| Form transfer | Form belum memanfaatkan ruang desktop dengan baik; pesan kosong dapat meninggalkan jarak berlebih. | Rekening dan bank berdampingan pada desktop, nominal menempati lebar penuh, dan elemen kosong tidak membuat baris tambahan. |
| Metode transfer | Radio dan kartu pilihan cukup padat, state interaksi kurang terlihat. | Area pilihan, state hover, dan metode terpilih lebih tegas dengan format informasi yang tetap seragam. |
| Konfirmasi/status/riwayat | Kartu dan status memiliki penekanan visual terbatas. | Spacing, pemisahan label/nilai, status, dan empty state lebih konsisten dan mudah dipindai. |
| Responsive | Pernah diuji secara terbatas pada tahap sebelumnya. | Seluruh tampilan yang disebut pada bagian pengujian dicek ulang pada 360px, 390px, dan desktop. |

## 6. File yang Berubah pada Tahap Ini

- `app.js` — kelas layout pada form, spacer header, dan tombol koreksi; alur/state tidak diubah.
- `styles.css` — penerapan token dan refinement komponen serta responsive.
- `WEEK2_UI_UX_REFINEMENT_REPORT.md` — laporan tahap ini.

`index.html` dan dokumen acuan tidak diubah dalam tahap refinement ini. Perubahan kerja yang belum di-commit dari tahap Feature Completion tetap berada di working tree.

## 7. Hasil Pengujian Ulang

| Pemeriksaan | Hasil |
|---|---|
| `node --check app.js` | PASS |
| `git diff --check` | PASS |
| Browser: beranda, riwayat kosong, Customer Service, form, metode, konfirmasi, status diproses/berhasil/gagal, riwayat, peringatan duplikat | PASS |
| Viewport 360×800, 390×844, 1280×900 pada 10 tampilan utama (30 kombinasi layar) | PASS — tidak ditemukan horizontal overflow |
| Validasi form, identitas penerima, enam rincian konfirmasi, status dan riwayat | PASS |
| Peringatan koneksi melalui event offline simulasi | PASS — status transaksi tetap sama |
| Fokus keyboard pada kontrol awal | PASS — outline terlihat |
| JavaScript page errors dalam alur yang diuji | 0 ditemukan |
| Data riwayat sementara pengujian | Dibersihkan setelah pengujian |

Ukuran `documentElement.clientWidth` dapat berkurang saat scrollbar vertikal tampil; pada seluruh kombinasi, `scrollWidth` sama dengan `clientWidth`, sehingga tidak ada overflow horizontal.

## 8. Regresi dan Hal yang Belum Diuji

- **Regresi yang ditemukan:** tidak ada pada skenario yang dijalankan.
- **Belum diuji:** pembaca layar nyata, pengujian usability dengan peserta, zoom teks, perangkat fisik, inspeksi visual pada semua browser, dan koneksi buruk yang benar-benar terjadi. Offline state diuji dengan event browser simulasi, bukan dengan gangguan jaringan nyata.
- **Belum diverifikasi melalui sumber kebutuhan:** biaya, total debit, kecepatan, ketentuan, batas nominal, serta nomor referensi tetap `TBD` sesuai dokumentasi.

## 9. Batasan Simulasi

- Seluruh transaksi dan penerima merupakan data simulasi lokal; tidak ada transaksi yang dikirim ke bank.
- Tidak ada API eksternal atau data nasabah nyata yang ditambahkan.
- Status tetap hanya berhasil, sedang diproses, atau gagal.
- Hasil usability tidak diklaim karena belum diuji dengan peserta.

## 10. Konfirmasi Ruang Lingkup

- `PRD.md` dan lima dokumen UX tidak diubah.
- Tidak ada fitur baru atau aturan bisnis perbankan yang ditambahkan.
- Tidak ada dependency baru.
- Tidak ada commit atau push GitHub otomatis.
