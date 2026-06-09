// Kick FX Plugin
class KickFXPlugin {
    constructor(distortionPlugin) {
        this.distortionPlugin = distortionPlugin;
        this.audioContext = distortionPlugin.audioContext;
        this.osc = null;
        this.oscGain = null;
        this.isPlaying = false;

        this.pitch = 60;
        this.decay = 500;
        this.volume = 0.8;

        this.setupUI();
    }

    setupUI() {
        document.getElementById('kickTrigger').addEventListener('click', () => {
            this.triggerKick();
        });

        document.getElementById('kickReset').addEventListener('click', () => {
            document.getElementById('kickPitch').value = 60;
            document.getElementById('kickDecay').value = 500;
            document.getElementById('kickVolume').value = 80;
            document.getElementById('pitchValue').textContent = '60';
            document.getElementById('decayValue').textContent = '500';
            document.getElementById('volumeValue').textContent = '80';
        });

        document.getElementById('kickPitch').addEventListener('input', (e) => {
            this.pitch = parseInt(e.target.value);
        });

        document.getElementById('kickDecay').addEventListener('input', (e) => {
            this.decay = parseInt(e.target.value);
        });

        document.getElementById('kickVolume').addEventListener('input', (e) => {
            this.volume = parseInt(e.target.value) / 100;
        });
    }

    triggerKick() {
        const now = this.audioContext.currentTime;
        
        // Create oscillator
        this.osc = this.audioContext.createOscillator();
        this.osc.type = 'sine';
        this.osc.frequency.setValueAtTime(this.pitch, now);
        this.osc.frequency.exponentialRampToValueAtTime(0.01, now + this.decay / 1000);

        // Create gain
        this.oscGain = this.audioContext.createGain();
        this.oscGain.gain.setValueAtTime(this.volume, now);
        this.oscGain.gain.exponentialRampToValueAtTime(0.01, now + this.decay / 1000);

        // Connect
        this.osc.connect(this.oscGain);
        this.oscGain.connect(this.distortionPlugin.masterGain);

        // Play
        this.osc.start(now);
        this.osc.stop(now + this.decay / 1000);

        // Visual feedback
        const btn = document.getElementById('kickTrigger');
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), this.decay);
    }
}

window.addEventListener('load', () => {
    setTimeout(() => {
        if (window.distortionPlugin) {
            window.kickPlugin = new KickFXPlugin(window.distortionPlugin);
        }
    }, 100);
});