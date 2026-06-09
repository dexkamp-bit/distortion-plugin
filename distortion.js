// Distortion Plugin - Web Audio API Implementation
class DistortionPlugin {
    constructor() {
        this.audioContext = null;
        this.sourceNode = null;
        this.distortionNode = null;
        this.toneNode = null;
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
        this.output = 70;
        this.master = 80;
        this.distortionType = 'soft';
        this.isActive = true;

        this.initAudioContext();
        this.setupUI();
        this.setupWaveShaper();
    }

    initAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create nodes
        this.dryGain = this.audioContext.createGain();
        this.wetGain = this.audioContext.createGain();
        this.masterGain = this.audioContext.createGain();
        this.analyser = this.audioContext.createAnalyser();
        
        // Create distortion (wave shaper)
        this.distortionNode = this.audioContext.createWaveShaper();
        
        // Create tone control (low-pass filter)
        this.toneNode = this.audioContext.createBiquadFilter();
        this.toneNode.type = 'lowpass';
        this.toneNode.frequency.value = 4000;
        this.toneNode.Q.value = 1;

        // Connect the chain
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        
        // Set initial levels
        this.updateMasterVolume();
    }

    setupWaveShaper() {
        this.makeDistortionCurve(50);
    }

    makeDistortionCurve(amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);
        const deg = Math.PI / 180;

        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            let y;

            if (this.distortionType === 'soft') {
                // Soft clipping using tanh
                y = Math.tanh(x * (amount / 50));
            } else if (this.distortionType === 'hard') {
                // Hard clipping
                const drive = amount / 50;
                y = Math.max(-1, Math.min(1, x * drive));
            } else if (this.distortionType === 'raw') {
                // Raw bit crushing + distortion (hardstyle style)
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
        // Disconnect previous connections
        if (this.currentSource) {
            try {
                this.currentSource.disconnect();
            } catch (e) {}
        }

        this.currentSource = source;

        // Connect: Source -> Dry Path
        source.connect(this.dryGain);
        this.dryGain.connect(this.masterGain);

        // Connect: Source -> Distortion -> Tone -> Wet Path
        source.connect(this.distortionNode);
        this.distortionNode.connect(this.toneNode);
        this.toneNode.connect(this.wetGain);
        this.wetGain.connect(this.masterGain);

        // Update mix based on output level
        this.updateOutputLevel();
    }

    setupUI() {
        // Drive slider
        document.getElementById('drive').addEventListener('input', (e) => {
            this.drive = parseInt(e.target.value);
            document.getElementById('driveValue').textContent = this.drive;
            this.makeDistortionCurve(this.drive);
            this.checkClipping();
        });

        // Tone slider
        document.getElementById('tone').addEventListener('input', (e) => {
            this.tone = parseInt(e.target.value);
            document.getElementById('toneValue').textContent = this.tone;
            // Map tone to frequency (500 Hz - 8000 Hz)
            const freq = 500 + (this.tone / 100) * 7500;
            this.toneNode.frequency.value = freq;
        });

        // Output slider
        document.getElementById('output').addEventListener('input', (e) => {
            this.output = parseInt(e.target.value);
            document.getElementById('outputValue').textContent = this.output;
            this.updateOutputLevel();
        });

        // Master volume slider
        document.getElementById('master').addEventListener('input', (e) => {
            this.master = parseInt(e.target.value);
            document.getElementById('masterValue').textContent = this.master;
            this.updateMasterVolume();
        });

        // Distortion type buttons
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.distortionType = e.target.dataset.type;
                this.makeDistortionCurve(this.drive);
            });
        });

        // Power button
        document.getElementById('powerBtn').addEventListener('click', (e) => {
            this.isActive = !this.isActive;
            e.target.classList.toggle('active');
            
            if (!this.isActive) {
                // Bypass distortion - only use dry signal
                this.wetGain.gain.value = 0;
                this.dryGain.gain.value = 1;
            } else {
                this.updateOutputLevel();
            }
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            document.getElementById('drive').value = 50;
            document.getElementById('tone').value = 50;
            document.getElementById('output').value = 70;
            document.getElementById('master').value = 80;
            document.getElementById('driveValue').textContent = '50';
            document.getElementById('toneValue').textContent = '50';
            document.getElementById('outputValue').textContent = '70';
            document.getElementById('masterValue').textContent = '80';
            
            this.drive = 50;
            this.tone = 50;
            this.output = 70;
            this.master = 80;
            this.toneNode.frequency.value = 4000;
            
            this.makeDistortionCurve(this.drive);
            this.updateMasterVolume();
            this.updateOutputLevel();
        });

        // Load audio button
        document.getElementById('loadAudioBtn').addEventListener('click', () => {
            document.getElementById('audioInput').click();
        });

        document.getElementById('audioInput').addEventListener('change', (e) => {
            this.loadAudioFile(e.target.files[0]);
        });

        // Play button
        document.getElementById('playBtn').addEventListener('click', () => {
            if (this.isPlaying) {
                this.stop();
            } else {
                this.play();
            }
        });

        // Stop button
        document.getElementById('stopBtn').addEventListener('click', () => {
            this.stop();
        });

        // Start clipping detection
        this.startClippingDetection();
    }

    loadAudioFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.audioContext.decodeAudioData(e.target.result, (buffer) => {
                this.audioBuffer = buffer;
                console.log('Audio loaded:', buffer.duration, 'seconds');
            });
        };
        reader.readAsArrayBuffer(file);
    }

    play() {
        if (!this.audioBuffer) {
            alert('No audio file loaded!');
            return;
        }

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = this.audioBuffer;
        
        this.connectAudio(source);
        source.start(0);
        
        this.isPlaying = true;
        document.getElementById('playBtn').classList.add('playing');
        document.getElementById('playBtn').textContent = 'PAUSE';

        source.onended = () => {
            this.stop();
        };

        this.currentSource = source;
    }

    stop() {
        if (this.currentSource && this.isPlaying) {
            try {
                this.currentSource.stop();
            } catch (e) {}
        }
        
        this.isPlaying = false;
        document.getElementById('playBtn').classList.remove('playing');
        document.getElementById('playBtn').textContent = 'PLAY';
        document.getElementById('clippingLed').classList.remove('active');
    }

    updateOutputLevel() {
        // Map output level to dry/wet mix
        const outputFraction = this.output / 100;
        this.wetGain.gain.value = outputFraction;
        this.dryGain.gain.value = 1 - outputFraction;
    }

    updateMasterVolume() {
        const masterFraction = this.master / 100;
        this.masterGain.gain.value = masterFraction;
    }

    startClippingDetection() {
        const checkClipping = () => {
            const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(dataArray);

            // Check if signal is clipping
            const isClipping = dataArray.some(value => value > 250);
            const led = document.getElementById('clippingLed');
            
            if (isClipping) {
                led.classList.add('active');
            } else {
                led.classList.remove('active');
            }

            requestAnimationFrame(checkClipping);
        };

        checkClipping();
    }

    checkClipping() {
        // Visual feedback when high drive is set
        if (this.drive > 80) {
            document.getElementById('clippingLed').classList.add('active');
            setTimeout(() => {
                document.getElementById('clippingLed').classList.remove('active');
            }, 100);
        }
    }
}

// Initialize plugin when page loads
window.addEventListener('load', () => {
    new DistortionPlugin();
});
