import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue } from "framer-motion";
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

export default function Home() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        
        {/* Image Crossfade Loop */}
        <motion.div style={{ y: yHero }} className="absolute inset-0 w-full h-full lens-breathe">
          <div className="absolute inset-0 w-full h-full hero-img-1">
             <img src={heroRightPath} alt="Bride angle 1" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 w-full h-full hero-img-2">
             <img src={heroLeftPath} alt="Bride angle 2" className="w-full h-full object-cover" />
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
              <a href="#portfolio" data-testid="button-view-gallery" className="btn-frosted px-12 py-5 text-xs uppercase tracking-[0.2em] text-white/70 text-center w-full sm:w-auto">
                View Archive
              </a>
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

          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-8 auto-rows-auto">
            {/* Masonry-style layout */}
            
            {/* Large vertical */}
            <div className="col-span-1 md:col-span-5 md:row-span-2 group">
              <FadeIn className="h-full">
                <div className="overflow-hidden bg-muted aspect-[3/4] md:aspect-auto md:h-[90vh]">
                  <img src={gallery1Path} alt="Bridal portrait" className="w-full h-full object-cover editorial-image-hover" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-700 pointer-events-none" />
                </div>
                <p className="mt-4 font-serif italic text-muted-foreground text-sm">01. The Signature Look, New Delhi</p>
              </FadeIn>
            </div>
            
            {/* Wide horizontal */}
            <div className="col-span-1 md:col-span-7 group md:-ml-12 md:mt-24 relative z-10">
              <FadeIn delay={0.1} className="h-full">
                <div className="overflow-hidden bg-muted aspect-video md:h-[60vh] shadow-2xl">
                  <img src={gallery6Path} alt="Bridal Joy" className="w-full h-full object-cover editorial-image-hover" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-700 pointer-events-none" />
                </div>
                <p className="mt-4 font-serif italic text-muted-foreground text-sm">02. Cinematic Details</p>
              </FadeIn>
            </div>
            
            {/* Small vertical offset */}
            <div className="col-span-1 md:col-span-4 group md:mt-[-10vh]">
              <FadeIn delay={0.2} className="h-full">
                <div className="overflow-hidden bg-muted aspect-square md:h-[50vh]">
                  <img src={gallery4Path} alt="Makeup closeup" className="w-full h-full object-cover editorial-image-hover" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-700 pointer-events-none" />
                </div>
                <p className="mt-4 font-serif italic text-muted-foreground text-sm">03. Luminous Finish</p>
              </FadeIn>
            </div>

            {/* Medium portrait */}
            <div className="col-span-1 md:col-span-3 group">
              <FadeIn delay={0.3} className="h-full">
                <div className="overflow-hidden bg-muted aspect-[4/5] md:h-[65vh]">
                  <img src={gallery5Path} alt="Jewelry" className="w-full h-full object-cover editorial-image-hover" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-700 pointer-events-none" />
                </div>
                <p className="mt-4 font-serif italic text-muted-foreground text-sm">04. Heritage Adornments</p>
              </FadeIn>
            </div>
          </div>
          
          <FadeIn delay={0.4} className="mt-24 text-center">
            <button data-testid="button-view-all-gallery" className="text-xs uppercase tracking-[0.2em] font-sans border-b border-primary/30 pb-2 hover:border-primary transition-colors text-foreground">
              Explore Full Archive
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Gradient Transition */}
      <div className="h-[15vh] bg-gradient-to-b from-background to-black" />

      {/* NEW SECTION 1: THE BRIDAL MOMENT */}
      <section className="relative bg-black overflow-hidden">
        {/* Background atmospheric glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0f08] to-black" />
        
        {/* 4 cinematic story frames stacked vertically, each full viewport height */}
        {/* Frame 1: Anticipation */}
        <div className="relative h-[100svh] flex items-center justify-end pr-[8vw]">
          <img src={story1Path} className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
          <FadeIn className="relative z-10 text-right max-w-lg">
            <span className="font-sans text-[9px] tracking-[0.4em] text-[#B79272] uppercase block mb-6">I. The Anticipation</span>
            <h3 className="font-serif text-5xl md:text-7xl font-light text-white leading-[0.9] mb-8">
              She has<br/><em>always known</em><br/>this moment.
            </h3>
          </FadeIn>
        </div>
        
        {/* Frame 2: Artistry */}
        <div className="relative h-[100svh] flex items-center pl-[8vw]">
          <img src={story2Path} className="absolute inset-0 w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/20 to-transparent" />
          <FadeIn className="relative z-10 max-w-lg">
            <span className="font-sans text-[9px] tracking-[0.4em] text-[#B79272] uppercase block mb-6">II. The Artistry</span>
            <h3 className="font-serif text-5xl md:text-7xl font-light text-white leading-[0.9] mb-8">
              Each stroke,<br/><em>a memory</em><br/>being born.
            </h3>
          </FadeIn>
        </div>

        {/* Frame 3: Emotion */}
        <div className="relative h-[100svh] flex items-center justify-end pr-[8vw]">
          <img src={story3Path} className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
          <FadeIn className="relative z-10 text-right max-w-lg">
            <span className="font-sans text-[9px] tracking-[0.4em] text-[#B79272] uppercase block mb-6">III. The Revelation</span>
            <h3 className="font-serif text-5xl md:text-7xl font-light text-white leading-[0.9] mb-8">
              The mirror<br/>reflects what<br/><em>she always was.</em>
            </h3>
          </FadeIn>
        </div>

        {/* Frame 4: The Final Bride */}
        <div className="relative h-[100svh] flex items-center justify-center">
          <img src={story4Path} className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-black/40" />
          <FadeIn className="relative z-10 text-center">
            <span className="font-sans text-[9px] tracking-[0.4em] text-[#B79272] uppercase block mb-8">IV. The Bride</span>
            <h3 className="font-serif text-6xl md:text-[10vw] font-light text-white leading-[0.85]">
              Unforgettable.<br/><em>Always.</em>
            </h3>
          </FadeIn>
        </div>

        {/* Section label */}
        <div className="absolute top-1/2 right-6 -translate-y-1/2 writing-mode-vertical font-sans text-[8px] tracking-[0.4em] text-white/20 uppercase" style={{ writingMode: 'vertical-rl' }}>
          The Bridal Moment
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

          <div className="flex flex-col gap-32">
            
            {/* Collection 1: Horizontal asymmetric */}
            <FadeIn>
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-5/12 md:pl-12">
                  <div className="font-sans text-xs tracking-widest text-primary mb-4">01</div>
                  <h3 className="font-serif text-4xl mb-6 tracking-wide">The Signature Bride</h3>
                  <div className="w-12 h-px bg-primary mb-6" />
                  <p className="font-sans font-light text-muted-foreground leading-loose mb-8">
                    Our most requested comprehensive bridal styling. Flawless HD makeup, advanced draping, and intricate hairstyling designed for a majestic, commanding presence.
                  </p>
                  <a href="#book" className="text-[10px] uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">Request Consultation</a>
                </div>
                <div className="md:w-7/12 w-full h-[50vh] md:h-[60vh] bg-muted overflow-hidden group">
                  <img src={gallery2Path} alt="Signature Bride" className="w-full h-full object-cover editorial-image-hover" />
                </div>
              </div>
            </FadeIn>

            <SectionDivider />

            {/* Collection 2: Vertical with overlay */}
            <FadeIn>
              <div className="relative w-full md:w-3/4 mx-auto h-[70vh] bg-muted overflow-hidden group">
                <img src={gallery3Path} alt="Timeless Bride" className="w-full h-full object-cover editorial-image-hover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white">
                  <div className="font-sans text-xs tracking-widest text-primary mb-2">02</div>
                  <h3 className="font-serif text-4xl mb-4 tracking-wide text-white">The Timeless Bride</h3>
                  <p className="font-sans font-light text-white/80 leading-loose mb-8 max-w-md">
                    A classic, elegant aesthetic focusing on glowing skin and traditional elements that transcend fleeting trends. Pure, radiant, eternal.
                  </p>
                  <a href="#book" className="text-[10px] uppercase tracking-[0.2em] border-b border-white pb-1 hover:text-primary hover:border-primary transition-colors text-white">Request Consultation</a>
                </div>
              </div>
            </FadeIn>

            <SectionDivider />

            {/* Collection 3: Two column offset text */}
            <FadeIn>
              <div className="flex flex-col-reverse md:flex-row gap-12 items-center">
                <div className="md:w-1/2 w-full h-[60vh] bg-muted overflow-hidden group">
                  <img src={gallery1Path} alt="Royal Glow" className="w-full h-full object-cover editorial-image-hover" />
                </div>
                <div className="md:w-1/2 relative md:pl-20">
                  <div className="absolute -top-20 -left-10 text-[15rem] font-serif font-light text-primary/10 leading-none pointer-events-none hidden md:block">03</div>
                  <h3 className="font-serif text-4xl mb-6 tracking-wide relative z-10">The Royal Glow</h3>
                  <p className="font-sans font-light text-muted-foreground leading-loose mb-8 relative z-10">
                    Premium airbrush techniques paired with luxury 24k gold infused skincare prep for the ultimate illuminated finish. For the bride who demands absolute perfection.
                  </p>
                  <a href="#book" className="text-[10px] uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors relative z-10">Request Consultation</a>
                </div>
              </div>
            </FadeIn>

            <SectionDivider />

            {/* Collection 4: Minimal with large quote */}
            <FadeIn>
              <div className="max-w-4xl mx-auto text-center py-12">
                <div className="font-sans text-xs tracking-widest text-primary mb-4">04</div>
                <h3 className="font-serif text-4xl mb-12 tracking-wide">The Modern Muse</h3>
                <p className="font-serif italic text-3xl md:text-5xl text-muted-foreground mb-12 leading-tight">
                  "For the contemporary bride. Minimalist, editorial-style makeup that highlights natural bone structure, rather than masking it."
                </p>
                <a href="#book" className="text-[10px] uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">Request Consultation</a>
              </div>
            </FadeIn>

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

          {/* Three asymmetric DSLR frames */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-4 items-end">
            
            {/* Frame 1 - tall */}
            <div className="w-full md:w-[45%] relative group">
              <div className="relative overflow-hidden aspect-[3/4]">
                <img src={lens1Path} className="w-full h-full object-cover editorial-image-hover opacity-90" />
                {/* DSLR frame overlay */}
                <div className="absolute inset-0 border border-white/10 m-4 pointer-events-none" />
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                  <div className="font-mono text-[8px] text-white/30 tracking-wider">f/1.8 — 1/200s — ISO 800</div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                  <div className="font-mono text-[8px] text-white/30">85mm</div>
                  <div className="w-2 h-2 rounded-full border border-white/30" />
                </div>
                {/* Film grain overlay */}
                <div className="absolute inset-0 noise-overlay opacity-[0.06]" />
              </div>
              <p className="mt-4 font-serif italic text-white/40 text-sm">The intimate portrait.</p>
            </div>

            {/* Frame 2 - shorter, offset up */}
            <div className="w-full md:w-[30%] md:-translate-y-16 relative group">
              <div className="relative overflow-hidden aspect-square">
                <img src={lens2Path} className="w-full h-full object-cover editorial-image-hover opacity-90" />
                <div className="absolute inset-0 border border-white/10 m-4 pointer-events-none" />
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                  <div className="font-mono text-[8px] text-white/30 tracking-wider">f/2.8 — 1/125s</div>
                </div>
                <div className="absolute inset-0 noise-overlay opacity-[0.06]" />
              </div>
              <p className="mt-4 font-serif italic text-white/40 text-sm">The artistry revealed.</p>
            </div>

            {/* Frame 3 - medium height */}
            <div className="w-full md:w-[25%] relative group">
              <div className="relative overflow-hidden aspect-[2/3]">
                <img src={lens3Path} className="w-full h-full object-cover editorial-image-hover opacity-90" />
                <div className="absolute inset-0 border border-white/10 m-4 pointer-events-none" />
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                  <div className="font-mono text-[8px] text-white/30 tracking-wider">100mm — Macro</div>
                </div>
                <div className="absolute inset-0 noise-overlay opacity-[0.06]" />
              </div>
              <p className="mt-4 font-serif italic text-white/40 text-sm">The whispered detail.</p>
            </div>
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
      <section className="py-40 bg-background relative border-t border-border">
        {/* Brand Trust Strip */}
        <div className="w-full overflow-hidden mb-24 border-t border-b border-border/30 py-6">
          <div className="scroll-strip">
            {['Vogue India', 'Elle Weddings', 'Brides Today', 'WedMeGood', 'The Wed', 'Bridal Asia', 'Vogue India', 'Elle Weddings', 'Brides Today', 'WedMeGood', 'The Wed', 'Bridal Asia'].map((brand, i) => (
              <span key={i} className="font-serif italic text-2xl text-muted-foreground mx-12 whitespace-nowrap">{brand}</span>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-12">
          
          {/* Large Quote style testimonials */}
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="font-serif text-8xl text-primary/40 leading-none h-16">"</div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-32 max-w-5xl mx-auto border-t border-border pt-16">
            <FadeIn delay={0.1}>
              <p className="font-serif italic text-2xl text-muted-foreground mb-8 leading-relaxed">
                "The detail, the care, the luxury experience. The AG team understands how to make a bride feel like absolute royalty."
              </p>
              <div className="font-serif text-lg">Meera R.</div>
              <div className="font-sans text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-1">Royal Palace Bride</div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="font-serif italic text-2xl text-muted-foreground mb-8 leading-relaxed">
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

      {/* NEW SECTION 4: EMOTIONAL FINAL CTA */}
      <section className="relative h-[80vh] md:h-[100vh] overflow-hidden flex items-center justify-center" data-testid="section-final-cta">
        {/* Background: use hero_left image with dark overlay */}
        <img src={heroLeftPath} className="absolute inset-0 w-full h-full object-cover scale-105" style={{ filter: 'brightness(0.35) saturate(0.8)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
        
        {/* Atmospheric glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(183,146,114,0.08)_0%,_transparent_70%)]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <FadeIn>
            <span className="font-sans text-[9px] tracking-[0.5em] text-[#B79272] uppercase block mb-12">Begin Your Bridal Story</span>
            <h2 className="font-serif text-6xl md:text-[8vw] font-light text-white leading-[0.85] mb-12">
              Your most<br/>beautiful<br/><em>chapter awaits.</em>
            </h2>
            <div className="w-16 h-px bg-[#B79272]/60 mx-auto mb-12" />
            <p className="font-sans font-light text-white/50 text-sm tracking-[0.2em] mb-16 max-w-md mx-auto">
              We accept a curated selection of brides each season.<br/>Your story deserves to begin with intention.
            </p>
            <a href="#book" data-testid="link-final-cta" className="inline-block btn-frosted px-16 py-5 text-xs uppercase tracking-[0.3em] text-white/90">
              Reserve Your Date
            </a>
          </FadeIn>
        </div>

        {/* Letterbox bars */}
        <div className="absolute top-0 left-0 right-0 h-[50px] bg-black opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[50px] bg-black opacity-40 pointer-events-none" />
      </section>

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
