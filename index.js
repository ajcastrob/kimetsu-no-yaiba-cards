/* Controller — entry point, wires web components together */
import { AudioEngine } from "./lib/audio-engine.js";

import "./components/slayer-card.js";
import "./components/slayer-details.js";
import "./components/hud-header.js";
import "./components/hud-footer.js";
import "./components/music-player.js";
import "./components/particle-canvas.js";
import "./components/bg-particles.js";

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
