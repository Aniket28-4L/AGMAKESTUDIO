import { useEffect, useRef, useState } from "react";
import aaravellaLogo from "../ag-studio-assets/avlogo.png";

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

  useEffect(() => {
    const panel = panelRef.current;
    const logo  = logoRef.current;

    if (!panel || !logo) return;

    // Lock body scrolling while preloader is active
    const originalOverflow   = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow         = "hidden";
    document.body.style.overscrollBehavior = "none";

    // Logo initial state: hidden & slightly down
    logo.style.opacity   = "0";
    logo.style.transform = "translateY(14px)";

    // Phase 2: Fade up logo
    const t1 = setTimeout(() => {
      logo.style.transition = "opacity 650ms ease, transform 650ms cubic-bezier(.25,.46,.45,.94)";
      logo.style.opacity   = "1";
      logo.style.transform = "translateY(0)";
    }, 120);

    // Phase 3 & 4: Hold ~1s, then slide panel downward off screen
    const t2 = setTimeout(() => {
      panel.style.transition = "transform 780ms cubic-bezier(.22,1,.36,1)";
      panel.style.transform  = "translateY(100%)";

      // Phase 5: Restore scroll & unmount cleanly
      const t3 = setTimeout(() => {
        document.body.style.overflow         = originalOverflow;
        document.body.style.overscrollBehavior = originalOverscroll;
        setGone(true);
      }, 800);

      return () => clearTimeout(t3);
    }, 1600);

    return () => {
      document.body.style.overflow         = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

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

