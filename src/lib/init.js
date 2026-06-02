import { syncAtmosphere } from "./atmosphere.js";
import { selectSlayer } from "./slayer-selection.js";

export function initApp(ctx) {
  ctx.elements.bgParticles.refresh(ctx.currentStyle);
  ctx.elements.particleCanvas.start();
  syncAtmosphere(ctx.currentStyle, ctx);

  const activeRadio = document.querySelector(
    'slayer-card input[type="radio"]:checked',
  );
  if (activeRadio) {
    const card = activeRadio.closest("slayer-card");
    const charId = card.getAttribute("data-character");
    selectSlayer(charId, ctx);
  }
}
