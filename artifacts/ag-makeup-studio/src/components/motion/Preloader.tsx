import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";

interface PreloaderProps {
  onComplete: () => void;
}

/** Couture easing — slow, weighted, editorial */
const EASE_IN = "power4.in";
const EASE_OUT = "expo.out";
const EASE_IO = "power4.inOut";

export function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineMidRef = useRef<HTMLDivElement>(null);
  const lineBottomRef = useRef<HTMLDivElement>(null);
  const frameLeftRef = useRef<HTMLDivElement>(null);
  const frameRightRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const pearlsRef = useRef<HTMLDivElement>(null);

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    document.body.style.overflow = "";
    document.documentElement.classList.remove("preloader-active");
    onCompleteRef.current();
  };

  useLayoutEffect(() => {
    completedRef.current = false;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("preloader-active");

    const root = rootRef.current;
    const overlay = overlayRef.current;
    const bg = bgRef.current;
    const shimmer = shimmerRef.current;
    const vignette = vignetteRef.current;
    const monogram = monogramRef.current;
    const sweep = sweepRef.current;
    const heading = headingRef.current;
    const tagline = taglineRef.current;
    const lineTop = lineTopRef.current;
    const lineMid = lineMidRef.current;
    const lineBottom = lineBottomRef.current;
    const frameLeft = frameLeftRef.current;
    const frameRight = frameRightRef.current;
    const progress = progressRef.current;
    const grain = grainRef.current;
    const ambient = ambientRef.current;
    const curtainLeft = curtainLeftRef.current;
    const curtainRight = curtainRightRef.current;
    const pearls = pearlsRef.current;

    if (
      !root ||
      !overlay ||
      !bg ||
      !shimmer ||
      !vignette ||
      !monogram ||
      !sweep ||
      !heading ||
      !tagline ||
      !lineTop ||
      !lineMid ||
      !lineBottom ||
      !frameLeft ||
      !frameRight ||
      !progress ||
      !grain ||
      !ambient ||
      !curtainLeft ||
      !curtainRight ||
      !pearls
    ) {
      finish();
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let headingSplit: SplitType | null = null;
    let taglineSplit: SplitType | null = null;

    const pearlEls = pearls.querySelectorAll<HTMLElement>(".preloader-pearl");

    const ctx = gsap.context(() => {
      gsap.set(overlay, { autoAlpha: 0 });
      gsap.set(bg, { scale: 1.08, autoAlpha: 1 });
      gsap.set(shimmer, { xPercent: -120, autoAlpha: 0 });
      gsap.set(vignette, { autoAlpha: 0 });
      gsap.set(monogram, { autoAlpha: 0, scale: 0.94 });
      gsap.set(sweep, { xPercent: -130, autoAlpha: 0 });
      gsap.set(grain, { autoAlpha: 0 });
      gsap.set(ambient, { scale: 1.15, autoAlpha: 0 });
      gsap.set([lineTop, lineMid, lineBottom], { scaleX: 0, autoAlpha: 0 });
      gsap.set([frameLeft, frameRight], { scaleY: 0, autoAlpha: 0, transformOrigin: "center top" });
      gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(curtainLeft, { yPercent: 100 });
      gsap.set(curtainRight, { yPercent: 100 });
      gsap.set(pearlEls, { autoAlpha: 0, scale: 0.4, y: 24 });

      if (!reducedMotion) {
        headingSplit = new SplitType(heading, {
          types: "chars",
          charClass: "preloader-split-char",
        });
        taglineSplit = new SplitType(tagline, {
          types: "words",
          wordClass: "preloader-split-word",
        });
        gsap.set(headingSplit.chars, { yPercent: 115, autoAlpha: 0, rotateX: -40 });
        gsap.set(taglineSplit.words, {
          yPercent: 110,
          autoAlpha: 0,
          filter: "blur(12px)",
        });
      } else {
        gsap.set([heading, tagline], { autoAlpha: 0, y: 16 });
      }

      const headingChars = headingSplit?.chars ?? [heading];
      const taglineWords = taglineSplit?.words ?? [tagline];

      const runExit = () => {
        const exitTl = gsap.timeline({ onComplete: finish });

        exitTl
          .to(sweep, { xPercent: 130, autoAlpha: 0.35, duration: 1, ease: EASE_IO }, 0)
          .to(
            headingChars,
            {
              yPercent: -90,
              autoAlpha: 0,
              filter: "blur(10px)",
              duration: 0.8,
              stagger: 0.01,
              ease: EASE_IN,
            },
            0
          )
          .to(
            taglineWords,
            {
              yPercent: -70,
              autoAlpha: 0,
              filter: "blur(8px)",
              duration: 0.7,
              stagger: 0.03,
              ease: EASE_IN,
            },
            0.05
          )
          .to([lineTop, lineMid, lineBottom], {
            scaleX: 0,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.03,
            ease: EASE_IN,
          }, 0.08)
          .to([frameLeft, frameRight], {
            scaleY: 0,
            autoAlpha: 0,
            duration: 0.6,
            stagger: 0.03,
            ease: EASE_IN,
          }, 0.08)
          .to(monogram, { autoAlpha: 0, scale: 1.05, duration: 0.7, ease: EASE_IN }, 0.05)
          .to(pearlEls, { autoAlpha: 0, y: -40, scale: 0.5, duration: 0.7, stagger: 0.03 }, 0.1)
          .to(
            [curtainLeft, curtainRight],
            { yPercent: 0, duration: 1.2, ease: EASE_IO, stagger: 0.05 },
            0.2
          )
          .to(overlay, { yPercent: -100, duration: 1.5, ease: EASE_IO }, 0.4)
          .to(bg, { scale: 1.12, duration: 1.5, ease: EASE_IN }, 0.5)
          .to(overlay, { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");
      };

      if (reducedMotion) {
        gsap
          .timeline({ onComplete: runExit })
          .to(overlay, { autoAlpha: 1, duration: 0.4 })
          .to(vignette, { autoAlpha: 1, duration: 0.4 }, 0)
          .to([heading, tagline], { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }, 0.1)
          .to({}, { duration: 0.5 });
        return;
      }

      // —— ACT I: Pastel world materialises ——
      const introTl = gsap.timeline();

      introTl
        .to(overlay, { autoAlpha: 1, duration: 0.6, ease: "power2.out" })
        .to(vignette, { autoAlpha: 1, duration: 1.2, ease: EASE_OUT }, 0.1)
        .to(ambient, { autoAlpha: 1, scale: 1, duration: 1.5, ease: EASE_OUT }, 0)
        .to(grain, { autoAlpha: 0.22, duration: 1.2, ease: EASE_OUT }, 0.2)
        .to(monogram, { autoAlpha: 0.07, scale: 1, duration: 1.5, ease: EASE_OUT }, 0.2)
        .to(
          pearlEls,
          {
            autoAlpha: 0.7,
            scale: 1,
            y: 0,
            duration: 1.4,
            stagger: { each: 0.1, from: "center" },
            ease: EASE_OUT,
          },
          0.3
        )
        .to(
          [frameLeft, frameRight],
          { scaleY: 1, autoAlpha: 1, duration: 1.2, ease: EASE_IO, stagger: 0.08 },
          0.4
        );

      // Silk shimmer + light sweep (continuous luxury motion)
      gsap.to(shimmer, {
        xPercent: 120,
        autoAlpha: 0.45,
        duration: 4.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(ambient, {
        scale: 1.04,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1,
      });

      gsap.to(monogram, {
        scale: 1.03,
        duration: 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2,
      });

      pearlEls.forEach((pearl, i) => {
        gsap.to(pearl, {
          y: `+=${18 + i * 8}`,
          x: `+=${(i % 2 === 0 ? 1 : -1) * 14}`,
          duration: 6 + i * 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // —— ACT II: Couture typography ——
      const typeTl = gsap.timeline();

      typeTl
        .to(sweep, { xPercent: 130, autoAlpha: 0.5, duration: 1.5, ease: EASE_IO }, 0)
        .to(sweep, { autoAlpha: 0, duration: 0.5 }, 1.2)
        .to(lineTop, { scaleX: 1, autoAlpha: 1, duration: 1, ease: EASE_IO }, 0.1)
        .to(
          headingChars,
          {
            yPercent: 0,
            autoAlpha: 1,
            rotateX: 0,
            duration: 1,
            stagger: 0.03,
            ease: EASE_OUT,
          },
          0.2
        )
        .to(lineMid, { scaleX: 1, autoAlpha: 1, duration: 0.8, ease: EASE_IO }, 0.6)
        .to(
          taglineWords,
          {
            yPercent: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.05,
            ease: EASE_OUT,
          },
          0.8
        )
        .to(lineBottom, { scaleX: 1, autoAlpha: 1, duration: 1, ease: EASE_IO }, 1);

      // —— ACT III: Lingering luxury hold ——
      const holdTl = gsap.timeline();

      holdTl
        .to(progress, { scaleX: 1, duration: 1.2, ease: EASE_IO }, 0)
        .to(heading, { letterSpacing: "0.03em", duration: 0.8, ease: "sine.inOut" }, 0.2)
        .to({}, { duration: 0.3 });

      gsap
        .timeline({ onComplete: runExit })
        .add(introTl)
        .add(typeTl, "-=0.3")
        .add(holdTl, "-=0.2");
    }, root);

    const fallback = window.setTimeout(finish, 6000);

    return () => {
      window.clearTimeout(fallback);
      headingSplit?.revert();
      taglineSplit?.revert();
      ctx.revert();
      document.body.style.overflow = "";
      document.documentElement.classList.remove("preloader-active");
    };
  }, []);

  return (
    <div ref={rootRef} className="preloader-root fixed inset-0 z-[10001]">
      <div
        ref={overlayRef}
        className="preloader-overlay absolute inset-0 flex items-center justify-center overflow-hidden"
        role="status"
        aria-live="polite"
        aria-label="Loading AG Make Up Studio"
      >
        {/* Pastel blush base — always visible */}
        <div ref={bgRef} className="preloader-bg absolute inset-0" aria-hidden />
        <div ref={ambientRef} className="preloader-ambient absolute inset-0 pointer-events-none" aria-hidden />
        <div ref={shimmerRef} className="preloader-shimmer absolute inset-0 pointer-events-none" aria-hidden />
        <div ref={vignetteRef} className="preloader-vignette absolute inset-0 pointer-events-none" aria-hidden />
        <div ref={grainRef} className="preloader-grain absolute inset-0 pointer-events-none" aria-hidden />
        <div ref={sweepRef} className="preloader-sweep absolute inset-0 pointer-events-none" aria-hidden />

        <div ref={monogramRef} className="preloader-monogram font-serif" aria-hidden>
          AG
        </div>

        <div ref={pearlsRef} className="preloader-pearls absolute inset-0 pointer-events-none" aria-hidden>
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="preloader-pearl"
              style={{
                left: `${8 + i * 11}%`,
                top: `${15 + (i % 4) * 20}%`,
              }}
            />
          ))}
        </div>

        <div ref={frameLeftRef} className="preloader-frame preloader-frame--left" aria-hidden />
        <div ref={frameRightRef} className="preloader-frame preloader-frame--right" aria-hidden />

        <div className="preloader-content relative z-10 flex flex-col items-center text-center px-8 max-w-2xl">
          <div ref={lineTopRef} className="preloader-line preloader-line--top" />
          <h1 ref={headingRef} className="preloader-heading font-serif font-light">
            AG Make Up Studio
          </h1>
          <div ref={lineMidRef} className="preloader-line preloader-line--mid" />
          <p ref={taglineRef} className="preloader-tagline font-sans font-light">
            Crafting Timeless Bridal Beauty
          </p>
          <div ref={lineBottomRef} className="preloader-line preloader-line--bottom" />
        </div>

        <div className="preloader-progress-wrap absolute bottom-0 left-0 right-0 z-20 px-12 pb-10">
          <div className="preloader-progress-track">
            <div ref={progressRef} className="preloader-progress-bar" />
          </div>
        </div>
      </div>

      <div ref={curtainLeftRef} className="preloader-curtain preloader-curtain--left" aria-hidden />
      <div ref={curtainRightRef} className="preloader-curtain preloader-curtain--right" aria-hidden />
    </div>
  );
}
