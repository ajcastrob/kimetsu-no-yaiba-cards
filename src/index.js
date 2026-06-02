/* Controller — entry point, wires web components together */
import { AudioEngine } from "./lib/audio-engine.js";

import "./components/slayer-card/slayer-card.js";
import "./components/slayer-details/slayer-details.js";
import "./components/hud-header/hud-header.js";
import "./components/hud-footer/hud-footer.js";
import "./components/music-player/music-player.js";
import "./components/particle-canvas/particle-canvas.js";
import "./components/bg-particles/bg-particles.js";

import { wireEvents } from "./lib/events.js";
import { initApp } from "./lib/init.js";

const audio = new AudioEngine();

const ctx = {
  audio,
  currentStyle: "water",
  elements: {
    appContainer: document.querySelector(".app-container"),
    detailsPanel: document.querySelector("slayer-details"),
    musicPlayer: document.querySelector("music-player"),
    particleCanvas: document.querySelector("particle-canvas"),
    bgParticles: document.querySelector("bg-particles"),
  },
};

wireEvents(ctx);
window.addEventListener("DOMContentLoaded", () => initApp(ctx));
