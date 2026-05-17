import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring, useMotionValue } from "framer-motion";
import heroRightPath from "@assets/hero_right.png";
import heroLeftPath from "@assets/hero_left.png";
import gallery1Path from "@assets/gallery_1.png";
import gallery2Path from "@assets/gallery_2.png";
import gallery3Path from "@assets/gallery_3.png";
import gallery4Path from "@assets/gallery_4.png";
import gallery5Path from "@assets/gallery_5.png";
import gallery6Path from "@assets/gallery_6.png";
import founderPath from "@assets/founder.png";
import story1Path from "@assets/story_1.png";
import story2Path from "@assets/story_2.png";
import story3Path from "@assets/story_3.png";
import story4Path from "@assets/story_4.png";
import lens1Path from "@assets/lens_1.png";
import lens2Path from "@assets/lens_2.png";
import lens3Path from "@assets/lens_3.png";
import testimonialsBgPath from "@assets/a0dcf1bf0f646736b9552283059a83bf_1778999396158.jpg";
import { Menu, X } from "lucide-react";

// Helper for cinematic fade ins
const FadeIn = ({ children, delay = 0, className = "", stagger = false }: { children: React.ReactNode; delay?: number; className?: string, stagger?: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.12,
              delayChildren: delay,
            }
          }
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 1.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const FadeChild = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 1.4, ease: [0.25, 0.1, 0.25, 1] } }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionDivider = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <div className="w-full flex justify-center py-8 opacity-40">
      <motion.div 
        ref={ref}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="h-px bg-primary w-1/3 section-line" 
      />
    </div>
  );
};

function TransformationSlider({ beforeSrc, afterSrc }: { beforeSrc: string; afterSrc: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const isDragging = useRef(false);

  const updatePos = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePos(clientX);
    };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section ref={ref} className="py-32 bg-background relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="container mx-auto px-6 md:px-12"
      >
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary block mb-4">The Transformation</span>
          <h2 className="font-serif text-5xl md:text-7xl font-light leading-[0.9]">
            Before &amp; <em className="text-muted-foreground">After</em>
          </h2>
          <p className="font-sans font-light text-muted-foreground mt-6 text-sm tracking-[0.15em]">Drag the divider to reveal the artistry.</p>
        </div>

        {/* Slider */}
        <div
          ref={containerRef}
          data-testid="transformation-slider"
          className="relative w-full max-w-4xl mx-auto aspect-[4/5] md:aspect-[16/9] overflow-hidden select-none"
          style={{ cursor: "ew-resize" }}
          onMouseDown={(e) => { isDragging.current = true; updatePos(e.clientX); }}
          onTouchStart={(e) => { isDragging.current = true; updatePos(e.touches[0].clientX); }}
        >
          {/* AFTER image — full width base */}
          <img
            src={afterSrc}
            alt="After bridal transformation"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />

          {/* BEFORE image — clipped to left portion */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${pos}%` }}
          >
            <img
              src={beforeSrc}
              alt="Before bridal transformation"
              className="absolute inset-0 h-full object-cover"
              style={{ width: containerRef.current?.offsetWidth ?? "100%", filter: "grayscale(0.6) brightness(0.9) saturate(0.5)" }}
              draggable={false}
            />
            {/* Before label */}
            <div className="absolute top-6 left-6">
              <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/70 bg-black/30 backdrop-blur-sm px-3 py-1.5">Before</span>
            </div>
          </div>

          {/* After label */}
          <div className="absolute top-6 right-6">
            <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-white/70 bg-black/30 backdrop-blur-sm px-3 py-1.5">After</span>
          </div>

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
            style={{ left: `${pos}%` }}
          />

          {/* Drag handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
            style={{ left: `${pos}%` }}
          >
            <div
              data-testid="slider-handle"
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "1.5px solid rgba(183,146,114,0.8)",
                boxShadow: "0 0 20px rgba(183,146,114,0.3)",
              }}
            >
              {/* Left/right arrows */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 10l-3 3m0 0l3 3m-3-3h14m0 0l-3-3m3 3l-3 3" stroke="rgba(183,146,114,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center font-serif italic text-muted-foreground mt-8 text-lg">
          "Every bride deserves to see herself transformed."
        </p>
      </motion.div>
    </section>
  );
}

// ── Bridal Quiz ─────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    q: "What feeling do you want to radiate on your wedding day?",
    opts: [
      { label: "Timeless & Pure", value: "timeless" },
      { label: "Majestic & Commanding", value: "signature" },
      { label: "Luminous & Regal", value: "royal" },
      { label: "Modern & Editorial", value: "muse" },
    ],
  },
  {
    q: "Your bridal palette — which speaks to your soul?",
    opts: [
      { label: "Ivory, Pearl & Blush", value: "timeless" },
      { label: "Deep Jewels & Burgundy", value: "signature" },
      { label: "Gold, Vermillion & Amber", value: "royal" },
      { label: "Nude, Taupe & Champagne", value: "muse" },
    ],
  },
  {
    q: "Which word defines your bridal vision?",
    opts: [
      { label: "Eternal", value: "timeless" },
      { label: "Grand", value: "signature" },
      { label: "Opulent", value: "royal" },
      { label: "Effortless", value: "muse" },
    ],
  },
];

const QUIZ_RESULTS: Record<string, { name: string; desc: string; img: string }> = {
  timeless: {
    name: "The Timeless Bride",
    desc: "A classic, elegant aesthetic — glowing skin, traditional elements, and a radiance that transcends trends. Pure. Eternal.",
    img: "/src/assets/gallery_3.png",
  },
  signature: {
    name: "The Signature Bride",
    desc: "Comprehensive, commanding, majestic. Flawless HD makeup and intricate hairstyling for a presence that fills every room.",
    img: "/src/assets/gallery_2.png",
  },
  royal: {
    name: "The Royal Glow",
    desc: "Premium airbrush and 24k gold-infused skincare prep — the ultimate illuminated finish for a bride who demands perfection.",
    img: "/src/assets/gallery_1.png",
  },
  muse: {
    name: "The Modern Muse",
    desc: "Minimalist and editorial — celebrating your natural bone structure with a softness that reads breathtaking in every frame.",
    img: "/src/assets/gallery_4.png",
  },
};

function BridalQuiz({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0); // 0-2 questions, 3 = result
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const getResult = useCallback((ans: string[]) => {
    const counts: Record<string, number> = { timeless: 0, signature: 0, royal: 0, muse: 0 };
    ans.forEach((a) => { counts[a] = (counts[a] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }, []);

  const next = () => {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (step < 2) {
      setStep(step + 1);
    } else {
      setStep(3);
    }
  };

  const result = step === 3 ? QUIZ_RESULTS[getResult(answers)] : null;

  return (
    <motion.div
      key="quiz-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{ background: "rgba(15,10,8,0.97)" }}
    >
      {/* Noise grain */}
      <div className="absolute inset-0 noise-overlay opacity-[0.04] pointer-events-none" />
      {/* Ambient champagne glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(183,146,114,0.07) 0%, transparent 65%)" }} />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-7 right-8 font-sans text-[10px] tracking-[0.3em] uppercase text-white/30 hover:text-white/70 transition-colors"
      >
        Close
      </button>

      <div className="w-full max-w-2xl px-8 md:px-0 relative z-10">
        <AnimatePresence mode="wait">
          {step < 3 ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Header */}
              <div className="mb-12 text-center">
                <span className="font-sans text-[9px] tracking-[0.5em] text-[#B79272] uppercase block mb-6">
                  Bridal Style Discovery — {step + 1} of 3
                </span>
                {/* Progress line */}
                <div className="w-48 h-px bg-white/10 mx-auto relative">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-[#B79272]"
                    animate={{ width: `${((step + 1) / 3) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              <h2 className="font-serif text-3xl md:text-5xl font-light text-white text-center leading-[1.15] mb-14">
                {QUIZ_QUESTIONS[step].q}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {QUIZ_QUESTIONS[step].opts.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelected(opt.value)}
                    className="group text-left px-7 py-6 border transition-all duration-400 relative overflow-hidden"
                    style={{
                      borderColor: selected === opt.value ? "#B79272" : "rgba(255,255,255,0.1)",
                      background: selected === opt.value ? "rgba(183,146,114,0.08)" : "transparent",
                    }}
                  >
                    {selected === opt.value && (
                      <motion.div
                        layoutId="quiz-select-bg"
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "rgba(183,146,114,0.06)" }}
                      />
                    )}
                    <span className="font-serif text-xl text-white/80 group-hover:text-white transition-colors relative z-10">
                      {opt.label}
                    </span>
                    {selected === opt.value && (
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#B79272]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <button
                  onClick={next}
                  disabled={!selected}
                  className="font-sans text-[10px] uppercase tracking-[0.3em] border-b pb-1 transition-all duration-300"
                  style={{
                    borderColor: selected ? "#B79272" : "rgba(255,255,255,0.2)",
                    color: selected ? "#B79272" : "rgba(255,255,255,0.2)",
                    cursor: selected ? "pointer" : "not-allowed",
                  }}
                >
                  {step < 2 ? "Continue →" : "Reveal My Look →"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center"
            >
              <span className="font-sans text-[9px] tracking-[0.5em] text-[#B79272] uppercase block mb-8">
                Your Bridal Look
              </span>
              <h2 className="font-serif text-5xl md:text-7xl font-light text-white mb-6 leading-[0.9]">
                {result?.name}
              </h2>
              <div className="w-16 h-px bg-[#B79272]/50 mx-auto mb-8" />
              <p className="font-sans font-light text-white/50 text-sm leading-loose max-w-md mx-auto mb-12">
                {result?.desc}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="#book"
                  onClick={onClose}
                  className="inline-block px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-white"
                  style={{ background: "linear-gradient(135deg,#B79272,#C9A98A)", boxShadow: "0 4px 24px rgba(183,146,114,0.35)" }}
                >
                  Book This Look
                </a>
                <button
                  onClick={() => { setStep(0); setAnswers([]); setSelected(null); }}
                  className="px-10 py-4 text-[10px] uppercase tracking-[0.3em] border border-white/15 text-white/40 hover:text-white/70 hover:border-white/30 transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  // Custom cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 28, stiffness: 280, mass: 0.5 };
  const trailConfig = { damping: 40, stiffness: 120, mass: 1 };
  const orbX = useSpring(cursorX, springConfig);
  const orbY = useSpring(cursorY, springConfig);
  const trailX = useSpring(cursorX, trailConfig);
  const trailY = useSpring(cursorY, trailConfig);
  const [cursorHover, setCursorHover] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const onEnter = () => setCursorHover(true);
    const onLeave = () => setCursorHover(false);
    window.addEventListener("mousemove", move);
    document.querySelectorAll("a, button, [data-testid]").forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, [cursorX, cursorY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileMenuOpen]);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/20 selection:text-foreground relative cursor-none">
      {/* Bridal Quiz Overlay */}
      <AnimatePresence>
        {quizOpen && <BridalQuiz onClose={() => setQuizOpen(false)} />}
      </AnimatePresence>
      {/* Custom Champagne Cursor */}
      <motion.div
        data-testid="cursor-orb"
        className="fixed pointer-events-none z-[99999] hidden md:block"
        style={{ x: orbX, y: orbY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="rounded-full border border-[#B79272]/70 bg-[#C9A98A]/10 backdrop-blur-[2px]"
          animate={{ width: cursorHover ? 48 : 12, height: cursorHover ? 48 : 12 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </motion.div>
      <motion.div
        className="fixed pointer-events-none z-[99998] hidden md:block"
        style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
      >
        <div
          className="rounded-full"
          style={{
            width: 80,
            height: 80,
            background: "radial-gradient(circle, rgba(199,169,138,0.18) 0%, rgba(215,187,180,0.06) 50%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      </motion.div>

      {/* Texture & Entrance Overlays */}
      <div className="noise-overlay" />
      <div className="cinematic-entrance-overlay" />

      {/* Ambient floating pearls - global atmospheric element */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="ambient-pearl"
            style={{
              left: `${10 + i * 11}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${25 + i * 5}s`,
              width: `${80 + i * 30}px`,
              height: `${80 + i * 30}px`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 flex justify-between items-center bg-background/5 backdrop-blur-sm border-none mix-blend-difference text-white transition-all duration-500">
        <div className="flex flex-col items-start cursor-pointer group">
          <span className="font-serif text-3xl leading-none">AG</span>
          <span className="font-sans text-[8px] tracking-[0.4em] mt-1 group-hover:text-primary transition-colors">MAKEUP STUDIO</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-10 font-sans text-xs tracking-widest uppercase">
          <a href="#portfolio" className="nav-link cursor-pointer hover:text-primary transition-colors py-2">Portfolio</a>
          <a href="#collections" className="nav-link cursor-pointer hover:text-primary transition-colors py-2">Collections</a>
          <a href="#atelier" className="nav-link cursor-pointer hover:text-primary transition-colors py-2">Atelier</a>
          <a href="#book" className="nav-link cursor-pointer hover:text-primary transition-colors py-2">Book</a>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50 mix-blend-difference"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: mobileMenuOpen ? "0%" : "100%" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed inset-0 z-40 bg-background flex flex-col justify-center items-center md:hidden"
      >
        <div className="flex flex-col items-center gap-8 font-sans text-sm tracking-widest uppercase text-foreground">
          <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Portfolio</a>
          <a href="#collections" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Collections</a>
          <a href="#atelier" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Atelier</a>
          <a href="#book" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">Book</a>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative h-[100svh] flex items-center justify-center overflow-hidden bg-black">
        {/* Letterboxes */}
        <div className="letterbox top" />
        <div className="letterbox bottom" />
        
        {/* Cinematic Image Crossfade — DSLR hero alternating */}
        <motion.div style={{ y: yHero }} className="absolute inset-0 w-full h-full lens-breathe">
          <div className="absolute inset-0 w-full h-full hero-img-1">
            <img src={heroRightPath} alt="Bride" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 w-full h-full hero-img-2">
            <img src={heroLeftPath} alt="Bride" className="w-full h-full object-cover" />
          </div>
          {/* Overlays */}
          <div className="candlelit-overlay" />
          <div className="vignette" />
          <div className="dof-blur" />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${80 + Math.random() * 20}%`, // start from bottom
                width: `${2 + Math.random() * 6}px`,
                height: `${2 + Math.random() * 6}px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 15}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-30 container mx-auto px-6 md:px-12 flex flex-col pt-24 h-full justify-center">
          <div className="max-w-5xl">
            <FadeIn delay={0.4}>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary/80">AG Bridal Couture</span>
                <div className="h-px w-12 bg-primary/40" />
              </div>
            </FadeIn>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.6 }}
              className="text-white flex flex-col relative"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)', lineHeight: 0.9 }}
            >
              <span className="font-serif font-light">Crafted For The Bride</span>
              
              {/* Animated Horizontal Rule */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
                className="h-[2px] bg-primary/40 w-1/2 my-2 origin-left" 
              />
              
              <span className="font-serif italic text-white/90 translate-x-4 md:translate-x-12">Who Wants To Feel Unforgettable.</span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
              className="mt-16 flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
            >
              <a href="#collections" data-testid="button-explore-packages" className="btn-frosted px-12 py-5 text-xs uppercase tracking-[0.2em] text-white text-center w-full sm:w-auto">
                Explore Collections
              </a>
              <button
                data-testid="button-open-quiz"
                onClick={() => setQuizOpen(true)}
                className="btn-frosted px-12 py-5 text-xs uppercase tracking-[0.2em] text-[#C9A98A] text-center w-full sm:w-auto relative group overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#C9A98A" strokeWidth="1"/><path d="M6 4v2.5M6 8v.5" stroke="#C9A98A" strokeWidth="1" strokeLinecap="round"/></svg>
                  Find Your Bridal Look
                </span>
              </button>
            </motion.div>

            {/* Second Subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.6 }}
              className="mt-16"
            >
              <p className="font-serif italic text-white/60" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>Beauty Designed Like A Memory.</p>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-30"
        >
          <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/50">Scroll</span>
          <div className="scroll-line text-white/30" />
        </motion.div>
      </section>

      {/* Gallery / Archive */}
      <section id="portfolio" className="py-40 bg-background relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          
          <div className="relative mb-32 flex flex-col md:flex-row justify-between items-end">
            <FadeIn>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary">The Archive</span>
                <div className="h-px w-16 bg-primary" />
              </div>
              <h2 className="font-serif text-5xl md:text-7xl">Editorial Radiance</h2>
            </FadeIn>
            <FadeIn delay={0.2} className="mt-8 md:mt-0">
              <p className="font-serif italic text-2xl text-muted-foreground max-w-sm text-right">
                Capturing the essence of modern Indian royalty.
              </p>
            </FadeIn>
            
            {/* Ghost text background */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 text-ghost text-foreground">
              PORTFOLIO
            </div>
          </div>

          {/* Pinterest-style masonry using CSS columns */}
          <div className="columns-2 md:columns-3 gap-4 md:gap-6">
            {[
              { src: gallery1Path, alt: "Bridal portrait", caption: "01. The Signature Look, New Delhi" },
              { src: gallery3Path, alt: "Bridal in motion", caption: "02. Veil in Flight" },
              { src: gallery4Path, alt: "Makeup closeup", caption: "03. Luminous Finish" },
              { src: gallery2Path, alt: "Bridal hands", caption: "04. Mehndi & Pearls" },
              { src: gallery6Path, alt: "Bridal Joy", caption: "05. Candid Radiance" },
              { src: gallery5Path, alt: "Jewelry", caption: "06. Heritage Adornments" },
            ].map((item, i) => (
              <div key={i} className="break-inside-avoid mb-4 md:mb-6 group relative overflow-hidden" data-testid={`gallery-item-${i}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-auto block editorial-image-hover"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-700 pointer-events-none" />
                </div>
                <p className="mt-2 font-serif italic text-muted-foreground text-xs px-1">{item.caption}</p>
              </div>
            ))}
          </div>
          
          <FadeIn delay={0.4} className="mt-24 text-center">
            <button data-testid="button-view-all-gallery" className="text-xs uppercase tracking-[0.2em] font-sans border-b border-primary/30 pb-2 hover:border-primary transition-colors text-foreground">
              Explore Full Archive
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Transformation Reveal */}
      <TransformationSlider beforeSrc={gallery4Path} afterSrc={gallery1Path} />

      {/* Gradient Transition */}
      <div className="h-[15vh] bg-gradient-to-b from-background to-black" />

      {/* THE BRIDAL MOMENT — compact editorial spread */}
      <section className="relative bg-black overflow-hidden">
        {/* Full-bleed atmospheric background */}
        <div className="absolute inset-0">
          <img src={story4Path} className="w-full h-full object-cover opacity-25" style={{ filter: "blur(2px) saturate(0.6)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(183,146,114,0.06) 0%, transparent 60%)" }} />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-12 py-24 md:py-32">
          {/* Section eyebrow */}
          <FadeIn className="flex items-center gap-4 mb-16 md:mb-20">
            <div className="h-px w-8 bg-[#B79272]/40" />
            <span className="font-sans text-[9px] tracking-[0.5em] text-[#B79272] uppercase">The Bridal Moment</span>
          </FadeIn>

          {/* Two-column layout: images left, verses right — both stretch to same height */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-stretch">

            {/* Left: 2×2 contact sheet — stretches to match verse column height */}
            <FadeIn className="md:w-[42%] w-full flex-none flex flex-col">
              <div className="grid grid-cols-2 grid-rows-2 gap-2 flex-1">
                {[story1Path, story2Path, story3Path, story4Path].map((src, i) => (
                  <div key={i} className="relative overflow-hidden group min-h-0">
                    <img
                      src={src}
                      alt={["Anticipation", "Artistry", "Revelation", "Bride"][i]}
                      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-700"
                      style={{ filter: "saturate(0.75)" }}
                    />
                    <div className="absolute inset-0 border border-white/[0.08] pointer-events-none" />
                    <div className="absolute top-3 left-3 font-serif italic text-[10px] text-[#B79272]/70 pointer-events-none">
                      {["I", "II", "III", "IV"][i]}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Right: stacked editorial verses */}
            <div className="md:w-[58%] w-full flex flex-col justify-between gap-0 md:pt-4">
              {[
                { num: "I",   title: "The Anticipation", lines: ["She has", "always known", "this moment."] },
                { num: "II",  title: "The Artistry",     lines: ["Each stroke,", "a memory", "being born."] },
                { num: "III", title: "The Revelation",   lines: ["The mirror reflects", "what she", "always was."] },
                { num: "IV",  title: "The Bride",        lines: ["Unforgettable.", "Always."] },
              ].map((verse, i) => (
                <FadeIn key={i} delay={i * 0.1} className="flex-1 flex flex-col justify-center">
                  <div className="py-6 border-t border-white/[0.08] flex gap-8 items-start">
                    <span className="font-sans text-[9px] tracking-[0.3em] text-[#B79272]/50 w-6 flex-none pt-1">{verse.num}</span>
                    <div className="flex-1">
                      <span className="font-sans text-[8px] tracking-[0.35em] text-white/20 uppercase block mb-3">{verse.title}</span>
                      <h3 className="font-serif font-light text-white leading-[1.15]" style={{ fontSize: "clamp(1.4rem, 3vw, 2.5rem)" }}>
                        {verse.lines.map((line, li) => (
                          <span key={li} className="block">
                            {li === verse.lines.length - 1 ? <em>{line}</em> : line}
                          </span>
                        ))}
                      </h3>
                    </div>
                  </div>
                </FadeIn>
              ))}
              <div className="border-t border-white/[0.08]" />
            </div>
          </div>
        </div>

        {/* Vertical section label */}
        <div className="absolute top-1/2 right-6 -translate-y-1/2 font-sans text-[8px] tracking-[0.4em] text-white/15 uppercase" style={{ writingMode: "vertical-rl" }}>
          AG Bridal Couture
        </div>
      </section>

      {/* Gradient Transition */}
      <div className="h-[15vh] bg-gradient-to-b from-black to-[#F5F0EB]" />

      {/* Collections */}
      <section id="collections" className="py-32 relative bg-[#F5F0EB]">
        <div className="absolute top-0 right-0 text-ghost text-primary/40 -translate-y-1/2">
          COLLECTIONS
        </div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <FadeIn className="mb-24 md:ml-24">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary">Our Offerings</span>
              <div className="h-px w-24 bg-primary" />
            </div>
            <h2 className="font-serif text-5xl md:text-7xl max-w-2xl leading-[1.1]">
              Couture Bridal <br/><span className="italic text-muted-foreground">Experiences</span>
            </h2>
          </FadeIn>

          <div className="flex flex-col gap-2">
            {[
              {
                num: "01",
                name: "The Signature Bride",
                desc: "Our most requested comprehensive bridal styling. Flawless HD makeup, advanced draping, and intricate hairstyling designed for a majestic, commanding presence.",
                img: gallery2Path,
                alt: "Signature Bride",
              },
              {
                num: "02",
                name: "The Timeless Bride",
                desc: "A classic, elegant aesthetic focusing on glowing skin and traditional elements that transcend fleeting trends. Pure, radiant, eternal.",
                img: gallery3Path,
                alt: "Timeless Bride",
              },
              {
                num: "03",
                name: "The Royal Glow",
                desc: "Premium airbrush techniques paired with luxury 24k gold infused skincare prep for the ultimate illuminated finish. For the bride who demands absolute perfection.",
                img: gallery1Path,
                alt: "Royal Glow",
              },
              {
                num: "04",
                name: "The Modern Muse",
                desc: "For the contemporary bride — minimalist, editorial-style makeup that highlights natural bone structure and lets your inner radiance lead.",
                img: gallery4Path,
                alt: "Modern Muse",
              },
            ].map((col, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="flex flex-col md:flex-row items-stretch border-t border-primary/20 py-10 gap-8 group">
                  {/* Number */}
                  <div className="md:w-16 flex-none flex items-start pt-1">
                    <span className="font-sans text-[11px] tracking-[0.35em] text-primary">{col.num}</span>
                  </div>
                  {/* Image */}
                  <div className="md:w-[38%] flex-none h-64 md:h-72 overflow-hidden bg-muted">
                    <img
                      src={col.img}
                      alt={col.alt}
                      className="w-full h-full object-cover editorial-image-hover"
                    />
                  </div>
                  {/* Text */}
                  <div className="flex-1 flex flex-col justify-center md:pl-12">
                    <div className="w-8 h-px bg-primary mb-6" />
                    <h3 className="font-serif text-3xl md:text-4xl mb-5 tracking-wide">{col.name}</h3>
                    <p className="font-sans font-light text-muted-foreground leading-loose mb-8 max-w-md">{col.desc}</p>
                    <a
                      href="#book"
                      data-testid={`link-collection-${col.num}`}
                      className="text-[10px] uppercase tracking-[0.25em] border-b border-foreground/30 pb-1 hover:text-primary hover:border-primary transition-colors w-fit"
                    >
                      Request Consultation
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient Transition */}
      <div className="h-[15vh] bg-gradient-to-b from-[#F5F0EB] to-[#0d0b0a]" />

      {/* NEW SECTION 2: AS SEEN THROUGH THE LENS */}
      <section className="py-40 bg-[#0d0b0a] relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a0f08_0%,_#0d0b0a_70%)]" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <FadeIn className="mb-24 flex flex-col items-center text-center">
            <span className="font-sans text-[9px] tracking-[0.4em] text-[#B79272] uppercase mb-6">As Seen Through The Lens</span>
            <h2 className="font-serif text-5xl md:text-8xl font-light text-white leading-[0.9]">
              Through the<br/><em className="text-[#B79272]">DSLR</em>
            </h2>
            <p className="font-sans font-light text-white/40 mt-8 text-sm tracking-[0.2em]">Every bride captured in her most luminous moment.</p>
          </FadeIn>

          {/* Three DSLR frames — uniform 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { src: lens1Path, meta: "f/1.8 · 1/200s · ISO 800", focal: "85mm", caption: "The intimate portrait." },
              { src: lens2Path, meta: "f/2.0 · 1/160s · ISO 640", focal: "50mm", caption: "The artistry revealed." },
              { src: lens3Path, meta: "f/2.8 · 1/125s · ISO 500", focal: "100mm Macro", caption: "The whispered detail." },
            ].map((frame, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div className="group relative overflow-hidden aspect-[3/4]">
                  <img
                    src={frame.src}
                    alt={frame.caption}
                    className="w-full h-full object-cover editorial-image-hover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                  />
                  {/* DSLR viewfinder border */}
                  <div className="absolute inset-0 border border-white/10 m-3 pointer-events-none" />
                  {/* Corner brackets */}
                  <div className="absolute top-5 left-5 w-5 h-5 border-t border-l border-white/25 pointer-events-none" />
                  <div className="absolute top-5 right-5 w-5 h-5 border-t border-r border-white/25 pointer-events-none" />
                  <div className="absolute bottom-5 left-5 w-5 h-5 border-b border-l border-white/25 pointer-events-none" />
                  <div className="absolute bottom-5 right-5 w-5 h-5 border-b border-r border-white/25 pointer-events-none" />
                  {/* EXIF top */}
                  <div className="absolute top-7 left-7 right-7 flex justify-between pointer-events-none">
                    <span className="font-mono text-[8px] text-white/30 tracking-wider">{frame.meta}</span>
                  </div>
                  {/* Focal bottom */}
                  <div className="absolute bottom-7 left-7 right-7 flex justify-between items-center pointer-events-none">
                    <span className="font-mono text-[8px] text-white/30">{frame.focal}</span>
                    <div className="w-2 h-2 rounded-full border border-white/20" />
                  </div>
                  {/* Film grain */}
                  <div className="absolute inset-0 noise-overlay opacity-[0.05] pointer-events-none" />
                  {/* Hover champagne glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ boxShadow: "inset 0 0 60px rgba(183,146,114,0.12)" }} />
                </div>
                <p className="mt-3 font-serif italic text-white/35 text-sm">0{i + 1}. {frame.caption}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient Transition */}
      <div className="h-[15vh] bg-gradient-to-b from-[#0d0b0a] to-background" />

      {/* Founder / About */}
      <section className="py-32 relative bg-background overflow-hidden">
        <div className="absolute -left-40 top-20 text-[20rem] font-serif italic text-foreground opacity-[0.03] whitespace-nowrap pointer-events-none">
          Artistry
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">
            <div className="md:w-1/2 w-full">
              <FadeIn>
                <div className="relative overflow-hidden w-full aspect-[4/5] bg-muted">
                  <img src={founderPath} alt="Anu Giri" className="w-full h-full object-cover filter contrast-125 saturate-110" />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-color" />
                </div>
              </FadeIn>
            </div>
            
            <div className="md:w-1/2 w-full md:mt-32">
              <FadeIn stagger={true}>
                <FadeChild>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary">The Founder</span>
                    <div className="h-px w-16 bg-primary" />
                  </div>
                </FadeChild>
                <FadeChild>
                  <h2 className="font-serif text-5xl md:text-7xl mb-10">Anu Giri</h2>
                </FadeChild>
                <FadeChild>
                  <div className="font-sans font-light text-muted-foreground leading-[2] space-y-6 max-w-lg text-lg">
                    <p>
                      With over a decade of dedication to the art of luxury bridal makeup, my philosophy is rooted in a simple truth: we are designing for unforgettable memories.
                    </p>
                    <p>
                      The AG approach blends the flawless techniques of editorial fashion with the emotional resonance of a wedding day. We do not mask; we elevate. We bring forward the radiant, timeless version of you that will be cherished in photographs for generations.
                    </p>
                  </div>
                </FadeChild>
                
                <FadeChild className="mt-16 pt-16 border-t border-border flex gap-16">
                  <div>
                    <div className="font-serif text-5xl text-foreground">10<span className="text-primary">+</span></div>
                    <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-4">Years Mastery</div>
                  </div>
                  <div>
                    <div className="font-serif text-5xl text-foreground">500<span className="text-primary">+</span></div>
                    <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-4">Couture Brides</div>
                  </div>
                  <div>
                    <div className="font-serif text-5xl text-foreground">15</div>
                    <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-4">Industry Awards</div>
                  </div>
                </FadeChild>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION 3: REELS WALL */}
      <section className="py-40 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <FadeIn className="mb-20">
            <span className="font-sans text-[9px] tracking-[0.4em] text-primary uppercase block mb-4">The Archive in Motion</span>
            <h2 className="font-serif text-5xl md:text-7xl font-light text-foreground leading-[0.9]">
              Moments<br/><em className="text-muted-foreground">Frozen in Light</em>
            </h2>
          </FadeIn>

          {/* Horizontal scrolling reel strip */}
          <div className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
            {[gallery1Path, gallery2Path, gallery3Path, gallery4Path, gallery5Path, gallery6Path].map((img, i) => (
              <div key={i} className="flex-none w-[240px] md:w-[280px] snap-center relative group" data-testid={`reel-frame-${i}`}>
                <div className="relative overflow-hidden aspect-[9/16] bg-black">
                  <img src={img} className="w-full h-full object-cover editorial-image-hover opacity-90 group-hover:opacity-100 transition-opacity duration-700" />
                  {/* Reel overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  {/* Reel frame lines */}
                  <div className="absolute inset-0 border border-white/5 m-2 pointer-events-none" />
                  {/* Simulated play button on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-14 h-14 rounded-full backdrop-blur-sm bg-white/10 border border-white/30 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                    </div>
                  </div>
                  {/* Caption */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="font-sans text-[8px] tracking-[0.2em] text-white/50 uppercase">AG Bridal Film · 0{i + 1}</p>
                  </div>
                  {/* Glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ boxShadow: 'inset 0 0 40px rgba(183,146,114,0.15)' }} />
                </div>
              </div>
            ))}
          </div>
          
          <p className="font-sans text-[9px] tracking-[0.3em] text-muted-foreground uppercase mt-8 text-center">
            Follow @agmakeupstudio for the full story
          </p>
        </div>
      </section>

      {/* Recognition & Testimonials */}
      <section className="py-40 relative overflow-hidden border-t border-border">
        {/* Butterfly watercolour background */}
        <div className="absolute inset-0">
          <img
            src={testimonialsBgPath}
            alt=""
            className="w-full h-full object-cover"
            style={{ objectPosition: "center center" }}
          />
          {/* Soft ivory wash so text stays legible while art shines through */}
          <div className="absolute inset-0 bg-[#F7F1EB]/72" />
        </div>

        {/* Brand Trust Strip */}
        <div className="w-full overflow-hidden mb-24 border-t border-b border-[#B79272]/20 py-6 relative z-10">
          <div className="scroll-strip">
            {['Vogue India', 'Elle Weddings', 'Brides Today', 'WedMeGood', 'The Wed', 'Bridal Asia', 'Vogue India', 'Elle Weddings', 'Brides Today', 'WedMeGood', 'The Wed', 'Bridal Asia'].map((brand, i) => (
              <span key={i} className="font-serif italic text-2xl text-muted-foreground mx-12 whitespace-nowrap">{brand}</span>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          
          {/* Large Quote style testimonials */}
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="font-serif text-8xl text-primary/50 leading-none h-16">"</div>
              <p className="font-serif italic text-3xl md:text-5xl text-foreground leading-[1.3] mb-12">
                Anu didn't just do my makeup; she crafted a vision. I felt like I stepped out of a Vogue India editorial. Truly unforgettable.
              </p>
              <div className="flex items-center gap-6">
                <div className="h-px w-12 bg-primary" />
                <div>
                  <div className="font-serif text-xl">Priyanka S.</div>
                  <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-1">Destination Bride</div>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-32 max-w-5xl mx-auto border-t border-[#B79272]/25 pt-16">
            <FadeIn delay={0.1}>
              <p className="font-serif italic text-2xl text-foreground/70 mb-8 leading-relaxed">
                "The detail, the care, the luxury experience. The AG team understands how to make a bride feel like absolute royalty."
              </p>
              <div className="font-serif text-lg">Meera R.</div>
              <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-1">Royal Palace Bride</div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="font-serif italic text-2xl text-foreground/70 mb-8 leading-relaxed">
                "My makeup lasted flawlessly through tears, laughter, and a night of dancing. She is an absolute master of her craft."
              </p>
              <div className="font-serif text-lg">Aisha M.</div>
              <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-1">Classic Bride</div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Atelier / Products - Full Bleed Cinematic */}
      <section id="atelier" className="py-40 bg-gradient-to-br from-[#EEE3D7] via-[#F7F1EB] to-[#EEE3D7] relative overflow-hidden">
        <div className="absolute inset-0 candlelit-overlay opacity-30" />
        <motion.div 
          style={{ y: yBg }} 
          className="absolute inset-0 opacity-10 atelier-bg-glow"
          initial={false}
        >
          {/* Abstract texture bg */}
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
        </motion.div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-8 bg-primary/40" />
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-foreground">The Atelier</span>
              <div className="h-px w-8 bg-primary/40" />
            </div>
            
            <p className="font-serif italic text-3xl md:text-5xl mt-8 mb-24 text-foreground max-w-4xl mx-auto leading-tight">
              Crafted exclusively with the world's most prestigious beauty houses to ensure a flawless, enduring finish.
            </p>

            {/* Editorial Brand Showcase */}
            <div className="w-full max-w-5xl mx-auto mt-16 mb-4">
              {/* Row 1 */}
              <FadeIn delay={0} className="flex items-baseline justify-center gap-8 md:gap-16 mb-10 flex-wrap">
                <span className="font-serif text-3xl md:text-5xl tracking-[0.25em] text-foreground/75 hover:text-foreground transition-colors duration-500 cursor-default whitespace-nowrap">DIOR</span>
                <span className="font-serif text-xl md:text-2xl tracking-widest text-foreground/50 hover:text-foreground/80 transition-colors duration-500 cursor-default whitespace-nowrap">CHARLOTTE TILBURY</span>
              </FadeIn>
              {/* Row 2 */}
              <FadeIn delay={0.1} className="flex items-baseline justify-center gap-8 md:gap-20 mb-10 flex-wrap">
                <span className="font-sans text-2xl md:text-4xl tracking-[0.35em] font-medium text-foreground/80 hover:text-foreground transition-colors duration-500 cursor-default whitespace-nowrap">M·A·C</span>
                <span className="font-serif text-2xl md:text-3xl tracking-widest text-foreground/55 hover:text-foreground/80 transition-colors duration-500 cursor-default whitespace-nowrap">ESTÉE LAUDER</span>
                <span className="font-sans text-xl md:text-2xl tracking-[0.4em] text-foreground/45 hover:text-foreground/70 transition-colors duration-500 cursor-default whitespace-nowrap">NARS</span>
              </FadeIn>
              {/* Row 3 */}
              <FadeIn delay={0.2} className="flex items-baseline justify-center gap-8 md:gap-16 flex-wrap">
                <span className="font-sans text-lg md:text-xl tracking-[0.3em] text-foreground/40 hover:text-foreground/65 transition-colors duration-500 cursor-default whitespace-nowrap">TOM FORD</span>
                <span className="font-serif text-xl md:text-2xl tracking-widest text-foreground/50 hover:text-foreground/75 transition-colors duration-500 cursor-default whitespace-nowrap">HUDA BEAUTY</span>
                <span className="font-sans text-sm md:text-base tracking-[0.4em] text-foreground/35 hover:text-foreground/60 transition-colors duration-500 cursor-default whitespace-nowrap">BOBBI BROWN</span>
              </FadeIn>
            </div>
            
            <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-foreground/50 mt-12">
              Curated for the AG Makeup Studio
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Booking Form */}
      <section id="book" className="py-40 relative bg-background overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 max-w-3xl relative z-10">
          <FadeIn className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary">Inquiries</span>
            </div>
            <h2 className="font-serif text-6xl md:text-8xl mb-8 text-foreground">Begin Your Story</h2>
            <p className="font-sans font-light text-muted-foreground text-lg">
              We accept a limited number of brides per season to ensure the highest level of artistry and attention.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="border-b border-border hover:border-primary focus-within:border-primary transition-colors pb-3">
                  <label className="block font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Full Name</label>
                  <input type="text" data-testid="input-name" className="w-full bg-transparent outline-none font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 placeholder:italic" placeholder="Your name" />
                </div>
                <div className="border-b border-border hover:border-primary focus-within:border-primary transition-colors pb-3">
                  <label className="block font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Email Address</label>
                  <input type="email" data-testid="input-email" className="w-full bg-transparent outline-none font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 placeholder:italic" placeholder="you@example.com" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="border-b border-border hover:border-primary focus-within:border-primary transition-colors pb-3">
                  <label className="block font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Wedding Date</label>
                  <input type="text" data-testid="input-date" className="w-full bg-transparent outline-none font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 placeholder:italic" placeholder="DD / MM / YYYY" />
                </div>
                <div className="border-b border-border hover:border-primary focus-within:border-primary transition-colors pb-3">
                  <label className="block font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Location / Venue</label>
                  <input type="text" data-testid="input-location" className="w-full bg-transparent outline-none font-serif text-2xl text-foreground placeholder:text-muted-foreground/30 placeholder:italic" placeholder="City, State" />
                </div>
              </div>

              <div className="border-b border-border hover:border-primary focus-within:border-primary transition-colors pb-3">
                <label className="block font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Event Details & Vision</label>
                <textarea data-testid="input-details" rows={3} className="w-full bg-transparent outline-none font-serif text-2xl text-foreground resize-none placeholder:text-muted-foreground/30 placeholder:italic" placeholder="Tell us about how you want to feel..."></textarea>
              </div>

              <div className="pt-10 w-full">
                <button type="submit" data-testid="button-submit-inquiry" className="btn-silk w-full py-8 text-center text-white cursor-pointer group">
                  <span className="relative z-10 font-serif text-2xl tracking-widest uppercase">Request Your Consultation</span>
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919999999999?text=Hi%2C%20I%27d%20love%20to%20book%20a%20bridal%20consultation%20with%20AG%20Makeup%20Studio"
        target="_blank"
        rel="noopener noreferrer"
        data-testid="button-whatsapp"
        className="fixed bottom-8 right-8 z-[9990] group flex items-center gap-3"
        aria-label="Book via WhatsApp"
      >
        {/* Label pill — expands on hover */}
        <motion.span
          initial={{ opacity: 0, x: 10, width: 0 }}
          whileHover={{ opacity: 1, x: 0, width: "auto" }}
          className="hidden md:block overflow-hidden font-sans text-[9px] tracking-[0.25em] uppercase text-white/80 bg-[#1A1614]/80 backdrop-blur-md px-4 py-2 rounded-full whitespace-nowrap"
        >
          Book on WhatsApp
        </motion.span>

        {/* Main orb button */}
        <div
          className="relative w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{
            background: "linear-gradient(135deg, #B79272 0%, #C9A98A 100%)",
            boxShadow: "0 4px 24px rgba(183,146,114,0.45)",
          }}
        >
          {/* WhatsApp icon */}
          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>

          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "#B79272" }} />
        </div>
      </a>

      {/* Footer */}
      <footer className="bg-[#1A1614] text-[#F5F0EB] py-32 relative overflow-hidden">
        {/* Large BG letters */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-serif font-light text-[#F5F0EB]/5 pointer-events-none leading-none">
          AG
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
          <div className="font-serif text-5xl tracking-widest uppercase text-white mb-8">AG</div>
          <p className="font-serif italic text-2xl mb-20 text-[#B79272] max-w-md">Artistry designed for unforgettable memories.</p>
          
          <div className="flex gap-12 text-[10px] uppercase tracking-[0.3em] font-sans mb-24">
            <a href="#" data-testid="link-instagram" className="hover:text-[#B79272] transition-colors nav-link pb-2">Instagram</a>
            <a href="#" data-testid="link-pinterest" className="hover:text-[#B79272] transition-colors nav-link pb-2">Pinterest</a>
            <a href="#" data-testid="link-contact" className="hover:text-[#B79272] transition-colors nav-link pb-2">Contact</a>
          </div>

          <div className="text-[9px] tracking-[0.4em] font-sans text-white/30 uppercase">
            &copy; {new Date().getFullYear()} AG Makeup Studio. All Rights Reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
