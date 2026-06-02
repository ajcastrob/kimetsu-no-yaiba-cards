import gsap from "gsap";

export function createWaterBreathingTimeline(element) {
  if (!element) return null;

  const tl = gsap.timeline({ repeat: -1 });

  tl.to(element, {
    opacity: 0.8,
    duration: 2.5,
    ease: "sine.inOut",
  })
    .to(element, {
      opacity: 0.3,
      duration: 2.5,
      ease: "sine.inOut",
    });

  return tl;
}

export function createThunderBreathingTimeline(element) {
  if (!element) return null;

  gsap.set(element, { willChange: "transform, opacity" });

  const tl = gsap.timeline({ repeat: -1 });

  tl.to(element, {
    opacity: 0.55,
    scaleX: 1.03,
    scaleY: 1.01,
    duration: 0.625,
    ease: "power2.inOut",
  })
    .to(element, {
      opacity: 0.2,
      scaleX: 0.99,
      scaleY: 1,
      duration: 0.625,
      ease: "power2.inOut",
    })
    .to(element, {
      opacity: 0.4,
      scaleX: 1.02,
      scaleY: 1,
      duration: 0.625,
      ease: "power2.inOut",
    })
    .to(element, {
      opacity: 0.15,
      scaleX: 1,
      scaleY: 1,
      duration: 0.625,
      ease: "power2.inOut",
    });

  return tl;
}

export function createBeastBreathingTimeline(element) {
  if (!element) return null;

  gsap.set(element, { willChange: "clip-path, opacity" });

  const tl = gsap.timeline({ repeat: -1 });

  tl.to(element, {
    opacity: 0.7,
    clipPath: "polygon(5% 5%, 95% 0, 95% 95%, 0 95%)",
    duration: 0.75,
    ease: "power2.inOut",
  })
    .to(element, {
      opacity: 0.2,
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      duration: 0.75,
      ease: "power2.inOut",
    });

  return tl;
}

export function startBreathingEffect(effect, element) {
  if (!element) return null;

  switch (effect) {
    case "water":
      return createWaterBreathingTimeline(element);
    case "thunder":
      return createThunderBreathingTimeline(element);
    case "beast":
      return createBeastBreathingTimeline(element);
    default:
      return null;
  }
}
