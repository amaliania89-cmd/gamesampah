"""
Full simulator and validator for all 10 EcoCoder Quest levels.
Verifies that all 10 levels are 100% solvable and balanced.
"""

def tile_to_coord(n):
    row = (n - 1) // 5 + 1
    y = row - 1
    pos_in_row = (n - 1) % 5
    x = pos_in_row if row % 2 == 1 else (4 - pos_in_row)
    return x, y

def coord_to_tile(x, y):
    row = y + 1
    pos_in_row = x if row % 2 == 1 else (4 - x)
    return (row - 1) * 5 + pos_in_row + 1

DIRECTIONS = [
    (1, 0),   # 0: East (Kanan)
    (0, -1),  # 1: South (Bawah)
    (-1, 0),  # 2: West (Kiri)
    (0, 1),   # 3: North (Atas)
]

class LevelSim:
    def __init__(self, level_num, name, items, bins, obstacles, hint_text, eco_info):
        self.level_num = level_num
        self.name = name
        self.raw_items = items
        self.raw_bins = bins
        self.raw_obstacles = obstacles
        self.hint_text = hint_text
        self.eco_info = eco_info
        
        self.items = {tile_to_coord(t): v for t, v in items.items()}
        self.bins = {tile_to_coord(t): v for t, v in bins.items()}
        self.obstacles = {tile_to_coord(t) for t in obstacles}
        
    def run_commands(self, commands):
        x, y = 0, 0 # petak 1 always
        dir_idx = 0 # East always
        inventory = None
        remaining_items = dict(self.items)
        collected_count = 0
        total_items = len(self.items)
        
        def flatten(cmds):
            flat = []
            for c in cmds:
                if isinstance(c, tuple) and c[0] == 'repeat':
                    times, inner = c[1], c[2]
                    for _ in range(times):
                        flat.extend(flatten(inner))
                else:
                    flat.append(c)
            return flat

        flat_cmds = flatten(commands)
        
        for step, cmd in enumerate(flat_cmds):
            if cmd == 'move':
                dx, dy = DIRECTIONS[dir_idx]
                nx, ny = x + dx, y + dy
                if nx < 0 or nx > 4 or ny < 0 or ny > 4:
                    return False, f"Step {step+1}: Keluar batas papan di ({nx}, {ny})"
                if (nx, ny) in self.obstacles:
                    return False, f"Step {step+1}: Menabrak penghalang di petak {coord_to_tile(nx, ny)}"
                x, y = nx, ny
            elif cmd == 'turn_right':
                dir_idx = (dir_idx + 1) % 4
            elif cmd == 'turn_left':
                dir_idx = (dir_idx - 1) % 4
            elif cmd == 'pickup':
                if inventory is not None:
                    return False, f"Step {step+1}: Tangan sudah penuh membawa sampah!"
                if (x, y) not in remaining_items:
                    return False, f"Step {step+1}: Tidak ada sampah di petak {coord_to_tile(x, y)}"
                inventory = remaining_items.pop((x, y))
            elif cmd == 'drop':
                if inventory is None:
                    return False, f"Step {step+1}: Tidak membawa sampah untuk diletakkan!"
                if (x, y) not in self.bins:
                    return False, f"Step {step+1}: Petak {coord_to_tile(x, y)} bukan tempat sampah!"
                bin_type = self.bins[(x, y)]
                if inventory['type'] != bin_type:
                    return False, f"Step {step+1}: Jenis sampah salah ({inventory['type']} ke tong {bin_type}) di petak {coord_to_tile(x, y)}!"
                inventory = None
                collected_count += 1
                if collected_count == total_items:
                    return True, f"Menang dalam {step+1} langkah!"
            else:
                return False, f"Perintah tidak dikenal: {cmd}"
                
        if collected_count == total_items:
            return True, "Menang!"
        return False, f"Program selesai tetapi masih ada {total_items - collected_count} sampah tersisa!"

def count_blocks(cmds):
    count = 0
    for c in cmds:
        if isinstance(c, tuple) and c[0] == 'repeat':
            count += 1 + count_blocks(c[2])
        else:
            count += 1
    return count

# All 10 Levels Definitions:
levels = [
    # Level 1: Maju 1 jalur lurus
    LevelSim(1, "Langkah Pertama: Ayo Maju!",
             items={3: {'type': 'organic', 'name': 'Apel Busuk'}},
             bins={5: 'organic'},
             obstacles=[],
             hint_text=[
                 "Karakter Rina menghadap ke kanan. Jalur lurus menuju petak 5!",
                 "Maju 2 petak ke apel (petak 3), ambil, lalu maju 2 petak lagi ke tong hijau (petak 5).",
                 "Susun blok: Maju -> Maju -> Ambil Sampah -> Maju -> Maju -> Letakkan Sampah."
             ],
             eco_info="Apel adalah sampah organik yang mudah terurai dan dapat diolah menjadi pupuk kompos untuk tanaman!"),

    # Level 2: Belokan & Putar
    LevelSim(2, "Belokan Cantik: Belajar Memutar",
             items={3: {'type': 'organic', 'name': 'Kulit Pisang'}},
             bins={8: 'organic'},
             obstacles=[],
             hint_text=[
                 "Setelah mengambil kulit pisang di petak 3, kamu perlu mengubah arah hadap Rina.",
                 "Putar kiri akan mengarahkan Rina ke arah atas (Utara) menuju petak 8.",
                 "Susun blok: Maju -> Maju -> Ambil -> Putar Kiri -> Maju -> Letakkan."
             ],
             eco_info="Kulit pisang kaya akan kalium. Dalam proses pengomposan, nutrisinya sangat menyuburkan tanah!"),

    # Level 3: Sampah Anorganik
    LevelSim(3, "Pilah Botol Plastik: Sampah Anorganik",
             items={4: {'type': 'inorganic', 'name': 'Botol Plastik'}},
             bins={7: 'inorganic'},
             obstacles=[],
             hint_text=[
                 "Botol plastik adalah sampah anorganik. Pastikan dibuang ke tong anorganik (biru/kuning)!",
                 "Maju 3 langkah ke petak 4 untuk ambil botol, lalu putar kiri dan maju ke petak 7.",
                 "Susun blok: Maju x3 -> Ambil -> Putar Kiri -> Maju -> Letakkan."
             ],
             eco_info="Botol plastik membutuhkan waktu hingga 450 tahun untuk terurai di alam! Daur ulang adalah solusi terbaik."),

    # Level 4: Rintangan Batu
    LevelSim(4, "Hindari Rintangan: Ada Batu Besar",
             items={8: {'type': 'organic', 'name': 'Sisa Sayur'}},
             bins={3: 'organic'},
             obstacles=[2],
             hint_text=[
                 "Petak 2 terhalang batu besar. Rina harus berputar ke atas melalui petak 10!",
                 "Putar kiri, maju ke petak 10, putar kanan, lalu maju melewati petak 9 ke petak 8.",
                 "Setelah ambil sayur di petak 8, putar kanan (hadap bawah), lalu maju ke petak 3 untuk letakkan sampah."
             ],
             eco_info="Sayuran sisa memasak adalah sampah organik hijau yang menghasilkan gas metana jika tertimbun tanpa dipilah."),

    # Level 5: Dua Jenis Sampah
    LevelSim(5, "Pilah Dua Jenis: Organik & Anorganik",
             items={2: {'type': 'organic', 'name': 'Apel Busuk'},
                    7: {'type': 'inorganic', 'name': 'Kaleng Logam'}},
             bins={10: 'organic', 5: 'inorganic'},
             obstacles=[3],
             hint_text=[
                 "Rina hanya bisa membawa 1 sampah dalam satu waktu. Selesaikan satu per satu!",
                 "Ambil apel di petak 2 lalu buang ke tong hijau (petak 10). Kemudian ambil kaleng di petak 7 dan buang ke petak 5.",
                 "Rute: Maju -> Ambil -> Putar Kiri -> Maju -> Putar Kiri -> Maju -> Letakkan -> Balik kanan menuju petak 7!"
             ],
             eco_info="Kaleng aluminium dapat didaur ulang tanpa batas tanpa kehilangan kualitasnya. Hemat energi hingga 95%!"),

    # Level 6: Pengenalan Loop
    LevelSim(6, "Kekuatan Loop: Maju Berulang",
             items={5: {'type': 'inorganic', 'name': 'Kantong Plastik'}},
             bins={15: 'inorganic'},
             obstacles=[],
             hint_text=[
                 "Gunakan blok 'Ulangi ... kali' untuk meringkas langkah maju yang berulang!",
                 "Daripada menyusun Maju 4 kali, gunakan Ulangi 4 kali [Maju].",
                 "Gunakan loop pertama untuk maju 4x, ambil sampah, putar kiri, lalu loop kedua maju 2x ke tong."
             ],
             eco_info="Kantong plastik kresek sering mencemari saluran air dan laut. Bawalah tas belanja kain sendiri!"),

    # Level 7: Loop dengan Pola Tangga
    # Jalur tangga: dari (0,0) -> maju (1,0) -> belok kiri -> maju (1,1) [9] -> belok kanan.
    # Ulangi 2x: dari (1,1) -> maju (2,1) [8] -> belok kiri -> maju (2,2) [13] -> belok kanan.
    # Sampah di petak 13. Tong di petak 14 (3,2).
    # Obstacles: petak 4, petak 7
    LevelSim(7, "Pola Berulang: Tangga Bersih",
             items={13: {'type': 'organic', 'name': 'Kulit Jeruk'}},
             bins={14: 'organic'},
             obstacles=[4, 7],
             hint_text=[
                 "Perhatikan pola langkah: Maju -> Putar Kiri -> Maju -> Putar Kanan. Pola ini berulang 2 kali!",
                 "Masukkan keempat blok pola tersebut ke dalam satu blok Ulangi 2 kali.",
                 "Setelah pola selesai, Rina berada di petak 13. Ambil sampah, maju ke petak 14, dan letakkan!"
             ],
             eco_info="Pola berulang dalam algoritma mempermudah kita menyelesaikan masalah kompleks secara efisien."),

    # Level 8: Tiga Sampah di Taman
    # Sampah: 2 (organik), 10 (organik), 7 (anorganik)
    # Tong: 1 (organik), 6 (anorganik)
    LevelSim(8, "Taman Bersih: Tiga Sampah",
             items={2: {'type': 'organic', 'name': 'Daun Kering'},
                    10: {'type': 'organic', 'name': 'Sisa Buah'},
                    7: {'type': 'inorganic', 'name': 'Botol Kaca'}},
             bins={1: 'organic', 6: 'inorganic'},
             obstacles=[4, 8],
             hint_text=[
                 "Rencanakan rute: selesaikan sampah organik yang dekat dengan petak 1 dulu!",
                 "Ambil sampah di petak 2 atau 10, buang ke petak 1, lalu kumpulkan botol kaca di petak 7 ke petak 6.",
                 "Manfaatkan putar balik secara efisien untuk menghemat blok program."
             ],
             eco_info="Botol kaca dapat disterilkan dan dipakai ulang (reuse) berkali-kali untuk mengurangi limbah."),

    # Level 9: Optimasi Loop Panjang
    # Petak 1 ke petak 5 (4 langkah) ambil sampah 1. Petak 5 ke petak 15 (2 langkah atas) ambil sampah 2.
    # Tong organik di petak 25 (4,4).
    # Loop 1: Ulangi 4 kali [Maju], Ambil (di 5). Putar Kiri, Ulangi 2 kali [Maju], Ambil tidak bisa (tangan penuh)!
    # Jadi buang dulu!
    # Mari buat level 9: Start (0,0). Tong di petak 25 (4,4) [inorganic].
    # Sampah di petak 5 (inorganic), sampah di petak 21 (0,4) [inorganic]. Tong di 23 (2,4).
    # Mari rancang:
    # Karakter mengumpulkan sampah dengan jalur loop keliling.
    # Start (0,0) hadap kanan.
    # Sampah di petak 3 (organik). Tong di petak 5.
    # Karakter bisa pakai loop!
    # Mari kita buat level 9 yang bersih dan efisien:
    LevelSim(9, "Efisiensi Algoritma",
             items={5: {'type': 'inorganic', 'name': 'Sedotan Plastik'},
                    16: {'type': 'inorganic', 'name': 'Bungkus Snack'}},
             bins={15: 'inorganic'},
             obstacles=[8, 9, 18],
             hint_text=[
                 "Ada 2 sampah anorganik. Gunakan loop untuk mempercepat langkah perjalanan Rina!",
                 "Ambil sedotan di petak 5, buang di tong petak 15. Lalu ambil bungkus snack di petak 16 dan buang ke tong petak 15.",
                 "Rute lurus bisa dipersingkat dengan blok Ulangi agar mendapat 3 bintang."
             ],
             eco_info="Sedotan plastik termasuk sampah mikroplastik paling berbahaya bagi biota laut."),

    # Level 10: Boss Level - Eco Master
    LevelSim(10, "Misi Akhir: Eco Master!",
             items={3: {'type': 'organic', 'name': 'Apel Busuk'},
                    14: {'type': 'inorganic', 'name': 'Botol Plastik'}},
             bins={5: 'organic', 25: 'inorganic'},
             obstacles=[2, 7, 12, 17, 22],
             hint_text=[
                 "Tantangan puncak! Rintangan membatasi jalur tengah. Kamu harus memutar lewat jalur atas.",
                 "Gunakan loop untuk bergerak lurus di jalur luar.",
                 "Pilah sampah organik ke tong hijau petak 5, dan anorganik ke tong biru petak 25."
             ],
             eco_info="Selamat! Kamu telah menguasai dasar algoritma dan pemilahan sampah untuk menjaga bumi lestari!")
]

# Solutions for verification
solutions = [
    # L1
    ['move', 'move', 'pickup', 'move', 'move', 'drop'],
    # L2
    ['move', 'move', 'pickup', 'turn_left', 'move', 'drop'],
    # L3
    ['move', 'move', 'move', 'pickup', 'turn_left', 'move', 'drop'],
    # L4
    ['turn_left', 'move', 'turn_right', 'move', 'move', 'pickup', 'turn_right', 'move', 'drop'],
    # L5:
    ['move', 'pickup', 'turn_left', 'move', 'turn_left', 'move', 'drop',
     'turn_right', 'turn_right', 'move', 'move', 'move', 'pickup',
     'turn_right', 'move', 'turn_left', 'move', 'drop'],
    # L6
    [('repeat', 4, ['move']), 'pickup', 'turn_left', ('repeat', 2, ['move']), 'drop'],
    # L7:
    [('repeat', 2, ['move', 'turn_left', 'move', 'turn_right']), 'pickup', 'move', 'drop'],
    # L8: Start (0,0) hadap kanan
    # 1. Ambil 2 (1,0): move, pickup, turn_right 2x (turn_right, turn_right), move, drop (di 1)
    # 2. Ambil 10 (0,1): turn_right (hadap utara), move, pickup, turn_right 2x, move, drop (di 1)
    # 3. Ambil 7 (3,1): turn_left (hadap timur), move, move, move (ke 4), turn_left (hadap utara), move (ke 7 [3,1]), pickup
    # 4. Buang ke 6 (4,1): turn_right (hadap timur), move (ke 6), drop!
    ['move', 'pickup', 'turn_right', 'turn_right', 'move', 'drop',
     'turn_right', 'move', 'pickup', 'turn_right', 'turn_right', 'move', 'drop',
     'turn_left', 'move', 'move', 'move', 'turn_left', 'move', 'pickup',
     'turn_right', 'move', 'drop'],
    # L9:
    # 1. Sedotan di 5 (4,0): repeat(4, [move]), pickup, turn_left, repeat(2, [move]), drop (di 15 [4,2])
    # 2. Bungkus di 16 (4,3): move (ke 16), pickup, turn_left 2x, move, drop (di 15)
    [('repeat', 4, ['move']), 'pickup', 'turn_left', ('repeat', 2, ['move']), 'drop',
     'move', 'pickup', 'turn_right', 'turn_right', 'move', 'drop'],
    # L10:
    # Start (0,0). Obstacles at x=1 (tiles 2, 7, 12, 17, 22). Column x=1 is blocked except we can go up column 0!
    # Karakter hadap timur di (0,0). Menghadap petak 2 (batu).
    # Jadi dari (0,0): turn_left (hadap utara).
    # repeat(4, [move]) -> naik dari y=0 ke y=4 (petak 21)!
    # turn_right (hadap timur).
    # move ke (1,4) [petak 22 is obstacle! Wait, let's verify if 22 is obstacle]).
]
