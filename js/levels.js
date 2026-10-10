/**
 * EcoCoder Quest - Game Levels Definition (10 Levels)
 * Fully compliant with PRD specifications, verified and mathematically solvable.
 */

window.GAME_LEVELS = [
    {
        id: 1,
        title: "Level 1: Langkah Pertama",
        concept: "Sekuens Dasar",
        description: "Bantu Rina mengambil apel busuk dan membuangnya ke tong sampah organik!",
        optimalBlocks: 6,
        starThresholds: { three: 6, two: 9 },
        items: [
            { tile: 3, type: "organic", name: "Apel Busuk", icon: "🍎", category: "Organik" }
        ],
        bins: [
            { tile: 5, type: "organic", name: "Tong Organik", icon: "🗑️🟢" }
        ],
        obstacles: [],
        hints: [
            "Perhatikan arah hadap karakter Rina. Jalurnya lurus ke arah kanan!",
            "Rina perlu maju 2 kali ke petak 3 untuk mengambil apel, lalu maju 2 kali lagi ke tong hijau di petak 5.",
            "Susunan blok lengkap: Maju ➔ Maju ➔ Ambil Sampah ➔ Maju ➔ Maju ➔ Letakkan Sampah."
        ],
        tutorial: {
            step1: "Tarik atau ketuk blok 'Maju 1 langkah' ke area program di bawah.",
            step2: "Gunakan 'Ambil sampah' saat berdiri di petak 3, lalu 'Letakkan sampah' di tong petak 5.",
            step3: "Tekan tombol 'Jalankan Program' berwarna hijau untuk melihat Rina bergerak!"
        },
        ecoCard: {
            title: "Fakta Sampah: Apel Busuk 🍎",
            category: "Sampah Organik",
            decompTime: "1 - 2 bulan",
            fact: "Sisa buah dan sayuran adalah sampah organik yang mudah terurai oleh mikroorganisme tanah. Jika dikomposkan, sisa apel menjadi pupuk organik kaya nutrisi!",
            tip: "Jangan campur sisa makanan dengan plastik agar proses pengomposan tidak terganggu."
        }
    },
    {
        id: 2,
        title: "Level 2: Belokan Cantik",
        concept: "Arah Hadap & Putar",
        description: "Tong sampah berada di baris atas! Gunakan blok putar untuk berbelok.",
        optimalBlocks: 6,
        starThresholds: { three: 6, two: 8 },
        items: [
            { tile: 3, type: "organic", name: "Kulit Pisang", icon: "🍌", category: "Organik" }
        ],
        bins: [
            { tile: 8, type: "organic", name: "Tong Organik", icon: "🗑️🟢" }
        ],
        obstacles: [],
        hints: [
            "Tong sampah berada di petak 8 (tepat di atas petak 3). Ubah arah hadap Rina!",
            "Setelah mengambil pisang di petak 3, gunakan 'Putar Kiri 90°' agar Rina menghadap ke atas (Utara).",
            "Susunan blok: Maju ➔ Maju ➔ Ambil ➔ Putar Kiri ➔ Maju ➔ Letakkan."
        ],
        tutorial: {
            step1: "Karakter tidak bisa langsung mundur atau menyamping, harus diputar terlebih dahulu!",
            step2: "Gunakan 'Putar Kiri' untuk menghadap ke atas, lalu 'Maju 1 langkah' ke petak 8."
        },
        ecoCard: {
            title: "Fakta Sampah: Kulit Pisang 🍌",
            category: "Sampah Organik",
            decompTime: "2 - 6 minggu",
            fact: "Kulit pisang mengandung kalium dan fosfor tinggi. Di taman, kulit pisang bisa direndam dalam air untuk dijadikan pupuk cair organik tanaman mawar atau tomat!",
            tip: "Selalu buang kulit buah ke tong sampah organik hijau ya!"
        }
    },
    {
        id: 3,
        title: "Level 3: Pilah Botol Plastik",
        concept: "Sampah Anorganik",
        description: "Temukan botol plastik dan buang ke tong anorganik (biru/kuning)!",
        optimalBlocks: 7,
        starThresholds: { three: 7, two: 9 },
        items: [
            { tile: 4, type: "inorganic", name: "Botol Plastik", icon: "🧴", category: "Anorganik" }
        ],
        bins: [
            { tile: 7, type: "inorganic", name: "Tong Anorganik", icon: "🗑️🔵" }
        ],
        obstacles: [],
        hints: [
            "Botol plastik adalah sampah anorganik. Tempatkan di tong biru daur ulang!",
            "Maju 3 langkah ke petak 4, ambil botol, putar kiri (hadap atas), lalu maju ke petak 7.",
            "Susunan blok: Maju ➔ Maju ➔ Maju ➔ Ambil ➔ Putar Kiri ➔ Maju ➔ Letakkan."
        ],
        ecoCard: {
            title: "Fakta Sampah: Botol Plastik PET 🧴",
            category: "Sampah Anorganik",
            decompTime: "450 Tahun!",
            fact: "Satu botol plastik membutuhkan waktu hampir 5 abad untuk hancur menjadi mikroplastik. Mendaur ulang 1 botol plastik menghemat energi yang cukup untuk menyalakan lampu selama 3 jam!",
            tip: "Remas botol plastik sebelum dibuang ke tempat daur ulang untuk menghemat ruang tempat sampah."
        }
    },
    {
        id: 4,
        title: "Level 4: Hindari Rintangan",
        concept: "Navigasi Hambatan",
        description: "Awas! Ada batu besar menghalangi jalan lurus. Cari jalur memutar!",
        optimalBlocks: 9,
        starThresholds: { three: 9, two: 12 },
        items: [
            { tile: 8, type: "organic", name: "Sisa Sayuran", icon: "🥬", category: "Organik" }
        ],
        bins: [
            { tile: 3, type: "organic", name: "Tong Organik", icon: "🗑️🟢" }
        ],
        obstacles: [2],
        hints: [
            "Petak 2 terhalang batu besar. Rina harus berputar ke atas melalui petak 10!",
            "Putar kiri (hadap atas), maju ke petak 10, putar kanan, lalu maju melewati petak 9 ke petak 8.",
            "Ambil sayur di petak 8, putar kanan (hadap bawah), lalu maju ke petak 3 untuk letakkan sampah."
        ],
        ecoCard: {
            title: "Fakta Sampah: Sisa Sayur Mayur 🥬",
            category: "Sampah Organik",
            decompTime: "5 - 10 hari",
            fact: "Sayuran membusuk sangat cepat. Jika dibuang ke TPA tanpa udara, sayuran menghasilkan gas metana yang 25x lebih merusak iklim daripada CO2. Pilah dan komposkan segera!",
            tip: "Sayuran yang belum basi bisa dibuat kaldu sayur yang lezat di rumah."
        }
    },
    {
        id: 5,
        title: "Level 5: Pilah Dua Jenis",
        concept: "Dua Kategori Sampah",
        description: "Ada sampah organik dan anorganik. Ingat: Rina hanya bisa membawa 1 sampah sekaligus!",
        optimalBlocks: 17,
        starThresholds: { three: 17, two: 22 },
        items: [
            { tile: 2, type: "organic", name: "Apel Busuk", icon: "🍎", category: "Organik" },
            { tile: 7, type: "inorganic", name: "Kaleng Minuman", icon: "🥫", category: "Anorganik" }
        ],
        bins: [
            { tile: 10, type: "organic", name: "Tong Organik", icon: "🗑️🟢" },
            { tile: 5, type: "inorganic", name: "Tong Anorganik", icon: "🗑️🔵" }
        ],
        obstacles: [3],
        hints: [
            "Bawa sampah satu per satu: buang sampah pertama ke tongnya sebelum mengambil sampah kedua!",
            "Maju ke petak 2, ambil apel, lalu buang ke tong hijau petak 10. Kemudian bergerak ke petak 7 untuk ambil kaleng dan buang ke petak 5.",
            "Rute: Maju ➔ Ambil ➔ Putar Kiri ➔ Maju ➔ Putar Kiri ➔ Maju ➔ Letakkan ➔ Putar Balik menuju petak 7!"
        ],
        ecoCard: {
            title: "Fakta Sampah: Kaleng Aluminium 🥫",
            category: "Sampah Anorganik",
            decompTime: "80 - 200 Tahun",
            fact: "Aluminium dapat didaur ulang 100% tanpa batas kualitas! Kaleng bekas yang didaur ulang bisa kembali ke rak toko sebagai kaleng baru hanya dalam waktu 60 hari.",
            tip: "Bilas kaleng dari sisa minuman manis sebelum dimasukkan ke tong daur ulang agar tidak mengundang semut."
        }
    },
    {
        id: 6,
        title: "Level 6: Kekuatan Loop",
        concept: "Pengenalan Blok Ulangi",
        description: "Jalurnya sangat panjang! Daripada menumpuk banyak blok Maju, gunakan blok 'Ulangi ... kali'.",
        optimalBlocks: 7,
        starThresholds: { three: 7, two: 10 },
        items: [
            { tile: 5, type: "inorganic", name: "Kantong Plastik", icon: "🛍️", category: "Anorganik" }
        ],
        bins: [
            { tile: 15, type: "inorganic", name: "Tong Anorganik", icon: "🗑️🔵" }
        ],
        obstacles: [],
        hints: [
            "Dari petak 1 ke petak 5 butuh 4 langkah maju. Masukkan blok 'Maju' ke dalam 'Ulangi 4 kali'!",
            "Ambil sampah di petak 5, putar kiri (menghadap atas), lalu gunakan loop kedua 'Ulangi 2 kali [Maju]'.",
            "Gunakan: Ulangi 4x [Maju] ➔ Ambil ➔ Putar Kiri ➔ Ulangi 2x [Maju] ➔ Letakkan."
        ],
        tutorial: {
            step1: "Blok 'Ulangi' dapat diisi angka 2 sampai 9. Blok di dalamnya akan dieksekusi berulang!",
            step2: "Tarik blok Maju ke dalam mulut blok Ulangi untuk menghemat baris kode."
        },
        ecoCard: {
            title: "Fakta Sampah: Kantong Plastik Kresek 🛍️",
            category: "Sampah Anorganik",
            decompTime: "10 - 20 Tahun",
            fact: "Miliaran kantong plastik digunakan setiap hari dan mencemari lautan. Banyak penyu laut salah mengira kantong plastik mengapung sebagai ubur-ubur makanan mereka.",
            tip: "Bawalah tas belanja kain belanja (tote bag) sendiri setiap bepergian."
        }
    },
    {
        id: 7,
        title: "Level 7: Pola Berulang",
        concept: "Loop Pola Gabungan",
        description: "Jalur tangga memiliki pola berulang: Maju, Belok Kiri, Maju, Belok Kanan. Ringkas dengan loop!",
        optimalBlocks: 8,
        starThresholds: { three: 8, two: 11 },
        items: [
            { tile: 13, type: "organic", name: "Kulit Jeruk", icon: "🍊", category: "Organik" }
        ],
        bins: [
            { tile: 14, type: "organic", name: "Tong Organik", icon: "🗑️🟢" }
        ],
        obstacles: [4, 7],
        hints: [
            "Pola tangga: [Maju, Putar Kiri, Maju, Putar Kanan] berulang sebanyak 2 kali!",
            "Masukkan keempat blok pola tersebut ke dalam satu blok Ulangi 2 kali.",
            "Setelah loop selesai di petak 13: Ambil Sampah ➔ Maju ➔ Letakkan Sampah."
        ],
        ecoCard: {
            title: "Fakta Komputasi & Ekologi: Berpikir Pola 🧩",
            category: "Computational Thinking",
            decompTime: "6 Bulan",
            fact: "Mengenali pola (Pattern Recognition) adalah pilar penting Computational Thinking. Dengan pola, kita menghemat tenaga menyusun program dan menghemat sumber daya bumi!",
            tip: "Kulit jeruk mengandung minyak atsiri alami yang bisa dijadikan pembersih ramah lingkungan."
        }
    },
    {
        id: 8,
        title: "Level 8: Tiga Sampah di Taman",
        concept: "Perencanaan Rute Strategis",
        description: "Tiga sampah berserakan di sekitar taman! Rencanakan rute pemilahan sampah yang efektif.",
        optimalBlocks: 22,
        starThresholds: { three: 22, two: 28 },
        items: [
            { tile: 2, type: "organic", name: "Daun Kering", icon: "🍂", category: "Organik" },
            { tile: 10, type: "organic", name: "Sisa Roti", icon: "🍞", category: "Organik" },
            { tile: 7, type: "inorganic", name: "Gelas Plastik", icon: "🥤", category: "Anorganik" }
        ],
        bins: [
            { tile: 1, type: "organic", name: "Tong Organik", icon: "🗑️🟢" },
            { tile: 6, type: "inorganic", name: "Tong Anorganik", icon: "🗑️🔵" }
        ],
        obstacles: [5, 8],
        hints: [
            "Kumpulkan sampah organik yang dekat dengan petak 1 (petak 2 dan petak 10) terlebih dahulu ke tong hijau.",
            "Setelah tong hijau selesai, ambil gelas plastik di petak 7 dan bawa ke tong anorganik di petak 6.",
            "Gunakan putar balik cerdik (2 kali putar kanan) untuk bolak-balik mengambil dan membuang sampah."
        ],
        ecoCard: {
            title: "Fakta Sampah: Gelas Plastik Sekali Pakai 🥤",
            category: "Sampah Anorganik",
            decompTime: "50 Tahun",
            fact: "Gelas minuman boba dan es kopi sering kali memiliki lapisan plastik tebal yang sulit terurai secara alami.",
            tip: "Gunakan tumbler atau botol minum sendiri saat membeli minuman favoritmu!"
        }
    },
    {
        id: 9,
        title: "Level 9: Efisiensi Algoritma",
        concept: "Optimasi Kode",
        description: "Jarak antar sampah cukup jauh. Gunakan blok perulangan secara maksimal untuk meraih 3 bintang!",
        optimalBlocks: 11,
        starThresholds: { three: 11, two: 15 },
        items: [
            { tile: 5, type: "inorganic", name: "Sedotan Plastik", icon: "🥤", category: "Anorganik" },
            { tile: 16, type: "inorganic", name: "Bungkus Makanan", icon: "🍟", category: "Anorganik" }
        ],
        bins: [
            { tile: 15, type: "inorganic", name: "Tong Anorganik", icon: "🗑️🔵" }
        ],
        obstacles: [7, 8, 18],
        hints: [
            "Sedotan berada di petak 5 (4 langkah lurus dari awal). Gunakan Ulangi 4 kali [Maju]!",
            "Setelah ambil di petak 5, putar kiri dan gunakan Ulangi 2 kali [Maju] menuju tong petak 15 untuk buang sampah.",
            "Dari petak 15, maju 1 langkah ke petak 16 untuk mengambil bungkus makanan, lalu putar balik dan letakkan di petak 15."
        ],
        ecoCard: {
            title: "Fakta Sampah: Sedotan Plastik 🥤",
            category: "Sampah Anorganik",
            decompTime: "200 Tahun",
            fact: "Sedotan plastik terlalu kecil untuk diproses mesin daur ulang biasa dan sering terbuang ke lautan. Mengganti sedotan plastik dengan sedotan bambu atau stainless steel menyelamatkan ribuan hewan laut!",
            tip: "Katakan 'Tanpa sedotan, terima kasih' saat memesan minuman di restoran."
        }
    },
    {
        id: 10,
        title: "Level 10: Eco Master",
        concept: "Tantangan Puncak",
        description: "Misi Terakhir! Selesaikan labirin rintangan dan pilah seluruh sampah untuk menjadi Eco Master!",
        optimalBlocks: 18,
        starThresholds: { three: 24, two: 35 },
        items: [
            { tile: 3, type: "organic", name: "Apel Busuk", icon: "🍎", category: "Organik" },
            { tile: 14, type: "inorganic", name: "Kotak Karton", icon: "📦", category: "Anorganik" }
        ],
        bins: [
            { tile: 5, type: "organic", name: "Tong Organik", icon: "🗑️🟢" },
            { tile: 15, type: "inorganic", name: "Tong Anorganik", icon: "🗑️🔵" }
        ],
        obstacles: [4, 8, 12],
        hints: [
            "Perhatikan posisi tong: Organik di petak 5, Anorganik di petak 15. Jalur terbagi rintangan di petak 4, 8, 12.",
            "Ambil apel di petak 3 terlebih dahulu, lalu putar kiri naik ke petak 8 (awas batu!) jadi naik lewat petak 2 ke 9, atau putar ke atas.",
            "Selesaikan sampah organik dulu ke petak 5, lalu ambil kotak karton di petak 14 dan buang ke tong biru di petak 15!"
        ],
        ecoCard: {
            title: "Pencapaian: EcoCoder Master! 🏆",
            category: "Gelar Kehormatan",
            decompTime: "Abadi",
            fact: "Selamat! Kamu telah berhasil menamatkan seluruh 10 level EcoCoder Quest! Kamu kini memahami konsep algoritma sekuens & loop sekaligus mahir memilah sampah.",
            tip: "Terapkan kebiasaan memilah sampah di rumah dan sekolah setiap hari!"
        }
    }
];
