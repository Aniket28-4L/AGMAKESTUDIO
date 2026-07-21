import { useEffect, useRef, useState } from "react";

/**
 * LoadingScreen — Independent Brand Splash
 *
 * Single Source of Truth implementation matching the reference image.
 * Uses tight vector SVG viewBox and responsive max-width scaling for a commanding,
 * luxury editorial presence on desktop, tablet, and mobile displays.
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
        <svg
          viewBox="0 0 600 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width:     "min(88vw, 820px)",
            height:    "auto",
            display:   "block",
            userSelect:"none",
          }}
          aria-label="ANU GIRI STUDIO - Luxury Bridal Studio"
        >
          <g
            fill="#B79272"
            fontFamily="'Cormorant Garamond', 'Cormorant', Georgia, serif"
            textAnchor="middle"
          >
            {/* ANU */}
            <text
              x="300"
              y="85"
              fontSize="64"
              fontWeight="200"
              letterSpacing="0.40em"
              dx="0.20em"
            >
              ANU
            </text>

            {/* GIRI */}
            <text
              x="300"
              y="158"
              fontSize="64"
              fontWeight="200"
              letterSpacing="0.40em"
              dx="0.20em"
            >
              GIRI
            </text>

            {/* STUDIO */}
            <text
              x="300"
              y="231"
              fontSize="64"
              fontWeight="200"
              letterSpacing="0.40em"
              dx="0.20em"
            >
              STUDIO
            </text>

            {/* LUXURY BRIDAL STUDIO */}
            <text
              x="300"
              y="308"
              fontSize="14.5"
              fontWeight="300"
              letterSpacing="0.50em"
              dx="0.25em"
              opacity="0.88"
            >
              LUXURY BRIDAL STUDIO
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
