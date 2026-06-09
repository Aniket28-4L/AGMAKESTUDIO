import { useEffect, useLayoutEffect, useRef, useState, useCallback, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionContext } from "./motion-context";
import { Preloader } from "./Preloader";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const pageRef = useRef<HTMLDivElement>(null);

  const handlePreloaderReady = useCallback(() => {
    console.log("MotionProvider: handlePreloaderReady called");
    setIsReady(true);
  }, []);

  const handlePreloaderDone = useCallback(() => {
    console.log("MotionProvider: handlePreloaderDone called");
    setShowPreloader(false);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.1,
      infinite: false,
    });

    setLenisInstance(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72, duration: 2.2 });
    };

    document.addEventListener("click", onAnchorClick);
    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, [isReady]);

  // Cinematic page entrance after preloader exits
  useLayoutEffect(() => {
    if (!isReady || !pageRef.current) return;

    const page = pageRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      gsap.set(page, { clearProps: "all" });
      return;
    }

    gsap.set(page, { autoAlpha: 0 });
    gsap.to(page, {
      autoAlpha: 1,
      duration: 1.5,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(page, { clearProps: "all" });
      },
    });
  }, [isReady]);

  console.log("MotionProvider rendering, showPreloader:", showPreloader);

  return (
    <MotionContext.Provider value={{ isReady, lenis: lenisInstance }}>
      {showPreloader && <Preloader onReady={handlePreloaderReady} onDone={handlePreloaderDone} />}
      <div
        ref={pageRef}
        className="motion-page-content"
        data-motion-ready={isReady ? "true" : "false"}
      >
        {children}
      </div>
    </MotionContext.Provider>
  );
}
