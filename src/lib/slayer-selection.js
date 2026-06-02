import { SLAYERS, CHARACTER_TO_STYLE } from "./data.js";
import { syncAtmosphere, pulseInterface } from "./atmosphere.js";

export function selectSlayer(id, ctx) {
  const data = SLAYERS[id];
  if (!data) return;

  const style = CHARACTER_TO_STYLE[id] || "water";
  ctx.elements.detailsPanel.update(data);
  ctx.elements.particleCanvas.setStyle(style);
  ctx.currentStyle = style;
  syncAtmosphere(style, ctx);
  pulseInterface("style-switch", ctx);

  if (data.audioFile) {
    ctx.elements.musicPlayer.changeTrack(data.audioFile, data.audioTitle);
  }

  ctx.audio.playDrawSound(style);
}
