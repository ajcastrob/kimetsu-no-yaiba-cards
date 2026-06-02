export class MusicPlayer extends HTMLElement {
  connectedCallback() {
    this.classList.add("music-player");
    this.id = "music-player";
    this.render();
    this.attachEvents();
  }

  render() {
    this.innerHTML = `
      <div class="music-info">
        <span class="music-label">♪ TEMA DEL PERSONAJE</span>
        <span class="music-title" id="music-title">Kamado Tanjiro no Uta</span>
      </div>
      <div class="music-controls">
        <span class="music-dot"></span>
        <audio id="music-audio" preload="auto" loop></audio>
      </div>
    `;
  }

  get audio() {
    return this.querySelector("#music-audio");
  }

  get titleEl() {
    return this.querySelector("#music-title");
  }

  attachEvents() {
    const audio = this.audio;

    audio.addEventListener("play", () => this.setState("playing"));
    audio.addEventListener("waiting", () => this.setState("buffering"));
    audio.addEventListener("pause", () => this.setState("idle"));
    audio.addEventListener("ended", () => {
      audio.currentTime = 0;
      audio.play();
    });
  }

  setState(state) {
    this.classList.toggle("is-playing", state === "playing");
    this.classList.toggle("is-buffering", state === "buffering");
  }

  changeTrack(src, title) {
    const audio = this.audio;
    this.titleEl.textContent = title || "";
    audio.src = src;
    this.setState("buffering");
    audio.play().then(() => {
      this.setState("playing");
    }).catch(() => {
      this.setState("idle");
    });
  }
}

customElements.define("music-player", MusicPlayer);
