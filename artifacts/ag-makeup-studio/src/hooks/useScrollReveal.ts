import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION } from "@/lib/motion/config";
import { useMotion } from "@/components/motion/motion-context";

gsap.registerPlugin(ScrollTrigger);

type RevealVariant = "fade-up" | "blur" | "fade";

interface UseScrollRevealOptions {
  delay?: number;
  variant?: RevealVariant;
  stagger?: number | false;
  start?: string;
  disabled?: boolean;
}

const VARIANT_FROM: Record<RevealVariant, gsap.TweenVars> = {
  "fade-up": { autoAlpha: 0, y: 48 },
  blur: { autoAlpha: 0, y: 36, filter: "blur(10px)" },
  fade: { autoAlpha: 0 },
};

const VARIANT_TO: Record<RevealVariant, gsap.TweenVars> = {
  "fade-up": { autoAlpha: 1, y: 0 },
  blur: { autoAlpha: 1, y: 0, filter: "blur(0px)" },
  fade: { autoAlpha: 1 },
};

export function useScrollReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  {
    delay = 0,
    variant = "fade-up",
    stagger = false,
    start = MOTION.scroll.start,
    disabled = false,
  }: UseScrollRevealOptions = {}
) {
  const { isReady } = useMotion();

  useEffect(() => {
    if (disabled || !ref.current) return;
    const el = ref.current;
    const targets = stagger ? Array.from(el.children) : [el];
    gsap.set(targets, VARIANT_FROM[variant]);
  }, [ref, variant, stagger, disabled]);

  useEffect(() => {
    if (!isReady || disabled || !ref.current) return;

    const el = ref.current;
    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el;

      gsap.set(targets, VARIANT_FROM[variant]);

      gsap.fromTo(
        targets,
        VARIANT_FROM[variant],
        {
          ...VARIANT_TO[variant],
          duration: MOTION.duration.slow,
          delay,
          stagger: stagger ? (typeof stagger === "number" ? stagger : MOTION.stagger.default) : 0,
          ease: MOTION.ease.luxury,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [isReady, ref, delay, variant, stagger, start, disabled]);
}

/** Batch-init reveals via data attributes (gallery cards, images, etc.) */
export function useScrollRevealBatch(isReady: boolean) {
  useEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal='fade-up']").forEach((el) => {
        gsap.set(el, { autoAlpha: 0, y: 40 });
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: MOTION.duration.slow,
            ease: MOTION.ease.luxury,
            scrollTrigger: { trigger: el, start: MOTION.scroll.start, once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal='image']").forEach((el) => {
        const img = el.querySelector("img");
        const target = img ?? el;
        gsap.set(target, { autoAlpha: 0, scale: 1.06, filter: "blur(4px)" });
        gsap.fromTo(
          target,
          { autoAlpha: 0, scale: 1.06, filter: "blur(4px)" },
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.8,
            ease: MOTION.ease.cinematic,
            scrollTrigger: { trigger: el, start: MOTION.scroll.start, once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((parent) => {
        const children = parent.children;
        if (!children.length) return;
        gsap.set(children, { autoAlpha: 0, y: 36, filter: "blur(6px)" });
        gsap.fromTo(
          children,
          { autoAlpha: 0, y: 36, filter: "blur(6px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: MOTION.duration.medium,
            stagger: MOTION.stagger.default,
            ease: MOTION.ease.luxury,
            scrollTrigger: { trigger: parent, start: MOTION.scroll.start, once: true },
          }
        );
      });
    });

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [isReady]);
}
