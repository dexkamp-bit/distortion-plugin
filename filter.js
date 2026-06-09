// Filter Plugin
class FilterPlugin {
    constructor(distortionPlugin) {
        this.distortionPlugin = distortionPlugin;
        this.audioContext = distortionPlugin.audioContext;
        this.filterNode = this.audioContext.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.value = 8000;
        this.filterNode.Q.value = 1;

        // Connect filter in the chain
        distortionPlugin.masterGain.disconnect();
        distortionPlugin.masterGain.connect(this.filterNode);
        this.filterNode.connect(distortionPlugin.analyser);

        this.setupUI();
    }

    setupUI() {
        document.getElementById('filterFreq').addEventListener('input', (e) => {
            this.filterNode.frequency.value = parseInt(e.target.value);
        });

        document.getElementById('filterRes').addEventListener('input', (e) => {
            this.filterNode.Q.value = parseInt(e.target.value);
        });

        document.querySelectorAll('.filter-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-type-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterNode.type = e.target.dataset.mode;
            });
        });
    }
}

window.addEventListener('load', () => {
    setTimeout(() => {
        if (window.distortionPlugin) {
            window.filterPlugin = new FilterPlugin(window.distortionPlugin);
        }
    }, 100);
});