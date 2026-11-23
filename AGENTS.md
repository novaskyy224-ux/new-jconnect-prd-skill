# AGENTS: AI Coding Agent Instructions — Experiment B

## 1. Project Overview

Repository ini berisi dokumentasi untuk simulasi UX aplikasi New JConnect Mobile — Transfer Antarbank. Tujuan implementasi adalah menghasilkan pengalaman transfer antarbank yang jelas, aman, dan mudah dipahami untuk eksperimen akademik.

Aplikasi harus tetap berupa simulasi. Tidak boleh terhubung ke rekening, sistem perbankan nyata, API transaksi nyata, kredensial perbankan, atau data nasabah nyata.

## 2. Documentation Priority

Urutan sumber kebutuhan:

1. `PRD.md`
2. `UX-SPEC.md`
3. `DESIGN-SYS.md`
4. `INTERACTION.md`
5. `ACCEPTANCE.md`

Jika terdapat konflik, berhenti dan laporkan konflik. Jangan menyelesaikan konflik dengan menambah asumsi. PRD tidak boleh diubah.

## 3. Required Reading

Sebelum implementasi, AI Agent wajib membaca:

- `PRD.md`
- `UX-SPEC.md`
- `DESIGN-SYS.md`
- `INTERACTION.md`
- `ACCEPTANCE.md`

Pekerjaan implementasi baru boleh dimulai setelah membaca kelima dokumen dan memetakan tugas ke requirement yang dapat ditelusuri.

## 4. Development Principles

- Jelaskan kebutuhan yang diimplementasikan.
- Utamakan perilaku yang benar dan dapat diuji.
- Gunakan data lokal yang jelas sebagai simulasi.
- Jangan mengarang data metode, status, biaya, penerima, atau referensi.
- Jangan menghapus atau melemahkan requirement PRD.
- Jangan menambah fitur yang tidak memiliki trace ke PRD.
- Pastikan status diproses tidak ditampilkan sebagai berhasil.
- Pastikan pengguna dapat mengoreksi tujuan sebelum menyetujui.

## 5. Technology Constraints

- Pertahankan teknologi dan framework yang sama dengan Experiment A bila repository/struktur referensinya tersedia secara lokal.
- Jika teknologi belum tersedia atau Experiment A tidak tersedia, tandai keputusan sebagai TBD dan jangan mengganti teknologi tanpa persetujuan.
- Jangan menyalin seluruh implementasi Experiment A.
- Jangan mengubah teknologi, build tool, atau dependency hanya demi preferensi pribadi.
- Tidak boleh menginstal dependency pada tahap dokumentasi atau tanpa kewenangan implementasi yang eksplisit.
- Tidak boleh membuat integrasi perbankan sungguhan.

## 6. Coding Guidelines

- Ikuti pola repository yang ada setelah tahap implementasi dimulai.
- Gunakan nama komponen, state, dan ID yang jelas.
- Pisahkan data simulasi, state transaksi, dan komponen UI agar perilaku mudah diuji.
- Hindari hard-coded status selain tiga nilai PRD: berhasil, sedang diproses, gagal.
- Hindari kredensial, API, atau data pribadi nyata.
- Tangani loading, empty, error, koneksi buruk, dan status dengan state eksplisit.
- Hindari timeout/durasi proses yang tidak ditetapkan PRD.
- Tambahkan test sesuai pola proyek.

## 7. Component Guidelines

Gunakan komponen dari DESIGN-SYS:

- button primary/secondary;
- input dengan label dan validasi;
- card ringkasan;
- card pembanding metode;
- card identitas penerima;
- status component;
- navigation/header;
- loading indicator;
- warning/error panel;
- empty state.

Komponen status wajib menyertakan teks dan ikon, bukan hanya warna.

## 8. UX Implementation Rules

- Tautkan menu Transfer Antarbank ke alur utama dari beranda.
- Tampilkan nama penerima dan bank tujuan setelah data diisi.
- Berikan akses koreksi tujuan.
- Tampilkan ringkasan konfirmasi lengkap:
  penerima, bank tujuan, nominal, biaya, metode, dan total debit.
- Gunakan format pembanding metode yang seragam.
- Tampilkan status berdasarkan data transaksi terbaru.
- Perbarui tampilan otomatis ketika data diperbarui.
- Jangan menyarankan transfer ulang ketika status belum jelas.
- Tampilkan nomor referensi pada hasil dan riwayat jika tersedia.
- Jangan menampilkan nomor referensi palsu.

## 9. Design System Rules

- Gunakan token dari `DESIGN-SYS.md`.
- Jangan membuat nilai warna, radius, spacing, atau typography lokal yang bertentangan tanpa alasan.
- Jangan mengklaim warna sebagai identitas resmi Bank Jatim.
- Pertahankan hierarki mobile.
- Gunakan warna bersama teks dan ikon.
- Hindari dekorasi yang mengurangi keterbacaan.

## 10. Interaction Rules

Ikuti pola Trigger — System Response — Feedback — Next Action pada `INTERACTION.md`.

- Semua status harus dibedakan oleh teks, ikon, dan warna.
- Koreksi tujuan tersedia sebelum persetujuan.
- Peringatan transfer serupa harus muncul saat data simulasi menyatakan transaksi masih diproses.
- Indikator proses hanya digunakan untuk status diproses.
- Gangguan harus memakai bahasa awam dan menyertakan next action.
- Peringatan koneksi buruk tidak boleh mengubah status transaksi.
- Riwayat dan Customer Service perlu dapat dijangkau dari konteks bermasalah.

## 11. Accessibility Requirements

- Kontrol memiliki label/nama yang dapat diakses.
- Urutan tab dan pembaca layar logis.
- Fokusan keyboard terlihat.
- Status tidak hanya bergantung pada warna.
- Pesan validasi dan error dapat dibaca pembaca layar.
- Target sentuh minimum harus dipertimbangkan sesuai guideline.
- Layout tetap dapat digunakan pada zoom dan layar sempit.
- Nilai kontras baru harus diuji sebelum digunakan.

## 12. Validation Requirements

- Mappingkan implementasi ke ID FR dan AC.
- Jalankan test fungsional yang paling kecil mencakup perubahan.
- Uji tiga status transaksi, pembaruan status, referensi tersedia/tidak tersedia, koreksi tujuan, metode, riwayat, dan gangguan.
- Uji responsive pada ukuran yang ditetapkan saat implementasi; ukuran belum ditentukan PRD.
- Uji keyboard dan pembaca layar untuk semua alur utama.
- Jangan menyatakan PASS sebelum bukti pengujian tersedia.
- Pertahankan status NOT TESTED sampai pengujian benar-benar dilakukan.

## 13. Testing Instructions

1. Mulai dari test/cek yang paling dekat dengan perubahan.
2. Verifikasi data lokal yang digunakan sebagai simulasi.
3. Pastikan status hanya memiliki tiga nilai.
4. Pastikan ringkasan memiliki enam rincian wajib.
5. Pastikan koreksi tujuan dapat dilakukan.
6. Pastikan nomor referensi hanya ditampilkan bila tersedia.
7. Pastikan akses beranda, riwayat, dan bantuan berfungsi.
8. Jalankan validasi acceptance yang relevan.
9. Laporkan kegagalan, partial, dan TBD secara jujur.

## 14. Documentation Maintenance

- Perbarui dokumentasi jika requirement resmi berubah melalui PRD.
- Jangan mengubah PRD secara diam-diam.
- Perbarui traceability matrix saat menambah atau mengubah requirement.
- Jangan menambahkan asumsi baru ke dokumen sebagai fakta.
- Tandai dengan **TBD** atau nyatakan “asumsi perlu dikonfirmasi”.
- Simpan bukti pengujian dan ubah status AC hanya setelah verifikasi.

## 15. Restrictions

AI Agent dilarang:

- mengubah PRD;
- mengubah atau menyalin implementasi Experiment A tanpa kewenangan;
- menambahkan fitur di luar PRD;
- membuat API atau integrasi perbankan nyata;
- memakai kredensial atau data transaksi nyata;
- mengklaim hasil wawancara atau observasi yang tidak ada;
- mengubah teknologi hanya demi preferensi;
- mengubah target usability PRD;
- menambah angka/timeout/batas yang tidak ditetapkan;
- menyelesaikan konflik dokumen dengan asumsi tersembunyi;
- menyatakan fitur selesai tanpa validasi.
