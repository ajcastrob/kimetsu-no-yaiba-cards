function loadCSS(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
loadCSS(new URL("./particle-canvas.css", import.meta.url).href);

import { SOUND_PROFILES } from "../../lib/data.js";

export class ParticleCanvas extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<canvas id="particle-canvas"></canvas>`;
    this.canvas = this.querySelector("#particle-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.animationId = null;
    this.currentStyle = "water";

    this.resizeCanvas = this.resizeCanvas.bind(this);
    window.addEventListener("resize", this.resizeCanvas);
    this.resizeCanvas();
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.resizeCanvas);
    this.stop();
  }

  resizeCanvas() {
    this.canvasW = window.innerWidth;
    this.canvasH = window.innerHeight;
    this.canvas.width = this.canvasW;
    this.canvas.height = this.canvasH;
  }

  spawnParticle() {
    const styles = {
      water: {
        color: "79, 195, 247",
        size: [2, 8],
        speed: [0.2, 0.8],
        life: [60, 150],
        wobble: true,
      },
      thunder: {
        color: "255, 255, 51",
        size: [1.5, 5],
        speed: [0.4, 1.2],
        life: [40, 100],
        wobble: true,
      },
      beast: {
        color: "120, 191, 171",
        size: [3, 10],
        speed: [0.3, 1.2],
        life: [40, 100],
        wobble: true,
      },
    };

    const cfg = styles[this.currentStyle] || styles.water;
    const angle = Math.random() * Math.PI * 2;

    return {
      x: Math.random() * this.canvasW,
      y: this.canvasH + 10,
      vx: Math.cos(angle) * (Math.random() * (cfg.speed[1] - cfg.speed[0]) + cfg.speed[0]),
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

  updateParticles() {
    this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life--;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      const lifeRatio = p.life / p.maxLife;
      p.x += p.vx + Math.sin(p.life * 0.02 + p.angleOffset) * p.drift;
      p.y += p.vy;
      p.vy += 0.01;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * lifeRatio, 0, Math.PI * 2);
      const alpha = p.alpha * lifeRatio * 0.6;
      this.ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
      this.ctx.fill();

      if (this.currentStyle === "thunder" && Math.random() < 0.15) {
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        const tipX = p.x + (Math.random() - 0.5) * 10;
        const tipY = p.y - Math.random() * 8;
        this.ctx.lineTo(tipX, tipY);
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    }

    const isThunder = this.currentStyle === "thunder";
    const spawnRate = isThunder ? 5 : 4;
    for (let i = 0; i < spawnRate; i++) {
      if (this.particles.length < 200) {
        const p = this.spawnParticle();
        p.maxLife = p.life;
        this.particles.push(p);
      }
    }

    this.animationId = requestAnimationFrame(() => this.updateParticles());
  }

  setStyle(style) {
    this.currentStyle = style;
    this.particles = [];
  }

  start() {
    if (this.animationId) return;
    this.updateParticles();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.particles = [];
    this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
  }
}

customElements.define("particle-canvas", ParticleCanvas);
