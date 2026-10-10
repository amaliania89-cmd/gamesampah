/**
 * EcoCoder Quest - Main Entry Point
 */

document.addEventListener('DOMContentLoaded', () => {
    const engine = window.gameEngine;
    const ui = new window.UIManager(engine);

    // Audio unlock on user's first click anywhere on page
    const unlockAudio = () => {
        if (window.soundEngine) {
            window.soundEngine.ensureContext();
            if (!window.soundEngine.isMuted && !window.soundEngine.bgmPlaying) {
                window.soundEngine.startBGM();
            }
        }
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    // Load first level or highest unlocked level
    const prog = ui.getProgress();
    const targetLevelId = Math.min(prog.unlockedLevel || 1, window.GAME_LEVELS.length);
    ui.loadLevel(targetLevelId - 1);

    console.log("EcoCoder Quest initialized successfully! 🌿🤖");
});
