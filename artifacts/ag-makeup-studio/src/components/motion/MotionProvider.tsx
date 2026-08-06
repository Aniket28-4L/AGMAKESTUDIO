import { useState, useRef, useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionContext } from "./motion-context";
import { PageContent } from "./PageContent";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

interface MotionProviderProps {
  children: ReactNode;
}

/**
 * MotionProvider
 *
 * Responsibilities:
 *   - Provide MotionContext ({ isReady, lenis }) to the component tree
 *   - Initialize Lenis smooth scroll
 *   - Initialize ScrollTrigger
 *   - Set isReady = true immediately on mount (no loading screen)
 *
 * No preloader, no splash, no timers, no conditional rendering.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const clickListenerRef = useRef<((e: MouseEvent) => void) | null>(null);

  // Initialize motion systems on mount with complete cleanup on unmount.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setIsReady(true);
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
    clickListenerRef.current = onAnchorClick;

    ScrollTrigger.refresh();

    setIsReady(true);
    setLenisInstance(lenis);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (clickListenerRef.current) {
        document.removeEventListener("click", clickListenerRef.current);
      }
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return (
    <MotionContext.Provider value={{ isReady, lenis: lenisInstance }}>
      <PageContent isReady={isReady}>{children}</PageContent>
    </MotionContext.Provider>
  );
}
