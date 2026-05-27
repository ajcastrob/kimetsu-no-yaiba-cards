/* ==========================================================================
   鬼滅の刃 // DEMON SLAYER CORPS — SYSTEM CONTROLLER
   Hazards: Canvas Particles, Web Audio, Japanese Zodiac Clock
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. CHARACTER DATABASE (SLAYER DATA)
   -------------------------------------------------------------------------- */
const SLAYERS = {
  tanjiro: {
    code: "竈門 炭治郎 // OP_01 // 水",
    bio: "Tanjiro es un joven amable y de gran determinación cuya familia fue masacrada por un demonio. Su hermana menor Nezuko sobrevivió pero fue transformada en demonio. Decidido a devolverle su humanidad, se une al Cuerpo de Exterminio de Demonios. Domina la Respiración del Agua y posteriormente hereda la antigua danza sagrada del fuego: Hinokami Kagura.",
    stats: { strength: 75, speed: 82, technique: 90, concentration: 95 },
    abilityTitle: "水の呼吸 // RESPIRACIÓN DEL AGUA",
    abilityDesc:
      "Uno de los estilos de respiración más fundamentales. Traza elegantes remolinos de agua con su espada, combinando fluidez y precisión para abrumar a sus enemigos. Domina las once formas completas de este estilo.",
    videoId: "bq7caidfUts",
    videoTitle: "Kamado Tanjiro no Uta",
  },
  zenitsu: {
    code: "我妻 善逸 // OP_02 // 雷",
    bio: "Zenitsu es un espadachín extremadamente miedoso que duda de sí mismo constantemente. Sin embargo, cuando cae inconsciente, su verdadero potencial emerge. Es un prodigio de la Respiración del Rayo, capaz de ejecutar la Primera Forma «Relámpago Veloz» a una velocidad sobrehumana que ni los demonios más rápidos pueden esquivar.",
    stats: { strength: 60, speed: 98, technique: 45, concentration: 30 },
    abilityTitle: "雷の呼吸 // RESPIRACIÓN DEL RAYO",
    abilityDesc:
      "Un estilo de respiración que imita la velocidad y el poder destructivo de un rayo. La Primera Forma «Relámpago Veloz» es un corte de velocidad divina que divide al enemigo en un instante. Solo seis formas se han transmitido a través de las generaciones.",
    videoId: "1PO2AVXWBhk",
    videoTitle: "Zenitsu Theme (Epic Version)",
  },
  inosuke: {
    code: "嘴平 伊之助 // OP_03 // 獣",
    bio: "Inosuke fue criado por jabalíes en la montaña y desarrolló un estilo de lucha salvaje e impredecible. Creador autodidacta de su propia Respiración de la Bestia, posee un sentido del tacto extremadamente desarrollado que le permite detectar enemigos fuera de su campo visual. Bajo su máscara de jabalí se esconde un rostro hermoso y femenino.",
    stats: { strength: 95, speed: 78, technique: 55, concentration: 60 },
    abilityTitle: "獣の呼吸 // RESPIRACIÓN DE LA BESTIA",
    abilityDesc:
      "Un estilo de respiración único creado por el propio Inosuke sin entrenamiento formal. Combina movimientos salvajes e impredecibles con el uso de dos espadas. El Primer Colmillo «Perforar» es una estocada giratoria que atraviesa al enemigo como un jabalí enfurecido.",
    videoId: "ngMk0oAiyZI",
    videoTitle: "Inosuke Theme V3 (Epic Version)",
  },
};

/* --------------------------------------------------------------------------
   2. ZODIAC CLOCK (ETO / 十二支)
   -------------------------------------------------------------------------- */
const ETO_MAP = [
  { hour: 23, symbol: "子", romaji: "Ne" }, // Rat 23-1
  { hour: 1, symbol: "丑", romaji: "Ushi" }, // Ox 1-3
  { hour: 3, symbol: "寅", romaji: "Tora" }, // Tiger 3-5
  { hour: 5, symbol: "卯", romaji: "U" }, // Rabbit 5-7
  { hour: 7, symbol: "辰", romaji: "Tatsu" }, // Dragon 7-9
  { hour: 9, symbol: "巳", romaji: "Mi" }, // Snake 9-11
  { hour: 11, symbol: "午", romaji: "Uma" }, // Horse 11-13
  { hour: 13, symbol: "未", romaji: "Hitsuji" }, // Sheep 13-15
  { hour: 15, symbol: "申", romaji: "Saru" }, // Monkey 15-17
  { hour: 17, symbol: "酉", romaji: "Tori" }, // Rooster 17-19
  { hour: 19, symbol: "戌", romaji: "Inu" }, // Dog 19-21
  { hour: 21, symbol: "亥", romaji: "I" }, // Boar 21-23
];

function getEtoki(hour) {
  for (const eto of ETO_MAP) {
    if (hour >= eto.hour && hour < eto.hour + 2) return eto;
  }
  return ETO_MAP[0];
}

/* --------------------------------------------------------------------------
   3. DOM REFS
   -------------------------------------------------------------------------- */
const hudZodiac = document.getElementById("hud-zodiac");
const hudClock = document.getElementById("hud-clock");
const missionStatus = document.getElementById("mission-status");
const footerCoords = document.getElementById("footer-coords");

const slayerCode = document.getElementById("slayer-code");
const slayerBio = document.getElementById("slayer-bio");
const abilityName = document.getElementById("ability-name");
const abilityDesc = document.getElementById("ability-desc");

const musicTitle = document.getElementById("music-title");

const statStrength = document.getElementById("stat-strength");
const statSpeed = document.getElementById("stat-speed");
const statTechnique = document.getElementById("stat-technique");
const statConcentration = document.getElementById("stat-concentration");
const valStrength = document.getElementById("val-strength");
const valSpeed = document.getElementById("val-speed");
const valTechnique = document.getElementById("val-technique");
const valConcentration = document.getElementById("val-concentration");

const cardsContainer = document.getElementById("cards-container");
const cardArticles = document.querySelectorAll(".character-card");
const confirmBtn = document.getElementById("confirm-btn");
const appContainer = document.querySelector(".app-container");
const detailsPanel = document.querySelector(".details-panel");
const musicPlayer = document.querySelector(".music-player");

const particleCanvas = document.getElementById("particle-canvas");
const ctx = particleCanvas ? particleCanvas.getContext("2d") : null;

const bgParticles = document.getElementById("bg-particles");

const STYLE_TO_CHARACTER = {
  water: "tanjiro",
  thunder: "zenitsu",
  beast: "inosuke",
};

const SOUND_PROFILES = {
  water: {
    accent: [1320, 1040, 780],
    chimeOscTypes: ["sine", "sine", "triangle"],
    chimeLFORate: 4.2,
    chimeLFODepth: 5,
    drawOscType: "triangle",
    drawFreqStart: 660,
    drawFreqEnd: 1320,
    drawDecay: 0.18,
    drawNoiseColor: "bandpass",
    drawNoiseFreq: 800,
    clashFreqs: [420, 840, 210, 1680],
    clashOscTypes: ["sawtooth", "triangle", "sine", "square"],
    reverbMix: 0.35,
    reverbDecay: 1.8,
    stereoWidth: 0.4,
    distortion: 0,
    preBreath: true,
    breathFreq: 600,
    breathDuration: 0.25,
    bgColor: "79, 195, 247",
    bgGlow: "rgba(79, 195, 247, 0.32)",
    ambientX: "22%",
    ambientY: "28%",
  },
  thunder: {
    accent: [2340, 1860, 1320],
    chimeOscTypes: ["triangle", "triangle", "sawtooth"],
    chimeLFORate: 14.0,
    chimeLFODepth: 18,
    drawOscType: "sawtooth",
    drawFreqStart: 1200,
    drawFreqEnd: 2400,
    drawDecay: 0.1,
    drawNoiseColor: "highpass",
    drawNoiseFreq: 2000,
    clashFreqs: [640, 1280, 320, 2560],
    clashOscTypes: ["sawtooth", "square", "sine", "triangle"],
    reverbMix: 0.2,
    reverbDecay: 0.8,
    stereoWidth: 0.6,
    distortion: 0.3,
    preBreath: true,
    breathFreq: 1200,
    breathDuration: 0.12,
    bgColor: "255, 223, 92",
    bgGlow: "rgba(255, 223, 92, 0.42)",
    ambientX: "50%",
    ambientY: "45%",
  },
  beast: {
    accent: [780, 620, 460],
    chimeOscTypes: ["sawtooth", "triangle", "square"],
    chimeLFORate: 7.8,
    chimeLFODepth: 10,
    drawOscType: "sawtooth",
    drawFreqStart: 380,
    drawFreqEnd: 760,
    drawDecay: 0.15,
    drawNoiseColor: "lowpass",
    drawNoiseFreq: 400,
    clashFreqs: [260, 520, 130, 1040],
    clashOscTypes: ["square", "sawtooth", "sine", "triangle"],
    reverbMix: 0.25,
    reverbDecay: 1.2,
    stereoWidth: 0.5,
    distortion: 0.5,
    preBreath: true,
    breathFreq: 300,
    breathDuration: 0.3,
    bgColor: "120, 191, 171",
    bgGlow: "rgba(120, 191, 171, 0.32)",
    ambientX: "75%",
    ambientY: "35%",
  },
};

/* --------------------------------------------------------------------------
   4. CANVAS PARTICLE SYSTEM (BREATHING STYLES)
   -------------------------------------------------------------------------- */
let particles = [];
let animationId = null;
let currentStyle = "water";

let canvasW = 0;
let canvasH = 0;

function resizeCanvas() {
  if (!particleCanvas) return;
  canvasW = window.innerWidth;
  canvasH = window.innerHeight;
  particleCanvas.width = canvasW;
  particleCanvas.height = canvasH;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function spawnParticle() {
  const styles = {
    water: {
      color: "79, 195, 247",
      size: [2, 8],
      speed: [0.2, 0.8],
      life: [60, 150],
      angle: [-0.3, 0.3],
      wobble: true,
    },
    thunder: {
      color: "255, 255, 51",
      size: [1.5, 5],
      speed: [0.4, 1.2],
      life: [40, 100],
      angle: [-0.4, 0.4],
      wobble: true,
    },
    beast: {
      color: "120, 191, 171",
      size: [3, 10],
      speed: [0.3, 1.2],
      life: [40, 100],
      angle: [-0.5, 0.5],
      wobble: true,
    },
  };

  const cfg = styles[currentStyle] || styles.water;
  const angle = Math.random() * Math.PI * 2;

  return {
    x: Math.random() * canvasW,
    y: canvasH + 10,
    vx:
      Math.cos(angle) *
      (Math.random() * (cfg.speed[1] - cfg.speed[0]) + cfg.speed[0]),
    vy: -(Math.random() * (cfg.speed[1] - cfg.speed[0]) + cfg.speed[0]),
    size: Math.random() * (cfg.size[1] - cfg.size[0]) + cfg.size[0],
    life: Math.floor(Math.random() * (cfg.life[1] - cfg.life[0]) + cfg.life[0]),
    maxLife: 0,
    alpha: 0.5 + Math.random() * 0.5,
    color: cfg.color,
    wobble: cfg.wobble,
    angleOffset: Math.random() * Math.PI * 2,
    drift: Math.random() * 0.5 - 0.25,
  };
}

function updateParticles() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasW, canvasH);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life--;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    const lifeRatio = p.life / p.maxLife;
    p.x += p.vx + Math.sin(p.life * 0.02 + p.angleOffset) * p.drift;
    p.y += p.vy;
    p.vy += 0.01;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * lifeRatio, 0, Math.PI * 2);
    const alpha = p.alpha * lifeRatio * 0.6;
    ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
    ctx.fill();

    if (currentStyle === "thunder" && Math.random() < 0.15) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      const tipX = p.x + (Math.random() - 0.5) * 10;
      const tipY = p.y - Math.random() * 8;
      ctx.lineTo(tipX, tipY);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // Spawn new particles
  const isZenitsu = currentStyle === "thunder";
  const spawnRate = isZenitsu ? 5 : 4;
  for (let i = 0; i < spawnRate; i++) {
    if (particles.length < 200) {
      const p = spawnParticle();
      p.maxLife = p.life;
      particles.push(p);
    }
  }

  animationId = requestAnimationFrame(updateParticles);
}

function setBreathingStyle(style) {
  currentStyle = style;
  particles = [];
  syncAtmosphere(style);
}

function startParticles() {
  if (animationId) return;
  updateParticles();
}

function stopParticles() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  particles = [];
  if (ctx) ctx.clearRect(0, 0, canvasW, canvasH);
}

/* --------------------------------------------------------------------------
   5. BACKGROUND FLOATING PARTICLES (CSS-generated DOM)
   -------------------------------------------------------------------------- */
function createBgParticles() {
  if (!bgParticles) return;
  bgParticles.innerHTML = "";
  const profile = SOUND_PROFILES[currentStyle] || SOUND_PROFILES.water;
  for (let i = 0; i < 20; i++) {
    const dot = document.createElement("div");
    const size = 1 + Math.random() * 2;
    dot.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${profile.bgGlow};
      box-shadow: 0 0 ${4 + size * 4}px ${profile.bgGlow};
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float-bg ${8 + Math.random() * 12}s infinite ease-in-out;
      animation-delay: ${Math.random() * 5}s;
      opacity: ${0.25 + Math.random() * 0.45};
      pointer-events: none;
    `;
    bgParticles.appendChild(dot);
  }
}

/* --------------------------------------------------------------------------
   6. CLOCK & MISSION STATUS
   -------------------------------------------------------------------------- */
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  hudClock.textContent = `${hh}:${mm}:${ss}`;

  const eto = getEtoki(now.getHours());
  hudZodiac.textContent = `${eto.symbol} (${eto.romaji})`;

  // Mission status alternates
  const sec = now.getSeconds();
  if (sec % 30 < 15) {
    missionStatus.textContent = "MISIÓN: EN ESPERA // 待機中";
  } else {
    missionStatus.textContent = "MISIÓN: ACTIVA // 任務中";
  }
}
setInterval(updateClock, 1000);
updateClock();

// Footer coordinates — slight animation
function randomizeCoord() {
  const base = [35.6762, 139.6503];
  const drift = () => (Math.random() - 0.5) * 0.01;
  const lat = (base[0] + drift()).toFixed(4);
  const lng = (base[1] + drift()).toFixed(4);
  footerCoords.textContent = `CUARTEL GENERAL // ${lat}°N ${lng}°E // ${Math.floor(80 + Math.random() * 40)}m`;
}
setInterval(randomizeCoord, 4000);
randomizeCoord();

/* --------------------------------------------------------------------------
   7. YOUTUBE IFrame API — MUSIC PLAYER PER CHARACTER
   -------------------------------------------------------------------------- */
let ytPlayer = null;
let ytReady = false;
let pendingVideoId = null;

function setMusicPlayerState(state) {
  if (!musicPlayer) return;
  musicPlayer.classList.toggle("is-playing", state === "playing");
  musicPlayer.classList.toggle("is-buffering", state === "buffering");
}

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player("youtube-player", {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1,
    },
    events: {
      onReady: () => {
        ytReady = true;
        setMusicPlayerState("buffering");
        if (pendingVideoId) {
          changeVideo(pendingVideoId);
          pendingVideoId = null;
        }
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          setMusicPlayerState("playing");
        } else if (event.data === YT.PlayerState.BUFFERING) {
          setMusicPlayerState("buffering");
        } else {
          setMusicPlayerState("idle");
        }
        if (
          event.data === YT.PlayerState.ENDED &&
          ytPlayer &&
          typeof ytPlayer.playVideo === "function"
        ) {
          ytPlayer.playVideo();
        }
      },
    },
  });
}

function changeVideo(videoId) {
  if (!ytPlayer || !ytReady) {
    pendingVideoId = videoId;
    return;
  }
  try {
    ytPlayer.loadVideoById({
      videoId,
      startSeconds: 0,
      suggestedQuality: "small",
    });
    ytPlayer.playVideo();
  } catch (e) {}
}

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

/* --------------------------------------------------------------------------
   7. WEB AUDIO API — SOUND DESIGN
   -------------------------------------------------------------------------- */
let audioCtx = null;
let reverbImpulse = null;

function createReverbImpulse(decay = 2.0) {
  const sr = audioCtx.sampleRate;
  const len = Math.floor(sr * decay);
  const buf = audioCtx.createBuffer(2, len, sr);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 5);
    }
  }
  return buf;
}

function createWetDryChain(mix = 0.3) {
  const dryGain = audioCtx.createGain();
  dryGain.gain.value = 1;
  const conv = audioCtx.createConvolver();
  conv.buffer = reverbImpulse || createReverbImpulse(2.0);
  conv.normalize = true;
  const wetGain = audioCtx.createGain();
  wetGain.gain.value = mix;
  conv.connect(wetGain);
  dryGain.connect(audioCtx.destination);
  wetGain.connect(audioCtx.destination);
  return { conv, dryGain, wetGain };
}

function createSoftClipper(amount = 0) {
  if (amount <= 0) return null;
  const ws = audioCtx.createWaveShaper();
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

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    reverbImpulse = createReverbImpulse(2.5);
  }
}

function getSoundProfile(style = currentStyle) {
  return SOUND_PROFILES[style] || SOUND_PROFILES.water;
}

function pulseInterface(type = "style-switch") {
  if (!appContainer) return;
  appContainer.classList.remove("is-style-switching", "is-blade-flash");
  void appContainer.offsetWidth;
  appContainer.classList.add(
    type === "blade-flash" ? "is-blade-flash" : "is-style-switching",
  );
}

function syncAtmosphere(style = currentStyle) {
  const profile = getSoundProfile(style);
  const charId = STYLE_TO_CHARACTER[style] || "tanjiro";
  document.body.dataset.breathing = style;
  document.documentElement.style.setProperty("--ambient-x", profile.ambientX);
  document.documentElement.style.setProperty("--ambient-y", profile.ambientY);
  document.documentElement.style.setProperty("--sensor-color", profile.bgColor);
  document.documentElement.style.setProperty("--sensor-glow", profile.bgGlow);
  if (appContainer) appContainer.dataset.character = charId;
  if (detailsPanel) detailsPanel.dataset.character = charId;
  createBgParticles();
}

// Chime anime-style — cada respiración con su firma sonora
function playChime(style = currentStyle) {
  try {
    initAudio();
    if (audioCtx.state === "suspended") return;
    const profile = getSoundProfile(style);
    const now = audioCtx.currentTime;
    const dur = 0.4;

    const master = audioCtx.createGain();
    master.gain.setValueAtTime(0.028, now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    const { dryGain, conv } = createWetDryChain(profile.reverbMix * 0.4);
    master.connect(dryGain);
    master.connect(conv);

    const panner = audioCtx.createStereoPanner();
    dryGain.connect(panner);
    panner.connect(audioCtx.destination);

    // LFO tremolo — el "aliento" del estilo
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = profile.chimeLFORate;
    lfoGain.gain.value = profile.chimeLFODepth * 0.003;
    lfo.connect(lfoGain);
    lfo.start(now);
    lfo.stop(now + dur);

    profile.accent.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = profile.chimeOscTypes[index];
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(
        freq * 0.65,
        now + 0.2 + index * 0.03,
      );

      if (index === 0) {
        lfoGain.connect(osc.frequency);
      }

      g.gain.setValueAtTime(index === 0 ? 0.7 : 0.28, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.28 + index * 0.04);

      const oscPanner = audioCtx.createStereoPanner();
      oscPanner.pan.setValueAtTime(
        (index - 1) * profile.stereoWidth * 0.35,
        now,
      );

      osc.connect(g);
      g.connect(oscPanner);
      oscPanner.connect(master);
      osc.start(now + index * 0.018);
      osc.stop(now + dur + index * 0.04);
    });
  } catch (e) {}
}

// Sword draw anime-style — pre-breath + noise sweep + metallic
function playDrawSound(style = currentStyle) {
  try {
    initAudio();
    if (audioCtx.state === "suspended") return;
    const profile = getSoundProfile(style);
    const now = audioCtx.currentTime;

    // === FASE 1: Pre-breath (inspiración del estilo) ===
    if (profile.preBreath) {
      const bNoise = audioCtx.createBufferSource();
      const bSize = Math.floor(audioCtx.sampleRate * profile.breathDuration);
      const bBuf = audioCtx.createBuffer(1, bSize, audioCtx.sampleRate);
      const bData = bBuf.getChannelData(0);
      for (let i = 0; i < bSize; i++) {
        bData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bSize, 2);
      }
      bNoise.buffer = bBuf;
      const bFilter = audioCtx.createBiquadFilter();
      bFilter.type = "bandpass";
      bFilter.frequency.value = profile.breathFreq;
      bFilter.Q.value = 2;
      const bGain = audioCtx.createGain();
      bGain.gain.setValueAtTime(0.015, now);
      bGain.gain.exponentialRampToValueAtTime(0.0001, now + profile.breathDuration);
      bNoise.connect(bFilter);
      bFilter.connect(bGain);
      bGain.connect(audioCtx.destination);
      bNoise.start(now);
    }

    // === FASE 2: Noise sweep (desenvaine) ===
    const drawStart = now + (profile.preBreath ? profile.breathDuration * 0.7 : 0);
    const noise = audioCtx.createBufferSource();
    const bufSize = Math.floor(audioCtx.sampleRate * profile.drawDecay);
    const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2.5);
    }
    noise.buffer = buf;
    const filter = audioCtx.createBiquadFilter();
    filter.type = profile.drawNoiseColor;
    filter.frequency.setValueAtTime(profile.drawNoiseFreq * 3, drawStart);
    filter.frequency.exponentialRampToValueAtTime(
      profile.drawNoiseFreq,
      drawStart + profile.drawDecay * 0.8,
    );
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.06, drawStart);
    noiseGain.gain.linearRampToValueAtTime(0, drawStart + profile.drawDecay);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noise.start(drawStart);

    // === FASE 3: Oscilador metálico (filo de la espada) ===
    const metallic = audioCtx.createOscillator();
    metallic.type = profile.drawOscType;
    metallic.frequency.setValueAtTime(profile.drawFreqStart, drawStart);
    metallic.frequency.exponentialRampToValueAtTime(
      profile.drawFreqEnd,
      drawStart + profile.drawDecay * 0.5,
    );
    const metalGain = audioCtx.createGain();
    metalGain.gain.setValueAtTime(0.025, drawStart);
    metalGain.gain.exponentialRampToValueAtTime(0.0001, drawStart + profile.drawDecay);

    const metalPanner = audioCtx.createStereoPanner();
    metalPanner.pan.setValueAtTime(profile.stereoWidth * 0.5, drawStart);

    metallic.connect(metalGain);
    metalGain.connect(metalPanner);

    // Reverb sutíl en el metálico
    const { dryGain: mDry, conv: mConv } = createWetDryChain(profile.reverbMix * 0.3);
    metalPanner.connect(mDry);
    metalPanner.connect(mConv);

    metallic.start(drawStart + 0.015);
    metallic.stop(drawStart + profile.drawDecay);
  } catch (e) {}
}

// Blade clash anime-style — 4 fases: pre-clash, impacto, sostenido, cola
function playClashSound(style = currentStyle) {
  try {
    initAudio();
    if (audioCtx.state === "suspended") return;
    const profile = getSoundProfile(style);
    const now = audioCtx.currentTime;
    const { dryGain, conv, wetGain } = createWetDryChain(profile.reverbMix);
    const dist = createSoftClipper(profile.distortion);

    // === FASE 1: Pre-clash — silencio + breath hold (0–0.08s) ===
    const preEnd = now + 0.06;

    // === FASE 2: Impacto — 4 osciladores + noise burst (0.08–0.25s) ===
    const impactStart = preEnd;
    const impactGain = audioCtx.createGain();
    impactGain.gain.setValueAtTime(0.09, impactStart);
    impactGain.gain.linearRampToValueAtTime(0.04, impactStart + 0.12);
    impactGain.gain.exponentialRampToValueAtTime(0.0001, impactStart + 0.35);
    impactGain.connect(dryGain);

    // Pre-conectar distorsión al bus de impacto
    if (dist) dist.connect(impactGain);

    profile.clashFreqs.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      osc.type = profile.clashOscTypes[i];
      osc.frequency.setValueAtTime(freq, impactStart);
      osc.frequency.exponentialRampToValueAtTime(
        freq * (i === 0 ? 1.8 : i === 1 ? 0.6 : 0.75),
        impactStart + 0.2,
      );

      const g = audioCtx.createGain();
      g.gain.setValueAtTime(i === 3 ? 0.35 : 0.7, impactStart);
      g.gain.linearRampToValueAtTime(0, impactStart + 0.3);

      osc.connect(g);
      if (dist) {
        g.connect(dist);
      } else {
        g.connect(impactGain);
      }

      osc.start(impactStart + i * profile.clashDelay);
      osc.stop(impactStart + 0.35);
    });

    // Noise burst (impacto físico)
    const noise = audioCtx.createBufferSource();
    const nSize = Math.floor(audioCtx.sampleRate * 0.06);
    const nBuf = audioCtx.createBuffer(1, nSize, audioCtx.sampleRate);
    const nData = nBuf.getChannelData(0);
    for (let i = 0; i < nSize; i++) {
      nData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nSize, 8);
    }
    noise.buffer = nBuf;
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.07, impactStart + 0.01);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, impactStart + 0.1);
    noise.connect(noiseGain);
    if (dist) {
      noiseGain.connect(dist);
    } else {
      noiseGain.connect(impactGain);
    }
    noise.start(impactStart + 0.01);

    // === FASE 3: Sostenido — el anillo metálico (0.25–0.5s) ===
    const ringStart = impactStart + 0.12;
    const ring = audioCtx.createOscillator();
    ring.type = "sine";
    ring.frequency.setValueAtTime(profile.clashFreqs[1] * 0.3, ringStart);
    ring.frequency.exponentialRampToValueAtTime(
      profile.clashFreqs[1] * 0.15,
      ringStart + 0.25,
    );
    const ringGain = audioCtx.createGain();
    ringGain.gain.setValueAtTime(0.03, ringStart);
    ringGain.gain.exponentialRampToValueAtTime(0.0001, ringStart + 0.35);
    ring.connect(ringGain);
    ringGain.connect(audioCtx.destination);
    ring.start(ringStart);
    ring.stop(ringStart + 0.35);

    // === FASE 4: Cola — reverb tail + paneo L→R (0.5–0.9s) ===
    const tailPanner = audioCtx.createStereoPanner();
    tailPanner.pan.setValueAtTime(-0.6, impactStart);
    tailPanner.pan.linearRampToValueAtTime(0.6, impactStart + 0.4);
    impactGain.connect(tailPanner);
    tailPanner.connect(conv);
  } catch (e) {}
}

// Selection impact — sonido breve al hacer click en una card (entre hover y draw)
function playSelectionImpact(style = currentStyle) {
  try {
    initAudio();
    if (audioCtx.state === "suspended") return;
    const profile = getSoundProfile(style);
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = style === "beast" ? "sawtooth" : "sine";
    osc.frequency.setValueAtTime(profile.accent[1] * 1.2, now);
    osc.frequency.exponentialRampToValueAtTime(
      profile.accent[1] * 0.5,
      now + 0.08,
    );
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    const panner = audioCtx.createStereoPanner();
    panner.pan.setValueAtTime(profile.stereoWidth * 0.3, now);

    osc.connect(gain);
    gain.connect(panner);
    panner.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {}
}

function unlockAudio() {
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}
window.addEventListener("click", unlockAudio);
window.addEventListener("keydown", unlockAudio);

/* --------------------------------------------------------------------------
   8. TYPEWRITER EFFECT
   -------------------------------------------------------------------------- */
let typeInterval = null;

function typeText(element, text, speed = 15) {
  clearInterval(typeInterval);
  element.textContent = "";
  let idx = 0;
  typeInterval = setInterval(() => {
    if (idx < text.length) {
      element.textContent += text.charAt(idx);
      idx++;
    } else {
      clearInterval(typeInterval);
    }
  }, speed);
}

/* --------------------------------------------------------------------------
   9. STAT COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function animateStat(element, target, suffix = "") {
  let current = 0;
  const duration = 700;
  const step = Math.max(Math.floor(duration / Math.max(target, 1)), 10);
  const timer = setInterval(() => {
    current += Math.max(1, Math.floor(target / 30));
    if (current >= target) {
      element.textContent = `${target}${suffix}`;
      clearInterval(timer);
    } else {
      element.textContent = `${current}${suffix}`;
    }
  }, step);
}

/* --------------------------------------------------------------------------
   10. SELECT SLAYER
   -------------------------------------------------------------------------- */
function selectSlayer(id) {
  const data = SLAYERS[id];
  if (!data) return;

  slayerCode.textContent = data.code;
  typeText(slayerBio, data.bio, 10);

  abilityName.textContent = data.abilityTitle;
  typeText(abilityDesc, data.abilityDesc, 12);

  // Stats animation
  const statMap = {
    strength: statStrength,
    speed: statSpeed,
    technique: statTechnique,
    concentration: statConcentration,
  };
  const valMap = {
    strength: valStrength,
    speed: valSpeed,
    technique: valTechnique,
    concentration: valConcentration,
  };

  for (const key of Object.keys(data.stats)) {
    const bar = statMap[key];
    const val = valMap[key];
    const target = data.stats[key];

    val.textContent = "0";
    bar.style.width = "0%";
    animateStat(val, target, "");

    setTimeout(() => {
      bar.style.width = `${target}%`;
    }, 60);
  }

  // Breathing style changes
  const styleMap = { tanjiro: "water", zenitsu: "thunder", inosuke: "beast" };
  setBreathingStyle(styleMap[id] || "water");
  pulseInterface("style-switch");

  // Cambiar música de YouTube
  if (data.videoId) {
    musicTitle.textContent = data.videoTitle || "";
    changeVideo(data.videoId);
  }

  // Audio
  playDrawSound(styleMap[id] || "water");
}

/* --------------------------------------------------------------------------
   11. EVENT LISTENERS
   -------------------------------------------------------------------------- */
cardArticles.forEach((card) => {
  const radio = card.querySelector('input[type="radio"]');
  const charId = card.getAttribute("data-character");
  const styleMap = { tanjiro: "water", zenitsu: "thunder", inosuke: "beast" };

  card.addEventListener("mouseenter", () => {
    if (!radio.checked) playChime(styleMap[charId] || currentStyle);
  });

  card.addEventListener("click", (e) => {
    if (!radio.checked) {
      playSelectionImpact(styleMap[charId] || currentStyle);
    }
  });

  radio.addEventListener("change", () => {
    if (radio.checked) {
      selectSlayer(charId);
    }
  });
});

// Confirm button
if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    playClashSound();
    pulseInterface("blade-flash");
    const span = confirmBtn.querySelector("span");
    const original = span ? span.textContent : confirmBtn.textContent;

    if (span) {
      span.textContent = "⚔ DESENVAINADO // BLADE FLASH";
    } else {
      confirmBtn.textContent = "⚔ DESENVAINADO // BLADE FLASH";
    }

    const app = document.querySelector(".app-container");
    if (app) {
      app.style.borderColor = "var(--accent-color)";
      app.style.boxShadow = `0 0 50px var(--accent-glow), 0 20px 60px rgba(0,0,0,0.6)`;
    }

    confirmBtn.style.background = "var(--accent-color)";
    confirmBtn.style.color = "var(--bg-deep)";
    confirmBtn.style.fontWeight = "700";

    setTimeout(() => {
      if (span) {
        span.textContent = original;
      } else {
        confirmBtn.textContent = original;
      }
      if (app) {
        app.style.borderColor = "";
        app.style.boxShadow = "";
      }
      confirmBtn.style.background = "";
      confirmBtn.style.color = "";
      confirmBtn.style.fontWeight = "";
    }, 2200);
  });
}

/* --------------------------------------------------------------------------
   12. INIT
   -------------------------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  createBgParticles();
  startParticles();
  syncAtmosphere(currentStyle);

  const activeRadio = document.querySelector(
    '.character-card input[type="radio"]:checked',
  );
  if (activeRadio) {
    const card = activeRadio.closest(".character-card");
    const charId = card.getAttribute("data-character");
    selectSlayer(charId);
  }
});

/* --------------------------------------------------------------------------
   KEYFRAME INJECTION (BG particles float)
   -------------------------------------------------------------------------- */
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes float-bg {
    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
    25% { transform: translateY(-30px) translateX(10px); opacity: 0.6; }
    50% { transform: translateY(-60px) translateX(-5px); opacity: 0.3; }
    75% { transform: translateY(-20px) translateX(15px); opacity: 0.5; }
  }
`;
document.head.appendChild(styleSheet);
