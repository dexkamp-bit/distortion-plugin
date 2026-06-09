// Handle knob rotations based on slider input
document.addEventListener('DOMContentLoaded', () => {
    const sliders = [
        // Distortion
        { id: 'drive', knobId: 'driveKnob', valueId: 'driveValue', min: 0, max: 100 },
        { id: 'tone', knobId: 'toneKnob', valueId: 'toneValue', min: 0, max: 100 },
        // Filter
        { id: 'filterFreq', knobId: 'freqKnob', valueId: 'freqValue', min: 20, max: 20000 },
        { id: 'filterRes', knobId: 'resonanceKnob', valueId: 'resValue', min: 0, max: 40 },
        // Kick
        { id: 'kickPitch', knobId: 'pitchKnob', valueId: 'pitchValue', min: 20, max: 200 },
        { id: 'kickDecay', knobId: 'decayKnob', valueId: 'decayValue', min: 10, max: 2000 },
        { id: 'kickVolume', knobId: 'volumeKnob', valueId: 'volumeValue', min: 0, max: 100 }
    ];

    sliders.forEach(slider => {
        const input = document.getElementById(slider.id);
        if (!input) return;
        
        const knobElement = document.getElementById(slider.knobId);
        const pointer = knobElement.querySelector('.knob-pointer');
        const valueDisplay = document.getElementById(slider.valueId);

        // Update knob rotation on input
        input.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            const normalized = (value - slider.min) / (slider.max - slider.min);
            const rotation = normalized * 270 - 135;
            pointer.style.transform = `rotate(${rotation}deg)`;
            valueDisplay.textContent = value;
        });

        // Click and drag on knob
        knobElement.addEventListener('mousedown', (e) => {
            const rect = knobElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const handleMouseMove = (moveE) => {
                const dx = moveE.clientX - centerX;
                const dy = moveE.clientY - centerY;
                let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

                angle = Math.max(-135, Math.min(135, angle));

                const normalized = (angle + 135) / 270;
                const value = Math.round(slider.min + normalized * (slider.max - slider.min));
                input.value = value;
                input.dispatchEvent(new Event('input'));
            };

            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        // Initialize
        const initialValue = parseInt(input.value);
        const initialNormalized = (initialValue - slider.min) / (slider.max - slider.min);
        const initialRotation = initialNormalized * 270 - 135;
        pointer.style.transform = `rotate(${initialRotation}deg)`;
    });
});