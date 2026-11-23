# Product Requirements Document

## New JConnect Mobile — Transfer Antarbank

Dokumen ringkas ini merupakan versi yang disanitasi dari PRD sumber untuk penggunaan repository. Dokumen sumber lokal adalah `PRD_New_JConnect_Mobile_Transfer_Antarbank_v1.0.docx`. Versi ini tidak memuat identitas atau informasi pribadi.

## Tujuan produk

Menyediakan pengalaman transfer antarbank yang jelas, aman, dan mudah dipahami sehingga nasabah dapat memeriksa tujuan, memahami biaya, mengetahui status transaksi, dan mengambil langkah aman saat terjadi gangguan.

## Target pengguna

Nasabah New JConnect Mobile yang melakukan atau berencana melakukan transfer antarbank.

## Fitur dan functional requirements

### FR-01 Menampilkan status transaksi

- Menampilkan status berhasil, sedang diproses, atau gagal.
- Status harus berasal dari data transaksi terbaru.
- Pembaruan status harus ditampilkan secara otomatis ketika data diperbarui.

### FR-02 Arahan aman saat bermasalah

- Menampilkan arahan menunggu, memeriksa riwayat, atau menghubungi bantuan.
- Menyediakan tautan/logika menuju riwayat dan Customer Service.
- Memberi peringatan sebelum transfer ulang apabila transaksi serupa masih diproses.

### FR-03 Bukti dan rujukan transaksi

- Menyimpan nomor referensi jika tersedia.
- Menampilkan nomor referensi pada hasil dan riwayat.

### FR-04 Indikator proses dan gangguan

- Menampilkan indikator ketika transaksi diproses.
- Memberi peringatan saat koneksi buruk.
- Pesan gangguan menggunakan bahasa awam dan saran tindakan berikutnya.

### FR-05 Ringkasan konfirmasi

- Menampilkan penerima, bank tujuan, nominal, biaya, metode, dan total debit.
- Informasi disusun mudah dipindai.
- Pengguna dapat kembali dan mengoreksi tujuan.

### FR-06 Identitas penerima

- Menampilkan nama penerima dan bank tujuan setelah data diisi.
- Pengguna dapat mengubah tujuan tanpa mengulang seluruh formulir.

### FR-07 Perbandingan metode

- Menampilkan nama metode, biaya, kecepatan, ketentuan utama, dan batas nominal.
- Informasi antar-metode menggunakan format seragam.

### FR-08 Akses menu transfer

- Menu transfer antarbank tetap dapat diakses dari beranda.

## Business rules

- Status hanya berhasil, sedang diproses, atau gagal.
- Nomor referensi ditampilkan jika tersedia.
- Transfer serupa yang masih diproses menghasilkan peringatan.
- Konfirmasi sekurang-kurangnya memuat penerima, bank, nominal, biaya, metode, dan total debit.
- Pengguna dapat mengoreksi tujuan sebelum menyetujui.
- Aturan durasi status diproses tetap merupakan pertanyaan terbuka yang belum ditetapkan.

## Kriteria penerimaan

- Semua status dapat dibedakan dengan warna, ikon, dan bahasa awam.
- Pengguna tidak mengulang transfer saat status belum jelas.
- Bukti atau rujukan dapat ditemukan dari hasil atau riwayat.
- Pesan gangguan menjelaskan situasi dan tindakan berikutnya.
- Ringkasan memuat dan menonjolkan seluruh rincian yang diwajibkan.
- Penerima dan bank dapat diperiksa serta dikoreksi.
- Metode dapat dibandingkan dalam format konsisten.
- Menu transfer mudah ditemukan dari beranda.

## Batas simulasi

Implementasi eksperimen menggunakan data lokal dan tidak terhubung ke rekening atau sistem perbankan nyata.
