export class SlayerDetails extends HTMLElement {
  connectedCallback() {
    this.classList.add("details-panel");
    this.id = "details-panel";
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="corner-frame">
        <span class="corner tl"></span>
        <span class="corner tr"></span>
        <span class="corner bl"></span>
        <span class="corner br"></span>
      </div>

      <div class="panel-section">
        <div class="panel-header">
          <span class="dec-line"></span>
          <h3 class="panel-title" id="slayer-code">竈門 炭治郎 // OP_01 // 水</h3>
        </div>
        <p class="panel-bio" id="slayer-bio">Texto de biografía del cazador...</p>
      </div>

      <div class="panel-section">
        <span class="label-tech">戦闘能力 // PARÁMETROS DE COMBATE</span>
        <div class="stat-group">
          <div class="stat-row">
            <span class="stat-label">FUERZA</span>
            <div class="stat-bar">
              <div class="stat-fill" id="stat-strength" style="width: 75%"></div>
            </div>
            <span class="stat-val" id="val-strength">75</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">VELOCIDAD</span>
            <div class="stat-bar">
              <div class="stat-fill" id="stat-speed" style="width: 82%"></div>
            </div>
            <span class="stat-val" id="val-speed">82</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">TÉCNICA</span>
            <div class="stat-bar">
              <div class="stat-fill" id="stat-technique" style="width: 90%"></div>
            </div>
            <span class="stat-val" id="val-technique">90</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">ENERGíA</span>
            <div class="stat-bar">
              <div class="stat-fill" id="stat-concentration" style="width: 95%"></div>
            </div>
            <span class="stat-val" id="val-concentration">95</span>
          </div>
        </div>
      </div>

      <div class="panel-section">
        <span class="label-tech">呼吸 // ESTILO DE RESPIRACIÓN</span>
        <div class="ability-box" id="ability-box">
          <h4 class="ability-title" id="ability-name">水の呼吸 // WATER BREATHING</h4>
          <p class="ability-desc" id="ability-desc">Descripción de la habilidad...</p>
        </div>
      </div>

      <button class="action-btn" id="confirm-btn" type="button">
        <span>⚔ CONFIRMAR EXTERMINIO // ENGAGE</span>
      </button>
    `;
  }

  get elements() {
    return {
      code: this.querySelector("#slayer-code"),
      bio: this.querySelector("#slayer-bio"),
      abilityName: this.querySelector("#ability-name"),
      abilityDesc: this.querySelector("#ability-desc"),
      statStrength: this.querySelector("#stat-strength"),
      statSpeed: this.querySelector("#stat-speed"),
      statTechnique: this.querySelector("#stat-technique"),
      statConcentration: this.querySelector("#stat-concentration"),
      valStrength: this.querySelector("#val-strength"),
      valSpeed: this.querySelector("#val-speed"),
      valTechnique: this.querySelector("#val-technique"),
      valConcentration: this.querySelector("#val-concentration"),
      confirmBtn: this.querySelector("#confirm-btn"),
    };
  }

  typeText(element, text, speed = 15) {
    if (this._typeInterval) clearInterval(this._typeInterval);
    element.textContent = "";
    let idx = 0;
    this._typeInterval = setInterval(() => {
      if (idx < text.length) {
        element.textContent += text.charAt(idx);
        idx++;
      } else {
        clearInterval(this._typeInterval);
        this._typeInterval = null;
      }
    }, speed);
  }

  animateStat(element, target) {
    let current = 0;
    const duration = 700;
    const step = Math.max(Math.floor(duration / Math.max(target, 1)), 10);
    const timer = setInterval(() => {
      current += Math.max(1, Math.floor(target / 30));
      if (current >= target) {
        element.textContent = `${target}`;
        clearInterval(timer);
      } else {
        element.textContent = `${current}`;
      }
    }, step);
  }

  update(data) {
    const el = this.elements;
    el.code.textContent = data.code;
    this.typeText(el.bio, data.bio, 10);
    el.abilityName.textContent = data.abilityTitle;
    this.typeText(el.abilityDesc, data.abilityDesc, 12);

    const statMap = {
      strength: el.statStrength,
      speed: el.statSpeed,
      technique: el.statTechnique,
      concentration: el.statConcentration,
    };
    const valMap = {
      strength: el.valStrength,
      speed: el.valSpeed,
      technique: el.valTechnique,
      concentration: el.valConcentration,
    };

    for (const key of Object.keys(data.stats)) {
      const bar = statMap[key];
      const val = valMap[key];
      const target = data.stats[key];
      val.textContent = "0";
      bar.style.width = "0%";
      this.animateStat(val, target);
      setTimeout(() => {
        bar.style.width = `${target}%`;
      }, 60);
    }
  }
}

customElements.define("slayer-details", SlayerDetails);
