class AudioServiceImpl {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.ambientOscillators = [];
    this.isMuted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContext();
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
      this.masterGain.gain.value = 0.3; // Default volume
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  playClick() {
    if (!this.initialized || this.isMuted) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + 0.05);
    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, this.context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.context.currentTime + 0.1);
  }

  playSuccess() {
    if (!this.initialized || this.isMuted) return;
    const freqs = [440, 554.37, 659.25, 880]; // A major chord arpeggio
    freqs.forEach((freq, i) => {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, this.context.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.3, this.context.currentTime + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + i * 0.1 + 0.5);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(this.context.currentTime + i * 0.1);
      osc.stop(this.context.currentTime + i * 0.1 + 0.5);
    });
  }

  startOceanAmbience() {
    if (!this.initialized || this.isMuted) return;
    this.stopOceanAmbience(); // Prevent duplicates

    const bufferSize = this.context.sampleRate * 2; // 2 seconds of noise
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1; // White noise
    }

    const whiteNoise = this.context.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    // Filter to make it sound like ocean waves (lowpass sweeping)
    const filter = this.context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400; // Deep ocean rumble

    // LFO to sweep the filter frequency (simulating waves crashing)
    const lfo = this.context.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15; // Slow wave cycle

    const lfoGain = this.context.createGain();
    lfoGain.gain.value = 600; // Frequency sweep range

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const volumeGain = this.context.createGain();
    volumeGain.gain.value = 0.1; // Keep it subtle

    whiteNoise.connect(filter);
    filter.connect(volumeGain);
    volumeGain.connect(this.masterGain);

    whiteNoise.start();
    lfo.start();

    this.ambientOscillators.push(whiteNoise, lfo);
  }

  stopOceanAmbience() {
    this.ambientOscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    this.ambientOscillators = [];
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 0.3;
    }
  }
}

export const AudioService = new AudioServiceImpl();
