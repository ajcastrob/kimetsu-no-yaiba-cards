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

const particleCanvas = document.getElementById("particle-canvas");
const ctx = particleCanvas ? particleCanvas.getContext("2d") : null;

const bgParticles = document.getElementById("bg-particles");

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
      size: [1, 4],
      speed: [1.0, 3.0],
      life: [15, 40],
      angle: [-0.8, 0.8],
      wobble: false,
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

    if (currentStyle === "thunder" && Math.random() < 0.3) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      const tipX = p.x + (Math.random() - 0.5) * 15;
      const tipY = p.y - Math.random() * 10;
      ctx.lineTo(tipX, tipY);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // Spawn new particles
  const isZenitsu = currentStyle === "thunder";
  const spawnRate = isZenitsu ? 8 : 4;
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
  for (let i = 0; i < 20; i++) {
    const dot = document.createElement("div");
    const size = 1 + Math.random() * 2;
    dot.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(165, 154, 202, 0.3);
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float-bg ${8 + Math.random() * 12}s infinite ease-in-out;
      animation-delay: ${Math.random() * 5}s;
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
        if (pendingVideoId) {
          changeVideo(pendingVideoId);
          pendingVideoId = null;
        }
      },
      onStateChange: (event) => {
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

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Chime — wind bell / furin
function playChime() {
  try {
    initAudio();
    if (audioCtx.state === "suspended") return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2800, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.06);
    gain.gain.setValueAtTime(0.015, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {}
}

// Sword draw
function playDrawSound() {
  try {
    initAudio();
    if (audioCtx.state === "suspended") return;
    const now = audioCtx.currentTime;
    const noise = audioCtx.createBufferSource();
    const bufSize = audioCtx.sampleRate * 0.15;
    const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 3);
    }
    noise.buffer = buf;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(3000, now);
    filter.frequency.exponentialRampToValueAtTime(500, now + 0.12);
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.15);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(now);
  } catch (e) {}
}

// Blade clash
function playClashSound() {
  try {
    initAudio();
    if (audioCtx.state === "suspended") return;
    const now = audioCtx.currentTime;
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(200, now);
    osc1.frequency.exponentialRampToValueAtTime(600, now + 0.2);
    osc2.type = "square";
    osc2.frequency.setValueAtTime(100, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(50, now + 0.15);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);
    osc1.start(now);
    osc2.start(now + 0.05);
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.25);
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

  // Cambiar música de YouTube
  if (data.videoId) {
    musicTitle.textContent = data.videoTitle || "";
    changeVideo(data.videoId);
  }

  // Audio
  playDrawSound();
}

/* --------------------------------------------------------------------------
   11. EVENT LISTENERS
   -------------------------------------------------------------------------- */
cardArticles.forEach((card) => {
  const radio = card.querySelector('input[type="radio"]');
  const charId = card.getAttribute("data-character");

  card.addEventListener("mouseenter", () => {
    if (!radio.checked) playChime();
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
    const span = confirmBtn.querySelector("span");
    const original = span ? span.textContent : confirmBtn.textContent;

    if (span) {
      span.textContent = "⚔ DESENVAINADO // BLADE FLASH";
    } else {
      confirmBtn.textContent = "⚔ DESENVAINADO // BLADE FLASH";
    }

    const app = document.querySelector(".app-container");
    app.style.borderColor = "var(--accent-color)";
    app.style.boxShadow = `0 0 50px var(--accent-glow), 0 20px 60px rgba(0,0,0,0.6)`;

    confirmBtn.style.background = "var(--accent-color)";
    confirmBtn.style.color = "var(--bg-deep)";
    confirmBtn.style.fontWeight = "700";

    setTimeout(() => {
      if (span) {
        span.textContent = original;
      } else {
        confirmBtn.textContent = original;
      }
      app.style.borderColor = "";
      app.style.boxShadow = "";
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
