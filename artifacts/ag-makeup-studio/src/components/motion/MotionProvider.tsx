import { useState, useRef, useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionContext } from "./motion-context";
import { PageContent } from "./PageContent";
import { logPerfEvent } from "../../lib/perf-logger";
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

  // Initialize motion systems on mount and signal readiness immediately.
  useEffect(() => {
    logPerfEvent("MotionProvider initialized (Phase 1 Test: Lenis Disabled)");

    // PHASE 1 ISOLATION TEST: Lenis disabled. Native scrolling only.
    let lenis: Lenis | null = null;

    // Recalculate scroll-trigger positions against the settled layout.
    ScrollTrigger.refresh();

    // Signal readiness — batched with Lenis init for a single re-render.
    setIsReady(true);
    setLenisInstance(null);
  }, []);

  // Cleanup: cancel RAF, detach listeners, destroy Lenis on unmount.
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (clickListenerRef.current) {
        document.removeEventListener("click", clickListenerRef.current);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
      }
    };
  }, [lenisInstance]);

  return (
    <MotionContext.Provider value={{ isReady, lenis: lenisInstance }}>
      <PageContent isReady={isReady}>{children}</PageContent>
    </MotionContext.Provider>
  );
}
