# Week 2 Feature Completion Report

## 1. Ringkasan Initial Development

Initial Development sudah menyediakan beranda, alur transfer lokal, perbandingan metode, konfirmasi, tiga status, riwayat `localStorage`, dan tata letak mobile. Audit source menunjukkan beberapa perilaku belum aman atau belum lengkap meskipun sebagian UI telah tersedia: nama penerima dapat tertinggal setelah rekening berubah, validasi nominal hanya memeriksa nilai kosong, metode dapat terlewati, peringatan duplikat menggunakan konfirmasi browser yang membingungkan, dan status berhasil membuat nomor referensi sintetis.

Audit didasarkan pada `PRD.md`, `UX-SPEC.md`, `DESIGN-SYS.md`, `INTERACTION.md`, `ACCEPTANCE.md`, `AGENTS.md`, serta source aktual. Tidak ditemukan konflik kebutuhan antar dokumen. Biaya, batas nominal, kecepatan, ketentuan metode, aturan durasi status diproses, kanal kontak Customer Service, dan data referensi transaksi tetap tidak ditentukan oleh dokumen.

## 2. Hasil Audit dan Traceability

Status di bawah menunjukkan kesesuaian implementasi setelah perbaikan. `IMPLEMENTED` berarti perilaku tersedia dan diuji di skenario yang dicantumkan; `PARTIAL` berarti perilaku struktural tersedia tetapi data/aturan penting masih TBD atau hanya sebagian terverifikasi; `NOT TESTED` berarti bukti yang dibutuhkan belum dikumpulkan. Tidak ada kriteria yang sengaja dihilangkan (`MISSING`).

### Functional Requirements

| Requirement | Status | Bukti / catatan |
|---|---|---|
| FR-01 — Status transaksi terbaru dan pembaruan otomatis | IMPLEMENTED | Status berhasil/diproses/gagal diuji. Perubahan data simulasi lintas-tab memperbarui halaman status dan menghapus peringatan duplikat yang sudah tidak relevan pada konfirmasi. |
| FR-02 — Arahan aman, riwayat, Customer Service, peringatan duplikat | IMPLEMENTED | Jalur bantuan dan riwayat diuji; duplikat menampilkan pilihan meninjau status, kembali ke formulir, atau melanjutkan simulasi secara eksplisit. |
| FR-03 — Nomor referensi jika tersedia | PARTIAL | Referensi sintetis `SIM-*` tidak lagi dibuat dan referensi sintetis lama diabaikan. Jalur referensi tersedia belum dapat diuji karena tidak ada referensi sah yang ditetapkan dalam data/dokumen. |
| FR-04 — Indikator proses dan gangguan | IMPLEMENTED | Indikator hanya untuk status diproses; kondisi offline dan error penyimpanan riwayat diuji. |
| FR-05 — Ringkasan konfirmasi dan koreksi tujuan | PARTIAL | Enam rincian wajib tampil dan koreksi diuji. Biaya dan total debit tetap `TBD` sebab sumber tidak menetapkan biaya. |
| FR-06 — Identitas penerima dan koreksi tanpa mengulang formulir | IMPLEMENTED | Identitas berasal dari pasangan rekening-bank simulasi; perubahan rekening/bank menginvalidasi kecocokan lama. |
| FR-07 — Perbandingan metode | PARTIAL | Format nama, biaya, kecepatan, ketentuan, dan batas seragam. Nama metode hanya label simulasi; nilai kebijakan tetap `TBD`. |
| FR-08 — Akses transfer dari beranda | IMPLEMENTED | Navigasi beranda ke alur transfer diuji. |

### Functional Acceptance Criteria

| AC | Status | Bukti / catatan |
|---|---|---|
| AC-FR01-01 | IMPLEMENTED | Ketiga status diperiksa pada halaman status/riwayat. |
| AC-FR01-02 | IMPLEMENTED | Pembaruan status dari tab lain tercermin otomatis pada halaman status dan konfirmasi duplikat. |
| AC-FR02-01 | IMPLEMENTED | Pesan menunggu, riwayat, dan bantuan tersedia pada konteks status. |
| AC-FR02-02 | IMPLEMENTED | Akses riwayat dan halaman Customer Service simulasi diuji. |
| AC-FR02-03 | IMPLEMENTED | Peringatan muncul sebelum transfer serupa kedua dibuat. |
| AC-FR03-01 | PARTIAL | Properti referensi disimpan bila tersedia, tetapi tidak ada sumber/fixture referensi resmi untuk diuji. |
| AC-FR03-02 | PARTIAL | Ketiadaan referensi ditampilkan dengan benar pada hasil/riwayat; kasus referensi tersedia belum dapat diuji. |
| AC-FR04-01 | IMPLEMENTED | Indikator pemrosesan muncul hanya pada status sedang diproses. |
| AC-FR04-02 | IMPLEMENTED | Peringatan offline diuji dan tidak mengubah status transaksi. |
| AC-FR04-03 | IMPLEMENTED | Pesan gangguan dan error penyimpanan menjelaskan tindakan berikutnya. |
| AC-FR05-01 | PARTIAL | Enam baris ringkasan terverifikasi; nilai biaya/total debit `TBD`. |
| AC-FR05-02 | IMPLEMENTED | Ringkasan diuji pada mobile/desktop tanpa overflow horizontal. |
| AC-FR05-03 | IMPLEMENTED | Koreksi tujuan sebelum persetujuan diuji. |
| AC-FR06-01 | IMPLEMENTED | Nama dan bank ditampilkan saat pasangan simulasi cocok. |
| AC-FR06-02 | IMPLEMENTED | Perubahan rekening/bank memperbarui atau menolak identitas lama. |
| AC-FR07-01 | PARTIAL | Semua atribut pembanding tampil; data biaya, kecepatan, ketentuan, dan batas masih `TBD`. |
| AC-FR07-02 | IMPLEMENTED | Kartu metode menggunakan format yang sama. |
| AC-FR08-01 | IMPLEMENTED | Menu Transfer Antarbank dapat dijangkau dari beranda. |

### UX, Non-Functional, Responsive, dan Accessibility

| Kriteria | Status | Bukti / catatan |
|---|---|---|
| AC-UX-01 — Status memakai teks, ikon, dan warna | IMPLEMENTED | Tiga state memiliki ikon, label, dan token warna. Rasio kontras token status diperiksa; warna warning pada permukaan putih 4.60:1. |
| AC-UX-02 — Tidak mendorong transfer ulang saat status belum jelas | IMPLEMENTED | Peringatan duplikat dengan tindakan eksplisit diuji. |
| AC-UX-03 — Bukti/rujukan dapat ditemukan jika tersedia | PARTIAL | Kasus referensi tidak tersedia diuji; data referensi yang sah belum ditetapkan. |
| AC-UX-04 — Pesan gangguan dan next action | IMPLEMENTED | Offline dan error penyimpanan diuji. |
| AC-UX-05 — Penerima dapat diperiksa/dikoreksi | IMPLEMENTED | Perubahan data penerima diuji sebelum persetujuan. |
| AC-UX-06 — Metode dibandingkan secara konsisten | PARTIAL | Struktur konsisten; informasi metode belum ditetapkan. |
| AC-UX-07 — Jalur utama mudah ditemukan/digunakan | NOT TESTED | Membutuhkan pengujian dengan peserta/pengguna nyata. |
| AC-NFR-01 — Simulasi lokal tanpa integrasi perbankan | IMPLEMENTED | Tidak ditemukan pemanggilan `fetch`, XHR, WebSocket, EventSource, atau URL layanan pada source aplikasi. |
| AC-NFR-02 — Hanya tiga nilai status | IMPLEMENTED | Source membatasi status pada tiga nilai PRD; ketiganya diuji. |
| AC-NFR-03 — Status dapat dibedakan | IMPLEMENTED | Ikon/label/warna tersedia; kontras token status diukur secara programatis. |
| AC-NFR-04 — Rujukan dapat ditemukan jika tersedia | PARTIAL | Sama dengan AC-FR03-01/02; tidak ada referensi sah untuk test fixture. |
| AC-NFR-05 — Target usability | NOT TESTED | Belum ada pengujian dengan peserta nyata. |
| AC-NFR-06 — Tidak ada timeout/durasi baru | IMPLEMENTED | Tidak ada timer/status timeout ditambahkan. |
| AC-RSP-01 — Ukuran mobile target | PARTIAL | Diuji pada 390×844 dan 1280×900; ukuran target resmi masih TBD. |
| AC-RSP-02 — Ringkasan tidak terpotong/overflow | IMPLEMENTED | Konfirmasi diuji pada mobile dan desktop tanpa overflow horizontal. |
| AC-RSP-03 — Pembanding terbaca di layar sempit | IMPLEMENTED | Halaman metode diuji pada lebar mobile tanpa overflow horizontal. |
| AC-RSP-04 — Aksi koreksi/navigasi tetap tersedia | PARTIAL | Alur koreksi dan navigasi utama diuji; belum dilakukan inspeksi visual semua halaman pada seluruh ukuran. |
| AC-A11Y-01 — Nama kontrol dapat diakses | IMPLEMENTED | Kontrol utama diuji dengan role/label aksesibel browser. |
| AC-A11Y-02 — Urutan keyboard/tab logis | PARTIAL | Tab mencapai kontrol utama; seluruh urutan pada semua layar belum diuji. |
| AC-A11Y-03 — Status tidak hanya mengandalkan warna | IMPLEMENTED | Teks status dan ikon disediakan. |
| AC-A11Y-04 — Pesan error dapat dibaca pembaca layar | PARTIAL | Error memakai `role="alert"`/deskripsi kontrol; pembaca layar nyata belum diuji. |
| AC-A11Y-05 — Fokus keyboard terlihat | IMPLEMENTED | Fokus keyboard menampilkan outline. |
| AC-A11Y-06 — Target sentuh | IMPLEMENTED | Tombol utama 48px dan tombol kembali 44px sesuai guideline desain. |
| AC-A11Y-07 — Zoom tidak menghilangkan informasi | NOT TESTED | Belum diuji pada zoom pembesaran. |

## 3. Fitur yang Sudah Sesuai dan Perubahan

### Fitur yang dipertahankan

- Beranda, navigasi transfer, riwayat, dan bantuan lokal.
- Pilihan bank/metode simulasi, layar konfirmasi, tiga status, serta penyimpanan riwayat lokal.
- Token desain utama, label kontrol, focus outline, dan struktur responsive yang telah ada.

### Perbaikan dan penyelesaian fitur

- Verifikasi penerima sekarang diturunkan dari pasangan rekening-bank simulasi. Mengubah salah satunya langsung membatalkan verifikasi sebelumnya.
- Rekening yang tidak ditemukan atau tidak cocok dengan bank ditolak dengan pesan yang dapat diakses.
- Validasi input memeriksa nilai wajib, karakter angka, dan nominal lebih besar dari nol; tidak menambah batas maksimum.
- Alur konfirmasi tidak dapat melewati pemilihan metode.
- Ringkasan menampilkan enam rincian wajib. Total debit ditandai `TBD` selama biaya belum diketahui, tanpa menjumlahkan biaya yang belum tersedia.
- Peringatan duplikat tidak lagi memakai dialog OK/Cancel yang membingungkan. Pengguna dapat meninjau status sebelumnya, kembali ke formulir, atau memilih melanjutkan simulasi.
- Nomor referensi sintetis tidak lagi dibuat. Referensi lama berformat sintetis tidak ditampilkan; transaksi baru menunjukkan bahwa referensi belum tersedia.
- Penyimpanan riwayat memvalidasi bentuk data dan menampilkan error bila data rusak atau browser tidak mengizinkan penyimpanan.
- Perubahan data riwayat dari tab lain memperbarui layar status/riwayat yang sedang terbuka.
- Peringatan offline tidak mengubah status transaksi.
- Tata letak desktop diperluas; form, metode, dan konfirmasi diperiksa pada lebar mobile dan desktop.
- Warna latar status diproses disesuaikan agar token warning mencapai kontras minimal yang diukur pada permukaan putih.

### Fitur/kriteria yang masih PARTIAL atau NOT TESTED

- Data biaya administrasi, total debit, kecepatan, ketentuan utama, batas nominal, dan nama metode nyata belum ditetapkan.
- Tidak ada sumber/fixture nomor referensi transaksi yang sah. Referensi tidak dibuat untuk menutupi kekosongan data.
- Data penerima lokal hanya mencakup dua pasangan rekening-bank simulasi.
- Halaman Customer Service merupakan jalur bantuan simulasi; kanal kontak nyata tidak ditetapkan.
- Usability dengan peserta, pembaca layar nyata, zoom, dan inspeksi visual seluruh halaman pada seluruh breakpoint belum dilakukan.

## 4. Perubahan Source Code

- `app.js`: verifikasi dan validasi data, flow metode/konfirmasi, peringatan duplikat, penanganan riwayat, referensi, dan pembaruan lintas-tab.
- `styles.css`: responsivitas desktop dan konsistensi warna permukaan status/error.
- `index.html`: menghapus `aria-live` global yang mengumumkan ulang seluruh halaman; pengumuman tetap berada pada komponen status/error yang relevan.

Tidak ada dependency atau framework baru. Tidak ada API atau koneksi transaksi nyata.

## 5. Pengujian

| Pengujian | Hasil |
|---|---|
| `node --check app.js` | PASS |
| `git diff --check` | PASS |
| Server lokal: halaman, CSS, JS | PASS (HTTP 200) |
| Browser: beranda, navigasi, riwayat kosong | PASS |
| Validasi kosong, rekening tak dikenal, nominal non-angka/nol | PASS |
| Verifikasi penerima, ketidakcocokan bank, koreksi tujuan | PASS |
| Metode wajib dipilih sebelum konfirmasi | PASS |
| Enam rincian konfirmasi dan total debit TBD | PASS |
| Status diproses, berhasil, gagal; riwayat persisten | PASS |
| Peringatan duplikat, tinjau status, batalkan, lanjut eksplisit | PASS |
| Referensi tidak tersedia dan tidak ada referensi sintetis | PASS |
| Offline warning tidak mengubah status | PASS |
| Error state saat data riwayat rusak | PASS |
| Pembaruan status otomatis di halaman status/konfirmasi ketika tab lain memperbarui data | PASS |
| Responsive form/metode/konfirmasi pada 390×844 dan 1280×900 | PASS, tanpa overflow horizontal |
| Fokus keyboard dan outline terlihat | PASS |
| Runtime page errors pada alur utama | Tidak ditemukan |
| Pengujian pengguna nyata/pembaca layar nyata | NOT TESTED |

Pada smoke test awal, dua assertion test memakai asumsi yang keliru tentang teks status (ikon ikut menjadi bagian teks aksesibel) dan rute setelah reload (kembali ke beranda). Assertion diperbaiki untuk memeriksa konten/rute aktual; status sukses, riwayat persisten, dan seluruh skenario kemudian diverifikasi tanpa kegagalan aplikasi.

## 6. Batasan dan Tindak Lanjut

1. Konfirmasikan daftar metode, biaya, kecepatan, ketentuan, dan batas nominal sebelum mengubah `TBD`.
2. Sediakan data referensi simulasi yang disetujui bila alur nomor referensi perlu diuji; jangan membuat nomor yang menyerupai referensi bank nyata.
3. Tentukan kanal/tujuan Customer Service simulasi jika dibutuhkan oleh eksperimen.
4. Tetapkan viewport target dan lakukan validasi responsive/zoom lanjutan.
5. Lakukan uji pembaca layar dan usability dengan peserta sesuai protokol penelitian sebelum mengklaim keberhasilan usability.

## 7. Konfirmasi Batasan

- `PRD.md` dan lima dokumen pendukung (`UX-SPEC.md`, `DESIGN-SYS.md`, `INTERACTION.md`, `ACCEPTANCE.md`, `AGENTS.md`) tidak diubah.
- Tidak ada perubahan pada ruang lingkup produk dan tidak ada integrasi perbankan nyata.
- Seluruh data transaksi yang digunakan untuk smoke test browser dibersihkan setelah pengujian.
- Tidak ada Git commit atau push otomatis.
