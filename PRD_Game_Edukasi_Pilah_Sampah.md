# PRD: EcoCoder Quest, Game Edukasi Pengelolaan Sampah & Dasar Algoritma

| Item | Keterangan |
|---|---|
| Versi dokumen | 1.0 |
| Platform | Website (responsif, perlu internet) |
| Target pengguna | Siswa SMP |
| Bahasa | Indonesia |
| Gaya visual | Anime cerah |
| Jumlah level | 10 |

---

## 1. Ringkasan Produk

**EcoCoder Quest** adalah game puzzle berbasis web di mana siswa menyusun blok perintah untuk menggerakkan karakter anime di papan 5x5, mengambil sampah, lalu membuangnya ke tempat sampah yang jenisnya tepat (organik atau anorganik). Game ini mengajarkan konsep dasar **algoritma dan pemrograman** (urutan instruksi dan perulangan) sekaligus **kebiasaan memilah sampah**.

## 2. Latar Belakang & Masalah

- Siswa SMP sering menganggap pemrograman abstrak dan sulit dibayangkan.
- Pemilahan sampah sudah diajarkan, tetapi jarang dipraktikkan dalam bentuk yang menarik.
- Game visual berbasis blok membuat konsep berpikir komputasional (computational thinking) lebih konkret dan menyenangkan.

## 3. Tujuan Produk

1. Siswa memahami **sekuens** (urutan perintah harus tepat) dan **perulangan** (menyederhanakan perintah berulang).
2. Siswa mampu membedakan sampah **organik** dan **anorganik**.
3. Siswa berlatih **debugging**: membaca hasil, menemukan kesalahan, memperbaiki program.
4. Pengalaman bermain ringan, cerah, dan memotivasi.

**Indikator keberhasilan (target awal):**
- Minimal 70% pemain menyelesaikan level 1-5.
- Minimal 50% pemain menyelesaikan seluruh 10 level.
- Skor rata-rata kuis/refleksi pemahaman loop meningkat setelah bermain (jika diuji guru).

## 4. Pengguna & Skenario

**Persona utama:** Rina, 13 tahun, kelas 8, baru mengenal Informatika. Suka anime, bermain lewat laptop sekolah atau HP.

**Persona sekunder:** Guru Informatika yang memakai game sebagai media pembelajaran di kelas.

**Skenario singkat:** Rina membuka web, memilih level, menyeret blok perintah ke area program, menekan **Jalankan**, lalu menonton karakter mengeksekusi program. Jika semua sampah masuk ke tempat yang benar, level dinyatakan menang.

## 5. Ruang Lingkup

**Termasuk (v1.0):**
- Papan 5x5, karakter, sampah, tempat sampah, penghalang
- 6 blok perintah
- 10 level dengan kesulitan bertahap
- Sistem bintang dan petunjuk (hint)
- Edukasi singkat jenis sampah

**Tidak termasuk (v1.0):**
- Mode offline
- Perulangan bersarang (loop dalam loop)
- Percabangan (if/else) dan fungsi
- Multiplayer, akun guru/dashboard
- Editor level buatan pemain

## 6. Papan Permainan

### 6.1 Penomoran Petak

Papan 5x5 = 25 petak. Penomoran dimulai dari kiri bawah, bergerak ke kanan, lalu naik ke baris berikutnya dengan pola zig-zag, sehingga **angka 5 berada tepat di bawah angka 6**.

```
 21  22  23  24  25     <- baris 5 (atas)
 20  19  18  17  16     <- baris 4
 11  12  13  14  15     <- baris 3
 10   9   8   7   6     <- baris 2
  1   2   3   4   5     <- baris 1 (bawah)
```

Rumus: `baris = ceil(n / 5)`. Jika baris ganjil, kolom bergerak kiri ke kanan; jika baris genap, kolom bergerak kanan ke kiri.

### 6.2 Posisi Awal Karakter

- Karakter **selalu mulai di petak 1** (kiri bawah) pada semua level.
- Arah awal: **menghadap ke kanan (timur)** pada semua level.

### 6.3 Aturan Isi Petak

- Satu petak berisi paling banyak **satu objek** (sampah, tempat sampah, atau penghalang).
- Petak 1 (posisi awal) harus kosong.
- Tempat sampah dan petak sampah **bisa diinjak** karakter.
- Penghalang **tidak bisa dilewati**.

## 7. Objek Permainan

| Objek | Deskripsi | Perilaku |
|---|---|---|
| **Karakter pemain** | Gadis/pemuda anime berseragam relawan lingkungan | Bergerak dan berputar sesuai program. Mulai di petak 1 menghadap kanan |
| **Tempat sampah organik** | Tong berwarna hijau | Hanya menerima sampah organik |
| **Tempat sampah anorganik** | Tong berwarna biru/kuning | Hanya menerima sampah anorganik |
| **Sampah organik** | Sisa makanan (apel busuk, kulit pisang, tulang ikan) | Bisa diambil dan dibuang ke tong organik |
| **Sampah anorganik** | Botol plastik, kaleng, kantong plastik | Bisa diambil dan dibuang ke tong anorganik |
| **Penghalang** | Batu atau rumput lebat | Tidak bisa dilewati |

## 8. Blok Perintah

| No | Blok | Fungsi | Konsep |
|---|---|---|---|
| 1 | **Maju 1 langkah** | Karakter pindah 1 petak sesuai arah hadap | Sekuens |
| 2 | **Putar kanan 90°** | Berputar 90° searah jarum jam | Sekuens |
| 3 | **Putar kiri 90°** | Berputar 90° berlawanan jarum jam | Sekuens |
| 4 | **Ambil sampah** | Mengambil sampah di **petak yang sedang diinjak** | Sekuens |
| 5 | **Letakkan sampah** | Membuang sampah yang dibawa ke tempat sampah di **petak yang sedang diinjak** | Sekuens |
| 6 | **Ulangi ... kali** | Mengulang blok di dalamnya sebanyak x kali; **angka x diisi pemain** | Perulangan |

**Aturan blok Ulangi:**
- Nilai x diisi pemain (rentang 2-9).
- Blok **tidak boleh bersarang** (tidak ada loop di dalam loop).
- Blok lain dapat diletakkan di dalam blok Ulangi.

## 9. Aturan Permainan

### 9.1 Alur Eksekusi
1. Pemain menyusun program dari blok di area program.
2. Pemain menekan **Jalankan**; karakter mengeksekusi blok satu per satu secara animasi (blok yang sedang berjalan menyala).
3. Pemain dapat menekan **Ulang/Reset** untuk memperbaiki program.

### 9.2 Ambil dan Letakkan Sampah
- Karakter hanya boleh membawa **1 sampah** sekaligus.
- **Ambil sampah** hanya berhasil jika karakter berdiri di petak yang berisi sampah dan tangannya kosong.
- **Letakkan sampah** hanya berhasil jika karakter membawa sampah dan berdiri di petak tempat sampah yang **jenisnya sesuai**.

### 9.3 Kondisi Menang
Level **langsung dinyatakan menang** ketika **seluruh sampah di papan sudah masuk ke tempat sampah yang benar**, tanpa harus menunggu program selesai.

### 9.4 Kondisi Gagal
Level dinyatakan **gagal** (pemain diminta memperbaiki program dan mencoba lagi) jika:

| No | Kejadian | Pesan umpan balik (contoh) |
|---|---|---|
| 1 | Karakter menabrak penghalang | "Aduh! Ada batu di depan. Coba cari jalan lain." |
| 2 | Karakter keluar dari tepi papan | "Kamu keluar dari area! Cek lagi arah hadapmu." |
| 3 | Membuang sampah ke tempat sampah yang salah jenis | "Ups, ini sampah organik, harusnya ke tong hijau!" |
| 4 | Program selesai tetapi masih ada sampah yang belum masuk | "Masih ada sampah tersisa. Yuk lengkapi programmu." |

**Asumsi tambahan** (silakan koreksi bila tidak sesuai):
- Ambil sampah di petak kosong, saat tangan sudah penuh, atau Letakkan sampah di petak biasa (bukan tempat sampah) juga dianggap **gagal** dengan pesan yang sesuai.

## 10. Desain Level (10 Level)

| Level | Fokus | Isi papan (ringkas) | Konsep baru |
|---|---|---|---|
| 1 | Maju | 1 sampah organik, 1 tong organik, jalur lurus, tanpa penghalang | Sekuens dasar |
| 2 | Putar | Jalur ada belokan, 1 sampah, 1 tong | Putar kanan/kiri |
| 3 | Ambil & letakkan | 1 sampah anorganik, 1 tong anorganik | Urutan lengkap |
| 4 | Penghalang | 1 sampah, ada batu/rumput di jalur langsung | Menghindari rintangan |
| 5 | Dua jenis | 1 organik + 1 anorganik, 2 tong | Memilah jenis sampah |
| 6 | Pengenalan loop | Jalur lurus panjang | Blok Ulangi |
| 7 | Loop + belokan | Pola langkah berulang, 2 sampah | Loop dalam rute |
| 8 | Banyak sampah | 3 sampah campuran, 2 tong, beberapa penghalang | Perencanaan rute |
| 9 | Efisiensi | 3-4 sampah, penghalang lebih banyak | Optimasi dengan loop |
| 10 | Tantangan akhir | 4 sampah campuran, 2 tong, labirin penghalang | Gabungan semua konsep |

> Tata letak objek per level (nomor petak) didetailkan dalam dokumen desain level terpisah dan wajib divalidasi bisa diselesaikan (lihat bagian 14).

## 11. Sistem Bintang & Petunjuk

**Bintang (berdasar efisiensi jumlah blok):**
- ⭐ Level selesai
- ⭐⭐ Selesai dengan blok mendekati optimal
- ⭐⭐⭐ Selesai dengan jumlah blok sama dengan atau lebih sedikit dari solusi referensi (blok Ulangi menghitung sebagai 1 + isinya)

**Petunjuk (hint):**
- Tombol **Hint** tersedia di setiap level.
- Hint bertahap: (1) petunjuk umum, (2) rute yang perlu dilalui, (3) potongan blok awal.
- Penggunaan hint tidak menggugurkan kemenangan, tetapi dapat membatasi perolehan bintang 3.

**Progres:** level terkunci hingga level sebelumnya selesai. Progres disimpan di browser (local storage); akun belum diperlukan.

## 12. Kebutuhan Fungsional

| ID | Kebutuhan | Prioritas |
|---|---|---|
| FR-01 | Menampilkan papan 5x5 dengan penomoran zig-zag sesuai bagian 6.1 | Tinggi |
| FR-02 | Menampilkan karakter di petak 1 menghadap kanan di setiap level | Tinggi |
| FR-03 | Drag-and-drop 6 blok perintah ke area program (juga bisa tap di perangkat sentuh) | Tinggi |
| FR-04 | Input angka x pada blok Ulangi (2-9) | Tinggi |
| FR-05 | Eksekusi program dengan animasi bertahap dan sorotan blok aktif | Tinggi |
| FR-06 | Deteksi menang, kalah, dan pesan umpan balik sesuai bagian 9 | Tinggi |
| FR-07 | Tombol Jalankan, Reset, Hapus blok, dan atur kecepatan animasi | Tinggi |
| FR-08 | Pemilihan level dengan status kunci, bintang, dan progres | Tinggi |
| FR-09 | Sistem hint 3 tahap | Sedang |
| FR-10 | Kartu edukasi singkat jenis sampah setelah menang | Sedang |
| FR-11 | Tutorial interaktif pada level 1-2 | Sedang |
| FR-12 | Penyimpanan progres di local storage | Sedang |
| FR-13 | Efek suara dan musik latar dengan tombol mute | Rendah |

## 13. Kebutuhan Non-Fungsional

- **Platform:** browser modern (Chrome, Edge, Firefox, Safari), responsif untuk laptop, tablet, dan HP.
- **Koneksi:** memerlukan internet; tidak ada mode offline.
- **Performa:** waktu muat awal di bawah 5 detik pada jaringan 4G.
- **Aksesibilitas:** kontras warna memadai, teks mudah dibaca, ikon dibantu label teks.
- **Keamanan & privasi:** tidak mengumpulkan data pribadi pada v1.0.
- **Bahasa:** seluruh teks antarmuka dan narasi dalam Bahasa Indonesia yang ramah remaja.

## 14. Kebutuhan Desain (UI/UX)

- **Gaya visual:** anime cerah, palet segar (hijau daun, biru langit, kuning matahari, merah muda), garis bersih, ekspresi karakter ekspresif.
- **Layout layar permainan:** papan 5x5 di sisi kiri/atas, panel blok perintah dan area program di sisi kanan/bawah.
- **Karakter:** animasi berjalan, berputar, mengambil, membuang, senang (menang), dan terkejut (gagal).
- **Narasi:** karakter pendamping (maskot) memberi dialog singkat dan semangat.
- **Penomoran petak** dapat ditampilkan/disembunyikan lewat tombol.

## 15. Metrik & Analitik (Opsional v1.0)

- Persentase penyelesaian per level
- Rata-rata percobaan per level
- Penyebab kegagalan terbanyak
- Penggunaan hint

## 16. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Level terlalu sulit bagi pemula | Pemain berhenti | Tutorial, hint bertahap, kurva kesulitan landai |
| Level tidak punya solusi | Pemain frustrasi | Solver otomatis untuk validasi setiap level |
| Konsep loop kurang dipahami | Tujuan belajar tidak tercapai | Level 6-7 khusus loop dengan umpan balik visual |
| Kesulitan memakai drag-and-drop di HP | Pengalaman buruk | Dukungan tap untuk menambah blok |

## 17. Roadmap Setelah v1.0

- Percabangan (if/else) dan perulangan bersarang
- Blok fungsi/prosedur
- Papan lebih besar dan jenis sampah B3
- Mode offline (PWA)
- Akun guru dan dashboard perkembangan siswa
- Editor level dan berbagi level

## 18. Daftar Asumsi

1. Penomoran: baris bawah 1-5 (kiri ke kanan), 6 di atas 5, dan seterusnya zig-zag hingga 25 di kanan atas.
2. Arah awal karakter menghadap kanan.
3. Penghalang tidak bisa ditembus; menabrak penghalang atau tepi papan = gagal.
4. Perulangan bersarang tidak diperbolehkan.
5. Sistem bintang dan hint diperlukan.
6. Tidak ada mode offline.
7. Aksi ambil/letakkan yang tidak valid (petak kosong, tangan penuh, bukan di tempat sampah) = gagal.

---
*Akhir dokumen*
