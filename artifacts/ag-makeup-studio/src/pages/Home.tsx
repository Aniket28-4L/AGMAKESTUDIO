import { useEffect, useRef, useState, useCallback, memo, forwardRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useMotion } from "@/components/motion/motion-context";
import gsap from "gsap";
import { useScrollReveal, useScrollRevealBatch } from "@/hooks/useScrollReveal";
import { useHeroMotion } from "@/hooks/useHeroMotion";
import { MOTION } from "@/lib/motion/config";
import gallery1Path from "@assets/gallery_1.jpeg";
import gallery2Path from "@assets/gallery_2.jpeg";
import gallery3Path from "@assets/gallery_3.jpeg";
import gallery4Path from "@assets/gallery_4.jpeg";
import gallery5Path from "@assets/gallery_5.jpeg";
import gallery6Path from "@assets/gallery_6.jpeg";
import founderPath from "@assets/founder2.png";
import story1Path from "@assets/story_1.png";
import story2Path from "@assets/story_2.png";
import story3Path from "@assets/story_3.png";
import story4Path from "@assets/story_4.png";
import lens1Path from "@assets/awards1.jpeg";
import lens2Path from "@assets/awards2.jpeg";
import lens3Path from "@assets/awards3.jpeg";
import heroBridePath from "@assets/hero_bride.png";
import testimonialsBgPath from "@assets/a0dcf1bf0f646736b9552283059a83bf_1778999396158.jpg";
import featherBgPath from "@assets/3b202712b82894b59517c133e8c2fecf_1779000059086.jpg";
import { Menu, X, Instagram, Youtube, ExternalLink, ArrowUpRight, Mail, MapPin, Trophy, Users, Globe, Star, Gem, ArrowRight } from "lucide-react";
import avLogoPath from "@/ag-studio-assets/avlogo.png";
import aaravellaTextLogoPath from "@/ag-studio-assets/AARAVELLA_text_transparent.png";
import { useLocation } from "wouter";
import InstagramReelsSection from "../components/InstagramReelsSection";
import { LeafyButton } from "../components/ui/leafy-button";
import { client } from "../lib/sanity.client";
import { urlFor } from "../lib/imageUrl";
import { resolveHeroVideoUrl } from "../lib/videoUrl";
import {
  HOME_PAGE_QUERY,
  PORTFOLIO_QUERY,
  BEFORE_AFTER_QUERY,
  BRIDAL_MOMENTS_QUERY,
  OFFERINGS_QUERY,
  AWARDS_QUERY,
  TESTIMONIALS_QUERY,
  ARCHIVE_IN_MOTION_QUERY,
  SITE_SETTINGS_QUERY,
} from "../../../../services/sanity-studio/lib/groq";

// GSAP scroll reveals — same API, cinematic motion
const FadeIn = ({
  children,
  delay = 0,
  className = "",
  stagger = false,
  blur = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  stagger?: boolean;
  blur?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, {
    delay,
    stagger: stagger ? MOTION.stagger.default : false,
    variant: blur ? "blur" : "fade-up",
  });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

const FadeChild = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

const SectionDivider = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { isReady } = useMotion();

  useEffect(() => {
    if (!isReady || !ref.current) return;
    const el = ref.current;
    gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
    const tween = gsap.to(el, {
      scaleX: 1,
      duration: 1.5,
      ease: MOTION.ease.cinematic,
      scrollTrigger: { trigger: el, start: MOTION.scroll.start, once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [isReady]);

  return (
    <div className="w-full flex justify-center py-8 opacity-40">
      <div ref={ref} className="h-px bg-primary w-1/3 section-line" />
    </div>
  );
};

function TransformationSlider({
  beforeSrc,
  afterSrc,
  eyebrow,
  title,
  subtitle,
  quote,
}: {
  beforeSrc: string;
  afterSrc: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  quote?: string;
}) {
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

  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef, { variant: "blur" });

  const renderTitle = () => {
    const t = title || "Before & After";
    if (t.includes("&")) {
      const parts = t.split("&");
      return (
        <>
          {parts[0].trim()} &amp; <em className="text-muted-foreground">{parts[1].trim()}</em>
        </>
      );
    }
    return t;
  };

  return (
    <section ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={featherBgPath} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary block mb-4">
            {eyebrow || "The Transformation"}
          </span>
          <h2 className="font-serif text-5xl md:text-7xl font-light leading-[0.9]">
            {renderTitle()}
          </h2>
          <p className="font-sans font-light text-muted-foreground mt-6 text-sm tracking-[0.15em]">
            {subtitle || "Drag the divider to reveal the artistry."}
          </p>
        </div>

        {/* Slider */}
        <div
          ref={containerRef}
          data-testid="transformation-slider"
          className="relative w-full max-w-4xl mx-auto aspect-[4/5] md:aspect-[16/9] overflow-hidden select-none cursor-ew-resize"
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
                <path d="M6 10l-3 3m0 0l3 3m-3-3h14m0 0l-3-3m3 3l-3 3" stroke="rgba(183,146,114,0.9)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        {quote && (
          <p className="text-center font-serif italic text-muted-foreground mt-8 text-lg">
            "{quote}"
          </p>
        )}
      </div>
    </section>
  );
}


// ── Bridal Quiz ─────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    q: "What kind of finish do you envision for your special day?",
    opts: [
      { label: "Soft, Radiant & Timeless", value: "signature" },
      { label: "Lightweight & Effortlessly Natural", value: "airbrush" },
      { label: "Luxury, Glamorous & High-Fashion", value: "luxe" },
      { label: "Flawless & Camera-Perfect", value: "hd" },
    ],
  },
  {
    q: "What matters most to you in your bridal makeup?",
    opts: [
      { label: "A look personalized just for me", value: "signature" },
      { label: "A lightweight finish that lasts through heat & humidity", value: "airbrush" },
      { label: "Luxury beauty brands & an elevated finish", value: "luxe" },
      { label: "Perfect skin for photographs & videos", value: "hd" },
    ],
  },
  {
    q: "Which bridal beauty experience speaks to you most?",
    opts: [
      { label: "Natural beauty, perfected for my features", value: "signature" },
      { label: "Barely-there makeup with a beautiful, even finish", value: "airbrush" },
      { label: "A luxurious, radiant and glamorous transformation", value: "luxe" },
      { label: "Smooth, flawless skin that looks incredible on camera", value: "hd" },
    ],
  },
];

const QUIZ_RESULTS: Record<
  string,
  { name: string; desc: string; img: string }
> = {
  signature: {
    name: "Anu’s Signature Makeup",
    desc: "A bespoke bridal makeup experience created exclusively for you — personalized to your face shape and skin tone, with premium luxury products and a soft, radiant, timeless finish.",
    img: "/src/assets/gallery_2.png",
  },

  airbrush: {
    name: "Airbrush Makeup",
    desc: "A lightweight, camera-perfect finish for the modern bride. Ultra-light, sweat and humidity resistant, with a natural finish designed to stay beautiful throughout your celebration.",
    img: "/src/assets/gallery_3.png",
  },

  luxe: {
    name: "Luxe Makeup",
    desc: "Luxury artistry using internationally renowned beauty brands including Dior, Charlotte Tilbury and MAC — creating a radiant, high-fashion finish with elegant, long-lasting wear.",
    img: "/src/assets/gallery_1.png",
  },

  hd: {
    name: "HD Makeup",
    desc: "Flawless makeup designed for high-definition photography and video. A smooth, skin-like finish that naturally conceals imperfections while keeping you fresh throughout the celebration.",
    img: "/src/assets/gallery_4.png",
  },
};

function BridalQuiz({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const getResult = useCallback((ans: string[]) => {
    const counts: Record<string, number> = {
      signature: 0,
      airbrush: 0,
      luxe: 0,
      hd: 0,
    };

    ans.forEach((a) => {
      counts[a] = (counts[a] || 0) + 1;
    });

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

  const result =
    step === 3 ? QUIZ_RESULTS[getResult(answers)] : null;

  return createPortal(
    <motion.div
      key="quiz-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100000] flex items-center justify-center"
      style={{ background: "rgba(15,10,8,0.97)" }}
    >
      {/* Noise grain */}
      <div className="absolute inset-0 noise-overlay opacity-[0.04] pointer-events-none" />

      {/* Ambient champagne glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(183,146,114,0.07) 0%, transparent 65%)",
        }}
      />

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
              transition={{
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
              }}
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
                    animate={{
                      width: `${((step + 1) / 3) * 100}%`,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </div>

              {/* Question */}
              <h2 className="font-serif text-3xl md:text-5xl font-light text-white text-center leading-[1.15] mb-14">
                {QUIZ_QUESTIONS[step].q}
              </h2>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {QUIZ_QUESTIONS[step].opts.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelected(opt.value)}
                    className="group text-left px-7 py-6 border transition-all duration-400 relative overflow-hidden"
                    style={{
                      borderColor:
                        selected === opt.value
                          ? "#B79272"
                          : "rgba(255,255,255,0.1)",
                      background:
                        selected === opt.value
                          ? "rgba(183,146,114,0.08)"
                          : "transparent",
                    }}
                  >
                    {selected === opt.value && (
                      <motion.div
                        layoutId="quiz-select-bg"
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "rgba(183,146,114,0.06)",
                        }}
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

              {/* Continue */}
              <div className="mt-12 flex justify-center">
                <button
                  onClick={next}
                  disabled={!selected}
                  className="font-sans text-[10px] uppercase tracking-[0.3em] border-b pb-1 transition-all duration-300"
                  style={{
                    borderColor: selected
                      ? "#B79272"
                      : "rgba(255,255,255,0.2)",
                    color: selected
                      ? "#B79272"
                      : "rgba(255,255,255,0.2)",
                    cursor: selected
                      ? "pointer"
                      : "not-allowed",
                  }}
                >
                  {step < 2
                    ? "Continue →"
                    : "Reveal My Look →"}
                </button>
              </div>
            </motion.div>
          ) : (
            /* RESULT */
            <motion.div
              key="result"
              initial={{
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.9,
                ease: [0.25, 0.1, 0.25, 1],
              }}
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
                  style={{
                    background:
                      "linear-gradient(135deg,#B79272,#C9A98A)",
                    boxShadow:
                      "0 4px 24px rgba(183,146,114,0.35)",
                  }}
                >
                  Book This Look
                </a>

                <button
                  onClick={() => {
                    setStep(0);
                    setAnswers([]);
                    setSelected(null);
                  }}
                  className="px-10 py-4 text-[10px] uppercase tracking-[0.3em] border border-white/15 text-white/40 hover:text-white/70 hover:border-white/30 transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>,
    document.body
  );
}

// Continuous playback cinematic background video
const CinematicHeroVideo = memo(
  forwardRef<HTMLVideoElement, { videoUrl?: string; posterUrl?: string }>(
    ({ videoUrl, posterUrl }, ref) => {
      const videoRef = useRef<HTMLVideoElement>(null);
      const { isReady } = useMotion();

      const setRef = (node: HTMLVideoElement | null) => {
        videoRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      };

      useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Ensure video is paused until ready
        if (!isReady) {
          video.pause();
          return;
        }

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              video.play().catch(() => { });
            } else {
              video.pause();
            }
          },
          { threshold: 0.1 }
        );

        observer.observe(video);
        // Play immediately if intersecting when ready
        video.play().catch(() => { });

        return () => {
          observer.disconnect();
        };
      }, [isReady]);

      useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.load();
        if (isReady) {
          video.play().catch(() => { });
        }
      }, [videoUrl, posterUrl, isReady]);

      const resolvedUrl = resolveHeroVideoUrl(videoUrl);
      const isMp4 = resolvedUrl.endsWith(".mp4") || !resolvedUrl.endsWith(".webm");

      return (
        <video
          ref={setRef}
          autoPlay={isReady}
          muted
          loop
          playsInline
          preload="auto"
          poster={posterUrl || heroBridePath}
          className="w-full h-full object-cover object-[75%_35%] md:object-[82%_28%] scale-[1.05] will-change-transform"
          style={{
            filter: "contrast(1.02) saturate(1.05) brightness(1.02)",
          }}
        >
          <source src={resolvedUrl} type={isMp4 ? "video/mp4" : "video/webm"} />
        </video>
      );
    }
  )
);
CinematicHeroVideo.displayName = "CinematicHeroVideo";

async function fetchHomeData() {
  const [
    homepage,
    portfolio,
    beforeAfter,
    bridalMoments,
    offerings,
    awards,
    testimonials,
    archiveInMotion,
    siteSettings,
  ] = await Promise.all([
    client.fetch(HOME_PAGE_QUERY),
    client.fetch(PORTFOLIO_QUERY),
    client.fetch(BEFORE_AFTER_QUERY),
    client.fetch(BRIDAL_MOMENTS_QUERY),
    client.fetch(OFFERINGS_QUERY),
    client.fetch(AWARDS_QUERY),
    client.fetch(TESTIMONIALS_QUERY),
    client.fetch(ARCHIVE_IN_MOTION_QUERY),
    client.fetch(SITE_SETTINGS_QUERY),
  ]);

  if (
    homepage === undefined ||
    portfolio === undefined ||
    beforeAfter === undefined ||
    bridalMoments === undefined ||
    offerings === undefined ||
    awards === undefined ||
    testimonials === undefined ||
    archiveInMotion === undefined ||
    siteSettings === undefined
  ) {
    throw new Error("One or more Sanity client fetches returned undefined.");
  }

  return {
    homepage,
    portfolio,
    beforeAfter,
    bridalMoments,
    offerings,
    awards,
    testimonials,
    archiveInMotion,
    siteSettings,
  };
}

export default function Home() {
  const [sanityData, setSanityData] = useState<any>(null);
  const [, setLocation] = useLocation();

  const homepage = sanityData?.homepage;

  // While loading, use static values
  const heroEyebrow = homepage ? homepage.heroEyebrow : "AARAVELLA Bridal Couture";
  const heroTitleText = homepage ? homepage.heroTitle : "Crafted For The Bride Who Wants To Feel Unforgettable.";
  const heroSubtitle = homepage ? homepage.heroSubtitle : "Beauty Designed Like A Memory.";
  const primaryCta = homepage ? homepage.primaryCta : "Explore Collections";
  const secondaryCta = homepage ? homepage.secondaryCta : "Find Your Bridal Look";
  const heroVideo = resolveHeroVideoUrl(homepage?.heroVideo);
  const heroPosterUrl = homepage?.heroPosterImage ? urlFor(homepage.heroPosterImage).url() : undefined;

  // Portfolio Section Variables
  const portfolioData = sanityData?.portfolio;
  const portfolioEyebrowVal = homepage ? (homepage.portfolioEyebrow || "The Archive") : "The Archive";
  const portfolioTitleVal = homepage ? (homepage.portfolioTitle || "Editorial Radiance") : "Editorial Radiance";
  const portfolioSubtitleVal = homepage ? (homepage.portfolioSubtitle || "Capturing the essence of modern Indian royalty.") : "Capturing the essence of modern Indian royalty.";

  const portfolioItems = portfolioData && portfolioData.length > 0
    ? portfolioData
    : [
      { isStatic: true, src: gallery1Path, alt: "Bridal portrait", caption: "01. The Signature Look, New Delhi" },
      { isStatic: true, src: gallery3Path, alt: "Bridal in motion", caption: "02. Veil in Flight" },
      { isStatic: true, src: gallery4Path, alt: "Makeup closeup", caption: "03. Luminous Finish" },
      { isStatic: true, src: gallery2Path, alt: "Bridal hands", caption: "04. Mehndi & Pearls" },
      { isStatic: true, src: gallery6Path, alt: "Bridal Joy", caption: "05. Candid Radiance" },
      { isStatic: true, src: gallery5Path, alt: "Jewelry", caption: "06. Heritage Adornments" },
    ];

  const getPortfolioImgSrc = (item: any) => {
    if (item.isStatic) return item.src;
    return item.image ? urlFor(item.image).url() : "";
  };

  const getPortfolioImgAlt = (item: any) => {
    if (item.isStatic) return item.alt;
    return item.altText || item.title || "";
  };

  // Founder Section Variables
  const founderEyebrowVal = homepage ? (homepage.founderEyebrow || "The Founder") : "The Founder";
  // TODO: Client's founder/owner name is still required. Using "Anu Giri" as placeholder until updated.
  const founderNameVal = homepage ? (homepage.founderName || "Anu Giri") : "Anu Giri";
  const founderImgUrl = homepage?.founderImage ? urlFor(homepage.founderImage).url() : founderPath;
  const founderImgAlt = homepage?.founderImage?.alt || founderNameVal;

  const biographyParagraphs = homepage?.founderBiography
    ? homepage.founderBiography.split(/\n\s*\n/).filter((p: string) => p.trim() !== "")
    : [
      "With over a decade of dedication to the art of luxury bridal makeup, my philosophy is rooted in a simple truth: we are designing for unforgettable memories.",
      "The AARAVELLA approach blends the flawless techniques of editorial fashion with the emotional resonance of a wedding day. We do not mask; we elevate. We bring forward the radiant, timeless version of you that will be cherished in photographs for generations."
    ];

  const fallbackStats = [
    { value: "10+", label: "Years Mastery" },
    { value: "500+", label: "Couture Brides" },
    { value: "15", label: "Industry Awards" },
  ];
  const founderStats = homepage?.founderStatistics && homepage.founderStatistics.length > 0
    ? homepage.founderStatistics
    : fallbackStats;

  const renderStatValue = (val: string) => {
    if (val.endsWith('+')) {
      return (
        <>
          {val.slice(0, -1)}
          <span className="text-primary">+</span>
        </>
      );
    }
    return val;
  };

  // Before & After Section Variables
  const beforeAfterDoc = sanityData?.beforeAfter?.[0];
  const beforeAfterEyebrowVal = homepage ? (homepage.beforeAfterEyebrow || "The Transformation") : "The Transformation";
  const beforeAfterTitleVal = beforeAfterDoc ? (beforeAfterDoc.title || "Before & After") : "Before & After";
  const beforeAfterSubtitleVal = homepage ? (homepage.beforeAfterSubtitle || "Drag the divider to reveal the artistry.") : "Drag the divider to reveal the artistry.";
  const beforeAfterQuoteVal = homepage ? (homepage.beforeAfterQuote || "Every bride deserves to see herself transformed.") : "Every bride deserves to see herself transformed.";

  const beforeAfterBeforeImg = beforeAfterDoc?.beforeImage
    ? urlFor(beforeAfterDoc.beforeImage).url()
    : gallery4Path;

  const beforeAfterAfterImg = beforeAfterDoc?.afterImage
    ? urlFor(beforeAfterDoc.afterImage).url()
    : gallery1Path;

  // Bridal Moments Section Variables
  const bridalMomentsData = sanityData?.bridalMoments?.[0];
  const bridalMomentEyebrowVal = homepage ? (homepage.bridalMomentEyebrow || "The Bridal Moment") : "The Bridal Moment";

  const bridalMomentImages = bridalMomentsData?.images && bridalMomentsData.images.length === 4
    ? bridalMomentsData.images.map((img: any) => urlFor(img).url())
    : [story1Path, story2Path, story3Path, story4Path];

  const bridalMomentAlts = bridalMomentsData?.images && bridalMomentsData.images.length === 4
    ? bridalMomentsData.images.map((img: any, i: number) => img.alt || ["Anticipation", "Artistry", "Revelation", "Bride"][i])
    : ["Anticipation", "Artistry", "Revelation", "Bride"];

  const fallbackVerses = [
    { num: "I", title: "The Anticipation", lines: ["She has", "always known", "this moment."] },
    { num: "II", title: "The Artistry", lines: ["Each stroke,", "a memory", "being born."] },
    { num: "III", title: "The Revelation", lines: ["The mirror reflects", "what she", "always was."] },
    { num: "IV", title: "The Bride", lines: ["Unforgettable.", "Always."] },
  ];

  const bridalMomentVerses = bridalMomentsData?.verses && bridalMomentsData.verses.length > 0
    ? bridalMomentsData.verses.map((v: any) => ({
      num: v.verseNumber || "",
      title: v.verseTitle || "",
      lines: v.verseLines || []
    }))
    : fallbackVerses;

  // Collections (Offerings) Section Variables
  const collectionsEyebrowVal = homepage ? (homepage.collectionsEyebrow || "Our Offerings") : "Our Offerings";
  const collectionsTitleVal = homepage ? (homepage.collectionsTitle || "Couture Bridal Experiences") : "Couture Bridal Experiences";

  const offeringsData = sanityData?.offerings;
  const offeringsItems = offeringsData && offeringsData.length > 0
    ? offeringsData
    : [
      {
        isStatic: true,
        number: 1,
        name: "Anu’s Signature Makeup",
        description: "A bespoke bridal makeup experience created exclusively for you.\n\n✓ Personalized to your face shape & skin tone\n✓ Premium luxury products only\n✓ Soft, radiant & timeless finish\n✓ Long-lasting for weddings & events\n✓ Natural look with flawless photographs",
        image: { isStatic: true, src: gallery2Path },
        ctaText: "Request Consultation"
      },
      {
        isStatic: true,
        number: 2,
        name: "Airbrush Makeup",
        description: "A lightweight, camera-perfect finish for modern brides.\n\n✓ Ultra-light airbrush application\n✓ Sweat & humidity resistant\n✓ HD camera-ready finish\n✓ Covers imperfections naturally\n✓ Ideal for destination weddings",
        image: { isStatic: true, src: gallery3Path },
        ctaText: "Request Consultation"
      },
      {
        isStatic: true,
        number: 3,
        name: "Luxe Makeup",
        description: "Luxury artistry using internationally renowned beauty brands.\n\n✓ Dior, Charlotte Tilbury & MAC products\n✓ High-fashion radiant finish\n✓ Customized bridal styling\n✓ Long-lasting premium wear\n✓ Elegant, luxurious appearance",
        image: { isStatic: true, src: gallery1Path },
        ctaText: "Request Consultation"
      },
      {
        isStatic: true,
        number: 4,
        name: "HD Makeup",
        description: "Flawless makeup designed for high-definition photography.\n\n✓ Smooth skin-like finish\n✓ Perfect for HD cameras & videos\n✓ Soft, natural-looking coverage\n✓ Conceals fine lines & pores\n✓ Fresh look throughout the celebration",
        image: { isStatic: true, src: gallery4Path },
        ctaText: "Request Consultation"
      }
    ];

  const renderCollectionsTitle = (title: string) => {
    if (title.includes("\n")) {
      const parts = title.split("\n");
      return (
        <>
          {parts[0]} <br /><span className="italic text-muted-foreground">{parts[1]}</span>
        </>
      );
    }
    const words = title.split(" ");
    if (words.length > 1) {
      const lastWord = words.pop();
      return (
        <>
          {words.join(" ")} <br /><span className="italic text-muted-foreground">{lastWord}</span>
        </>
      );
    }
    return title;
  };

  const getOfferingImgSrc = (item: any) => {
    if (item.isStatic) return item.image.src;
    return item.image ? urlFor(item.image).url() : "";
  };

  const getOfferingImgAlt = (item: any) => {
    if (item.isStatic) return item.name;
    return item.image?.alt || item.name || "";
  };

  const formatOfferingNumber = (num: number | string) => {
    const n = Number(num);
    if (isNaN(n)) return String(num);
    return n < 10 ? `0${n}` : `${n}`;
  };

  // Awards Section Variables
  const awardsEyebrowVal = homepage ? (homepage.awardsEyebrow || "Recognition Earned Through Passion") : "Recognition Earned Through Passion";
  const awardsTitleVal = homepage ? (homepage.awardsTitle || "Awards & Recognition") : "Awards & Recognition";
  const awardsQuoteVal = homepage ? (homepage.awardsQuote || "Honoured by industry experts and bridal beauty leaders for excellence in bridal artistry.") : "Honoured by industry experts and bridal beauty leaders for excellence in bridal artistry.";

  const renderAwardsTitle = (title: string) => {
    if (title.includes("&")) {
      const parts = title.split("&");
      return (
        <>
          {parts[0]} &amp; <em className="text-[#B79272]">{parts[1]}</em>
        </>
      );
    }
    return title;
  };

  const awardsData = sanityData?.awards;
  const awardsItems = awardsData && awardsData.length > 0
    ? awardsData
    : [
      { isStatic: true, title: "International Bridal Excellence", description: "Recognized for exceptional bridal transformations.", location: "Dubai", year: 2024, image: { isStatic: true, src: lens1Path } },
      { isStatic: true, title: "Global Beauty Leader", description: "Honoured for influence in luxury bridal artistry.", location: "London", year: 2023, image: { isStatic: true, src: lens2Path } },
      { isStatic: true, title: "Master of Bridal Artistry", description: "Excellence in couture bridal transformations.", location: "Mumbai", year: 2024, image: { isStatic: true, src: lens3Path } }
    ];

  const getAwardImgSrc = (item: any) => {
    if (item.isStatic) return item.image.src;
    return item.image ? urlFor(item.image).url() : "";
  };

  const getAwardImgAlt = (item: any) => {
    if (item.isStatic) return item.title;
    return item.image?.alt || item.title || "";
  };

  const getAwardLocationAndYear = (item: any) => {
    if (item.isStatic) return `${item.location} • ${item.year}`;
    return `${item.location || ""} • ${item.year || ""}`;
  };

  const fallbackTrustIndicators = [
    { icon: "trophy", title: "Award Winning", description: "Recognized globally for excellence" },
    { icon: "users", title: "500+ Brides", description: "A legacy of unforgettable memories" },
    { icon: "globe", title: "International", description: "Artistry that transcends borders" },
    { icon: "star", title: "Industry Expert", description: "As seen in leading publications" },
    { icon: "gem", title: "Luxury Experience", description: "Bespoke beauty for your day" }
  ];

  const awardsTrustIndicatorsVal = homepage?.awardsTrustIndicators && homepage.awardsTrustIndicators.length > 0
    ? homepage.awardsTrustIndicators
    : fallbackTrustIndicators;

  const iconComponentMap: Record<string, any> = {
    trophy: Trophy,
    users: Users,
    globe: Globe,
    star: Star,
    gem: Gem,
  };

  // Testimonials Section Variables
  const testimonialsData = sanityData?.testimonials || [];
  // TODO: The featured testimonial mentions "Anu" — should be replaced after the client provides updated testimonial content.
  const featuredTestimonial = testimonialsData.find((t: any) => t.featured) || testimonialsData[0] || {
    quote: "Anu didn't just do my makeup; she crafted a vision. I felt like I stepped out of a Vogue India editorial. Truly unforgettable.",
    brideName: "Priyanka S.",
    brideType: "Destination Bride"
  };

  const remainingTestimonials = testimonialsData.filter((t: any) => t._id !== featuredTestimonial._id).slice(0, 2);
  const finalRemainingTestimonials = remainingTestimonials.length >= 2
    ? remainingTestimonials
    : [
      {
        quote: "The detail, the care, the luxury experience. The AARAVELLA team understands how to make a bride feel like absolute royalty.",
        brideName: "Meera R.",
        brideType: "Royal Palace Bride"
      },
      {
        quote: "My makeup lasted flawlessly through tears, laughter, and a night of dancing. She is an absolute master of her craft.",
        brideName: "Aisha M.",
        brideType: "Classic Bride"
      }
    ];

  const testimonialsBrandStripVal = homepage?.testimonialsBrandStrip && homepage.testimonialsBrandStrip.length > 0
    ? [...homepage.testimonialsBrandStrip, ...homepage.testimonialsBrandStrip]
    : ['Vogue India', 'Elle Weddings', 'Brides Today', 'WedMeGood', 'The Wed', 'Bridal Asia', 'Vogue India', 'Elle Weddings', 'Brides Today', 'WedMeGood', 'The Wed', 'Bridal Asia'];

  // Archive In Motion Variables
  const archiveInMotionEyebrowVal = homepage ? (homepage.archiveInMotionEyebrow || "The Archive in Motion") : "The Archive in Motion";
  const archiveInMotionCaptionVal = homepage ? (homepage.archiveInMotionCaption || "Follow @aaravellaluxesalon for the full story") : "Follow @aaravellaluxesalon for the full story";

  const archiveInMotionData = sanityData?.archiveInMotion;
  const archiveInMotionItems = archiveInMotionData && archiveInMotionData.length > 0
    ? archiveInMotionData.map((item: any) => ({
      thumbnail: item.thumbnail ? urlFor(item.thumbnail).url() : "",
      reelUrl: item.instagramUrl || "",
      reelTitle: item.reelTitle || ""
    }))
    : undefined;

  // Atelier Section Variables
  const atelierEyebrowVal = homepage?.atelierContent?.eyebrow || "The Atelier";
  const atelierQuoteVal = homepage?.atelierContent?.quote || "Crafted exclusively with the world's most prestigious beauty houses to ensure a enduring, flawless finish.";
  const atelierFooterTextVal = homepage?.atelierContent?.footerText || "Curated for AARAVELLA Luxe Salon";

  const atelierBrands = homepage?.atelierContent?.brands && homepage.atelierContent.brands.length > 0
    ? homepage.atelierContent.brands
    : ["DIOR", "CHARLOTTE TILBURY", "M·A·C", "ESTÉE LAUDER", "NARS", "TOM FORD", "HUDA BEAUTY", "BOBBI BROWN"];

  const row1Brands = atelierBrands.slice(0, 2);
  const row2Brands = atelierBrands.slice(2, 5);
  const row3Brands = atelierBrands.slice(5);

  // Booking Section Variables
  const bookingFormEyebrowVal = homepage?.bookingFormEyebrow || "Inquiries";
  const bookingFormTitleVal = homepage?.bookingFormTitle || "Begin Your Story";
  const bookingFormSubtitleVal = homepage?.bookingFormSubtitle || "We accept a limited number of brides per season to ensure the highest level of artistry and attention.";

  // Floating WhatsApp Variables
  const whatsappNumberVal = homepage?.whatsappNumber || "919999999999";
  const whatsappLink = `https://wa.me/${whatsappNumberVal.replace(/\D/g, '')}?text=Hi%2C%20I%27d%20love%20to%20book%20a%20bridal%20consultation%20with%20AARAVELLA%20Luxe%20Salon`;

  // Footer Section Variables
  const siteSettings = sanityData?.siteSettings;
  const addressStreet = siteSettings?.address?.street || "Chitrakoot Society, Jamnagar Road";
  const addressCity = siteSettings?.address?.city || "Behind Crystal Mall";
  const addressPostcode = siteSettings?.address?.postcode || "Jamnagar, Gujarat 361002";

  const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=AARAVELLA+Luxe+Salon+${encodeURIComponent(addressStreet + ' ' + addressCity + ' ' + addressPostcode)}`;
  const mapEmbedUrlVal = siteSettings?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3687.261234471011!2d70.0435123759247!3d22.456747437151046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395715569485764d%3A0xc3929f635f799863!2sAG%20Makeup%20Studio!5e0!3m2!1sen!2sin!4v1717500000000!5m2!1sen!2sin";

  const socialLinksVal = siteSettings?.socialLinks && siteSettings.socialLinks.length > 0
    ? siteSettings.socialLinks.map((s: any) => ({
      name: s.platform ? s.platform.charAt(0).toUpperCase() + s.platform.slice(1) : "",
      url: s.url || "#"
    }))
    : [
      { name: 'Instagram', url: '#' },
      { name: 'Pinterest', url: '#' },
      { name: 'Behance', url: '#' }
    ];

  const footerContentVal = siteSettings?.footerContent || "Artistry designed for unforgettable memories.";
  // TODO: Actual client email is unknown — update before launch.
  const contactEmailVal = siteSettings?.contactEmail || "hello@aaravellaluxesalon.com";
  const copyrightTextVal = siteSettings?.copyrightText || "Crafted for Elegance.";

  let heroTitlePart1 = heroTitleText;
  let heroTitlePart2 = "";

  if (heroTitleText.includes("|")) {
    const parts = heroTitleText.split("|");
    heroTitlePart1 = parts[0].trim();
    heroTitlePart2 = parts.slice(1).join("|").trim();
  } else if (heroTitleText.includes("\n")) {
    const parts = heroTitleText.split("\n");
    heroTitlePart1 = parts[0].trim();
    heroTitlePart2 = parts.slice(1).join("\n").trim();
  } else {
    const splitIndex = heroTitleText.indexOf("Who Wants");
    if (splitIndex !== -1) {
      heroTitlePart1 = heroTitleText.substring(0, splitIndex).trim();
      heroTitlePart2 = heroTitleText.substring(splitIndex).trim();
    } else {
      const words = heroTitleText.split(" ");
      const half = Math.ceil(words.length / 2);
      heroTitlePart1 = words.slice(0, half).join(" ");
      heroTitlePart2 = words.slice(half).join(" ");
    }
  }

  useEffect(() => {
    async function verify() {
      try {
        const data = await fetchHomeData();
        console.log("Fetched Sanity Data:", data);

        const checks = {
          homepage: { name: "Homepage ........", expected: "object", actual: typeof data.homepage, count: null },
          portfolio: { name: "Portfolio ........", expected: "array", actual: Array.isArray(data.portfolio) ? "array" : typeof data.portfolio, count: Array.isArray(data.portfolio) ? data.portfolio.length : null },
          beforeAfter: { name: "BeforeAfter ......", expected: "array", actual: Array.isArray(data.beforeAfter) ? "array" : typeof data.beforeAfter, count: Array.isArray(data.beforeAfter) ? data.beforeAfter.length : null },
          bridalMoments: { name: "BridalMoments ....", expected: "array", actual: Array.isArray(data.bridalMoments) ? "array" : typeof data.bridalMoments, count: Array.isArray(data.bridalMoments) ? data.bridalMoments.length : null },
          offerings: { name: "Offerings ........", expected: "array", actual: Array.isArray(data.offerings) ? "array" : typeof data.offerings, count: Array.isArray(data.offerings) ? data.offerings.length : null },
          awards: { name: "Awards ...........", expected: "array", actual: Array.isArray(data.awards) ? "array" : typeof data.awards, count: Array.isArray(data.awards) ? data.awards.length : null },
          testimonials: { name: "Testimonials .....", expected: "array", actual: Array.isArray(data.testimonials) ? "array" : typeof data.testimonials, count: Array.isArray(data.testimonials) ? data.testimonials.length : null },
          archiveInMotion: { name: "ArchiveMotion ....", expected: "array", actual: Array.isArray(data.archiveInMotion) ? "array" : typeof data.archiveInMotion, count: Array.isArray(data.archiveInMotion) ? data.archiveInMotion.length : null },
          siteSettings: { name: "SiteSettings .....", expected: "object", actual: typeof data.siteSettings, count: null }
        };

        let report = "\n=== SANITY DATA VERIFICATION REPORT ===\n";
        let mismatchCount = 0;

        for (const [key, check] of Object.entries(checks)) {
          const isMatch = check.actual === check.expected && data[key as keyof typeof data] !== null;
          if (isMatch) {
            if (check.count !== null) {
              report += `${check.name} PASS (${check.count})\n`;
            } else {
              report += `${check.name} PASS\n`;
            }
          } else {
            mismatchCount++;
            report += `${check.name} FAIL (Expected: ${check.expected}, Got: ${check.actual} / null check)\n`;
          }
        }

        console.log(report);
        (window as any).__sanityData = data;
        (window as any).__sanityReport = report;
        setSanityData(data);
        if (mismatchCount > 0) {
          console.error(`Verification completed with ${mismatchCount} mismatch(es).`);
        } else {
          console.log("Verification completed successfully.");
        }
      } catch (error) {
        console.error("Sanity data fetch failed:", error);
      }
    }
    verify();
  }, []);
  const { isReady, lenis } = useMotion();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroRuleRef = useRef<HTMLDivElement>(null);
  const heroEyebrowRef = useRef<HTMLDivElement>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const heroSubtitleRef = useRef<HTMLDivElement>(null);
  const heroParallaxRef = useRef<HTMLDivElement>(null);

  useHeroMotion({
    videoRef: heroVideoRef,
    titleRef: heroTitleRef,
    ruleRef: heroRuleRef,
    eyebrowRef: heroEyebrowRef,
    ctaRef: heroCtaRef,
    subtitleRef: heroSubtitleRef,
    parallaxRef: heroParallaxRef,
  });

  useScrollRevealBatch(isReady);

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

  // Lock scroll when mobile menu is open (Lenis + body)
  useEffect(() => {
    if (mobileMenuOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      if (isReady) document.body.style.overflow = "";
    }
  }, [mobileMenuOpen, lenis, isReady]);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/20 selection:text-foreground relative">
      {/* Bridal Quiz Overlay */}
      <AnimatePresence>
        {quizOpen && <BridalQuiz onClose={() => setQuizOpen(false)} />}
      </AnimatePresence>

      {/* Texture Overlay */}
      <div className="noise-overlay" />

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
      <nav
        className="fixed top-0 left-0 right-0 z-[60] py-3 md:py-4 px-6 md:px-12 flex justify-between items-center bg-white/[0.01] backdrop-blur-[6px] border-b border-white/[0.04] text-white transition-all duration-1000 ease-out"
        style={{ opacity: isReady ? 1 : 0, transform: isReady ? 'none' : 'translateY(-10px)' }}
      >
        <div className="flex items-center cursor-pointer group">
          <img src={aaravellaTextLogoPath} alt="AARAVELLA" className="h-7 md:h-9 w-auto object-contain" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-10 font-sans text-[9px] tracking-[0.4em] uppercase opacity-80">
          <a href="#portfolio" className="nav-link cursor-pointer hover:text-primary transition-colors py-1">Portfolio</a>
          <a href="#collections" className="nav-link cursor-pointer hover:text-primary transition-colors py-1">Collections</a>
          <a href="#atelier" className="nav-link cursor-pointer hover:text-primary transition-colors py-1">Atelier</a>
          <a href="#book" className="nav-link cursor-pointer hover:text-primary transition-colors py-1">Book</a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white z-50 p-2 opacity-80"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {/* Mobile Menu Overlay - Refined for slimmer aesthetic */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#1A1614]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button
              className="absolute top-6 right-6 text-white/60"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center gap-12">
              {['Portfolio', 'Collections', 'Atelier', 'Book'].map((item, i) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-3xl italic text-white/90 tracking-widest hover:text-primary transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </div>
            <div className="absolute bottom-12 flex flex-col items-center gap-4">
              <span className="font-sans text-[8px] tracking-[0.5em] text-white/30 uppercase">AARAVELLA Luxe Salon</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[100svh] flex items-center justify-center overflow-hidden bg-black">
        {/* Letterboxes */}
        <div className="letterbox top" />
        <div className="letterbox bottom" />

        {/* Cinematic Video Background */}
        <div
          ref={heroParallaxRef}
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          <CinematicHeroVideo ref={heroVideoRef} videoUrl={heroVideo} posterUrl={heroPosterUrl} />

          {/* Luxury Overlays - Ultra light and cinematic */}
          <div className="absolute inset-0 bg-black/5" /> {/* Negligible tint */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/5 to-transparent z-10" /> {/* Subtle left-aligned gradient for readability */}

          {/* Soft Highlight Glow around the subject */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(255,240,220,0.1)_0%,transparent_50%)] mix-blend-overlay pointer-events-none" />

          {/* Local Cinematic Film Grain */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-20 hero-grain" />

          {/* Atmospheric Effects with ultra-low intensity */}
          <div className="candlelit-overlay opacity-40" />
          <div className="vignette opacity-20" />
          <div className="dof-blur opacity-15" />
        </div>

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

        <div className="relative z-30 container mx-auto px-6 md:px-16 flex flex-col pt-32 h-full justify-center">
          <div className="max-w-4xl">
            <div ref={heroEyebrowRef} className="flex items-center gap-4 mb-8">
              <span className="font-sans text-[9px] md:text-[10px] tracking-[0.5em] uppercase text-primary/70">{heroEyebrow}</span>
              <div className="h-px w-10 bg-primary/30" />
            </div>

            <h1
              ref={heroTitleRef}
              className="text-white flex flex-col relative"
              style={{
                fontSize: 'clamp(2.4rem, 7vw, 6.5rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.01em',
                textShadow: '0 4px 30px rgba(0,0,0,0.15)'
              }}
            >
              <span className="font-serif font-light">{heroTitlePart1}</span>

              <div
                ref={heroRuleRef}
                className="h-[1.5px] bg-primary/30 w-1/3 my-4 origin-left"
              />

              <span className="font-serif italic text-white/85 translate-x-4 md:translate-x-12" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.1)' }}>{heroTitlePart2}</span>
            </h1>

            <div
              ref={heroCtaRef}
              className="mt-20 flex flex-col sm:flex-row gap-8 w-full sm:w-auto"
            >
              <a href="#collections" data-testid="button-explore-packages" className="w-full sm:w-auto">
                <LeafyButton className="btn-frosted w-full sm:w-auto">
                  {primaryCta}
                </LeafyButton>
              </a>
              <div className="w-full sm:w-auto">
                <LeafyButton
                  data-testid="button-open-quiz"
                  onClick={() => setQuizOpen(true)}
                  className="btn-frosted w-full sm:w-auto !text-[#C9A98A]"
                >
                  {secondaryCta}
                </LeafyButton>
              </div>
            </div>

            {/* Subtitle - More breathing room */}
            <div
              ref={heroSubtitleRef}
              className="mt-24"

            >
              <p className="font-serif italic text-white/50 tracking-wide" style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)' }}>{heroSubtitle}</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-30"
        >

        </motion.div>
      </section>

      {/* Gallery / Archive */}
      <section id="portfolio" className="py-40 relative z-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img src={featherBgPath} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#F7F1EB]/90" />
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">

          <div className="relative mb-32 flex flex-col md:flex-row justify-between items-end">
            <FadeIn>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary">{portfolioEyebrowVal}</span>
                <div className="h-px w-16 bg-primary" />
              </div>
              <h2 className="font-serif text-5xl md:text-7xl">{portfolioTitleVal}</h2>
            </FadeIn>
            <FadeIn delay={0.2} className="mt-8 md:mt-0">
              <p className="font-serif italic text-2xl text-muted-foreground max-w-sm text-right">
                {portfolioSubtitleVal}
              </p>
            </FadeIn>

            {/* Ghost text background */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 text-ghost text-foreground">
              PORTFOLIO
            </div>
          </div>

          {/* Pinterest-style masonry using CSS columns */}
          <div className="columns-2 md:columns-3 gap-4 md:gap-6" data-reveal-stagger>
            {portfolioItems.map((item: any, i: number) => (
              <div key={item._id || i} className="break-inside-avoid mb-4 md:mb-6 group relative overflow-hidden" data-testid={`gallery-item-${i}`}>
                <div className="relative overflow-hidden">
                  <img
                    src={getPortfolioImgSrc(item)}
                    alt={getPortfolioImgAlt(item)}
                    className="w-full h-auto block editorial-image-hover"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-700 pointer-events-none" />
                </div>
                <p className="mt-2 font-serif italic text-muted-foreground text-xs px-1">{item.caption}</p>
              </div>
            ))}
          </div>

          <FadeIn delay={0.4} className="mt-24 text-center">
            <button
              onClick={() => setLocation("/archive")}
              data-testid="button-view-all-gallery"
              className="text-xs uppercase tracking-[0.2em] font-sans border-b border-primary/30 pb-2 hover:border-primary transition-colors text-foreground"
            >
              Explore Full Archive
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Founder / About - MOVED HERE after Portfolio */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img src={featherBgPath} alt="" className="w-full h-full object-cover object-right" />
          <div className="absolute inset-0 bg-[#F7F1EB]/88" />
        </div>
        <div className="absolute -left-40 top-20 text-[20rem] font-serif italic text-foreground opacity-[0.03] whitespace-nowrap pointer-events-none z-10">
          Artistry
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-start">
            <div className="md:w-1/2 w-full">
              <FadeIn>
                <div className="relative overflow-hidden w-full aspect-[4/5] bg-muted">
                  <img src={founderImgUrl} alt={founderImgAlt} className="w-full h-full object-cover filter contrast-125 saturate-110" />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-color" />
                </div>
              </FadeIn>
            </div>

            <div className="md:w-1/2 w-full md:mt-32">
              <FadeIn stagger={true}>
                <FadeChild>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary">{founderEyebrowVal}</span>
                    <div className="h-px w-16 bg-primary" />
                  </div>
                </FadeChild>
                <FadeChild>
                  <h2 className="font-serif text-5xl md:text-7xl mb-10">{founderNameVal}</h2>
                </FadeChild>
                <FadeChild>
                  <div className="font-sans font-light text-muted-foreground leading-[2] space-y-6 max-w-lg text-lg">
                    {biographyParagraphs.map((paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </FadeChild>

                <FadeChild className="mt-16 pt-16 border-t border-border flex gap-16">
                  {founderStats.map((stat: any, index: number) => (
                    <div key={index}>
                      <div className="font-serif text-5xl text-foreground">
                        {renderStatValue(stat.value)}
                      </div>
                      <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-4">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </FadeChild>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Reveal */}
      <TransformationSlider
        beforeSrc={beforeAfterBeforeImg}
        afterSrc={beforeAfterAfterImg}
        eyebrow={beforeAfterEyebrowVal}
        title={beforeAfterTitleVal}
        subtitle={beforeAfterSubtitleVal}
        quote={beforeAfterQuoteVal}
      />

      {/* THE BRIDAL MOMENT — compact editorial spread */}
      <section className="relative bg-background overflow-hidden">
        {/* Full-bleed atmospheric background */}
        <div className="absolute inset-0">
          <img src={featherBgPath} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-background/60" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(183,146,114,0.1) 0%, transparent 60%)" }} />
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-12 py-24 md:py-32">
          {/* Section eyebrow */}
          <FadeIn className="flex items-center gap-4 mb-16 md:mb-20">
            <div className="h-px w-8 bg-[#B79272]/40" />
            <span className="font-sans text-[9px] tracking-[0.5em] text-[#B79272] uppercase">{bridalMomentEyebrowVal}</span>
          </FadeIn>

          {/* Two-column layout: images left, verses right — both stretch to same height */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-stretch">

            {/* Left: 2×2 contact sheet — stretches to match verse column height */}
            <div className="md:w-[42%] w-full flex-none flex flex-col">
              <div className="grid grid-cols-2 grid-rows-2 gap-2 flex-1" data-reveal-stagger>
                {bridalMomentImages.map((src: string, i: number) => (
                  <div key={i} className="relative overflow-hidden group min-h-0">
                    <img
                      src={src}
                      alt={bridalMomentAlts[i]}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                      style={{ filter: "saturate(0.85)" }}
                    />
                    <div className="absolute inset-0 border border-black/[0.05] pointer-events-none" />
                    <div className="absolute top-3 left-3 font-serif italic text-[10px] text-[#B79272]/70 pointer-events-none">
                      {bridalMomentVerses[i]?.num || ["I", "II", "III", "IV"][i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: stacked editorial verses */}
            <div className="md:w-[58%] w-full flex flex-col justify-between gap-0 md:pt-4">
              {bridalMomentVerses.map((verse: any, i: number) => (
                <FadeIn key={i} delay={i * 0.1} className="flex-1 flex flex-col justify-center">
                  <div className="py-6 border-t border-black/[0.08] flex gap-8 items-start">
                    <span className="font-sans text-[9px] tracking-[0.3em] text-[#B79272]/50 w-6 flex-none pt-1">{verse.num}</span>
                    <div className="flex-1">
                      <span className="font-sans text-[8px] tracking-[0.35em] text-muted-foreground uppercase block mb-3">{verse.title}</span>
                      <h3 className="font-serif font-light text-foreground leading-[1.15]" style={{ fontSize: "clamp(1.4rem, 3vw, 2.5rem)" }}>
                        {verse.lines.map((line: string, li: number) => (
                          <span key={li} className="block">
                            {li === verse.lines.length - 1 ? <em className="text-primary/80">{line}</em> : line}
                          </span>
                        ))}
                      </h3>
                    </div>
                  </div>
                </FadeIn>
              ))}
              <div className="border-t border-black/[0.08]" />
            </div>
          </div>
        </div>

        {/* Vertical section label */}
        <div className="absolute top-1/2 right-6 -translate-y-1/2 font-sans text-[8px] tracking-[0.4em] text-black/15 uppercase" style={{ writingMode: "vertical-rl" }}>
          AARAVELLA Bridal Couture
        </div>
      </section>

      {/* Collections */}
      <section id="collections" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img src={featherBgPath} alt="" className="w-full h-full object-cover object-left" />
          <div className="absolute inset-0 bg-[#EEE3D7]/88" />
        </div>
        <div className="absolute top-0 right-0 text-ghost text-primary/40 -translate-y-1/2 z-10">
          COLLECTIONS
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <FadeIn className="mb-20 text-center flex flex-col items-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary">{collectionsEyebrowVal}</span>
              <div className="h-px w-12 bg-primary" />
            </div>
            <h2 className="font-serif text-5xl md:text-7xl leading-[1.1]">
              {renderCollectionsTitle(collectionsTitleVal)}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-16 md:gap-y-20 max-w-6xl mx-auto" data-reveal-stagger>
            {offeringsItems.map((col: any, i: number) => (
              <div
                key={col._id || i}
                className="flex flex-col group h-full"
                data-reveal="fade-up"
              >
                {/* Image - Supportive and Refined */}
                <div className="relative aspect-[16/10] mb-8 overflow-hidden rounded-[4px] bg-muted shadow-md transition-all duration-700 group-hover:shadow-xl">
                  <img
                    src={getOfferingImgSrc(col)}
                    alt={getOfferingImgAlt(col)}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>

                {/* Text Content */}
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-sans text-[10px] tracking-[0.3em] text-primary/60 font-medium">{formatOfferingNumber(col.number)}</span>
                    <div className="h-px w-6 bg-primary/30 transition-all duration-700 group-hover:w-12 group-hover:bg-primary" />
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl mb-4 tracking-wide text-foreground">{col.name}</h3>
                  <p className="font-sans font-light text-muted-foreground leading-relaxed mb-8 text-sm md:text-base whitespace-pre-line">
                    {col.description}
                  </p>
                  <div className="mt-auto">
                    <a
                      href="#book"
                      data-testid={`link-collection-${formatOfferingNumber(col.number)}`}
                      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] border-b border-foreground/20 pb-1 hover:text-primary hover:border-primary transition-all duration-500 group/link"
                    >
                      {col.ctaText || "Request Consultation"}
                      <ArrowUpRight size={12} className="transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* AWARDS & RECOGNITION SECTION */}
      <section className="py-32 md:py-48 relative overflow-hidden">
        {/* Background - Preserved from existing aesthetic */}
        <div className="absolute inset-0 z-0">
          <img
            src={featherBgPath}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#F7F1EB]/90 backdrop-blur-[2px]" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          {/* Header */}
          <FadeIn className="mb-24 flex flex-col items-center text-center">
            <span className="font-sans text-[10px] tracking-[0.5em] text-[#B79272] uppercase mb-6 font-medium">{awardsEyebrowVal}</span>
            <h2 className="font-serif text-5xl md:text-8xl font-light text-foreground leading-[0.9] mb-8">
              {renderAwardsTitle(awardsTitleVal)}
            </h2>
            <p className="font-serif italic text-xl md:text-2xl text-muted-foreground max-w-2xl">
              "{awardsQuoteVal}"
            </p>
          </FadeIn>

          {/* Awards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-32">
            {awardsItems.map((award: any, i: number) => (
              <FadeIn key={award._id || i} delay={i * 0.1} className="group">
                <div className="relative mb-8 overflow-hidden rounded-[24px] border border-[#B79272]/10 bg-white/5 backdrop-blur-sm transition-all duration-700 hover:-translate-y-2 hover:border-[#B79272]/30 hover:shadow-[0_20px_50px_rgba(183,146,114,0.15)]">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={getAwardImgSrc(award)}
                      alt={getAwardImgAlt(award)}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="text-center px-4">
                  <h3 className="font-serif text-2xl mb-3 text-foreground">{award.title}</h3>
                  <p className="font-sans text-[11px] tracking-widest uppercase text-muted-foreground mb-4 leading-relaxed">{award.description}</p>
                  <div className="font-sans text-[10px] tracking-[0.3em] text-[#B79272] uppercase font-medium">{getAwardLocationAndYear(award)}</div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Trust Indicators Strip */}
          <FadeIn delay={0.4} className="border-t border-[#B79272]/20 pt-20">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-8">
              {awardsTrustIndicatorsVal.map((item: any, i: number) => {
                const IconComponent = iconComponentMap[item.icon] || Trophy;
                return (
                  <div key={i} className="flex flex-col items-center text-center group">
                    <div className="mb-6 p-4 rounded-full border border-[#B79272]/10 bg-[#B79272]/5 transition-all duration-500 group-hover:bg-[#B79272]/10 group-hover:scale-110">
                      <IconComponent size={20} className="text-[#B79272]" strokeWidth={1.5} />
                    </div>
                    <h4 className="font-serif text-lg mb-2 text-foreground">{item.title}</h4>
                    <p className="font-sans text-[8px] tracking-[0.2em] uppercase text-muted-foreground leading-relaxed px-2">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>



      {/* NEW SECTION 3: REELS WALL */}
      <section className="py-40 bg-[#0a0a0a] relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <FadeIn className="mb-24">
            <span className="font-sans text-[9px] tracking-[0.4em] text-primary uppercase block mb-4">{archiveInMotionEyebrowVal}</span>
            <h2 className="font-serif text-5xl md:text-7xl font-light text-white leading-[0.9]">
              Moments<br /><em className="text-[#B79272]/60">Frozen in Light</em>
            </h2>
          </FadeIn>

          {/* Horizontal scrolling reel strip */}
          <InstagramReelsSection reels={archiveInMotionItems} />

          <p className="font-sans text-[9px] tracking-[0.4em] text-white/40 uppercase mt-12 text-center">
            {archiveInMotionCaptionVal}
          </p>
        </div>

        {/* Cinematic Background Elements */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#B79272]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#B79272]/5 blur-[120px] rounded-full pointer-events-none" />
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
            {testimonialsBrandStripVal.map((brand: string, i: number) => (
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
                {featuredTestimonial.quote}
              </p>
              <div className="flex items-center gap-6">
                <div className="h-px w-12 bg-primary" />
                <div>
                  <div className="font-serif text-xl">{featuredTestimonial.brideName}</div>
                  <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-1">{featuredTestimonial.brideType}</div>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-32 max-w-5xl mx-auto border-t border-[#B79272]/25 pt-16">
            {finalRemainingTestimonials.map((t: any, i: number) => (
              <FadeIn key={t._id || i} delay={0.1 + i * 0.1}>
                <p className="font-serif italic text-2xl text-foreground/70 mb-8 leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="font-serif text-lg">{t.brideName}</div>
                <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-1">{t.brideType}</div>
              </FadeIn>
            ))}
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
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-foreground">{atelierEyebrowVal}</span>
              <div className="h-px w-8 bg-primary/40" />
            </div>

            <p className="font-serif italic text-3xl md:text-5xl mt-8 mb-24 text-foreground max-w-4xl mx-auto leading-tight">
              {atelierQuoteVal}
            </p>

            {/* Editorial Brand Showcase */}
            <div className="w-full max-w-5xl mx-auto mt-16 mb-4">
              {/* Row 1 */}
              <FadeIn delay={0} className="flex items-baseline justify-center gap-8 md:gap-16 mb-10 flex-wrap">
                {row1Brands.map((brand: string, idx: number) => (
                  <span
                    key={idx}
                    className={idx % 2 === 0
                      ? "font-serif text-3xl md:text-5xl tracking-[0.25em] text-foreground/75 hover:text-foreground transition-colors duration-500 cursor-default whitespace-nowrap"
                      : "font-serif text-xl md:text-2xl tracking-widest text-foreground/50 hover:text-foreground/80 transition-colors duration-500 cursor-default whitespace-nowrap"
                    }
                  >
                    {brand}
                  </span>
                ))}
              </FadeIn>
              {/* Row 2 */}
              <FadeIn delay={0.1} className="flex items-baseline justify-center gap-8 md:gap-20 mb-10 flex-wrap">
                {row2Brands.map((brand: string, idx: number) => (
                  <span
                    key={idx}
                    className={idx === 0
                      ? "font-sans text-2xl md:text-4xl tracking-[0.35em] font-medium text-foreground/80 hover:text-foreground transition-colors duration-500 cursor-default whitespace-nowrap"
                      : idx === 1
                        ? "font-serif text-2xl md:text-3xl tracking-widest text-foreground/55 hover:text-foreground/80 transition-colors duration-500 cursor-default whitespace-nowrap"
                        : "font-sans text-xl md:text-2xl tracking-[0.4em] text-foreground/45 hover:text-foreground/70 transition-colors duration-500 cursor-default whitespace-nowrap"
                    }
                  >
                    {brand}
                  </span>
                ))}
              </FadeIn>
              {/* Row 3 */}
              <FadeIn delay={0.2} className="flex items-baseline justify-center gap-8 md:gap-16 flex-wrap">
                {row3Brands.map((brand: string, idx: number) => (
                  <span
                    key={idx}
                    className={idx === 0
                      ? "font-sans text-lg md:text-xl tracking-[0.3em] text-foreground/40 hover:text-foreground/65 transition-colors duration-500 cursor-default whitespace-nowrap"
                      : idx === 1
                        ? "font-serif text-xl md:text-2xl tracking-widest text-[#B79272] transition-colors duration-500 cursor-default whitespace-nowrap"
                        : "font-sans text-sm md:text-base tracking-[0.4em] text-foreground/35 hover:text-foreground/60 transition-colors duration-500 cursor-default whitespace-nowrap"
                    }
                  >
                    {brand}
                  </span>
                ))}
              </FadeIn>
            </div>

            <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-foreground/50 mt-12">
              {atelierFooterTextVal}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Booking Form */}
      <section id="book" className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img src={featherBgPath} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#F7F1EB]/90" />
        </div>
        {/* Subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-10" />

        <div className="container mx-auto px-6 md:px-12 max-w-3xl relative z-10">
          <FadeIn className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-primary">{bookingFormEyebrowVal}</span>
            </div>
            <h2 className="font-serif text-6xl md:text-8xl mb-8 text-foreground">{bookingFormTitleVal}</h2>
            <p className="font-sans font-light text-muted-foreground text-lg">
              {bookingFormSubtitleVal}
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
        href={whatsappLink}
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
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>

          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "#B79272" }} />
        </div>
      </a>

      {/* Footer */}
      <footer className="bg-[#1A1614] text-[#F5F0EB] py-32 md:py-48 relative overflow-hidden">
        {/* Large BG letters - perfectly centered and reduced opacity */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 text-center w-full flex flex-col items-center justify-center">
          <span className="text-[12vw] font-serif font-light text-[#F5F0EB]/[0.05] leading-none tracking-[0.15em] block">
            AARAVELLA
          </span>
          <span className="text-[4vw] font-sans font-light text-[#F5F0EB]/[0.04] leading-none tracking-[0.5em] block mt-[1.5vw]">
            LUXE SALON
          </span>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[40%_20%_40%] gap-20 lg:gap-0 items-start">

            {/* LEFT COLUMN: Location Card & Details */}
            <FadeIn className="flex flex-col gap-10 order-2 lg:order-1">
              <div className="flex flex-col gap-8">
                <div className="relative group rounded-[24px] overflow-hidden border border-[#B79272]/20 bg-white/[0.03] backdrop-blur-md transition-all duration-700 hover:border-[#B79272]/40 hover:shadow-[0_20px_50px_rgba(183,146,114,0.15)] h-[320px]">
                  <iframe
                    src={mapEmbedUrlVal}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="opacity-70 group-hover:opacity-90 transition-opacity duration-700"
                  />
                  <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[24px]" />
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="font-sans text-[11px] tracking-[0.5em] uppercase text-[#B79272] block font-semibold">{siteSettings?.businessName || "AARAVELLA LUXE SALON"}</span>
                    <p className="font-serif text-xl md:text-2xl leading-relaxed opacity-90 text-white/80">
                      {addressStreet}<br />
                      {addressCity}<br />
                      {addressPostcode}
                    </p>
                  </div>

                  <a
                    href={mapDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-10 py-4 bg-transparent border border-[#B79272]/30 text-[#B79272] font-sans text-[11px] tracking-[0.3em] uppercase hover:bg-[#B79272] hover:text-white transition-all duration-500 rounded-full group/btn shadow-lg"
                  >
                    Get Directions
                    <ArrowUpRight size={14} className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* CENTER COLUMN: Logo & Tagline */}
            <FadeIn delay={0.1} className="relative flex flex-col items-center text-center lg:pt-16 order-1 lg:order-2 px-4">
              {/* Mobile AV Watermark behind logo/tagline section (not behind map) */}
              <div className="md:hidden absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 w-full flex justify-center items-center opacity-[0.06]">
                <img
                  src={avLogoPath}
                  alt=""
                  className="w-[130vw] max-w-[520px] h-auto object-contain brightness-0 invert scale-150"
                  style={{ clipPath: "inset(0 0 54% 0)" }}
                />
              </div>

              <div className="relative z-10 flex justify-center mb-12">
                <img src={avLogoPath} alt="AARAVELLA Luxe Salon" className="h-56 md:h-80 w-auto object-contain brightness-0 invert" />
              </div>
              <div className="relative z-10 w-20 h-[1px] bg-[#B79272]/40 mb-12" />
              <p className="relative z-10 font-serif italic text-2xl md:text-4xl text-[#B79272]/80 max-w-sm leading-relaxed mb-16">
                "{footerContentVal}"
              </p>
              <div className="relative z-10 space-y-4 font-sans text-[11px] tracking-[0.5em] uppercase text-white/30">
                <p className="hover:text-[#B79272] transition-colors duration-300">Bridal Makeup</p>
                <p className="hover:text-[#B79272] transition-colors duration-300">Editorial Beauty</p>
                <p className="hover:text-[#B79272] transition-colors duration-300">Luxury Transformations</p>
              </div>
            </FadeIn>

            {/* RIGHT COLUMN: Luxury Social Panel */}
            <FadeIn delay={0.2} className="flex flex-col gap-0 lg:pl-16 order-3 lg:order-3">
              <span className="font-sans text-[11px] tracking-[0.7em] uppercase text-[#B79272] block mb-16 font-semibold">CONNECT</span>
              {socialLinksVal.map((social: any, i: number) => (
                <a
                  key={social.name || i}
                  href={social.url}
                  className="group flex items-center justify-between py-10 border-b border-white/10 last:border-0 relative overflow-hidden"
                >
                  <span className="font-serif text-3xl md:text-4xl tracking-wide text-white/60 group-hover:text-[#B79272] transition-all duration-500 transform group-hover:translate-x-4">
                    {social.name}
                  </span>
                  <div className="flex items-center gap-6">
                    <div className="h-[1px] w-0 bg-[#B79272]/40 group-hover:w-16 transition-all duration-700" />
                    <ArrowUpRight
                      size={28}
                      className="text-[#B79272]/40 group-hover:text-[#B79272] transition-all duration-500 transform group-hover:translate-x-2"
                    />
                  </div>
                  {/* Subtle luxury hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#B79272]/0 via-[#B79272]/[0.02] to-[#B79272]/[0.05] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-1000 ease-out" />
                </a>
              ))}

              <div className="mt-24 space-y-3">
                <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-white/20 block">Private Inquiries</span>
                <a href={`mailto:${contactEmailVal}`} className="font-serif text-2xl text-white/80 hover:text-[#B79272] transition-colors duration-500 border-b border-[#B79272]/10 pb-2 inline-block">
                  {contactEmailVal}
                </a>
              </div>
            </FadeIn>

          </div>

          {/* Copyright Bottom */}
          <div className="mt-32 md:mt-48 pt-16 border-t border-white/5 flex flex-col items-center">
            <div className="text-[11px] tracking-[0.6em] font-sans text-white/10 uppercase">
              &copy; {new Date().getFullYear()} {siteSettings?.businessName || "AARAVELLA Luxe Salon"}. {copyrightTextVal}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
