import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import heroRightPath from "@assets/hero_right.png";
import heroLeftPath from "@assets/hero_left.png";
import gallery1Path from "@assets/gallery_1.png";
import gallery2Path from "@assets/gallery_2.png";
import gallery3Path from "@assets/gallery_3.png";
import gallery4Path from "@assets/gallery_4.png";
import gallery5Path from "@assets/gallery_5.png";
import gallery6Path from "@assets/gallery_6.png";
import founderPath from "@assets/founder.png";
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileMenuOpen]);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/20 selection:text-foreground relative">
      {/* Texture & Entrance Overlays */}
      <div className="noise-overlay" />
      <div className="cinematic-entrance-overlay" />

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
        <motion.div style={{ y: yHero }} className="absolute inset-0 w-full h-full">
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
              className="text-huge text-white flex flex-col"
            >
              <span className="font-serif font-light">Crafted For The Bride</span>
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
      <div className="h-[20vh] bg-gradient-to-b from-background to-[#F5F0EB]" />

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
      <div className="h-[20vh] bg-gradient-to-b from-[#F5F0EB] to-background" />

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

      {/* Recognition & Testimonials */}
      <section className="py-40 bg-background relative border-t border-border">
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
      <section id="atelier" className="py-40 bg-[#eaddcf] relative overflow-hidden">
        <div className="absolute inset-0 candlelit-overlay opacity-30" />
        <motion.div 
          style={{ y: yBg }} 
          className="absolute inset-0 opacity-5"
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

            {/* Layered floating brands */}
            <div className="relative h-64 md:h-80 w-full max-w-5xl mx-auto">
              {[
                { name: "CHARLOTTE TILBURY", top: "10%", left: "10%", size: "text-2xl md:text-4xl", font: "font-serif tracking-widest", delay: 0 },
                { name: "DIOR", top: "40%", left: "40%", size: "text-4xl md:text-6xl", font: "font-serif tracking-[0.2em]", delay: 0.1 },
                { name: "M·A·C", top: "20%", left: "70%", size: "text-3xl md:text-5xl", font: "font-sans tracking-[0.3em] font-medium", delay: 0.2 },
                { name: "NARS", top: "70%", left: "20%", size: "text-2xl md:text-4xl", font: "font-sans tracking-[0.4em]", delay: 0.3 },
                { name: "ESTÉE LAUDER", top: "60%", left: "70%", size: "text-xl md:text-3xl", font: "font-serif tracking-widest", delay: 0.4 },
                { name: "TOM FORD", top: "85%", left: "45%", size: "text-lg md:text-2xl", font: "font-sans tracking-[0.2em]", delay: 0.5 },
              ].map((brand, i) => (
                <FadeIn key={i} delay={brand.delay} className={`absolute text-foreground/80 hover:text-foreground hover:scale-105 transition-all duration-500 cursor-default ${brand.size} ${brand.font}`} style={{ top: brand.top, left: brand.left, transform: 'translate(-50%, -50%)' }}>
                  {brand.name}
                </FadeIn>
              ))}
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
