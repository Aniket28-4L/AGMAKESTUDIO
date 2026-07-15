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

  // Stage 1 (Mount): Split title text and set initial hidden states immediately on frame one.
  // This guarantees the elements are prepared and hidden before the preloader curtains open.
  useEffect(() => {
    const { titleRef, ruleRef, eyebrowRef, ctaRef, subtitleRef, videoRef, parallaxRef } = refs;
    const title = titleRef.current;
    const video = videoRef.current;

    let split: SplitType | null = null;

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
    if (video) {
      gsap.set(video, { scale: 1.18, autoAlpha: 0.6, filter: "blur(4px)" });
    }
    if (parallaxRef.current) {
      gsap.set(parallaxRef.current, { scale: 1.12, autoAlpha: 0 });
    }

    return () => {
      split?.revert();
    };
  }, []); // Run exactly once on mount

  // Stage 2 (Animation): Construct the entry animation timeline.
  // This plays only when the curtains are finished opening (isReady === true).
  useEffect(() => {
    if (!isReady) return;

    const { videoRef, ruleRef, eyebrowRef, ctaRef, subtitleRef, parallaxRef, titleRef } = refs;
    const video = videoRef.current;
    const title = titleRef.current;

    // Access the split characters created in Stage 1
    const words = title ? title.querySelectorAll(".hero-split-word") : null;

    const ctx = gsap.context(() => {
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

      const tl = gsap.timeline({
        defaults: { ease: MOTION.ease.luxury },
        delay: 0.1, // Small delay matching curtain timing config
      });

      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { autoAlpha: 0, y: 32, filter: "blur(6px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.2 },
          0
        );
      }

      if (words && words.length > 0) {
        tl.to(
          words,
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
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable
  }, [isReady, lenis]);
}
