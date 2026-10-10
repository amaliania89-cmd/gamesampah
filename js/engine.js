/**
 * EcoCoder Quest - Game Engine & Interpreter
 * Handles board math, movement logic, block program execution, and collision detection.
 */

class GameEngine {
    constructor() {
        this.currentLevelIndex = 0;
        this.levelData = null;
        
        // Player state
        this.x = 0;
        this.y = 0;
        this.dir = 0; // 0: East, 1: South, 2: West, 3: North
        this.inventory = null; // null or { type, name, icon }
        
        // Board state
        this.items = new Map(); // key: "x,y" => item object
        this.bins = new Map(); // key: "x,y" => bin object
        this.obstacles = new Set(); // key: "x,y"
        this.totalItemsCount = 0;
        this.collectedItemsCount = 0;

        // Execution state
        this.isExecuting = false;
        this.shouldStop = false;
        this.executionSpeed = 1; // 1: 500ms, 2: 280ms, 3: 150ms
        this.showTileNumbers = true;
        this.hintLevelUsed = 0; // 0, 1, 2, or 3

        // Callbacks
        this.onStateChange = null;
        this.onBlockHighlight = null;
        this.onLevelWin = null;
        this.onLevelFail = null;
        this.onMascotMessage = null;
    }

    // --- Coordinate conversions as defined in PRD Section 6.1 ---
    static tileToCoord(n) {
        const row = Math.ceil(n / 5); // 1 to 5
        const y = row - 1; // 0 to 4
        const posInRow = (n - 1) % 5;
        const x = (row % 2 === 1) ? posInRow : (4 - posInRow);
        return { x, y };
    }

    static coordToTile(x, y) {
        const row = y + 1; // 1 to 5
        const posInRow = (row % 2 === 1) ? x : (4 - x);
        return (row - 1) * 5 + posInRow + 1;
    }

    static get DIRECTIONS() {
        return [
            { dx: 1, dy: 0, angle: 0, name: "Timur / Kanan" },
            { dx: 0, dy: -1, angle: 90, name: "Selatan / Bawah" },
            { dx: -1, dy: 0, angle: 180, name: "Barat / Kiri" },
            { dx: 0, dy: 1, angle: 270, name: "Utara / Atas" }
        ];
    }

    loadLevel(index) {
        if (index < 0 || index >= window.GAME_LEVELS.length) return false;
        this.currentLevelIndex = index;
        this.levelData = window.GAME_LEVELS[index];
        this.resetLevel();
        return true;
    }

    resetLevel() {
        this.shouldStop = true;
        this.isExecuting = false;

        // Reset player to tile 1 (x=0, y=0, East) as per PRD Section 6.2
        this.x = 0;
        this.y = 0;
        this.dir = 0; // East
        this.inventory = null;

        // Populate items, bins, and obstacles
        this.items.clear();
        this.bins.clear();
        this.obstacles.clear();

        this.levelData.items.forEach(item => {
            const coord = GameEngine.tileToCoord(item.tile);
            this.items.set(`${coord.x},${coord.y}`, { ...item, coord });
        });

        this.levelData.bins.forEach(bin => {
            const coord = GameEngine.tileToCoord(bin.tile);
            this.bins.set(`${coord.x},${coord.y}`, { ...bin, coord });
        });

        this.levelData.obstacles.forEach(tile => {
            const coord = GameEngine.tileToCoord(tile);
            this.obstacles.add(`${coord.x},${coord.y}`);
        });

        this.totalItemsCount = this.levelData.items.length;
        this.collectedItemsCount = 0;

        if (this.onBlockHighlight) {
            this.onBlockHighlight(null);
        }

        if (this.onStateChange) {
            this.onStateChange();
        }
    }

    getDelay() {
        if (this.executionSpeed === 3) return 140;
        if (this.executionSpeed === 2) return 260;
        return 480;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Count user program blocks (Ulangi counts as 1 + children count, as per PRD Section 11)
    static countProgramBlocks(blocks) {
        let count = 0;
        for (const b of blocks) {
            if (b.type === 'repeat') {
                count += 1 + GameEngine.countProgramBlocks(b.children || []);
            } else {
                count += 1;
            }
        }
        return count;
    }

    // Flatten block tree into executable step sequence with reference to block IDs
    flattenBlocks(blocks) {
        const flat = [];
        for (const b of blocks) {
            if (b.type === 'repeat') {
                const times = Math.max(2, Math.min(9, parseInt(b.times) || 2));
                for (let i = 0; i < times; i++) {
                    const inner = this.flattenBlocks(b.children || []);
                    flat.push(...inner);
                }
            } else {
                flat.push({
                    type: b.type,
                    blockId: b.id
                });
            }
        }
        return flat;
    }

    async runProgram(programBlocks) {
        if (this.isExecuting) return;
        this.resetLevel();

        if (!programBlocks || programBlocks.length === 0) {
            if (this.onLevelFail) {
                this.onLevelFail("Program masih kosong! Tarik beberapa blok perintah ke area kerja.");
            }
            return;
        }

        const flatSteps = this.flattenBlocks(programBlocks);
        if (flatSteps.length === 0) {
            if (this.onLevelFail) {
                this.onLevelFail("Tidak ada perintah untuk dijalankan.");
            }
            return;
        }

        this.isExecuting = true;
        this.shouldStop = false;

        const totalBlocksUsed = GameEngine.countProgramBlocks(programBlocks);

        if (this.onMascotMessage) {
            this.onMascotMessage("Semangat Rina! Sedang menjalankan programmu... 🌟");
        }

        for (let i = 0; i < flatSteps.length; i++) {
            if (this.shouldStop) {
                this.isExecuting = false;
                if (this.onBlockHighlight) this.onBlockHighlight(null);
                return;
            }

            const step = flatSteps[i];

            // Highlight currently executing block
            if (this.onBlockHighlight) {
                this.onBlockHighlight(step.blockId);
            }

            const result = this.executeStep(step.type);

            if (this.onStateChange) {
                this.onStateChange();
            }

            if (!result.success) {
                this.isExecuting = false;
                if (this.onBlockHighlight) this.onBlockHighlight(null);
                if (window.soundEngine) window.soundEngine.playError();
                if (this.onLevelFail) {
                    this.onLevelFail(result.message);
                }
                return;
            }

            // Check if win occurred during step
            if (result.won) {
                this.isExecuting = false;
                if (this.onBlockHighlight) this.onBlockHighlight(null);
                if (window.soundEngine) window.soundEngine.playWin();

                const stars = this.calculateStars(totalBlocksUsed);
                if (this.onLevelWin) {
                    this.onLevelWin({
                        stars,
                        totalBlocks: totalBlocksUsed,
                        stepCount: i + 1,
                        optimalBlocks: this.levelData.optimalBlocks,
                        ecoCard: this.levelData.ecoCard
                    });
                }
                return;
            }

            await this.sleep(this.getDelay());
        }

        // Program finished but win condition not reached
        this.isExecuting = false;
        if (this.onBlockHighlight) this.onBlockHighlight(null);

        if (this.collectedItemsCount < this.totalItemsCount) {
            if (window.soundEngine) window.soundEngine.playError();
            if (this.onLevelFail) {
                this.onLevelFail("Program selesai, tapi masih ada sampah tersisa di taman! Yuk periksa dan lengkapi programmu.");
            }
        }
    }

    executeStep(commandType) {
        const curTile = GameEngine.coordToTile(this.x, this.y);
        const curKey = `${this.x},${this.y}`;

        switch (commandType) {
            case 'move': {
                const dirInfo = GameEngine.DIRECTIONS[this.dir];
                const nx = this.x + dirInfo.dx;
                const ny = this.y + dirInfo.dy;

                // Check bounds (0..4)
                if (nx < 0 || nx > 4 || ny < 0 || ny > 4) {
                    return { success: false, message: "Kamu keluar dari area permainan! Cek lagi arah hadap dan jumlah langkah Rina." };
                }

                // Check obstacle
                const nKey = `${nx},${ny}`;
                if (this.obstacles.has(nKey)) {
                    const hitTile = GameEngine.coordToTile(nx, ny);
                    return { success: false, message: `Aduh! Ada rintangan batu di petak ${hitTile}. Coba cari jalan lain!` };
                }

                this.x = nx;
                this.y = ny;
                if (window.soundEngine) window.soundEngine.playStep();
                return { success: true };
            }

            case 'turn_right': {
                this.dir = (this.dir + 1) % 4;
                if (window.soundEngine) window.soundEngine.playTurn();
                return { success: true };
            }

            case 'turn_left': {
                this.dir = (this.dir + 3) % 4;
                if (window.soundEngine) window.soundEngine.playTurn();
                return { success: true };
            }

            case 'pickup': {
                if (this.inventory !== null) {
                    return { success: false, message: "Tangan Rina sudah penuh membawa sampah! Buang ke tempat sampah yang sesuai terlebih dahulu." };
                }

                if (!this.items.has(curKey)) {
                    return { success: false, message: `Ups! Tidak ada sampah di petak ${curTile} untuk diambil.` };
                }

                this.inventory = this.items.get(curKey);
                this.items.delete(curKey);
                if (window.soundEngine) window.soundEngine.playPickup();
                return { success: true };
            }

            case 'drop': {
                if (this.inventory === null) {
                    return { success: false, message: "Rina belum mengambil sampah apapun untuk diletakkan!" };
                }

                if (!this.bins.has(curKey)) {
                    return { success: false, message: `Jangan buang sampah sembarangan di petak ${curTile}! Carilah tempat sampah.` };
                }

                const targetBin = this.bins.get(curKey);
                if (this.inventory.type !== targetBin.type) {
                    const jenisItem = this.inventory.type === 'organic' ? 'Organik (Hijau)' : 'Anorganik (Biru/Kuning)';
                    const jenisTong = targetBin.type === 'organic' ? 'Tong Organik' : 'Tong Anorganik';
                    return {
                        success: false,
                        message: `Ups, ${this.inventory.name} adalah sampah ${this.inventory.type === 'organic' ? 'organik' : 'anorganik'}, seharusnya dibuang ke ${jenisItem}, bukan ke ${jenisTong}!`
                    };
                }

                // Successful deposit
                this.inventory = null;
                this.collectedItemsCount++;
                if (window.soundEngine) window.soundEngine.playDrop();

                // PRD Section 9.3: Immediate win condition when all items placed in right bins
                if (this.collectedItemsCount === this.totalItemsCount) {
                    return { success: true, won: true };
                }

                return { success: true };
            }

            default:
                return { success: false, message: `Perintah tidak dikenal: ${commandType}` };
        }
    }

    calculateStars(blockCount) {
        const { three, two } = this.levelData.starThresholds;
        
        // 3 Stars condition: blockCount <= three AND hint Tier 3 was NOT used
        if (blockCount <= three && this.hintLevelUsed < 3) {
            return 3;
        } else if (blockCount <= two) {
            return 2;
        }
        return 1;
    }

    stopProgram() {
        this.shouldStop = true;
        this.isExecuting = false;
        this.resetLevel();
    }
}

window.gameEngine = new GameEngine();
