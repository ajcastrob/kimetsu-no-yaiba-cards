import { SOUND_PROFILES, STYLE_TO_CHARACTER } from "./data.js";

export function syncAtmosphere(style, ctx) {
  const profile = SOUND_PROFILES[style] || SOUND_PROFILES.water;
  const charId = STYLE_TO_CHARACTER[style] || "tanjiro";
  document.body.dataset.breathing = style;
  document.documentElement.style.setProperty("--ambient-x", profile.ambientX);
  document.documentElement.style.setProperty("--ambient-y", profile.ambientY);
  document.documentElement.style.setProperty("--sensor-color", profile.bgColor);
  document.documentElement.style.setProperty("--sensor-glow", profile.bgGlow);
  if (ctx.elements.appContainer) ctx.elements.appContainer.dataset.character = charId;
  if (ctx.elements.detailsPanel) ctx.elements.detailsPanel.dataset.character = charId;
  ctx.elements.bgParticles.refresh(style);
}

export function pulseInterface(type = "style-switch", ctx) {
  const { appContainer } = ctx.elements;
  if (!appContainer) return;
  appContainer.classList.remove("is-style-switching", "is-blade-flash");
  void appContainer.offsetWidth;
  appContainer.classList.add(
    type === "blade-flash" ? "is-blade-flash" : "is-style-switching",
  );
}
