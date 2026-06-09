// Handle knob rotations based on slider input
document.addEventListener('DOMContentLoaded', () => {
    const sliders = [
        { id: 'drive', knobId: 'driveKnob', valueId: 'driveValue' },
        { id: 'tone', knobId: 'toneKnob', valueId: 'toneValue' },
        { id: 'output', knobId: 'outputKnob', valueId: 'outputValue' },
        { id: 'master', knobId: 'masterKnob', valueId: 'masterValue' }
    ];

    sliders.forEach(slider => {
        const input = document.getElementById(slider.id);
        const knob = document.getElementById(slider.knobId);
        const pointer = knob.querySelector('.knob-pointer');
        const valueDisplay = document.getElementById(slider.valueId);

        // Update knob rotation on input
        input.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            const rotation = (value / 100) * 270 - 135; // -135 to 135 degrees
            pointer.style.transform = `rotate(${rotation}deg)`;
            valueDisplay.textContent = value;
        });

        // Click on knob to rotate
        knob.addEventListener('mousedown', (e) => {
            const rect = knob.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const handleMouseMove = (moveE) => {
                const dx = moveE.clientX - centerX;
                const dy = moveE.clientY - centerY;
                let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

                // Constrain to -135 to 135 degrees
                angle = Math.max(-135, Math.min(135, angle));

                // Convert angle back to value (0-100)
                const value = Math.round((angle + 135) / 270 * 100);
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

        // Initialize knob position
        const initialValue = parseInt(input.value);
        const initialRotation = (initialValue / 100) * 270 - 135;
        pointer.style.transform = `rotate(${initialRotation}deg)`;
    });
});