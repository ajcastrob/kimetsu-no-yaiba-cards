import { SOUND_PROFILES } from "../lib/data.js";

export class BgParticles extends HTMLElement {
  connectedCallback() {
    this.classList.add("bg-particles");
    this.id = "bg-particles";
  }

  refresh(style) {
    this.innerHTML = "";
    const profile = SOUND_PROFILES[style] || SOUND_PROFILES.water;

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
      this.appendChild(dot);
    }
  }
}

customElements.define("bg-particles", BgParticles);
