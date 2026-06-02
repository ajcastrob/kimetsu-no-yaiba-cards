function loadCSS(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
loadCSS(new URL("./music-player.css", import.meta.url).href);

export class MusicPlayer extends HTMLElement {
  connectedCallback() {
    this.classList.add("music-player");
    this.id = "music-player";
    this._volume = 0.7;
    this._muted = false;
    this.render();
    this.cacheElements();
    this.attachEvents();
  }

  render() {
    this.innerHTML = `
      <div class="mp-header">
        <span class="mp-kanji">♪</span>
        <div class="mp-info">
          <span class="mp-label">再生中 // NOW PLAYING</span>
          <span class="mp-title" id="music-title">—</span>
        </div>
        <button class="mp-expand" id="mp-expand" aria-label="Toggle player">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 5h8M5 1v8" stroke="currentColor" stroke-width="1.2"/>
          </svg>
        </button>
      </div>
      <div class="mp-body">
        <div class="mp-progress-wrap">
          <div class="mp-progress" id="mp-progress">
            <div class="mp-progress-fill" id="mp-progress-fill"></div>
            <div class="mp-progress-thumb" id="mp-progress-thumb"></div>
          </div>
          <div class="mp-times">
            <span class="mp-time-current" id="mp-time-current">0:00</span>
            <span class="mp-time-duration" id="mp-time-duration">0:00</span>
          </div>
        </div>
        <div class="mp-controls">
          <button class="mp-btn mp-btn-prev" id="mp-btn-prev" aria-label="Restart">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2v8M10 2L4 6l6 4V2z" fill="currentColor"/>
            </svg>
          </button>
          <button class="mp-btn mp-btn-play" id="mp-btn-play" aria-label="Play/Pause">
            <svg class="mp-icon-play" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 2l10 6-10 6V2z" fill="currentColor"/>
            </svg>
            <svg class="mp-icon-pause" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 2h3v12H3zM10 2h3v12h-3z" fill="currentColor"/>
            </svg>
          </button>
          <button class="mp-btn mp-btn-next" id="mp-btn-next" aria-label="Restart">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 2v8M2 2l6 4-6 4V2z" fill="currentColor"/>
            </svg>
          </button>
          <div class="mp-volume-wrap">
            <button class="mp-btn mp-btn-vol" id="mp-btn-vol" aria-label="Mute">
              <svg class="mp-icon-vol" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 5h2l3-3v10l-3-3H2a1 1 0 01-1-1V6a1 1 0 011-1z" fill="currentColor"/>
                <path class="mp-vol-wave1" d="M9 5a3 3 0 010 4" stroke="currentColor" stroke-width="1.2" fill="none"/>
                <path class="mp-vol-wave2" d="M11 3a6 6 0 010 8" stroke="currentColor" stroke-width="1.2" fill="none"/>
                <line class="mp-vol-mute" x1="9" y1="5" x2="13" y2="9" stroke="currentColor" stroke-width="1.2"/>
                <line class="mp-vol-mute" x1="13" y1="5" x2="9" y2="9" stroke="currentColor" stroke-width="1.2"/>
              </svg>
            </button>
            <div class="mp-volume" id="mp-volume">
              <div class="mp-volume-fill" id="mp-volume-fill"></div>
              <div class="mp-volume-thumb" id="mp-volume-thumb"></div>
            </div>
          </div>
        </div>
      </div>
      <audio id="music-audio" preload="auto" loop></audio>
    `;
  }

  cacheElements() {
    this.els = {
      audio: this.querySelector("#music-audio"),
      title: this.querySelector("#music-title"),
      playBtn: this.querySelector("#mp-btn-play"),
      prevBtn: this.querySelector("#mp-btn-prev"),
      nextBtn: this.querySelector("#mp-btn-next"),
      expandBtn: this.querySelector("#mp-expand"),
      progress: this.querySelector("#mp-progress"),
      progressFill: this.querySelector("#mp-progress-fill"),
      progressThumb: this.querySelector("#mp-progress-thumb"),
      timeCurrent: this.querySelector("#mp-time-current"),
      timeDuration: this.querySelector("#mp-time-duration"),
      volBtn: this.querySelector("#mp-btn-vol"),
      volume: this.querySelector("#mp-volume"),
      volumeFill: this.querySelector("#mp-volume-fill"),
      volumeThumb: this.querySelector("#mp-volume-thumb"),
    };
    this.els.audio.volume = this._volume;
    this.updateVolumeUI();
  }

  attachEvents() {
    const { audio, playBtn, prevBtn, nextBtn, expandBtn, progress, volume, volBtn } = this.els;

    playBtn.addEventListener("click", () => this.togglePlay());
    prevBtn.addEventListener("click", () => this.restart());
    nextBtn.addEventListener("click", () => this.restart());
    expandBtn.addEventListener("click", () => this.toggleExpand());
    volBtn.addEventListener("click", () => this.toggleMute());

    audio.addEventListener("play", () => this.setState("playing"));
    audio.addEventListener("pause", () => this.setState("idle"));
    audio.addEventListener("waiting", () => this.setState("buffering"));
    audio.addEventListener("ended", () => {
      audio.currentTime = 0;
      audio.play();
    });
    audio.addEventListener("loadedmetadata", () => {
      this.els.timeDuration.textContent = this.formatTime(audio.duration);
    });
    audio.addEventListener("timeupdate", () => this.updateProgress());

    let draggingProgress = false;
    progress.addEventListener("pointerdown", (e) => {
      draggingProgress = true;
      this.seekFromEvent(e);
      progress.setPointerCapture(e.pointerId);
    });
    progress.addEventListener("pointermove", (e) => {
      if (draggingProgress) this.seekFromEvent(e);
    });
    progress.addEventListener("pointerup", () => { draggingProgress = false; });

    let draggingVolume = false;
    volume.addEventListener("pointerdown", (e) => {
      draggingVolume = true;
      this.setVolumeFromEvent(e);
      volume.setPointerCapture(e.pointerId);
    });
    volume.addEventListener("pointermove", (e) => {
      if (draggingVolume) this.setVolumeFromEvent(e);
    });
    volume.addEventListener("pointerup", () => { draggingVolume = false; });
  }

  togglePlay() {
    const { audio } = this.els;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  restart() {
    const { audio } = this.els;
    audio.currentTime = 0;
    if (audio.paused) audio.play().catch(() => {});
  }

  toggleExpand() {
    this.classList.toggle("is-expanded");
  }

  toggleMute() {
    this._muted = !this._muted;
    this.els.audio.muted = this._muted;
    this.updateVolumeUI();
  }

  setState(state) {
    this.classList.toggle("is-playing", state === "playing");
    this.classList.toggle("is-buffering", state === "buffering");
  }

  changeTrack(src, title) {
    const { audio, title: titleEl } = this.els;
    titleEl.textContent = title || "";
    audio.src = src;
    this.setState("buffering");
    audio.play().then(() => {
      this.setState("playing");
    }).catch(() => {
      this.setState("idle");
    });
  }

  updateProgress() {
    const { audio, progressFill, progressThumb, timeCurrent, timeDuration } = this.els;
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${pct}%`;
    progressThumb.style.left = `${pct}%`;
    timeCurrent.textContent = this.formatTime(audio.currentTime);
  }

  seekFromEvent(e) {
    const { audio, progress } = this.els;
    if (!audio.duration) return;
    const rect = progress.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
  }

  setVolumeFromEvent(e) {
    const { volume } = this.els;
    const rect = volume.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this._volume = pct;
    this.els.audio.volume = pct;
    if (pct > 0 && this._muted) {
      this._muted = false;
      this.els.audio.muted = false;
    }
    this.updateVolumeUI();
  }

  updateVolumeUI() {
    const { volumeFill, volumeThumb, volBtn } = this.els;
    const vol = this._muted ? 0 : this._volume;
    const pct = vol * 100;
    volumeFill.style.width = `${pct}%`;
    volumeThumb.style.left = `${pct}%`;
    volBtn.classList.toggle("is-muted", this._muted || this._volume === 0);
  }

  formatTime(s) {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }
}

customElements.define("music-player", MusicPlayer);
