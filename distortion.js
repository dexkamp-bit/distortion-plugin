// Distortion Plugin - Web Audio API Implementation
class DistortionPlugin {
    constructor() {
        this.audioContext = null;
        this.sourceNode = null;
        this.distortionNode = null;
        this.dryGain = null;
        this.wetGain = null;
        this.masterGain = null;
        this.analyser = null;
        this.isPlaying = false;
        this.audioBuffer = null;
        this.currentSource = null;

        // Plugin parameters
        this.drive = 50;
        this.tone = 50;
        this.distortionType = 'soft';
        this.isActive = true;

        this.initAudioContext();
        this.setupUI();
        this.setupWaveShaper();
    }

    initAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.dryGain = this.audioContext.createGain();
        this.wetGain = this.audioContext.createGain();
        this.masterGain = this.audioContext.createGain();
        this.analyser = this.audioContext.createAnalyser();
        
        this.distortionNode = this.audioContext.createWaveShaper();

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        
        this.updateMasterVolume();
    }

    setupWaveShaper() {
        this.makeDistortionCurve(50);
    }

    makeDistortionCurve(amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);

        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            let y;

            if (this.distortionType === 'soft') {
                y = Math.tanh(x * (amount / 50));
            } else if (this.distortionType === 'hard') {
                const drive = amount / 50;
                y = Math.max(-1, Math.min(1, x * drive));
            } else if (this.distortionType === 'raw') {
                const drive = amount / 50;
                const bitDepth = 8 - (amount / 100) * 4;
                const bits = Math.pow(2, bitDepth);
                y = Math.round(x * drive * bits) / bits;
            }

            curve[i] = y;
        }

        this.distortionNode.curve = curve;
    }

    connectAudio(source) {
        if (this.currentSource) {
            try {
                this.currentSource.disconnect();
            } catch (e) {}
        }

        this.currentSource = source;

        source.connect(this.dryGain);
        this.dryGain.connect(this.masterGain);

        source.connect(this.distortionNode);
        this.distortionNode.connect(this.wetGain);
        this.wetGain.connect(this.masterGain);
    }

    setupUI() {
        document.getElementById('drive').addEventListener('input', (e) => {
            this.drive = parseInt(e.target.value);
            this.makeDistortionCurve(this.drive);
        });

        document.getElementById('tone').addEventListener('input', (e) => {
            this.tone = parseInt(e.target.value);
        });

        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.distortionType = e.target.dataset.type;
                this.makeDistortionCurve(this.drive);
            });
        });
    }

    updateMasterVolume() {
        this.masterGain.gain.value = 0.8;
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    window.distortionPlugin = new DistortionPlugin();
});