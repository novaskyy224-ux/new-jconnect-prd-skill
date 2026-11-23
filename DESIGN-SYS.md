# DESIGN-SYS: New JConnect Mobile — Transfer Antarbank

## 1. Design Principles

1. **Profesional dan terpercaya:** tampilan tenang, konsisten, tanpa dekorasi berlebihan.
2. **Jelas sebelum indah:** hierarki informasi dan keterbacaan lebih utama daripada efek visual.
3. **Pindai dengan cepat:** rincian penting berada dekat satu sama lain dan diberi label jelas.
4. **Aman dan dapat dibatalkan:** koreksi tujuan tersedia sebelum persetujuan.
5. **Status tanpa ambigu:** status tidak hanya bergantung pada warna.
6. **Gunakan data lokal:** seluruh nilai hanya simulasi dan tidak merepresentasikan transaksi nyata.

## 2. Visual Direction

Gaya yang direkomendasikan: antarmuka mobile modern, ringan, profesional, dan mudah dibaca. Hindari klaim bahwa palet atau komponen berikut merupakan identitas resmi Bank Jatim karena PRD tidak menyediakan sumber resmi tersebut.

Warna digunakan sebagai isyarat fungsi, bukan identitas merek. Komponen memiliki kontras dan ukuran sentuh yang memadai.

## 3. Color Palette

Warna berikut adalah token simulasi yang perlu disetujui pada implementasi. Jangan menggantinya dengan warna resmi bank jika belum ada sumber yang ditetapkan.

| Token | Nilai contoh | Pemakaian |
|---|---:|---|
| `--color-primary` | `#0057A6` | Aksi utama, tautan utama |
| `--color-primary-hover` | `#00498C` | Kondisi hover/tekan |
| `--color-primary-contrast` | `#FFFFFF` | Teks di atas primary |
| `--color-success` | `#147D43` | Status berhasil |
| `--color-warning` | `#A86600` | Status diproses/peringatan |
| `--color-danger` | `#B42318` | Status gagal/error |
| `--color-info` | `#175CD3` | Informasi proses/koneksi |
| `--color-text-primary` | `#172B4D` | Judul dan teks utama |
| `--color-text-secondary` | `#5F6C7B` | Label dan teks pendukung |
| `--color-border` | `#D0D5DD` | Garis dan pembatas |
| `--color-border-strong` | `#98A2B3` | Kontrol aktif/perlu penekanan |
| `--color-surface` | `#FFFFFF` | Permukaan dasar |
| `--color-surface-subtle` | `#F4F6F8` | Area latar lembut |
| `--color-focus` | `#2E90FA` | Outline fokus keyboard |
| `--color-disabled` | `#E4E7EC` | Elemen tidak aktif |

Gunakan warna bersama teks dan ikon. Status tidak boleh bergantung pada warna saja.

## 4. Typography

- Gunakan stack sans-serif yang tersedia secara lokal; contoh: `Inter, "Segoe UI", Arial, sans-serif`.
- Ukuran dan berat:

| Token | Nilai | Pemakaian |
|---|---:|---|
| `--font-family-base` | `Inter, "Segoe UI", Arial, sans-serif` | Seluruh teks |
| `--text-xs` | `12px / 16px` | Keterangan sekunder |
| `--text-sm` | `14px / 20px` | Label, tabel ringkas |
| `--text-md` | `16px / 24px` | Teks utama dan input |
| `--text-lg` | `18px / 24px` | Judul bagian |
| `--text-xl` | `20px / 28px` | Judul halaman |
| `--text-2xl` | `24px / 32px` | Status/nominal utama |
| `--font-regular` | `400` | Teks normal |
| `--font-medium` | `500` | Label penting |
| `--font-semibold` | `600` | Judul dan status |

## 5. Spacing System

Gunakan skala 4px:

`4, 8, 12, 16, 20, 24, 32, 40, 48`

Token:

- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-5`: 20px
- `--space-6`: 24px
- `--space-8`: 32px
- `--space-10`: 40px
- `--space-12`: 48px

## 6. Layout dan Grid

- Satu kolom untuk konten utama pada mobile.
- Lebar konten disesuaikan responsif; jangan gunakan angka viewport tetap tanpa kebutuhan eksplisit.
- Padding halaman rekomendasi: 16px pada mobile, 24px pada tablet, 32px pada desktop.
- Jarak antarbagian: 24px.
- Jarak antar-komponen: 8–16px.
- Ringkasan konfirmasi boleh menggunakan dua kolom label/nilai pada lebar yang memadai, tetap dibaca satu kolom pada layar sempit.

## 7. Border, Radius, dan Shadow

| Token | Nilai | Pemakaian |
|---|---:|---|
| `--radius-sm` | `6px` | Input kecil, badge |
| `--radius-md` | `10px` | Tombol, card |
| `--radius-lg` | `16px` | Panel/lembar utama |
| `--border-width` | `1px` | Garis kontrol |
| `--shadow-card` | `0 2px 8px rgba(23,43,77,0.08)` | Card standar |
| `--shadow-elevated` | `0 8px 24px rgba(23,43,77,0.12)` | Dialog atau panel terangkat |

Hindari bayangan berlebihan pada seluruh layar.

## 8. Button Components

### Primary
- Digunakan untuk satu aksi utama.
- Warna primary dengan teks kontras.
- Tinggi minimum 48px pada mobile.

### Secondary
- Digunakan untuk koreksi atau kembali.
- Border kuat, latar surface.

### Destructive
- Hanya untuk tindakan negatif yang benar-benar perlu; tidak boleh menjadi aksi bawaan transfer.
- Gunakan token danger serta konfirmasi bila tindakan tersebut mengubah atau membatalkan data.

### State
- Hover, pressed, focus, disabled, dan loading memiliki bentuk jelas.
- Jangan hanya mengubah warna tanpa respons teks/aria yang sesuai.

## 9. Input Components

- Tinggi minimum 48px.
- Label selalu terlihat; placeholder tidak menggantikan label.
- Border default `--color-border`; fokus `--color-focus`.
- Pesan validasi ditempatkan di dekat kontrol.
- Gunakan keyboard numerik untuk nominal apabila tersedia.
- Nominal dan data penerima harus dapat diperiksa ulang sebelum konfirmasi.

## 10. Card Components

Card digunakan untuk:
- ringkasan konfirmasi;
- perbandingan metode;
- identitas penerima;
- status transaksi;
- akses riwayat.

Card harus memiliki judul, label, nilai, dan aksi yang konsisten. Jangan membuat card tanpa hierarki visual yang jelas.

## 11. Navigation Components

- Header menampilkan konteks layar dan tombol kembali.
- Menu Transfer Antarbank mudah terlihat dari beranda.
- Navigasi tidak boleh membuat pengguna kehilangan rincian tanpa kesempatan koreksi.
- Akses riwayat dan Customer Service harus tersedia pada konteks gangguan/status.

## 12. Status Components

Setiap status wajib memiliki:
- teks status;
- ikon;
- warna token;
- deskripsi singkat;
- next action.

| Status | Warna | Ikon | Teks contoh |
|---|---|---|---|
| Berhasil | success | centang | Transfer berhasil |
| Sedang diproses | warning | jam/progress | Transfer sedang diproses |
| Gagal | danger | silang/seru | Transfer gagal |

## 13. Icon Guidelines

- Gunakan ikon sederhana dan konsisten.
- Ikon status tidak berdiri sendiri; selalu disertai teks.
- Ikon dekoratif disembunyikan dari pembaca layar.
- Ikon yang menyampaikan makna membutuhkan label yang setara.

## 14. Responsive Design

- Prioritas mobile, lalu adaptasi ke layar lebih lebar.
- Jangan menyembunyikan rincian wajib hanya karena layar lebih kecil.
- Pembanding metode dapat berubah menjadi kartu vertikal pada layar kecil dan tabel pada layar yang memadai.
- Kontrol utama tetap mudah dijangkau dan tidak terpotong.
- Tidak boleh ada scroll horizontal untuk konten wajib.

## 15. Accessibility Guidelines

- Rasio kontras teks: target WCAG AA atau standar aksesibilitas yang ditetapkan implementasi. Nilai warna baru harus diuji.
- Ukuran target sentuh minimum 44×44px; rekomendasi 48px untuk aksi utama.
- Semua kontrol memiliki nama yang dapat diakses.
- Urutan keyboard/logis mengikuti alur visual.
- Gunakan outline fokus yang terlihat.
- Pesan error dapat didengar oleh pembaca layar dan tidak hanya ditunjukkan lewat warna.
- Status menyertakan teks dan ikon.
- Zoom teks harus tidak memutus tata letak atau menghilangkan aksi.
