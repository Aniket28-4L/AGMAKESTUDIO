import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { MOTION } from "@/lib/motion/config";
import { useMotion } from "@/components/motion/motion-context";

interface HeroMotionRefs {
  videoRef: RefObject<HTMLVideoElement | null>;
  titleRef: RefObject<HTMLHeadingElement | null>;
  ruleRef: RefObject<HTMLDivElement | null>;
  eyebrowRef: RefObject<HTMLDivElement | null>;
  ctaRef: RefObject<HTMLDivElement | null>;
  subtitleRef: RefObject<HTMLDivElement | null>;
  parallaxRef: RefObject<HTMLDivElement | null>;
}

export function useHeroMotion(refs: HeroMotionRefs) {
  const { isReady, lenis } = useMotion();

  useEffect(() => {
    if (!isReady) return;

    const { videoRef, titleRef, ruleRef, eyebrowRef, ctaRef, subtitleRef, parallaxRef } = refs;
    let split: SplitType | null = null;

    const ctx = gsap.context(() => {
      const video = videoRef.current;
      const title = titleRef.current;

      if (video) {
        gsap.fromTo(
          video,
          { scale: 1.18, autoAlpha: 0.6, filter: "blur(4px)" },
          {
            scale: 1.08,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 2.4,
            ease: MOTION.ease.cinematic,
          }
        );
        gsap.to(video, {
          scale: 1.12,
          duration: 22,
          ease: "none",
          repeat: -1,
          yoyo: true,
          delay: 2.4,
        });
      }

      if (parallaxRef.current) {
        gsap.fromTo(
          parallaxRef.current,
          { scale: 1.12, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 2.2, ease: MOTION.ease.cinematic }
        );
      }

      if (title) {
        gsap.set(title, { autoAlpha: 1 });
        split = new SplitType(title, {
          types: "lines,words",
          lineClass: "hero-split-line",
          wordClass: "hero-split-word",
        });

        gsap.set(split.words, { yPercent: 110, autoAlpha: 0 });
        gsap.set(split.lines, { overflow: "hidden", display: "block" });
      }

      if (eyebrowRef.current) {
        gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 28 });
      }
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { autoAlpha: 0, y: 24 });
      }
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { autoAlpha: 0, y: 16 });
      }
      if (ruleRef.current) {
        gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: "left center" });
      }

      const tl = gsap.timeline({
        defaults: { ease: MOTION.ease.luxury },
        delay: 0.1, // Slight delay to let the curtains begin moving
      });

      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { autoAlpha: 0, y: 32, filter: "blur(6px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.2 },
          0
        );
      }

      if (split?.words) {
        tl.to(
          split.words,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.4,
            stagger: 0.06,
            ease: MOTION.ease.reveal,
          },
          0.25
        );
      }

      if (ruleRef.current) {
        tl.fromTo(
          ruleRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 1.4, ease: MOTION.ease.cinematic },
          0.9
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 1.4 },
          1.2
        );
      }

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 1.6 },
          1.6
        );
      }

      if (parallaxRef.current && lenis) {
        gsap.to(parallaxRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: parallaxRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    });

    return () => {
      split?.revert();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable
  }, [isReady, lenis]);
}
