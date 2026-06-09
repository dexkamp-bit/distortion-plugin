// Main Audio Controls
window.addEventListener('load', () => {
    let audioContext = null;
    let audioBuffer = null;
    let currentSource = null;
    let isPlaying = false;

    document.getElementById('loadAudioBtn').addEventListener('click', () => {
        document.getElementById('audioInput').click();
    });

    document.getElementById('audioInput').addEventListener('change', (e) => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            audioContext.decodeAudioData(event.target.result, (buffer) => {
                audioBuffer = buffer;
                console.log('Audio loaded:', buffer.duration, 'seconds');
            });
        };
        reader.readAsArrayBuffer(file);
    });

    document.getElementById('playBtn').addEventListener('click', () => {
        if (!window.distortionPlugin) return;
        if (isPlaying) {
            stopAudio();
        } else {
            playAudio();
        }
    });

    document.getElementById('stopBtn').addEventListener('click', () => {
        stopAudio();
    });

    function playAudio() {
        if (!audioBuffer) {
            alert('No audio loaded!');
            return;
        }

        if (window.distortionPlugin.audioContext.state === 'suspended') {
            window.distortionPlugin.audioContext.resume();
        }

        const source = window.distortionPlugin.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        window.distortionPlugin.connectAudio(source);
        source.start(0);

        isPlaying = true;
        document.getElementById('playBtn').classList.add('playing');
        currentSource = source;

        source.onended = stopAudio;
    }

    function stopAudio() {
        if (currentSource && isPlaying) {
            try {
                currentSource.stop();
            } catch (e) {}
        }
        isPlaying = false;
        document.getElementById('playBtn').classList.remove('playing');
    }
});