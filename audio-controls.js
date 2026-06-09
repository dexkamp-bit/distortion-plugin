// Main Audio Controls - FIXED VERSION
let globalAudioContext = null;
let globalAudioBuffer = null;
let globalCurrentSource = null;
let globalIsPlaying = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Audio controls initializing...');\n
    const loadBtn = document.getElementById('loadAudioBtn');
    const audioInput = document.getElementById('audioInput');
    const playBtn = document.getElementById('playBtn');
    const stopBtn = document.getElementById('stopBtn');

    if (!loadBtn) {\n        console.error('Load button not found!');\n        return;
    }

    // Load button click
    loadBtn.addEventListener('click', (e) => {
        console.log('Load button clicked');
        e.preventDefault();
        audioInput.click();
    });

    // Audio input change
    audioInput.addEventListener('change', (e) => {
        console.log('File selected:', e.target.files[0]);
        const file = e.target.files[0];
        if (!file) return;

        // Create audio context if needed
        if (!globalAudioContext) {
            globalAudioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Audio context created');
        }

        const reader = new FileReader();
        
        reader.onerror = () => {
            console.error('FileReader error:', reader.error);
            alert('Error reading file!');\n        };

        reader.onload = (event) => {
            console.log('File loaded, decoding...');
            globalAudioContext.decodeAudioData(
                event.target.result,
                (buffer) => {
                    globalAudioBuffer = buffer;
                    console.log('✅ Audio decoded successfully:', buffer.duration, 'seconds');
                    alert('✅ Audio loaded! Duration: ' + buffer.duration.toFixed(2) + ' seconds');\n                },
                (error) => {
                    console.error('Decode error:', error);
                    alert('❌ Error decoding audio: ' + error.message);\n                }
            );
        };

        reader.readAsArrayBuffer(file);
    });

    // Play button
    playBtn.addEventListener('click', () => {
        console.log('Play button clicked, isPlaying:', globalIsPlaying);
        if (globalIsPlaying) {
            stopAudio();
        } else {
            playAudio();
        }
    });

    // Stop button
    stopBtn.addEventListener('click', () => {
        console.log('Stop button clicked');
        stopAudio();
    });
});

function playAudio() {
    console.log('playAudio called');

    if (!globalAudioBuffer) {
        alert('❌ No audio file loaded! Click LOAD first.');
        return;
    }

    if (!globalAudioContext) {
        alert('❌ Audio context not initialized!');\n        return;
    }

    if (globalAudioContext.state === 'suspended') {
        globalAudioContext.resume();
    }

    try {
        const source = globalAudioContext.createBufferSource();
        source.buffer = globalAudioBuffer;

        // Connect to master output
        if (window.distortionPlugin && window.distortionPlugin.masterGain) {
            source.connect(window.distortionPlugin.masterGain);
        } else {
            source.connect(globalAudioContext.destination);
        }

        source.start(0);

        globalIsPlaying = true;
        globalCurrentSource = source;
        document.getElementById('playBtn').classList.add('playing');
        document.getElementById('playBtn').textContent = '⏸ PAUSE';

        source.onended = stopAudio;
        console.log('✅ Audio playing...');
    } catch (error) {
        console.error('Play error:', error);
        alert('❌ Error playing audio: ' + error.message);\n    }
}

function stopAudio() {
    console.log('stopAudio called');

    if (globalCurrentSource && globalIsPlaying) {
        try {
            globalCurrentSource.stop();
        } catch (e) {
            console.error('Stop error:', e);
        }
    }

    globalIsPlaying = false;
    document.getElementById('playBtn').classList.remove('playing');
    document.getElementById('playBtn').textContent = '▶ PLAY';
    console.log('✅ Audio stopped');
}