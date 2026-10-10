/**
 * EcoCoder Quest - Audio Engine
 * Uses Web Audio API for zero-dependency, ultra-lightweight SFX and procedural BGM.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = localStorage.getItem('ecocoder_muted') === 'true';
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.initAudioContext();
    }

    initAudioContext() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx && !this.ctx) {
            this.ctx = new AudioCtx();
        }
    }

    ensureContext() {
        this.initAudioContext();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('ecocoder_muted', this.isMuted.toString());
        if (this.isMuted) {
            this.stopBGM();
        } else {
            this.startBGM();
        }
        return this.isMuted;
    }

    // --- SFX Generators ---

    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.15) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playStep() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        // Soft cheerful step pop
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.08);
    }

    playTurn() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.09);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.09);
    }

    playPickup() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Two sparkling notes (E5 -> G5)
        [659.25, 783.99].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.06);

            gain.gain.setValueAtTime(0.18, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.16);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.16);
        });
    }

    playDrop() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Chime chord (C5 -> E5 -> G5 -> C6)
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.05);

            gain.gain.setValueAtTime(0.15, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.25);
        });
    }

    playError() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.25);
    }

    playWin() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Major fanfare: C5, E5, G5, C6 (sustained)
        const notes = [
            { f: 523.25, t: 0, d: 0.12 },
            { f: 659.25, t: 0.12, d: 0.12 },
            { f: 783.99, t: 0.24, d: 0.15 },
            { f: 1046.50, t: 0.40, d: 0.6 }
        ];

        notes.forEach(({ f, t, d }) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + t);

            gain.gain.setValueAtTime(0.2, now + t);
            gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + t);
            osc.stop(now + t + d);
        });
    }

    playClick() {
        this.playTone(600, 'sine', 0.04, 0.06);
    }

    playHint() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [880, 1174.66].forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.08);

            gain.gain.setValueAtTime(0.1, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.2);
        });
    }

    playStar(index = 1) {
        const freqs = [523.25, 659.25, 783.99];
        const f = freqs[Math.min(index - 1, 2)];
        this.playTone(f, 'triangle', 0.2, 0.18);
    }

    // --- Procedural Cheerful BGM ---
    startBGM() {
        if (this.isMuted || this.bgmPlaying) return;
        this.ensureContext();
        if (!this.ctx) return;

        this.bgmPlaying = true;
        this.scheduleNextBgmLoop();
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    scheduleNextBgmLoop() {
        if (!this.bgmPlaying || this.isMuted || !this.ctx) return;

        // Cute sunny 8-bar loop notes (C major pentatonic / upbeat anime vibe)
        const melody = [
            { f: 523.25, d: 0.25 }, { f: 587.33, d: 0.25 }, { f: 659.25, d: 0.5 },
            { f: 783.99, d: 0.25 }, { f: 659.25, d: 0.25 }, { f: 523.25, d: 0.5 },
            { f: 587.33, d: 0.25 }, { f: 659.25, d: 0.25 }, { f: 587.33, d: 0.25 }, { f: 523.25, d: 0.25 },
            { f: 440.00, d: 0.5 },  { f: 523.25, d: 0.75 }
        ];

        let cursor = 0;
        const now = this.ctx.currentTime + 0.05;

        melody.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.f, now + cursor);

            // Very gentle and low background level
            gain.gain.setValueAtTime(0.025, now + cursor);
            gain.gain.exponentialRampToValueAtTime(0.0005, now + cursor + note.d * 0.9);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + cursor);
            osc.stop(now + cursor + note.d);

            cursor += note.d;
        });

        // Loop after melody duration + slight pause
        const totalDurationMs = (cursor + 1.2) * 1000;
        this.bgmTimer = setTimeout(() => {
            if (this.bgmPlaying) {
                this.scheduleNextBgmLoop();
            }
        }, totalDurationMs);
    }
}

// Global sound manager instance
window.soundEngine = new SoundEngine();
