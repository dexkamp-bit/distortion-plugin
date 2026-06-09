# ⚡ Hardstyle Distortion Plugin

A browser-based hardware-style audio distortion plugin built with **Web Audio API**, featuring authentic hardware knobs and distortion algorithms.

## Features

### 🎚️ Hardware Controls
- **4 Interactive Knobs**: DRIVE, TONE, MIX, POST
- **Analog-style Design**: Realistic knob rotation and visual feedback
- **Real-time Control**: Adjust parameters while playing audio

### 🔊 Distortion Types
- **SOFT** - Smooth tanh-based clipping for warm distortion
- **HARD** - Hard clipping for aggressive, digital sound
- **RAW** - Bit-crushing + distortion for authentic hardstyle/rawstyle

### 🎯 Additional Features
- ✅ Interactive rotating knobs (drag or click)
- ✅ LED clipping indicator
- ✅ Power button (bypass effect)
- ✅ Reset to defaults
- ✅ Load and play audio files
- ✅ Responsive hardware-style design
- ✅ Hardware-inspired color scheme (dark grays + orange accents)

## How to Use

1. **Load Audio**: Click "LOAD" and select an audio file
2. **Adjust Knobs**: Drag or click the knobs to rotate them
   - **DRIVE**: Amount of distortion
   - **TONE**: High-frequency content (low = darker, high = brighter)
   - **MIX**: Dry/Wet balance
   - **POST**: Master output level
3. **Select Type**: Choose between SOFT, HARD, or RAW distortion
4. **Play**: Click "PLAY" to hear your effect
5. **Monitor**: Watch the CLIP indicator for audio clipping

## Installation

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies needed!

## Technical Details

- **Technology**: Web Audio API with vanilla JavaScript
- **Audio Nodes**:
  - WaveShaper for distortion curves
  - BiquadFilter for tone control
  - GainNodes for mixing
  - AnalyserNode for clipping detection

- **Browser Support**: Chrome, Firefox, Safari 12+, Edge
- **Audio Formats**: MP3, WAV, OGG, FLAC (browser dependent)

## Distortion Algorithms

### Soft Clipping
Uses hyperbolic tangent function for smooth, warm distortion. Great for adding thickness and sustain.

### Hard Clipping
Pure peak clipping - cuts off audio peaks for aggressive, digital sound. Classic digital distortion.

### Raw (Rawstyle)
Combines bit-crushing with distortion for authentic rawstyle hardstyle characteristics. Perfect for kicks and basses.

## Tips for Best Results

- **Subtle Effects**: Keep DRIVE 30-50 and MIX around 50-70
- **Aggressive Sound**: DRIVE 70-100 with RAW or HARD type
- **Tone Shaping**: Lower TONE (30-40) for darker sound, higher (70-90) for brightness
- **Output Management**: Use POST to compensate for volume increase from distortion

## Browser Compatibility

| Browser | Support |
|---------|----------|
| Chrome  | ✅       |
| Firefox | ✅       |
| Safari  | ✅ 12+   |
| Edge    | ✅       |

## License

MIT - Feel free to use and modify!

## Made for 🎵
Hardstyle & Rawstyle producers who want authentic audio processing tools!
