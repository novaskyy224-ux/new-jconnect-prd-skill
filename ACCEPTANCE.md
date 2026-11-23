# ACCEPTANCE: New JConnect Mobile — Transfer Antarbank

## 1. Acceptance Criteria Overview

Dokumen ini menerjemahkan requirement PRD menjadi kriteria verifikasi. Status awal seluruh kriteria: **NOT TESTED**. Status hanya boleh berubah setelah bukti pengujian nyata tersedia.

Gunakan format:

- **Given** kondisi awal
- **When** tindakan pengguna/sistem
- **Then** hasil yang dapat diverifikasi

Skenario yang membutuhkan pengguna nyata berbeda dari pemeriksaan implementasi teknis/fungsional.

## 2. Functional Requirements Checklist

| ID | Requirement trace | Kriteria | Status |
|---|---|---|---|
| AC-FR01-01 | FR-01 | Sistem menampilkan status berhasil, diproses, atau gagal sesuai data terbaru. | NOT TESTED |
| AC-FR01-02 | FR-01 | Status terbaru diperbarui otomatis ketika data diperbarui. | NOT TESTED |
| AC-FR02-01 | FR-02 | State bermasalah menampilkan arahan menunggu, riwayat, atau Customer Service bila relevan. | NOT TESTED |
| AC-FR02-02 | FR-02 | Akses ke riwayat dan bantuan tersedia. | NOT TESTED |
| AC-FR02-03 | FR-02 | Peringatan muncul sebelum transfer ulang jika transfer serupa masih diproses. | NOT TESTED |
| AC-FR03-01 | FR-03 | Nomor referensi disimpan jika tersedia. | NOT TESTED |
| AC-FR03-02 | FR-03 | Nomor referensi ditampilkan pada hasil dan riwayat jika tersedia. | NOT TESTED |
| AC-FR04-01 | FR-04 | Indikator proses ditampilkan saat transaksi diproses. | NOT TESTED |
| AC-FR04-02 | FR-04 | Peringatan koneksi buruk ditampilkan pada kondisi yang ditentukan data simulasi. | NOT TESTED |
| AC-FR04-03 | FR-04 | Pesan gangguan menjelaskan situasi dan tindakan berikutnya. | NOT TESTED |
| AC-FR05-01 | FR-05 | Konfirmasi memuat penerima, bank tujuan, nominal, biaya, metode, dan total debit. | NOT TESTED |
| AC-FR05-02 | FR-05 | Ringkasan dapat dipindai dan rincian wajib ditonjolkan. | NOT TESTED |
| AC-FR05-03 | FR-05 | Pengguna dapat kembali dan mengoreksi tujuan sebelum menyetujui. | NOT TESTED |
| AC-FR06-01 | FR-06 | Nama penerima dan bank tujuan ditampilkan setelah data diisi. | NOT TESTED |
| AC-FR06-02 | FR-06 | Pengguna dapat mengubah tujuan tanpa mengulang seluruh formulir. | NOT TESTED |
| AC-FR07-01 | FR-07 | Pembanding menampilkan nama, biaya, kecepatan, ketentuan utama, dan batas nominal untuk setiap metode. | NOT TESTED |
| AC-FR07-02 | FR-07 | Semua metode menggunakan format seragam. | NOT TESTED |
| AC-FR08-01 | FR-08 | Menu Transfer Antarbank dapat diakses dari beranda. | NOT TESTED |

## 3. UX Requirements Checklist

| ID | Kriteria | Status |
|---|---|---|
| AC-UX-01 | Ketiga status dibedakan oleh teks, ikon, dan warna. | NOT TESTED |
| AC-UX-02 | Pengguna tidak didorong mengulang transfer saat status belum jelas. | NOT TESTED |
| AC-UX-03 | Bukti/rujukan dapat ditemukan dari hasil atau riwayat. | NOT TESTED |
| AC-UX-04 | Pesan gangguan menjelaskan situasi dan next action. | NOT TESTED |
| AC-UX-05 | Pengguna dapat memeriksa dan mengoreksi penerima/bank sebelum persetujuan. | NOT TESTED |
| AC-UX-06 | Pilihan metode dapat dibandingkan dalam format konsisten. | NOT TESTED |
| AC-UX-07 | Jalur utama dapat ditemukan dan dijalankan dengan mudah. | NOT TESTED |

## 4. Non-Functional Requirements Checklist

| ID | Sumber PRD | Kriteria | Status |
|---|---|---|---|
| AC-NFR-01 | Non-real integration | Implementasi menggunakan data lokal/simulasi, tidak terhubung ke rekening atau sistem perbankan nyata. | NOT TESTED |
| AC-NFR-02 | Business rules | Status hanya bernilai berhasil, sedang diproses, atau gagal. | NOT TESTED |
| AC-NFR-03 | Acceptance criteria | Status dapat dibedakan dengan warna, ikon, dan bahasa awam. | NOT TESTED |
| AC-NFR-04 | Acceptance criteria | Bukti/rujukan dapat ditemukan dari hasil atau riwayat. | NOT TESTED |
| AC-NFR-05 | Target usability PRD | Kriteria usability harus diuji pada pengguna nyata; tidak boleh dinyatakan PASS dari pemeriksaan ahli saja. | NOT TESTED |
| AC-NFR-06 | TBD technical | Tidak ada timeout/durasi diproses baru yang diperkenalkan tanpa persetujuan. | NOT TESTED |

## 5. User Flow Acceptance

### AC-FLOW-01 — Jalur transfer utama
Given pengguna berada di beranda

When pengguna membuka menu Transfer Antarbank dan menyelesaikan tujuan, metode, dan konfirmasi

Then sistem menampilkan ringkasan wajib dan hasil yang sesuai data simulasi.

### AC-FLOW-02 — Koreksi tujuan
Given pengguna telah sampai pada verifikasi atau konfirmasi

When pengguna memilih mengubah tujuan

Then pengguna dapat memperbaiki tujuan dan meninjau ringkasan ulang tanpa mengulang seluruh formulir.

### AC-FLOW-03 — Status diproses
Given transaksi simulasi masih diproses

When pengguna melihat hasil atau membuka riwayat

Then status diproses dan arahan menunggu/riwayat ditampilkan.

### AC-FLOW-04 — Status berhasil
Given data transaksi terbaru menyatakan berhasil

When pengguna membuka hasil

Then hasil berhasil ditampilkan beserta rujukan jika tersedia.

### AC-FLOW-05 — Status gagal
Given data transaksi terbaru menyatakan gagal

When pengguna membuka hasil

Then hasil gagal dan next action ditampilkan dengan bahasa awam.

### AC-FLOW-06 — Peringatan transfer ulang
Given transfer serupa masih diproses

When pengguna memulai transfer serupa

Then peringatan muncul sebelum transfer ulang.

## 6. Validation Scenarios

| ID | Scenario | Expected |
|---|---|---|
| VS-01 | Data tujuan lengkap | Nama penerima dan bank tujuan ditampilkan |
| VS-02 | Tujuan dikoreksi | Isian lain dipertahankan bila relevan dan ringkasan diperbarui |
| VS-03 | Metode dipilih | Ringkasan menampilkan nama metode, biaya, dan total debit |
| VS-04 | Konfirmasi dibuka | Enam rincian wajib terlihat |
| VS-05 | Nilai referensi tersedia | Referensi tampil pada hasil dan riwayat |
| VS-06 | Nilai referensi tidak tersedia | Tidak ada nomor referensi palsu/placeholder |
| VS-07 | Status diperbarui | Tampilan mengikuti data transaksi terbaru secara otomatis |

## 7. Error Handling Scenarios

| ID | Scenario | Expected |
|---|---|---|
| EH-01 | Koneksi buruk | Peringatan ditampilkan; status tidak ditentukan dari koneksi saja |
| EH-02 | Data transaksi gagal dimuat | Pesan menjelaskan situasi dan next action |
| EH-03 | Transaksi gagal | Status gagal, pesan awam, next action, dan opsi bantuan/riwayat |
| EH-04 | Status belum jelas | Tidak menyarankan transfer ulang; peringatan memeriksa riwayat |
| EH-05 | Input tidak lengkap | Validasi lokal menjelaskan data yang perlu diperbaiki |
| EH-06 | Transfer serupa diproses | Peringatan muncul sebelum transfer ulang |

## 8. Responsive Testing

| ID | Pengujian | Status |
|---|---|---|
| AC-RSP-01 | Jalur transfer dapat digunakan pada ukuran mobile yang ditargetkan TBD. | NOT TESTED |
| AC-RSP-02 | Ringkasan wajib tidak terpotong atau scroll horizontal. | NOT TESTED |
| AC-RSP-03 | Pembanding metode tetap dapat dibaca pada layar sempit. | NOT TESTED |
| AC-RSP-04 | Aksi koreksi, kembali, riwayat, dan bantuan tetap dapat diakses. | NOT TESTED |

## 9. Accessibility Testing

| ID | Pengujian | Status |
|---|---|---|
| AC-A11Y-01 | Semua kontrol memiliki nama yang dapat diakses. | NOT TESTED |
| AC-A11Y-02 | Urutan navigasi dan tab logis. | NOT TESTED |
| AC-A11Y-03 | Status dapat dibaca tanpa bergantung pada warna. | NOT TESTED |
| AC-A11Y-04 | Pesan error dapat dibaca oleh pembaca layar. | NOT TESTED |
| AC-A11Y-05 | Fokus keyboard terlihat. | NOT TESTED |
| AC-A11Y-06 | Target sentuh memenuhi batas implementasi; belum ada angka PRD yang ditetapkan. | NOT TESTED |
| AC-A11Y-07 | Zoom/scale tidak menghilangkan ringkasan wajib. | NOT TESTED |

## 10. Requirement Traceability Matrix

| PRD requirement | UX-SPEC | DESIGN-SYS | INTERACTION | Acceptance |
|---|---|---|---|---|
| FR-01 Status transaksi | §8.5, §10 | Status Components | §8 | AC-FR01-01/02 |
| FR-02 Arahan aman | §3, §8.7 | Status/Navigation | §10, §11, §17 | AC-FR02-01/02/03 |
| FR-03 Bukti/rujukan | §8.5/8.6 | Card/status | §13 | AC-FR03-01/02 |
| FR-04 Proses/gangguan | §8.5/8.7 | Loading/status/color | §9, §14, §17 | AC-FR04-01/02/03 |
| FR-05 Ringkasan konfirmasi | §8.4 | Card/layout/typography | §7 | AC-FR05-01/02/03 |
| FR-06 Identitas penerima | §8.2 | Card/input | §3, §5 | AC-FR06-01/02 |
| FR-07 Perbandingan metode | §8.3 | Card/layout | §6 | AC-FR07-01/02 |
| FR-08 Akses transfer | §7, §8.1 | Navigation | §2 | AC-FR08-01 |
| Business rule status tiga nilai | §8.5 | Status Components | §8 | AC-NFR-02 |
| Nomor referensi tersedia | §8.5/8.6 | Card/status | §13 | AC-FR03-01/02 |
| Transfer serupa diproses | §6 cabang | Warning | §11 | AC-FR02-03 |
| Konfirmasi wajib | §8.4 | Card/typography | §7 | AC-FR05-01 |
| Koreksi tujuan | §8.4 | Button/card | §3, §7 | AC-FR05-03 |
| Durasi diproses TBD | §6 | Tidak ditetapkan | §8/§9 | AC-NFR-06 |
| Simulasi lokal | §1 | Semua visual simulasi | Semua alur lokal | AC-NFR-01 |
