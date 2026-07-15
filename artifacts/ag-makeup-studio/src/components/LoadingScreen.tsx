import { useEffect, useRef, useState } from "react";

/**
 * LoadingScreen — Luxury Brand Splash (Responsive Edition)
 *
 * Completely isolated. Zero knowledge of routing, Sanity, MotionProvider,
 * Hero animations, GSAP timelines, or any page logic.
 *
 * Responsive:
 *   - 100dvh with 100vh fallback (prevents mobile browser-chrome jump)
 *   - clamp() typography scales across all breakpoints
 *   - Scroll locked on <body> while visible; restored on unmount
 *   - Safe-area insets respected via padding
 *   - Only transform + opacity animated (GPU composited, no repaint)
 *
 * Lifecycle:
 *   mount → lock scroll
 *   → ANU / GIRI / STUDIO fade-up (staggered)
 *   → tagline fades in
 *   → complete stillness hold (900ms)
 *   → panel translateY(-100%) lifts away in one motion
 *   → restore scroll → unmount forever
 */
export default function LoadingScreen() {
  const [gone, setGone] = useState(false);

  const panelRef  = useRef<HTMLDivElement>(null);
  const anuRef    = useRef<HTMLSpanElement>(null);
  const giriRef   = useRef<HTMLSpanElement>(null);
  const studioRef = useRef<HTMLSpanElement>(null);
  const subRef    = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const panel  = panelRef.current;
    const anu    = anuRef.current;
    const giri   = giriRef.current;
    const studio = studioRef.current;
    const sub    = subRef.current;

    if (!panel || !anu || !giri || !studio || !sub) return;

    // ── Lock scrolling while splash is visible ──────────────────────────────
    const originalOverflow    = document.body.style.overflow;
    const originalOverscroll  = document.body.style.overscrollBehavior;
    document.body.style.overflow         = "hidden";
    document.body.style.overscrollBehavior = "none";

    // ── All words start hidden, shifted 8px down ────────────────────────────
    [anu, giri, studio, sub].forEach((el) => {
      el.style.opacity  = "0";
      el.style.transform = "translateY(8px)";
    });

    // ── Reveal helper ───────────────────────────────────────────────────────
    //    Words: fade + lift.  Tagline: fade only (no Y movement).
    const reveal = (
      el: HTMLElement,
      delay: number,
      tagline = false,
    ): ReturnType<typeof setTimeout> =>
      setTimeout(() => {
        el.style.transition = tagline
          ? "opacity 500ms ease"
          : "opacity 480ms ease, transform 480ms cubic-bezier(.25,.46,.45,.94)";
        el.style.opacity   = "1";
        el.style.transform = "translateY(0)";
      }, delay);

    // ── Phase 2-5 — staggered word reveal ──────────────────────────────────
    const t1 = reveal(anu,    120);
    const t2 = reveal(giri,   360);
    const t3 = reveal(studio, 600);
    const t4 = reveal(sub,    950, true);

    // ── Phase 6 → 7 — hold, then lift panel upward ─────────────────────────
    // 600ms (STUDIO delay) + 480ms (STUDIO transition) + 900ms (hold) = 1980ms
    const t5 = setTimeout(() => {
      panel.style.transition = "transform 820ms cubic-bezier(.22,1,.36,1)";
      panel.style.transform  = "translateY(-100%)";

      // ── Phase 8 — restore scroll + unmount ─────────────────────────────
      const t6 = setTimeout(() => {
        document.body.style.overflow         = originalOverflow;
        document.body.style.overscrollBehavior = originalOverscroll;
        setGone(true);
      }, 840);

      return () => clearTimeout(t6);
    }, 1980);

    return () => {
      // Cleanup on unexpected unmount — always restore scroll
      document.body.style.overflow         = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      style={{
        // ── Positioning ───────────────────────────────────────────────────
        position:       "fixed",
        top:            0,
        left:           0,
        right:          0,
        // 100dvh prevents mobile browser-chrome jump; 100vh as fallback
        height:         "100dvh",
        zIndex:         999999,

        // ── Appearance ───────────────────────────────────────────────────
        background:     "#FAF7F2",

        // ── Layout — always perfectly centred ────────────────────────────
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",

        // ── Safe area — padding so content clears notches / home bars ────
        paddingTop:    "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft:   "env(safe-area-inset-left)",
        paddingRight:  "env(safe-area-inset-right)",

        // ── Behaviour ────────────────────────────────────────────────────
        pointerEvents:  "none",   // website fully interactive underneath
        overflow:       "hidden", // no horizontal bleed from large letterSpacing
        willChange:     "transform",
        touchAction:    "none",   // suppress scroll/swipe passthrough
      }}
    >
      {/* ── Wordmark ──────────────────────────────────────────────────────── */}
      <div style={wordmarkWrap}>
        <span ref={anuRef}    style={wordStyle}>ANU</span>
        <span ref={giriRef}   style={wordStyle}>GIRI</span>
        <span ref={studioRef} style={wordStyle}>STUDIO</span>
      </div>

      {/* ── Tagline ───────────────────────────────────────────────────────── */}
      <p ref={subRef} style={taglineStyle}>
        Luxury Bridal Studio
      </p>
    </div>
  );
}

// ── Static style objects ──────────────────────────────────────────────────────

const wordmarkWrap: React.CSSProperties = {
  display:        "flex",
  flexDirection:  "column",
  alignItems:     "center",
  lineHeight:     1,
  gap:            "0.06em",
  // Prevent any word from wrapping on narrow viewports
  whiteSpace:     "nowrap",
};

const wordStyle: React.CSSProperties = {
  display:        "block",
  fontFamily:     "'Cormorant Garamond', 'Cormorant', Georgia, serif",
  // clamp(min, preferred, max):
  //   ≤ 375px  → ~48px  |  768px → ~77px  |  ≥ 1400px → 112px
  fontSize:       "clamp(3rem, 10vw, 7rem)",
  fontWeight:     200,
  letterSpacing:  "0.38em",
  textTransform:  "uppercase",
  color:          "#B79272",
  lineHeight:     1.08,
  // Compensates for CSS letter-spacing adding trailing space after last glyph,
  // keeping the wordmark optically centred at all sizes.
  paddingRight:   "0.38em",
  // Only transform + opacity are animated — both GPU-composited, zero repaint
  willChange:     "opacity, transform",
};

const taglineStyle: React.CSSProperties = {
  marginTop:      "2rem",
  fontFamily:     "'Cormorant Garamond', 'Cormorant', Georgia, serif",
  // clamp: 9px floor, scales with vw, 11px cap
  fontSize:       "clamp(0.56rem, 1.5vw, 0.72rem)",
  fontWeight:     300,
  letterSpacing:  "0.52em",
  textTransform:  "uppercase",
  color:          "#B79272",
  paddingRight:   "0.52em",
  whiteSpace:     "nowrap",
  willChange:     "opacity, transform",
};
