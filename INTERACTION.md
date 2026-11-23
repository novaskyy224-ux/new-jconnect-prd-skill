# INTERACTION: New JConnect Mobile — Transfer Antarbank

## 1. Interaction Principles

Setiap interaksi harus:

- memberi respons langsung;
- menjaga konteks pengguna;
- menyebutkan hasil atau status berikutnya;
- tidak menyembunyikan tindakan koreksi;
- tidak membuat transfer tampak berhasil sebelum status terbaru dikonfirmasi;
- menggunakan satu pola untuk kondisi serupa.

## 2. Navigation Behavior

### Buka menu Transfer Antarbank
- **Trigger:** pengguna memilih Transfer Antarbank dari beranda.
- **System Response:** membuka form Transfer Antarbank.
- **Feedback:** judul halaman dan langkah konteks jelas.
- **Next Action:** pengguna mengisi tujuan atau kembali ke beranda.

### Kembali/koreksi
- **Trigger:** pengguna memilih kembali atau koreksi tujuan.
- **System Response:** menampilkan data sebelumnya dan mempertahankan data yang telah dimasukkan, bila valid untuk kembali ke langkah itu.
- **Feedback:** perubahan tujuan terlihat sebelum konfirmasi ulang.
- **Next Action:** pengguna mengoreksi atau melanjutkan.

## 3. User Input Behavior

### Pengisian tujuan
- **Trigger:** pengguna memasukkan identitas penerima, bank, nominal, atau metode.
- **System Response:** validasi relevan dijalankan dan data penerima ditampilkan jika tersedia dari data simulasi.
- **Feedback:** label, format, dan pesan kesalahan dekat kontrol.
- **Next Action:** pengguna melengkapi atau memperbaiki input.

### Koreksi tujuan
- **Trigger:** pengguna memilih ubah tujuan dari verifikasi atau konfirmasi.
- **System Response:** membuka bidang tujuan tanpa menghapus seluruh isian yang tidak perlu diubah.
- **Feedback:** tujuan lama dan perubahan ditampilkan jelas.
- **Next Action:** pengguna menyimpan koreksi lalu meninjau kembali ringkasan.

## 4. Form Validation

- **Trigger:** pengguna mengosongkan, salah mengisi, atau melewati nilai wajib.
- **System Response:** menandai kontrol bermasalah dan mencegah langkah berikutnya yang memerlukan data valid.
- **Feedback:** pesan menjelaskan apa yang perlu diperbaiki.
- **Next Action:** pengguna memperbaiki input lalu mencoba lagi.
- Nilai batas dan aturan format yang tidak ditentukan PRD adalah TBD; jangan menciptakan batas baru sebagai fakta produk.

## 5. Recipient Verification

- **Trigger:** data penerima dan bank lengkap.
- **System Response:** menampilkan nama penerima dan nama bank tujuan berdasarkan data simulasi.
- **Feedback:** identitas ditampilkan jelas sebagai ringkasan yang dapat diperiksa.
- **Next Action:** pengguna mengonfirmasi identitas atau memilih ubah tujuan.
- **Koreksi:** pengguna dapat mengubah tujuan tanpa mengulang seluruh formulir.

## 6. Transfer Method Selection

- **Trigger:** pengguna membuka pembanding atau memilih metode.
- **System Response:** menampilkan metode dalam format seragam: nama, biaya, kecepatan, ketentuan utama, dan batas nominal.
- **Feedback:** metode terpilih dan semua atribut pembanding terlihat.
- **Next Action:** pengguna memilih metode atau kembali untuk mengoreksi tujuan.
- Nilai biaya dan batas nominal harus berasal dari data simulasi. Tidak ada biaya, kecepatan, atau batas yang boleh dikarang tanpa sumber kebutuhan.

## 7. Transfer Confirmation

- **Trigger:** pengguna memilih lanjut dari form/metode.
- **System Response:** menampilkan ringkasan: penerima, bank tujuan, nominal, biaya, metode, dan total debit.
- **Feedback:** nilai penting ditonjolkan dan dapat dipindai.
- **Next Action:** pengguna kembali untuk koreksi atau menyetujui transfer simulasi.
- Pengguna harus dapat mengoreksi tujuan sebelum menyetujui.

## 8. Transaction Status Behavior

Hanya ada tiga status: **berhasil**, **sedang diproses**, dan **gagal**.

### Status berhasil
- **Trigger:** data transaksi terbaru menyatakan berhasil.
- **System Response:** menampilkan status berhasil.
- **Feedback:** ikon, teks, dan warna success; nomor referensi jika tersedia; ringkasan hasil.
- **Next Action:** lihat riwayat, lihat bukti, atau kembali ke beranda.

### Status sedang diproses
- **Trigger:** data transaksi terbaru menyatakan sedang diproses.
- **System Response:** menampilkan status diproses dan indikator proses.
- **Feedback:** penjelasan bahwa status belum final dan pengguna disarankan menunggu serta memeriksa riwayat.
- **Next Action:** tunggu pembaruan, buka riwayat, atau hubungi bantuan.
- Durasi proses belum ditentukan PRD; jangan menambahkan timeout atau janji durasi.

### Status gagal
- **Trigger:** data transaksi terbaru menyatakan gagal.
- **System Response:** menampilkan status gagal.
- **Feedback:** bahasa awam, alasan gangguan bila tersedia, dan tindakan berikutnya.
- **Next Action:** periksa input/riwayat atau hubungi bantuan sesuai kondisi simulasi.

Status harus berasal dari data transaksi terbaru dan diperbarui otomatis ketika data diperbarui.

## 9. Processing State

- **Trigger:** transaksi simulasi masuk ke proses.
- **System Response:** menampilkan indikator proses yang jelas.
- **Feedback:** status “Sedang diproses” dan pesan menunggu.
- **Next Action:** pengguna dapat membuka riwayat atau menunggu pembaruan.
- Jangan menampilkan keberhasilan sebelum data mutakhir menyatakan berhasil.

## 10. Failed Transaction State

- **Trigger:** data mutakhir menyatakan gagal atau gangguan menyebabkan status tidak dapat ditentukan.
- **System Response:** menampilkan status gagal atau state gangguan yang tidak salah menyatakan status final.
- **Feedback:** situasi dalam bahasa awam dan tindakan berikutnya.
- **Next Action:** periksa riwayat, hubungi Customer Service, atau coba lagi hanya bila konteks ini secara eksplisit memungkinkan dalam simulasi.
- Jangan mengklaim dana berhasil/gagal/berkurang tanpa data transaksi simulasi.

## 11. Duplicate Transaction Warning

- **Trigger:** pengguna hendak mengirim transfer serupa sementara transaksi serupa masih diproses.
- **System Response:** menahan atau meminta keputusan pada peringatan sebelum transfer ulang.
- **Feedback:** transaksi serupa masih diproses dan pengguna disarankan memeriksa status/riwayat.
- **Next Action:** pengguna meninjau riwayat atau membatalkan transfer ulang.
- Kriteria “serupa” dan mekanisme pendeteksiannya perlu ditentukan saat implementasi dan diberi data simulasi; PRD belum menetapkan definisi teknis.

## 12. Transaction History

- **Trigger:** pengguna membuka riwayat atau memilih tautan dari status.
- **System Response:** menampilkan transaksi terbaru beserta status.
- **Feedback:** status dapat dibaca dengan teks, ikon, dan warna.
- **Next Action:** pengguna membuka detail, melihat referensi jika tersedia, atau kembali ke status/bantuan.

## 13. Reference Number Behavior

- **Trigger:** sistem memiliki nomor referensi untuk transaksi.
- **System Response:** menyimpan nomor dan menampilkannya pada hasil serta riwayat.
- **Feedback:** nomor dapat dibaca dan disalin jika pola implementasi mendukung.
- **Next Action:** pengguna menyimpan atau membuka riwayat.
- **Fallback:** jika tidak tersedia, tidak menampilkan nomor atau placeholder palsu.

## 14. Loading State

- **Trigger:** sistem memuat data status, penerima, riwayat, atau hasil.
- **System Response:** menampilkan indikator loading.
- **Feedback:** pesan konteks singkat seperti “Memuat status transaksi”.
- **Next Action:** pengguna menunggu; kontrol tidak perlu menyarankan pengiriman ulang.

## 15. Empty State

- **Trigger:** riwayat tidak memiliki transaksi.
- **System Response:** menampilkan empty state.
- **Feedback:** “Belum ada transaksi” atau teks setara yang tidak menyinggung kegagalan sistem.
- **Next Action:** kembali ke beranda atau mulai transfer.

## 16. Error State

- **Trigger:** data gagal dimuat atau aksi tidak dapat diselesaikan.
- **System Response:** mempertahankan konteks pengguna dan tidak menghapus input bila memungkinkan.
- **Feedback:** bahasa awam, situasi, dan tindakan berikutnya.
- **Next Action:** coba lagi atau buka riwayat/bantuan sesuai konteks.

## 17. Network Connection Warning

- **Trigger:** koneksi buruk terdeteksi oleh data/lingkungan simulasi.
- **System Response:** menampilkan peringatan koneksi.
- **Feedback:** status dapat belum mutakhir dan pengguna perlu memeriksa kembali.
- **Next Action:** periksa koneksi, menunggu, atau membuka riwayat sesuai keadaan.
- Tidak boleh menentukan atau mengubah status transaksi hanya berdasarkan peringatan koneksi.

## 18. Responsive Interaction

- Target sentuh tetap cukup besar pada seluruh lebar.
- Konfirmasi dan metode dapat berubah tata letaknya tanpa mengubah urutan informasi.
- Navigasi kembali dan aksi koreksi tetap dapat diakses.
- Jangan menyembunyikan ringkasan wajib atau nomor referensi pada layar sempit.
