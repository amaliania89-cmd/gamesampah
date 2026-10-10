/**
 * EcoCoder Quest - UI Manager & Block Interaction Controller
 * Supports Drag-and-Drop, Touch/Tap addition, Nesting in Loops, Modals, and Animations.
 */

class UIManager {
    constructor(engine) {
        this.engine = engine;
        this.programBlocks = []; // Array of { id, type, times?, children?: [] }
        this.nextBlockId = 1;
        this.draggedBlockData = null;
        this.draggedElement = null;

        // Cache DOM elements
        this.boardGridEl = document.getElementById('board-grid');
        this.characterEl = document.getElementById('player-character');
        this.carriedBadgeEl = document.getElementById('carried-badge');
        this.workspaceListEl = document.getElementById('workspace-blocks');
        this.blockCountBadgeEl = document.getElementById('block-count-badge');
        this.levelTitleEl = document.getElementById('level-title');
        this.levelConceptEl = document.getElementById('level-concept');
        this.levelStarsEl = document.getElementById('level-stars-display');
        this.mascotBubbleEl = document.getElementById('mascot-bubble');
        this.mascotAvatarEl = document.getElementById('mascot-avatar');

        // Modals
        this.levelSelectModal = document.getElementById('level-select-modal');
        this.hintModal = document.getElementById('hint-modal');
        this.winModal = document.getElementById('win-modal');
        this.failModal = document.getElementById('fail-modal');

        this.initStorage();
        this.initEngineCallbacks();
        this.initToolbox();
        this.initWorkspaceDragDrop();
        this.initControls();
    }

    initStorage() {
        const savedProgress = localStorage.getItem('ecocoder_progress');
        if (!savedProgress) {
            // Level 1 unlocked by default
            const initialData = {
                unlockedLevel: 1,
                stars: {} // levelId => stars (1-3)
            };
            localStorage.setItem('ecocoder_progress', JSON.stringify(initialData));
        }
    }

    getProgress() {
        try {
            return JSON.parse(localStorage.getItem('ecocoder_progress')) || { unlockedLevel: 1, stars: {} };
        } catch {
            return { unlockedLevel: 1, stars: {} };
        }
    }

    saveLevelWin(levelId, stars) {
        const prog = this.getProgress();
        const currentStars = prog.stars[levelId] || 0;
        prog.stars[levelId] = Math.max(currentStars, stars);
        prog.unlockedLevel = Math.max(prog.unlockedLevel, levelId + 1);
        localStorage.setItem('ecocoder_progress', JSON.stringify(prog));
    }

    initEngineCallbacks() {
        this.engine.onStateChange = () => this.renderBoardState();
        this.engine.onBlockHighlight = (id) => this.highlightBlock(id);
        this.engine.onLevelWin = (data) => this.showWinModal(data);
        this.engine.onLevelFail = (msg) => this.showFailModal(msg);
        this.engine.onMascotMessage = (msg) => this.setMascotMessage(msg);
    }

    // --- Board Rendering ---
    renderBoard() {
        if (!this.boardGridEl) return;
        this.boardGridEl.innerHTML = '';

        // PRD Section 6.1: 5x5 Grid.
        // Screen top is Row 5 (y=4), Screen bottom is Row 1 (y=0)
        for (let y = 4; y >= 0; y--) {
            for (let x = 0; x < 5; x++) {
                const tileNum = GameEngine.coordToTile(x, y);
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.dataset.tile = tileNum;

                // Checkerboard subtle pattern
                if ((x + y) % 2 === 1) {
                    cell.classList.add('cell-alt');
                }

                // Tile number badge (zig-zag)
                const numBadge = document.createElement('span');
                numBadge.className = 'tile-number';
                numBadge.textContent = tileNum;
                if (!this.engine.showTileNumbers) {
                    numBadge.classList.add('hidden');
                }
                cell.appendChild(numBadge);

                // Slot for objects (items, bins, obstacles)
                const objSlot = document.createElement('div');
                objSlot.className = 'cell-object-slot';
                cell.appendChild(objSlot);

                this.boardGridEl.appendChild(cell);
            }
        }

        this.renderBoardState();
    }

    renderBoardState() {
        // Clear all object slots
        const cells = this.boardGridEl.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
            const slot = cell.querySelector('.cell-object-slot');
            if (slot) slot.innerHTML = '';
        });

        // 1. Render Obstacles
        this.engine.obstacles.forEach(coordKey => {
            const [x, y] = coordKey.split(',').map(Number);
            const cell = this.getCellElement(x, y);
            if (cell) {
                const slot = cell.querySelector('.cell-object-slot');
                slot.innerHTML = `
                    <div class="board-obj obj-obstacle" title="Rintangan Batu">
                        <span class="obj-icon">🪨</span>
                        <span class="obj-shadow"></span>
                    </div>
                `;
            }
        });

        // 2. Render Bins
        this.engine.bins.forEach(bin => {
            const { x, y } = bin.coord;
            const cell = this.getCellElement(x, y);
            if (cell) {
                const slot = cell.querySelector('.cell-object-slot');
                const isOrg = bin.type === 'organic';
                slot.innerHTML = `
                    <div class="board-obj obj-bin ${isOrg ? 'bin-organic' : 'bin-inorganic'}" title="${bin.name}">
                        <div class="bin-can">
                            <span class="bin-glow"></span>
                            <span class="bin-icon">${isOrg ? '🟢' : '🔵'}</span>
                            <span class="bin-label">${isOrg ? 'ORGANIK' : 'ANORGANIK'}</span>
                        </div>
                    </div>
                `;
            }
        });

        // 3. Render Trash Items
        this.engine.items.forEach(item => {
            const { x, y } = item.coord;
            const cell = this.getCellElement(x, y);
            if (cell) {
                const slot = cell.querySelector('.cell-object-slot');
                const isOrg = item.type === 'organic';
                slot.innerHTML = `
                    <div class="board-obj obj-item ${isOrg ? 'item-organic' : 'item-inorganic'}" title="${item.name} (${item.category})">
                        <span class="item-floating-icon">${item.icon}</span>
                        <span class="item-sparkle">✨</span>
                        <span class="obj-shadow"></span>
                    </div>
                `;
            }
        });

        // 4. Update Character Position & Rotation
        this.updateCharacterPosition();
    }

    getCellElement(x, y) {
        return this.boardGridEl.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
    }

    updateCharacterPosition() {
        if (!this.characterEl || !this.boardGridEl) return;

        // Position character relative to target cell
        const targetCell = this.getCellElement(this.engine.x, this.engine.y);
        if (!targetCell) return;

        const gridRect = this.boardGridEl.getBoundingClientRect();
        const cellRect = targetCell.getBoundingClientRect();

        const leftPos = cellRect.left - gridRect.left + (cellRect.width / 2) - 32;
        const topPos = cellRect.top - gridRect.top + (cellRect.height / 2) - 32;

        this.characterEl.style.transform = `translate(${leftPos}px, ${topPos}px)`;

        // Direction angle
        const dirInfo = GameEngine.DIRECTIONS[this.engine.dir];
        const dirArrow = this.characterEl.querySelector('.player-dir-arrow');
        if (dirArrow) {
            dirArrow.style.transform = `rotate(${dirInfo.angle}deg)`;
        }

        // Inventory display
        if (this.engine.inventory) {
            this.carriedBadgeEl.classList.remove('hidden');
            this.carriedBadgeEl.innerHTML = `
                <span class="carried-icon">${this.engine.inventory.icon}</span>
                <span class="carried-tag ${this.engine.inventory.type}">${this.engine.inventory.name}</span>
            `;
        } else {
            this.carriedBadgeEl.classList.add('hidden');
            this.carriedBadgeEl.innerHTML = '';
        }
    }

    // --- Toolbox Initialization ---
    initToolbox() {
        const toolBtns = document.querySelectorAll('.toolbox-item');
        toolBtns.forEach(btn => {
            const blockType = btn.dataset.type;

            // Click / Tap to add directly
            btn.addEventListener('click', () => {
                if (this.engine.isExecuting) return;
                this.addBlockToWorkspace(blockType);
                if (window.soundEngine) window.soundEngine.playClick();
            });

            // HTML5 Drag
            btn.setAttribute('draggable', 'true');
            btn.addEventListener('dragstart', (e) => {
                if (this.engine.isExecuting) {
                    e.preventDefault();
                    return;
                }
                this.draggedBlockData = { type: blockType, isNew: true };
                e.dataTransfer.setData('text/plain', blockType);
                btn.classList.add('dragging-source');
            });

            btn.addEventListener('dragend', () => {
                btn.classList.remove('dragging-source');
                this.draggedBlockData = null;
            });
        });
    }

    // --- Workspace Drag & Drop ---
    initWorkspaceDragDrop() {
        const dropArea = document.getElementById('workspace-dropzone');
        if (!dropArea) return;

        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropArea.classList.add('drag-over');
        });

        dropArea.addEventListener('dragleave', (e) => {
            if (!dropArea.contains(e.relatedTarget)) {
                dropArea.classList.remove('drag-over');
            }
        });

        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.classList.remove('drag-over');
            if (this.engine.isExecuting || !this.draggedBlockData) return;

            if (this.draggedBlockData.isNew) {
                this.addBlockToWorkspace(this.draggedBlockData.type);
            }
            if (window.soundEngine) window.soundEngine.playClick();
        });
    }

    addBlockToWorkspace(type, targetList = null) {
        const newBlock = {
            id: 'block_' + (this.nextBlockId++),
            type: type
        };

        if (type === 'repeat') {
            newBlock.times = 2;
            newBlock.children = [];
        }

        if (targetList) {
            targetList.push(newBlock);
        } else {
            this.programBlocks.push(newBlock);
        }

        this.renderWorkspace();
    }

    renderWorkspace() {
        if (!this.workspaceListEl) return;
        this.workspaceListEl.innerHTML = '';

        if (this.programBlocks.length === 0) {
            this.workspaceListEl.innerHTML = `
                <div class="workspace-empty-state">
                    <div class="empty-icon">🧩</div>
                    <p class="empty-title">Area Program Masih Kosong</p>
                    <p class="empty-subtitle">Klik atau seret blok perintah di samping ke sini untuk mulai memprogram!</p>
                </div>
            `;
            this.updateBlockCount();
            return;
        }

        this.programBlocks.forEach((block, index) => {
            const blockEl = this.createBlockElement(block, this.programBlocks, index);
            this.workspaceListEl.appendChild(blockEl);
        });

        this.updateBlockCount();
    }

    createBlockElement(block, parentArray, index) {
        const el = document.createElement('div');
        el.className = `code-block block-${block.type}`;
        el.id = block.id;
        el.setAttribute('draggable', !this.engine.isExecuting);

        // Block header / content
        let labelHtml = '';
        switch (block.type) {
            case 'move':
                labelHtml = `<span class="block-icon">➡️</span> <span class="block-text">Maju 1 langkah</span>`;
                break;
            case 'turn_right':
                labelHtml = `<span class="block-icon">↻</span> <span class="block-text">Putar kanan 90°</span>`;
                break;
            case 'turn_left':
                labelHtml = `<span class="block-icon">↺</span> <span class="block-text">Putar kiri 90°</span>`;
                break;
            case 'pickup':
                labelHtml = `<span class="block-icon">🤲</span> <span class="block-text">Ambil sampah</span>`;
                break;
            case 'drop':
                labelHtml = `<span class="block-icon">📥</span> <span class="block-text">Letakkan sampah</span>`;
                break;
            case 'repeat':
                labelHtml = `
                    <div class="repeat-header">
                        <span class="block-icon">🔁</span>
                        <span class="block-text">Ulangi</span>
                        <select class="repeat-select" data-id="${block.id}">
                            ${[2, 3, 4, 5, 6, 7, 8, 9].map(n => `<option value="${n}" ${block.times === n ? 'selected' : ''}>${n}</option>`).join('')}
                        </select>
                        <span class="block-text">kali</span>
                    </div>
                `;
                break;
        }

        el.innerHTML = `
            <div class="block-main">
                <div class="block-drag-handle">⠿</div>
                <div class="block-content">${labelHtml}</div>
                <div class="block-actions">
                    <button class="btn-block-delete" title="Hapus blok">✕</button>
                </div>
            </div>
        `;

        // Handle repeat children slot
        if (block.type === 'repeat') {
            const childSlot = document.createElement('div');
            childSlot.className = 'repeat-children-slot';
            childSlot.dataset.blockId = block.id;

            if (!block.children || block.children.length === 0) {
                childSlot.innerHTML = `<div class="repeat-placeholder">Tarik blok perintah ke dalam sini</div>`;
            } else {
                block.children.forEach((childBlock, cIdx) => {
                    const childEl = this.createBlockElement(childBlock, block.children, cIdx);
                    childSlot.appendChild(childEl);
                });
            }

            // Drag and drop into repeat container
            childSlot.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                childSlot.classList.add('child-slot-over');
            });

            childSlot.addEventListener('dragleave', (e) => {
                childSlot.classList.remove('child-slot-over');
            });

            childSlot.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                childSlot.classList.remove('child-slot-over');
                if (this.engine.isExecuting || !this.draggedBlockData) return;

                // PRD Section 8 & 18: No nested loops allowed
                if (this.draggedBlockData.type === 'repeat') {
                    this.setMascotMessage("Perulangan bersarang (loop di dalam loop) tidak diperbolehkan ya!");
                    if (window.soundEngine) window.soundEngine.playError();
                    return;
                }

                if (this.draggedBlockData.isNew) {
                    this.addBlockToWorkspace(this.draggedBlockData.type, block.children);
                }
                if (window.soundEngine) window.soundEngine.playClick();
            });

            el.appendChild(childSlot);

            // Repeat selector event
            const selectEl = el.querySelector('.repeat-select');
            selectEl.addEventListener('change', (e) => {
                block.times = parseInt(e.target.value) || 2;
                if (window.soundEngine) window.soundEngine.playClick();
            });
        }

        // Delete button
        const delBtn = el.querySelector('.btn-block-delete');
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.engine.isExecuting) return;
            parentArray.splice(index, 1);
            if (window.soundEngine) window.soundEngine.playClick();
            this.renderWorkspace();
        });

        // Reordering Drag Events
        el.addEventListener('dragstart', (e) => {
            if (this.engine.isExecuting) {
                e.preventDefault();
                return;
            }
            e.stopPropagation();
            this.draggedElement = { parent: parentArray, index: index, block: block };
            this.draggedBlockData = { type: block.type, isNew: false };
            el.classList.add('dragging-block');
        });

        el.addEventListener('dragend', (e) => {
            el.classList.remove('dragging-block');
            this.draggedElement = null;
            this.draggedBlockData = null;
        });

        return el;
    }

    updateBlockCount() {
        const count = GameEngine.countProgramBlocks(this.programBlocks);
        const opt = this.engine.levelData.optimalBlocks;
        if (this.blockCountBadgeEl) {
            this.blockCountBadgeEl.innerHTML = `
                <span class="count-num">${count}</span>
                <span class="count-label">Blok</span>
                <span class="count-opt">(Target ⭐⭐⭐: ≤ ${opt})</span>
            `;
        }
    }

    highlightBlock(blockId) {
        // Remove all previous active highlights
        const allBlocks = this.workspaceListEl.querySelectorAll('.code-block');
        allBlocks.forEach(b => b.classList.remove('block-running'));

        if (blockId) {
            const activeEl = document.getElementById(blockId);
            if (activeEl) {
                activeEl.classList.add('block-running');
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    // --- Controls Initialization ---
    initControls() {
        // Run button
        const btnRun = document.getElementById('btn-run-program');
        if (btnRun) {
            btnRun.addEventListener('click', () => {
                if (this.engine.isExecuting) return;
                this.engine.runProgram(this.programBlocks);
            });
        }

        // Reset button
        const btnReset = document.getElementById('btn-reset-board');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                this.engine.stopProgram();
                this.setMascotMessage("Papan di-reset! Programmu tetap aman.");
                if (window.soundEngine) window.soundEngine.playClick();
            });
        }

        // Clear program button
        const btnClear = document.getElementById('btn-clear-workspace');
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                if (this.engine.isExecuting) return;
                if (this.programBlocks.length === 0) return;
                if (confirm("Hapus semua blok program di area kerja?")) {
                    this.programBlocks = [];
                    this.renderWorkspace();
                    if (window.soundEngine) window.soundEngine.playClick();
                }
            });
        }

        // Toggle Tile Numbers
        const btnToggleNums = document.getElementById('btn-toggle-numbers');
        if (btnToggleNums) {
            btnToggleNums.addEventListener('click', () => {
                this.engine.showTileNumbers = !this.engine.showTileNumbers;
                btnToggleNums.classList.toggle('active', this.engine.showTileNumbers);
                const badges = this.boardGridEl.querySelectorAll('.tile-number');
                badges.forEach(b => b.classList.toggle('hidden', !this.engine.showTileNumbers));
                if (window.soundEngine) window.soundEngine.playClick();
            });
        }

        // Speed selector
        const speedBtns = document.querySelectorAll('.speed-pill');
        speedBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                speedBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.engine.executionSpeed = parseInt(btn.dataset.speed) || 1;
                if (window.soundEngine) window.soundEngine.playClick();
            });
        });

        // Audio Mute toggle
        const btnMute = document.getElementById('btn-toggle-audio');
        if (btnMute) {
            const updateAudioIcon = (muted) => {
                btnMute.innerHTML = muted ? '🔇' : '🔊';
                btnMute.title = muted ? 'Nyalakan Suara & BGM' : 'Matikan Suara & BGM';
            };
            updateAudioIcon(window.soundEngine.isMuted);

            btnMute.addEventListener('click', () => {
                const muted = window.soundEngine.toggleMute();
                updateAudioIcon(muted);
            });
        }

        // Hint button
        const btnHint = document.getElementById('btn-open-hint');
        if (btnHint) {
            btnHint.addEventListener('click', () => this.openHintModal());
        }

        // Level Select button
        const btnLevelSelect = document.getElementById('btn-open-levels');
        if (btnLevelSelect) {
            btnLevelSelect.addEventListener('click', () => this.openLevelSelectModal());
        }

        // Modal Close buttons
        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal-overlay').classList.add('hidden');
            });
        });
    }

    setMascotMessage(msg) {
        if (!this.mascotBubbleEl) return;
        this.mascotBubbleEl.textContent = msg;
        this.mascotBubbleEl.classList.remove('pop-anim');
        void this.mascotBubbleEl.offsetWidth; // trigger reflow
        this.mascotBubbleEl.classList.add('pop-anim');
    }

    loadLevel(index) {
        this.engine.loadLevel(index);
        this.programBlocks = [];
        this.renderBoard();
        this.renderWorkspace();

        const lvl = this.engine.levelData;
        if (this.levelTitleEl) this.levelTitleEl.textContent = lvl.title;
        if (this.levelConceptEl) this.levelConceptEl.textContent = lvl.concept;

        // Best stars for this level
        const prog = this.getProgress();
        const starsEarned = prog.stars[lvl.id] || 0;
        this.updateHeaderStars(starsEarned);

        // Mascot welcome
        this.setMascotMessage(lvl.description);

        // Show tutorial if level 1 or 2 and first time
        if (lvl.id === 1 && starsEarned === 0) {
            setTimeout(() => {
                this.setMascotMessage("Halo! Aku Koko! 🌿 Tarik blok 'Maju 1 langkah' untuk memandu Rina mengambil sampah.");
            }, 500);
        }
    }

    updateHeaderStars(count) {
        if (!this.levelStarsEl) return;
        let html = '';
        for (let i = 1; i <= 3; i++) {
            html += `<span class="star-icon ${i <= count ? 'star-filled' : 'star-empty'}">★</span>`;
        }
        this.levelStarsEl.innerHTML = html;
    }

    // --- Hint Modal Logic (PRD Section 11 & FR-09) ---
    openHintModal() {
        if (!this.hintModal) return;
        const hints = this.engine.levelData.hints || [];
        const container = document.getElementById('hint-content-list');
        container.innerHTML = '';

        if (window.soundEngine) window.soundEngine.playHint();

        hints.forEach((hintText, idx) => {
            const tierNum = idx + 1;
            const isUnlocked = this.engine.hintLevelUsed >= tierNum;
            const hintCard = document.createElement('div');
            hintCard.className = `hint-card hint-tier-${tierNum} ${isUnlocked ? 'unlocked' : 'locked'}`;

            hintCard.innerHTML = `
                <div class="hint-header">
                    <span class="hint-badge">Petunjuk Tahap ${tierNum}</span>
                    ${tierNum === 3 ? '<span class="hint-warning">⚠️ Menggunakan petunjuk ini membatasi bintang 3</span>' : ''}
                </div>
                <div class="hint-body">
                    ${isUnlocked ? `<p class="hint-text">${hintText}</p>` : `
                        <button class="btn-unlock-hint" data-tier="${tierNum}">
                            🔓 Buka Petunjuk Tahap ${tierNum}
                        </button>
                    `}
                </div>
            `;
            container.appendChild(hintCard);
        });

        // Wire unlock buttons
        container.querySelectorAll('.btn-unlock-hint').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tier = parseInt(e.target.dataset.tier);
                this.engine.hintLevelUsed = Math.max(this.engine.hintLevelUsed, tier);
                if (window.soundEngine) window.soundEngine.playHint();
                this.openHintModal(); // refresh view
            });
        });

        this.hintModal.classList.remove('hidden');
    }

    // --- Level Select Modal ---
    openLevelSelectModal() {
        if (!this.levelSelectModal) return;
        const grid = document.getElementById('level-cards-grid');
        grid.innerHTML = '';

        const prog = this.getProgress();

        window.GAME_LEVELS.forEach((lvl, idx) => {
            const isUnlocked = lvl.id <= prog.unlockedLevel;
            const isCurrent = idx === this.engine.currentLevelIndex;
            const stars = prog.stars[lvl.id] || 0;

            const card = document.createElement('div');
            card.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`;

            let starsHtml = '';
            for (let s = 1; s <= 3; s++) {
                starsHtml += `<span class="card-star ${s <= stars ? 'active' : ''}">★</span>`;
            }

            card.innerHTML = `
                <div class="level-num-pill">${lvl.id}</div>
                <div class="level-info">
                    <h4 class="level-card-title">${lvl.title.replace(`Level ${lvl.id}: `, '')}</h4>
                    <span class="level-card-concept">${lvl.concept}</span>
                </div>
                <div class="level-card-stars">${isUnlocked ? starsHtml : '🔒 Terkunci'}</div>
            `;

            if (isUnlocked) {
                card.addEventListener('click', () => {
                    this.levelSelectModal.classList.add('hidden');
                    this.loadLevel(idx);
                    if (window.soundEngine) window.soundEngine.playClick();
                });
            }

            grid.appendChild(card);
        });

        this.levelSelectModal.classList.remove('hidden');
    }

    // --- Win Modal (PRD Section 11, FR-06, FR-10) ---
    showWinModal(data) {
        if (!this.winModal) return;
        const { stars, totalBlocks, stepCount, optimalBlocks, ecoCard } = data;

        // Save progress to localStorage
        this.saveLevelWin(this.engine.levelData.id, stars);

        // Render Stars
        const starContainer = document.getElementById('win-stars-container');
        starContainer.innerHTML = '';
        for (let i = 1; i <= 3; i++) {
            const sSpan = document.createElement('span');
            sSpan.className = `win-star ${i <= stars ? 'earned' : 'missed'}`;
            sSpan.textContent = '★';
            starContainer.appendChild(sSpan);

            // Staggered star animation SFX
            if (i <= stars) {
                setTimeout(() => {
                    if (window.soundEngine) window.soundEngine.playStar(i);
                }, i * 250);
            }
        }

        // Stats
        document.getElementById('win-blocks-stat').textContent = `${totalBlocks} blok (Solusi target: ${optimalBlocks})`;
        document.getElementById('win-steps-stat').textContent = `${stepCount} langkah animasi`;

        // Eco Education Card
        const ecoBox = document.getElementById('win-eco-card');
        if (ecoCard) {
            ecoBox.innerHTML = `
                <div class="eco-badge-header">
                    <span class="eco-tag ${ecoCard.category.includes('Organik') ? 'tag-org' : 'tag-inorg'}">${ecoCard.category}</span>
                    <span class="eco-decomp">⏱️ Waktu Urai: <strong>${ecoCard.decompTime}</strong></span>
                </div>
                <h4 class="eco-card-title">${ecoCard.title}</h4>
                <p class="eco-card-fact">${ecoCard.fact}</p>
                <div class="eco-card-tip">
                    <span class="tip-icon">💡</span>
                    <span class="tip-text"><strong>Tips EcoCoder:</strong> ${ecoCard.tip}</span>
                </div>
            `;
        }

        // Action Buttons
        const btnNext = document.getElementById('btn-win-next-level');
        const hasNext = this.engine.currentLevelIndex < window.GAME_LEVELS.length - 1;
        if (hasNext) {
            btnNext.style.display = 'inline-flex';
            btnNext.onclick = () => {
                this.winModal.classList.add('hidden');
                this.loadLevel(this.engine.currentLevelIndex + 1);
            };
        } else {
            btnNext.style.display = 'none';
        }

        document.getElementById('btn-win-replay').onclick = () => {
            this.winModal.classList.add('hidden');
            this.engine.resetLevel();
        };

        document.getElementById('btn-win-levels').onclick = () => {
            this.winModal.classList.add('hidden');
            this.openLevelSelectModal();
        };

        this.winModal.classList.remove('hidden');
    }

    // --- Fail Modal (PRD Section 9.4) ---
    showFailModal(message) {
        if (!this.failModal) return;
        document.getElementById('fail-message-text').textContent = message;

        document.getElementById('btn-fail-retry').onclick = () => {
            this.failModal.classList.add('hidden');
            this.engine.resetLevel();
        };

        document.getElementById('btn-fail-hint').onclick = () => {
            this.failModal.classList.add('hidden');
            this.openHintModal();
        };

        this.failModal.classList.remove('hidden');
    }
}

window.UIManager = UIManager;
