import { SOUND_PROFILES } from "./data.js";

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.reverbImpulse = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.reverbImpulse = this.#createReverbImpulse(2.5);
    }
  }

  unlock() {
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  }

  #createReverbImpulse(decay = 2.0) {
    const sr = this.ctx.sampleRate;
    const len = Math.floor(sr * decay);
    const buf = this.ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 5);
      }
    }
    return buf;
  }

  #createWetDryChain(mix = 0.3) {
    const dryGain = this.ctx.createGain();
    dryGain.gain.value = 1;
    const conv = this.ctx.createConvolver();
    conv.buffer = this.reverbImpulse || this.#createReverbImpulse(2.0);
    conv.normalize = true;
    const wetGain = this.ctx.createGain();
    wetGain.gain.value = mix;
    conv.connect(wetGain);
    dryGain.connect(this.ctx.destination);
    wetGain.connect(this.ctx.destination);
    return { conv, dryGain, wetGain };
  }

  #createSoftClipper(amount = 0) {
    if (amount <= 0) return null;
    const ws = this.ctx.createWaveShaper();
    const k = amount * 100;
    const samples = 256;
    const curve = new Float32Array(samples);
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
    }
    ws.curve = curve;
    ws.oversample = "4x";
    return ws;
  }

  #getProfile(style) {
    return SOUND_PROFILES[style] || SOUND_PROFILES.water;
  }

  playChime(style) {
    try {
      this.init();
      if (this.ctx.state === "suspended") return;
      const p = this.#getProfile(style);
      const now = this.ctx.currentTime;
      const dur = 0.4;

      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.028, now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      const { dryGain, conv } = this.#createWetDryChain(p.reverbMix * 0.4);
      master.connect(dryGain);
      master.connect(conv);

      const panner = this.ctx.createStereoPanner();
      dryGain.connect(panner);
      panner.connect(this.ctx.destination);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.value = p.chimeLFORate;
      lfoGain.gain.value = p.chimeLFODepth * 0.003;
      lfo.connect(lfoGain);
      lfo.start(now);
      lfo.stop(now + dur);

      p.accent.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = p.chimeOscTypes[index];
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(
          freq * 0.65, now + 0.2 + index * 0.03,
        );
        if (index === 0) lfoGain.connect(osc.frequency);
        g.gain.setValueAtTime(index === 0 ? 0.7 : 0.28, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.28 + index * 0.04);

        const oscPanner = this.ctx.createStereoPanner();
        oscPanner.pan.setValueAtTime((index - 1) * p.stereoWidth * 0.35, now);

        osc.connect(g);
        g.connect(oscPanner);
        oscPanner.connect(master);
        osc.start(now + index * 0.018);
        osc.stop(now + dur + index * 0.04);
      });
    } catch {}
  }

  playDrawSound(style) {
    try {
      this.init();
      if (this.ctx.state === "suspended") return;
      const p = this.#getProfile(style);
      const now = this.ctx.currentTime;

      if (p.preBreath) {
        const bSize = Math.floor(this.ctx.sampleRate * p.breathDuration);
        const bBuf = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
        const bData = bBuf.getChannelData(0);
        for (let i = 0; i < bSize; i++) {
          bData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bSize, 2);
        }
        const bNoise = this.ctx.createBufferSource();
        bNoise.buffer = bBuf;
        const bFilter = this.ctx.createBiquadFilter();
        bFilter.type = "bandpass";
        bFilter.frequency.value = p.breathFreq;
        bFilter.Q.value = 2;
        const bGain = this.ctx.createGain();
        bGain.gain.setValueAtTime(0.015, now);
        bGain.gain.exponentialRampToValueAtTime(0.0001, now + p.breathDuration);
        bNoise.connect(bFilter);
        bFilter.connect(bGain);
        bGain.connect(this.ctx.destination);
        bNoise.start(now);
      }

      const drawStart = now + (p.preBreath ? p.breathDuration * 0.7 : 0);
      const bufSize = Math.floor(this.ctx.sampleRate * p.drawDecay);
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2.5);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = p.drawNoiseColor;
      filter.frequency.setValueAtTime(p.drawNoiseFreq * 3, drawStart);
      filter.frequency.exponentialRampToValueAtTime(
        p.drawNoiseFreq, drawStart + p.drawDecay * 0.8,
      );
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06, drawStart);
      noiseGain.gain.linearRampToValueAtTime(0, drawStart + p.drawDecay);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(drawStart);

      const metallic = this.ctx.createOscillator();
      metallic.type = p.drawOscType;
      metallic.frequency.setValueAtTime(p.drawFreqStart, drawStart);
      metallic.frequency.exponentialRampToValueAtTime(
        p.drawFreqEnd, drawStart + p.drawDecay * 0.5,
      );
      const metalGain = this.ctx.createGain();
      metalGain.gain.setValueAtTime(0.025, drawStart);
      metalGain.gain.exponentialRampToValueAtTime(0.0001, drawStart + p.drawDecay);

      const metalPanner = this.ctx.createStereoPanner();
      metalPanner.pan.setValueAtTime(p.stereoWidth * 0.5, drawStart);
      metallic.connect(metalGain);
      metalGain.connect(metalPanner);

      const { dryGain: mDry, conv: mConv } = this.#createWetDryChain(p.reverbMix * 0.3);
      metalPanner.connect(mDry);
      metalPanner.connect(mConv);

      metallic.start(drawStart + 0.015);
      metallic.stop(drawStart + p.drawDecay);
    } catch {}
  }

  playClashSound(style) {
    try {
      this.init();
      if (this.ctx.state === "suspended") return;
      const p = this.#getProfile(style);
      const now = this.ctx.currentTime;
      const { dryGain, conv } = this.#createWetDryChain(p.reverbMix);
      const dist = this.#createSoftClipper(p.distortion);

      const impactStart = now + 0.06;
      const impactGain = this.ctx.createGain();
      impactGain.gain.setValueAtTime(0.09, impactStart);
      impactGain.gain.linearRampToValueAtTime(0.04, impactStart + 0.12);
      impactGain.gain.exponentialRampToValueAtTime(0.0001, impactStart + 0.35);
      impactGain.connect(dryGain);
      if (dist) dist.connect(impactGain);

      p.clashFreqs.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        osc.type = p.clashOscTypes[i];
        osc.frequency.setValueAtTime(freq, impactStart);
        osc.frequency.exponentialRampToValueAtTime(
          freq * (i === 0 ? 1.8 : i === 1 ? 0.6 : 0.75),
          impactStart + 0.2,
        );
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(i === 3 ? 0.35 : 0.7, impactStart);
        g.gain.linearRampToValueAtTime(0, impactStart + 0.3);
        osc.connect(g);
        if (dist) g.connect(dist);
        else g.connect(impactGain);
        osc.start(impactStart + i * p.clashDelay);
        osc.stop(impactStart + 0.35);
      });

      const nSize = Math.floor(this.ctx.sampleRate * 0.06);
      const nBuf = this.ctx.createBuffer(1, nSize, this.ctx.sampleRate);
      const nData = nBuf.getChannelData(0);
      for (let i = 0; i < nSize; i++) {
        nData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nSize, 8);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = nBuf;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.07, impactStart + 0.01);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, impactStart + 0.1);
      noise.connect(noiseGain);
      if (dist) noiseGain.connect(dist);
      else noiseGain.connect(impactGain);
      noise.start(impactStart + 0.01);

      const ringStart = impactStart + 0.12;
      const ring = this.ctx.createOscillator();
      ring.type = "sine";
      ring.frequency.setValueAtTime(p.clashFreqs[1] * 0.3, ringStart);
      ring.frequency.exponentialRampToValueAtTime(
        p.clashFreqs[1] * 0.15, ringStart + 0.25,
      );
      const ringGain = this.ctx.createGain();
      ringGain.gain.setValueAtTime(0.03, ringStart);
      ringGain.gain.exponentialRampToValueAtTime(0.0001, ringStart + 0.35);
      ring.connect(ringGain);
      ringGain.connect(this.ctx.destination);
      ring.start(ringStart);
      ring.stop(ringStart + 0.35);

      const tailPanner = this.ctx.createStereoPanner();
      tailPanner.pan.setValueAtTime(-0.6, impactStart);
      tailPanner.pan.linearRampToValueAtTime(0.6, impactStart + 0.4);
      impactGain.connect(tailPanner);
      tailPanner.connect(conv);
    } catch {}
  }

  playSelectionImpact(style) {
    try {
      this.init();
      if (this.ctx.state === "suspended") return;
      const p = this.#getProfile(style);
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = style === "beast" ? "sawtooth" : "sine";
      osc.frequency.setValueAtTime(p.accent[1] * 1.2, now);
      osc.frequency.exponentialRampToValueAtTime(p.accent[1] * 0.5, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(p.stereoWidth * 0.3, now);

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }
}
