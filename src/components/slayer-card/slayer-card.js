function loadCSS(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
loadCSS(new URL("./slayer-card.css", import.meta.url).href);

export class SlayerCard extends HTMLElement {
  static get observedAttributes() {
    return ["character", "name-kanji", "name-romaji", "rank", "breathing-style", "breathing-kanji", "image", "image-alt", "effect", "checked"];
  }

  connectedCallback() {
    this.render();
    this.attachEvents();
  }

  render() {
    const char = this.getAttribute("character") || "";
    const nameKanji = this.getAttribute("name-kanji") || "";
    const nameRomaji = this.getAttribute("name-romaji") || "";
    const rank = this.getAttribute("rank") || "";
    const breathingStyle = this.getAttribute("breathing-style") || "";
    const breathingKanji = this.getAttribute("breathing-kanji") || "";
    const image = this.getAttribute("image") || "";
    const imageAlt = this.getAttribute("image-alt") || "";
    const effect = this.getAttribute("effect") || "";
    const checked = this.hasAttribute("checked");

    this.classList.add("character-card", `card-${char}`);
    this.setAttribute("data-character", char);

    this.innerHTML = `
      <label class="card-label">
        <input type="radio" name="slayer" id="radio-${char}" ${checked ? "checked" : ""} />
        <div class="card-inner">
          <div class="breathing-effect ${effect}-effect" data-effect="${effect}">
            <div class="particle-layer" data-style="${effect}"></div>
          </div>
          <div class="corner-frame">
            <span class="corner tl"></span>
            <span class="corner tr"></span>
            <span class="corner bl"></span>
            <span class="corner br"></span>
          </div>
          <div class="img-wrap">
            <img src="${image}" alt="${imageAlt}" class="slayer-img" loading="lazy" />
            <div class="img-overlay"></div>
            <span class="breathing-kanji">${breathingKanji}</span>
          </div>
          <div class="card-meta">
            <span class="slayer-rank">${rank}</span>
            <h3 class="slayer-name">${nameKanji}</h3>
            <div class="slayer-sub">
              <span class="romaji-name">${nameRomaji}</span>
              <span class="breathing-style">${breathingStyle}</span>
            </div>
          </div>
        </div>
      </label>
    `;
  }

  attachEvents() {
    const radio = this.querySelector('input[type="radio"]');
    const char = this.getAttribute("character");

    this.addEventListener("mouseenter", () => {
      if (!radio.checked) {
        this.dispatchEvent(new CustomEvent("slayer-hover", {
          detail: { character: char },
          bubbles: true,
        }));
      }
    });

    this.addEventListener("click", () => {
      if (!radio.checked) {
        this.dispatchEvent(new CustomEvent("slayer-click", {
          detail: { character: char },
          bubbles: true,
        }));
      }
    });

    radio.addEventListener("change", () => {
      if (radio.checked) {
        this.dispatchEvent(new CustomEvent("slayer-change", {
          detail: { character: char },
          bubbles: true,
        }));
      }
    });
  }
}

customElements.define("slayer-card", SlayerCard);
