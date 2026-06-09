import { useEffect, useRef } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onReady: () => void; // Background content can start animating
  onDone: () => void;  // Component can be unmounted
}

const EASE_LUXURY = "power3.inOut";
const EASE_CURTAIN = "expo.inOut";

export function Preloader({ onReady, onDone }: PreloaderProps) {
  console.log("Preloader component rendering");
  const rootRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  const completedRef = useRef(false);
  const onReadyRef = useRef(onReady);
  const onDoneRef = useRef(onDone);
  onReadyRef.current = onReady;
  onDoneRef.current = onDone;

  const brandName = "Anu Giri Studio";
  const chars = brandName.split("");

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    document.body.style.overflow = "";
    document.documentElement.classList.remove("preloader-active");
    onDoneRef.current();
  };

  useEffect(() => {
    console.log("Preloader: useEffect started");
    
    // Disable session check completely for now to ensure it always shows
    /*
    const hasSeenPreloader = sessionStorage.getItem("ag_luxury_preloader_v3_seen");
    if (hasSeenPreloader) {
      console.log("Preloader: Session check says already seen");
      onReadyRef.current();
      finish();
      return;
    }
    */

    completedRef.current = false;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("preloader-active");

    const root = rootRef.current;
    if (!root) {
      console.error("Preloader: Root ref is NULL");
      onReadyRef.current();
      finish();
      return;
    }
    
    const timer = setTimeout(() => {
      console.log("Preloader: Refs available, initializing GSAP after 100ms");

      ctxRef.current = gsap.context(() => {
        console.log("Preloader: GSAP Context started");
        
        const curtainLeft = curtainLeftRef.current;
        const curtainRight = curtainRightRef.current;
        const glow = glowRef.current;
        const title = titleRef.current;
        const tagline = taglineRef.current;
        const shimmer = shimmerRef.current;
        const particlesContainer = particlesRef.current;

        if (!curtainLeft || !curtainRight || !glow || !title || !tagline || !shimmer || !particlesContainer) {
          console.error("Preloader: Missing internal refs inside GSAP context");
          return;
        }

        const charElements = title.querySelectorAll(".preloader-char");
        console.log("Preloader: Chars found:", charElements.length);

        // INITIAL STATE
        gsap.set(root, { opacity: 1, visibility: "visible", display: "flex" }); 
        gsap.set([curtainLeft, curtainRight], { xPercent: 0 });
        gsap.set(glow, { autoAlpha: 0, scale: 0.8 });
        gsap.set(charElements, { autoAlpha: 0, y: 15 });
        gsap.set(tagline, { autoAlpha: 0, y: 10 });
        // Create floating particles
        const particles: HTMLDivElement[] = [];
        for (let i = 0; i < 20; i++) {
          const p = document.createElement("div");
          p.className = "preloader-particle";
          particlesContainer?.appendChild(p);
          particles.push(p);
          gsap.set(p, {
            x: gsap.utils.random(0, window.innerWidth),
            y: gsap.utils.random(0, window.innerHeight),
            scale: gsap.utils.random(0.5, 1.5),
            autoAlpha: 0
          });
        }
        gsap.set(shimmer, { xPercent: -100, autoAlpha: 0 });

        console.log("Preloader: Creating timeline");
        const mainTl = gsap.timeline({
          onComplete: () => {
            console.log("Preloader: Timeline complete");
            finish();
          }
        });

        // PHASE 01 — Luxury Canvas (0.0s – 0.4s)
        mainTl.to(glow, { autoAlpha: 1, scale: 1, duration: 1.2, ease: EASE_LUXURY }, 0);
        mainTl.to(particles, { autoAlpha: 0.25, duration: 0.8, stagger: 0.02 }, 0);

        // Particle floating animation (independent loop)
        particles.forEach((p) => {
          gsap.to(p, {
            y: "-=60",
            x: "+=30",
            duration: gsap.utils.random(4, 7),
            ease: "none",
            repeat: -1,
          });
        });

        // PHASE 02 — Cinematic Brand Reveal (0.4s – 1.4s)
        mainTl.to(charElements, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: "power2.out"
        }, 0.4);

        // PHASE 03 — Tagline Reveal (1.4s – 1.9s)
        mainTl.to(tagline, { 
          autoAlpha: 1, 
          y: 0, 
          duration: 0.7, 
          ease: "power2.out" 
        }, 1.4);
        
        mainTl.to(shimmer, { 
          autoAlpha: 1, 
          xPercent: 100, 
          duration: 1.2, 
          ease: "power1.inOut" 
        }, 1.3);

        // PHASE 04 — Brand Hold (1.9s – 2.4s)
        // (The timeline naturally holds here until Phase 05)

        // PHASE 05 — Luxury Curtain Reveal (2.4s – 3.0s)
        mainTl.add(() => {
          console.log("Preloader: Triggering onReady");
          onReadyRef.current(); // Signal homepage to reveal
        }, 2.4);

        mainTl.to(curtainLeft, { xPercent: -100, duration: 1.2, ease: EASE_CURTAIN }, 2.4);
        mainTl.to(curtainRight, { xPercent: 100, duration: 1.2, ease: EASE_CURTAIN }, 2.4);
        mainTl.to([title, tagline, glow, particles], { 
          autoAlpha: 0, 
          duration: 0.6, 
          ease: "power2.in" 
        }, 2.4);

      });
    }, 100);

    // Fallback timer
    const fallback = setTimeout(() => {
      if (!completedRef.current) {
        console.warn("Preloader: Fallback triggered");
        onReadyRef.current();
        finish();
      }
    }, 5000);

    return () => {
      console.log("Preloader: Cleanup");
      clearTimeout(timer);
      clearTimeout(fallback);
      if (ctxRef.current) ctxRef.current.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="preloader-root">
      <div className="preloader-grain" />
      
      {/* Luxury Curtains */}
      <div ref={curtainLeftRef} className="preloader-curtain preloader-curtain--left" />
      <div ref={curtainRightRef} className="preloader-curtain preloader-curtain--right" />
      
      {/* Atmosphere */}
      <div ref={glowRef} className="preloader-glow" />
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
      
      {/* Reveal Content */}
      <div className="relative flex flex-col items-center justify-center">
        <div className="relative">
          <h1 ref={titleRef} className="preloader-brand-title">
            {chars.map((char, index) => (
              <span key={index} className="preloader-char">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <div ref={shimmerRef} className="preloader-shimmer" />
        </div>

        <p ref={taglineRef} className="preloader-tagline">
          Crafting Timeless Bridal Elegance
        </p>
      </div>
    </div>
  );
}
