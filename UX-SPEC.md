# UX-SPEC: New JConnect Mobile — Transfer Antarbank

## 1. Product UX Overview

New JConnect Mobile membantu nasabah melakukan simulasi transfer antarbank dengan pengalaman yang jelas, aman, mudah dipindai, dan mudah diperbaiki. Dokumentasi ini menurunkan PRD menjadi alur layar dan kebutuhan UX; PRD tetap menjadi sumber kewajiban utama.

Lingkup UX mencakup akses transfer dari beranda, pemilihan penerima dan bank, pemilihan metode, ringkasan konfirmasi, pemrosesan, hasil, riwayat, bukti/rujukan, gangguan, dan bantuan. Implementasi wajib berupa simulasi lokal dan tidak terhubung ke sistem perbankan nyata.

## 2. Target Users dan User Context

- **Target pengguna:** nasabah New JConnect Mobile yang melakukan atau berencana melakukan transfer antarbank.
- **Tujuan konteks:** pengguna perlu memahami tujuan transfer, biaya, status, dan tindakan aman saat terjadi gangguan.
- **Konteks penggunaan yang perlu didukung:** layar mobile, koneksi yang dapat menjadi buruk, dan pengguna yang mungkin perlu memeriksa ulang informasi sebelum menyetujui.
- Persona dan wawancara pengguna tidak tersedia dalam PRD. Tidak ada asumsi demografis atau hasil riset yang disajikan sebagai fakta.

## 3. User Problems

1. Pengguna dapat kesulitan memverifikasi penerima dan bank tujuan.
2. Pengguna dapat gagal membandingkan metode transfer dengan mudah.
3. Pengguna dapat tidak memahami biaya dan total debit sebelum menyetujui.
4. Pengguna dapat tidak mengetahui apakah transaksi berhasil, sedang diproses, atau gagal.
5. Pengguna dapat mengulang transfer saat status belum jelas.
6. Pengguna dapat kesulitan menemukan bukti atau nomor referensi.
7. Pengguna dapat bingung saat koneksi buruk atau transaksi mengalami gangguan.

## 4. UX Goals

- **U1 — Dapat dipindai:** rincian penting terlihat jelas dan konsisten.
- **U2 — Aman:** tujuan dapat diperiksa dan dikoreksi sebelum persetujuan.
- **U3 — Tegas:** status berhasil, diproses, dan gagal dibedakan dengan bahasa, ikon, dan warna.
- **U4 — Tindak lanjut jelas:** gangguan menjelaskan situasi dan tindakan berikutnya.
- **U5 — Mudah ditemukan:** transfer dapat diakses dari beranda dan bukti dapat ditemukan dari hasil/riwayat.
- **U6 — Konsisten:** metode, status, kartu, tombol, dan pesan menggunakan pola yang seragam.

## 5. User Needs

- Melihat nama penerima dan bank tujuan setelah data diisi.
- Mengubah tujuan tanpa mengulang seluruh formulir.
- Membandingkan nama metode, biaya, kecepatan, ketentuan utama, dan batas nominal.
- Meninjau penerima, bank tujuan, nominal, biaya, metode, dan total debit.
- Mengoreksi tujuan sebelum menyetujui.
- Mengetahui status transaksi terbaru secara otomatis.
- Menyimpan dan melihat nomor referensi jika tersedia.
- Mendapatkan arahan menunggu, memeriksa riwayat, menghubungi bantuan, atau menghindari transfer ulang.
- Mengetahui bahwa koneksi buruk atau gangguan dapat memengaruhi tampilan status.

## 6. Main User Flow

1. Pengguna membuka beranda.
2. Pengguna memilih menu **Transfer Antarbank**.
3. Pengguna mengisi penerima, rekening, bank tujuan, nominal, dan metode.
4. Sistem menampilkan verifikasi identitas penerima dan bank tujuan.
5. Pengguna dapat mengoreksi tujuan tanpa mengulang seluruh data yang tidak perlu diisi ulang.
6. Pengguna membandingkan metode dan memilih satu metode.
7. Sistem menampilkan ringkasan konfirmasi.
8. Pengguna memeriksa penerima, bank, nominal, biaya, metode, dan total debit.
9. Pengguna mengoreksi tujuan atau melanjutkan persetujuan.
10. Sistem menampilkan indikator pemrosesan dan status terbaru.
11. Sistem menampilkan hasil:
   - berhasil,
   - sedang diproses, atau
   - gagal.
12. Pengguna dapat membuka riwayat, melihat nomor referensi jika tersedia, atau mengikuti arahan gangguan.

Cabang: jika transfer serupa masih diproses, sistem menampilkan peringatan sebelum transfer ulang.

## 7. Information Architecture

- **Beranda**
  - akses ke Transfer Antarbank
- **Transfer Antarbank**
  - tujuan penerima
  - pemilihan bank
  - nominal
  - pilihan metode
- **Verifikasi Tujuan**
  - nama penerima
  - bank tujuan
  - aksi ubah tujuan
- **Konfirmasi**
  - ringkasan wajib
  - koreksi
  - persetujuan
- **Status**
  - berhasil/diproses/gagal
  - indikator proses jika relevan
  - arahan berikutnya
  - nomor referensi jika tersedia
- **Riwayat**
  - daftar/status transaksi terbaru
  - nomor referensi jika tersedia
- **Bantuan**
  - Customer Service sesuai akses aplikasi atau tautan/logika yang ditetapkan saat implementasi

## 8. Screen/Page Specification

### 8.1 Beranda
- Menampilkan jalur yang mudah terlihat menuju transfer antarbank.
- Tidak menutup atau mengganti konteks navigasi utama.

### 8.2 Form Tujuan
- Menampilkan data yang diperlukan untuk identifikasi penerima dan nominal.
- Nama penerima dan bank tujuan ditampilkan setelah data diisi.
- Pengguna dapat mengubah tujuan tanpa mengulang seluruh formulir.

### 8.3 Pembanding Metode
- Setiap metode ditampilkan dalam format sama:
  - nama metode;
  - biaya;
  - kecepatan;
  - ketentuan utama;
  - batas nominal.
- Nilai batas nominal, ketentuan, dan kecepatan hanya boleh berasal dari data simulasi yang dipastikan. Informasi yang belum tersedia diberi label **TBD**.

### 8.4 Konfirmasi
- Urutan wajib: penerima, bank tujuan, nominal, biaya, metode, total debit.
- Informasi utama ditonjolkan dan dapat dipindai.
- Tersedia aksi kembali dan mengoreksi tujuan.

### 8.5 Hasil Transaksi
- Menampilkan status eksplisit: berhasil, sedang diproses, atau gagal.
- Status berasal dari data transaksi terbaru.
- Pembaruan ditampilkan otomatis ketika data diperbarui.
- Status berhasil/diproses/gagal dibedakan oleh warna, ikon, dan teks awam.
- Menyimpan dan menampilkan nomor referensi jika tersedia.
- Menampilkan arahan tindakan berikutnya sesuai status.

### 8.6 Riwayat
- Menampilkan status transaksi terbaru.
- Menampilkan nomor referensi jika tersedia.
- Menjadi titik masuk untuk memeriksa transaksi yang belum jelas.

### 8.7 Gangguan dan Bantuan
- Menjelaskan situasi dengan bahasa awam.
- Menyatakan tindakan berikutnya.
- Menyediakan akses ke riwayat dan Customer Service.
- Tidak menyarankan transfer ulang sebelum peringatan serupa diperiksa.

## 9. Content dan Microcopy Guidelines

- Gunakan bahasa Indonesia yang ringkas, formal, dan mudah dipahami.
- Hindari jargon teknis dan istilah yang mengasumsikan pengetahuan nasabah.
- Tulis status dengan kata kerja atau keadaan yang jelas:
  - **Berhasil**
  - **Sedang diproses**
  - **Gagal**
- Wajib menyertakan tindakan berikutnya pada pesan gangguan.
- Nominal, biaya, dan total debit diberi label yang konsisten.
- Angka disajikan dalam format mata uang lokal yang konsisten; aturan format final perlu dikonfirmasi bila tidak ditentukan PRD.
- Hindari frasa ancaman atau cakupan yang berlebihan.
- Peringatan transfer ulang harus menyatakan bahwa transaksi serupa masih diproses dan menyarankan pemeriksaan status/riwayat.

## 10. UX Requirements Mapping

| PRD ID | Kebutuhan UX | Penjabaran |
|---|---|---|
| FR-01 | Status jelas dan mutakhir | Status tiga nilai, bahasa/ikon/warna, pembaruan otomatis |
| FR-02 | Arahan aman saat bermasalah | Menunggu, riwayat, bantuan, peringatan transfer ulang |
| FR-03 | Bukti/rujukan | Nomor referensi jika tersedia pada hasil dan riwayat |
| FR-04 | Indikator dan gangguan | Indikator proses, peringatan koneksi, pesan awam + tindakan |
| FR-05 | Ringkasan konfirmasi | Enam rincian wajib, mudah dipindai, koreksi tujuan |
| FR-06 | Identitas penerima | Nama dan bank ditampilkan; tujuan dapat diubah |
| FR-07 | Perbandingan metode | Format seragam untuk nama, biaya, kecepatan, ketentuan, batas |
| FR-08 | Akses beranda | Jalur transfer antarbank tetap mudah ditemukan |
| Acceptance | Pengalaman aman | Tidak mengulang transfer saat status belum jelas |
