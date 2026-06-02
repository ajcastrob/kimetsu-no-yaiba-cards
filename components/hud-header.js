import { getEtoki } from "../lib/data.js";

export class HudHeader extends HTMLElement {
  connectedCallback() {
    this.classList.add("hud-header");
    this.render();
    this.startClock();
  }

  render() {
    this.innerHTML = `
      <div class="hud-left">
        <span class="wisteria-crest">❀</span>
        <span class="hud-sep">//</span>
        <span class="hud-status status-active">SYS: ACTIVO</span>
        <span class="hud-sep">//</span>
        <span class="hud-unit">鬼殺隊 // CUERPO DE EXTERMINIO</span>
      </div>
      <h1 class="hud-title">
        <span class="title-kanji">鬼滅の刃</span>
        <span class="title-sub">KIMETSU NO YAIBA</span>
      </h1>
      <div class="hud-right">
        <span class="hud-zodiac" id="hud-zodiac">―</span>
        <span class="hud-time" id="hud-clock">――:――:――</span>
        <span class="hud-sep">//</span>
        <span class="hud-ver">SYS_V4.82 // TAISHO_ERA</span>
      </div>
    `;
  }

  startClock() {
    const zodiacEl = this.querySelector("#hud-zodiac");
    const clockEl = this.querySelector("#hud-clock");

    const update = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      clockEl.textContent = `${hh}:${mm}:${ss}`;

      const eto = getEtoki(now.getHours());
      zodiacEl.textContent = `${eto.symbol} (${eto.romaji})`;
    };

    update();
    this._clockInterval = setInterval(update, 1000);
  }

  disconnectedCallback() {
    if (this._clockInterval) clearInterval(this._clockInterval);
  }
}

customElements.define("hud-header", HudHeader);
