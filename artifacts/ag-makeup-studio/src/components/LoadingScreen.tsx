import { useEffect, useRef, useState } from "react";
import aaravellaLogo from "../ag-studio-assets/avlogo.png";
import { useMotion } from "./motion/motion-context";

/**
 * LoadingScreen — Independent Brand Splash
 *
 * Displays the AARAVELLA Luxe Salon logo with a fade-up entrance,
 * hold, and slide-down exit animation before unmounting.
 */
export default function LoadingScreen() {
  const [gone, setGone] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const logoRef  = useRef<HTMLDivElement>(null);
  const { lenis } = useMotion();

  useEffect(() => {
    const panel = panelRef.current;
    const logo  = logoRef.current;

    if (!panel || !logo) return;

    // Stop Lenis smooth scroll while preloader is active
    if (lenis) {
      lenis.stop();
    }

    // Lock body scrolling while preloader is active
    const originalOverflow   = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow         = "hidden";
    document.body.style.overscrollBehavior = "none";

    // Intercept wheel events during active splash to prevent background scrolling
    const preventScroll = (e: WheelEvent) => {
      e.preventDefault();
    };
    window.addEventListener("wheel", preventScroll, { passive: false });

    // Logo initial state: hidden & slightly down
    logo.style.opacity   = "0";
    logo.style.transform = "translateY(14px)";

    let raf1: number;
    let raf2: number;
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    let t3: ReturnType<typeof setTimeout>;

    // Use double requestAnimationFrame to ensure the preloader is rendered/painted before timers begin
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        // Phase 2: Fade up logo
        t1 = setTimeout(() => {
          logo.style.transition = "opacity 650ms ease, transform 650ms cubic-bezier(.25,.46,.45,.94)";
          logo.style.opacity   = "1";
          logo.style.transform = "translateY(0)";
        }, 120);

        // Phase 3 & 4: Hold ~1s, then slide panel downward off screen
        t2 = setTimeout(() => {
          panel.style.transition = "transform 780ms cubic-bezier(.22,1,.36,1)";
          panel.style.transform  = "translateY(100%)";

          // Phase 5: Restore scroll & unmount cleanly
          t3 = setTimeout(() => {
            window.removeEventListener("wheel", preventScroll);
            document.body.style.overflow         = originalOverflow;
            document.body.style.overscrollBehavior = originalOverscroll;
            if (lenis) {
              lenis.start();
            }
            setGone(true);
          }, 800);
        }, 1600);
      });
    });

    return () => {
      window.removeEventListener("wheel", preventScroll);
      document.body.style.overflow         = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
      if (lenis) {
        lenis.start();
      }
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
      if (t3) clearTimeout(t3);
    };
  }, [lenis]);

  if (gone) return null;

  return (
    <>
      <style>{`
        .aaravella-preloader-logo {
          width: clamp(480px, 36vw, 620px);
          max-width: 90vw;
          height: auto;
          display: block;
          user-select: none;
          object-fit: contain;
        }
        @media (max-width: 1024px) {
          .aaravella-preloader-logo {
            width: clamp(360px, 50vw, 460px);
          }
        }
        @media (max-width: 600px) {
          .aaravella-preloader-logo {
            width: clamp(240px, 72vw, 320px);
          }
        }
      `}</style>
      <div
        ref={panelRef}
        aria-hidden="true"
        style={{
          position:       "fixed",
          inset:          0,
          width:          "100vw",
          height:         "100dvh",
          zIndex:         999999,
          background:     "#FAF7F2",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          boxSizing:      "border-box",
          paddingTop:     "env(safe-area-inset-top,    0px)",
          paddingBottom:  "env(safe-area-inset-bottom, 0px)",
          paddingLeft:    "env(safe-area-inset-left,   0px)",
          paddingRight:   "env(safe-area-inset-right,  0px)",
          overflow:       "hidden",
          pointerEvents:  "none",
          touchAction:    "none",
          willChange:     "transform",
        }}
      >
        <div
          ref={logoRef}
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            width:          "100%",
            padding:        "0 1rem",
            willChange:     "opacity, transform",
          }}
        >
          <img
            src={aaravellaLogo}
            alt="AARAVELLA Luxe Salon"
            draggable={false}
            className="aaravella-preloader-logo"
          />
        </div>
      </div>
    </>
  );
}

