/** Luxury cinematic motion tokens — slow, intentional, editorial */
export const MOTION = {
  ease: {
    luxury: "power3.out",
    cinematic: "power2.inOut",
    reveal: "power4.out",
  },
  duration: {
    slow: 1.6,
    medium: 1.2,
    fast: 0.9,
  },
  stagger: {
    tight: 0.08,
    default: 0.12,
    wide: 0.18,
  },
  scroll: {
    start: "top 88%",
    startHero: "top 90%",
  },
} as const;
