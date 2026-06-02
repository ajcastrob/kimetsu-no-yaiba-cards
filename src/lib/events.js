import { CHARACTER_TO_STYLE } from "./data.js";
import { pulseInterface } from "./atmosphere.js";
import { selectSlayer } from "./slayer-selection.js";

export function wireEvents(ctx) {
  document.addEventListener("slayer-hover", (e) => {
    const style = CHARACTER_TO_STYLE[e.detail.character] || ctx.currentStyle;
    ctx.audio.playChime(style);
  });

  document.addEventListener("slayer-click", (e) => {
    const style = CHARACTER_TO_STYLE[e.detail.character] || ctx.currentStyle;
    ctx.audio.playSelectionImpact(style);
  });

  document.addEventListener("slayer-change", (e) => {
    selectSlayer(e.detail.character, ctx);
  });

  const btn = ctx.elements.detailsPanel.elements.confirmBtn;
  btn.addEventListener("click", () => {
    ctx.audio.playClashSound(ctx.currentStyle);
    pulseInterface("blade-flash", ctx);
    const span = btn.querySelector("span");
    const original = span ? span.textContent : btn.textContent;

    if (span) span.textContent = "⚔ DESENVAINADO // BLADE FLASH";
    else btn.textContent = "⚔ DESENVAINADO // BLADE FLASH";

    ctx.elements.appContainer.style.borderColor = "var(--accent-color)";
    ctx.elements.appContainer.style.boxShadow = `0 0 50px var(--accent-glow), 0 20px 60px rgba(0,0,0,0.6)`;
    btn.style.background = "var(--accent-color)";
    btn.style.color = "var(--bg-deep)";
    btn.style.fontWeight = "700";

    setTimeout(() => {
      if (span) span.textContent = original;
      else btn.textContent = original;
      ctx.elements.appContainer.style.borderColor = "";
      ctx.elements.appContainer.style.boxShadow = "";
      btn.style.background = "";
      btn.style.color = "";
      btn.style.fontWeight = "";
    }, 2200);
  });

  window.addEventListener("click", () => ctx.audio.unlock());
  window.addEventListener("keydown", () => ctx.audio.unlock());
}
