function loadCSS(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
loadCSS(new URL("./hud-footer.css", import.meta.url).href);

export class HudFooter extends HTMLElement {
  connectedCallback() {
    this.classList.add("hud-footer");
    this.render();
    this.startUpdates();
  }

  render() {
    this.innerHTML = `
      <div class="footer-left">
        <span>❀ WISTERIA SEC-NET // RED SEGURA</span>
      </div>
      <div class="footer-center">
        <span class="pulse-dot"></span>
        <span id="mission-status">MISIÓN: EN ESPERA // 待機中</span>
      </div>
      <div class="footer-right">
        <span id="footer-coords">CUARTEL GENERAL // 35.6762°N 139.6503°E</span>
      </div>
    `;
  }

  startUpdates() {
    const missionEl = this.querySelector("#mission-status");
    const coordsEl = this.querySelector("#footer-coords");

    const updateMission = () => {
      const sec = new Date().getSeconds();
      missionEl.textContent = sec % 30 < 15
        ? "MISIÓN: EN ESPERA // 待機中"
        : "MISIÓN: ACTIVA // 任務中";
    };

    const updateCoords = () => {
      const base = [35.6762, 139.6503];
      const drift = () => (Math.random() - 0.5) * 0.01;
      const lat = (base[0] + drift()).toFixed(4);
      const lng = (base[1] + drift()).toFixed(4);
      coordsEl.textContent = `CUARTEL GENERAL // ${lat}°N ${lng}°E // ${Math.floor(80 + Math.random() * 40)}m`;
    };

    updateMission();
    updateCoords();
    this._missionInterval = setInterval(updateMission, 1000);
    this._coordsInterval = setInterval(updateCoords, 4000);
  }

  disconnectedCallback() {
    if (this._missionInterval) clearInterval(this._missionInterval);
    if (this._coordsInterval) clearInterval(this._coordsInterval);
  }
}

customElements.define("hud-footer", HudFooter);
