import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import heroBridePath from "@assets/hero_bride.png";
import gallery1Path from "@assets/gallery_1.png";
import gallery2Path from "@assets/gallery_2.png";
import gallery3Path from "@assets/gallery_3.png";
import gallery4Path from "@assets/gallery_4.png";
import gallery5Path from "@assets/gallery_5.png";
import gallery6Path from "@assets/gallery_6.png";
import founderPath from "@assets/founder.png";

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 1.2, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/20 selection:text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-8 md:px-16 flex justify-between items-center mix-blend-difference text-primary-foreground pointer-events-none">
        <div className="font-serif text-2xl tracking-widest uppercase">AG</div>
        <div className="hidden md:flex gap-8 font-sans text-sm tracking-widest uppercase">
          <span className="cursor-pointer pointer-events-auto hover:text-primary transition-colors">Portfolio</span>
          <span className="cursor-pointer pointer-events-auto hover:text-primary transition-colors">Atelier</span>
          <span className="cursor-pointer pointer-events-auto hover:text-primary transition-colors">Book</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[100svh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yHero }} className="absolute inset-0 w-full h-full">
          <img 
            src={heroBridePath} 
            alt="Luxury Indian Bride" 
            className="w-full h-full object-cover animate-drift opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
          <div className="absolute inset-0 bg-secondary/10 mix-blend-multiply" />
        </motion.div>

        {/* Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 10}s`
            }}
          />
        ))}

        <div className="veil-shape w-[60vw] h-[60vh] -top-[10%] -left-[10%]" />
        <div className="veil-shape w-[40vw] h-[40vh] bottom-[10%] -right-[5%]" style={{ animationDelay: '-7s' }} />

        <div className="relative z-20 container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center pt-24">
          <div className="md:w-2/3 max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-foreground"
            >
              Crafted For The Bride <br/>
              <span className="text-gradient italic">Who Wants To Feel Unforgettable.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="mt-8 text-lg md:text-xl text-muted-foreground font-sans max-w-lg font-light tracking-wide"
            >
              Couture bridal artistry that honors your heritage while capturing your most beautiful, timeless self.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 1.2 }}
              className="mt-12 flex flex-col sm:flex-row gap-6"
            >
              <button data-testid="button-explore-packages" className="glass-panel px-10 py-5 text-sm uppercase tracking-widest font-medium text-foreground hover:bg-white/40 transition-all duration-500 rounded-sm">
                Explore Bridal Packages
              </button>
              <button data-testid="button-view-gallery" className="px-10 py-5 text-sm uppercase tracking-widest font-medium text-muted-foreground border border-muted-foreground/30 hover:border-primary hover:text-primary transition-all duration-500 rounded-sm">
                View Bridal Gallery
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bridal Gallery */}
      <section className="py-32 bg-background relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <FadeIn className="flex justify-between items-end mb-16">
            <div>
              <span className="text-primary tracking-[0.3em] uppercase text-xs font-semibold">Portfolio</span>
              <h2 className="font-serif text-4xl md:text-6xl mt-4">The AG Bride</h2>
            </div>
            <button data-testid="button-view-all-gallery" className="hidden md:block text-xs uppercase tracking-widest font-medium border-b border-primary pb-1 text-primary">View Full Archive</button>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            <FadeIn delay={0.1} className="md:col-span-5 md:row-span-2">
              <div className="relative group overflow-hidden h-[600px] md:h-[900px] bg-muted">
                <img src={gallery1Path} alt="Bridal portrait" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <p className="text-white font-serif text-2xl italic">Flawless Details</p>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2} className="md:col-span-7 h-[400px]">
              <div className="relative group overflow-hidden h-full bg-muted">
                <img src={gallery6Path} alt="Bridal Joy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <p className="text-white font-serif text-2xl italic">Emotional Radiance</p>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.3} className="md:col-span-4 h-[468px]">
              <div className="relative group overflow-hidden h-full bg-muted">
                <img src={gallery4Path} alt="Makeup closeup" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
            </FadeIn>

            <FadeIn delay={0.4} className="md:col-span-3 h-[468px]">
              <div className="relative group overflow-hidden h-full bg-muted">
                <img src={gallery5Path} alt="Jewelry" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Bridal Collections */}
      <section className="py-32 relative bg-secondary/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(215,187,180,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <FadeIn className="text-center mb-24">
            <span className="text-primary tracking-[0.3em] uppercase text-xs font-semibold">Our Offerings</span>
            <h2 className="font-serif text-4xl md:text-6xl mt-4 max-w-2xl mx-auto">Couture Bridal Collections</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {[
              { title: "The Signature Bride", desc: "Our most requested comprehensive bridal styling. Flawless HD makeup, advanced draping, and intricate hairstyling designed for a majestic presence.", price: "Inquire" },
              { title: "The Timeless Bride", desc: "A classic, elegant aesthetic focusing on glowing skin and traditional elements that transcend fleeting trends.", price: "Inquire" },
              { title: "The Royal Glow", desc: "Premium airbrush techniques with luxury 24k gold infused skincare prep for the ultimate illuminated finish.", price: "Inquire" },
              { title: "The Modern Muse", desc: "For the contemporary bride. Minimalist, editorial-style makeup that highlights natural bone structure.", price: "Inquire" }
            ].map((pkg, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="champagne-glass p-12 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-3xl mb-4 text-foreground">{pkg.title}</h3>
                    <p className="text-muted-foreground font-light leading-relaxed mb-8">{pkg.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 cursor-pointer group w-max">
                    <span className="text-xs uppercase tracking-widest font-medium text-primary">Request Details</span>
                    <div className="h-[1px] w-12 bg-primary group-hover:w-20 transition-all duration-500" />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Anu Giri - Founder */}
      <section className="py-32 relative bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
            <div className="md:w-1/2">
              <FadeIn>
                <div className="relative p-4 bg-white/50">
                  <div className="absolute -inset-4 border border-primary/20 pointer-events-none" />
                  <img src={founderPath} alt="Anu Giri - Founder" className="w-full h-[600px] object-cover" />
                  <div className="absolute bottom-10 -right-10 bg-background/90 p-8 shadow-2xl glass-panel max-w-xs hidden md:block">
                    <p className="font-serif italic text-2xl text-primary">"Beauty is an emotional experience."</p>
                  </div>
                </div>
              </FadeIn>
            </div>
            
            <div className="md:w-1/2">
              <FadeIn delay={0.2}>
                <span className="text-primary tracking-[0.3em] uppercase text-xs font-semibold">The Artist</span>
                <h2 className="font-serif text-4xl md:text-6xl mt-4 mb-8">Anu Giri</h2>
                <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
                  <p>
                    With over a decade of dedication to the art of luxury bridal makeup, my philosophy is rooted in a simple truth: more than makeup, we are designing for unforgettable memories.
                  </p>
                  <p>
                    The AG Makeup Studio approach blends the flawless techniques of editorial fashion with the emotional resonance of a wedding day. We do not mask; we elevate. We bring forward the radiant, timeless version of you that will be cherished in photographs for generations.
                  </p>
                </div>
                <div className="mt-12 pt-12 border-t border-muted-foreground/20 flex gap-12">
                  <div>
                    <div className="font-serif text-3xl text-primary">10+</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Years of Mastery</div>
                  </div>
                  <div>
                    <div className="font-serif text-3xl text-primary">500+</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2">Couture Brides</div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition & Trust */}
      <section className="py-32 bg-muted/40 relative">
        <div className="container mx-auto px-6 md:px-12">
          <FadeIn className="text-center mb-20">
            <span className="text-primary tracking-[0.3em] uppercase text-xs font-semibold">Acclaim</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4">Recognition & Trust</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "“Anu didn't just do my makeup; she crafted a vision. I felt like I stepped out of a Vogue India editorial. Truly unforgettable.”", author: "Priyanka S.", location: "Destination Bride" },
              { text: "“The detail, the care, the luxury experience. The AG team understands how to make a bride feel like absolute royalty.”", author: "Meera R.", location: "Royal Palace Bride" },
              { text: "“My makeup lasted flawlessly through tears, laughter, and a night of dancing. She is an absolute master of her craft.”", author: "Aisha M.", location: "Classic Bride" }
            ].map((testimonial, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-background/60 p-10 h-full border border-primary/10 hover:border-primary/30 transition-colors">
                  <div className="text-primary text-4xl font-serif leading-none mb-4">"</div>
                  <p className="font-light italic text-muted-foreground mb-8">
                    {testimonial.text}
                  </p>
                  <div>
                    <div className="font-serif text-lg">{testimonial.author}</div>
                    <div className="text-[10px] uppercase tracking-widest text-primary mt-1">{testimonial.location}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="mt-20 pt-16 border-t border-muted-foreground/10">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              {['VOGUE', 'ELLE', 'BAZAAR', 'BRIDES', 'WEDDINGS'].map((brand, i) => (
                <div key={i} className="font-serif text-2xl md:text-3xl tracking-widest text-foreground/50">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Products Showcase */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <FadeIn>
            <span className="text-primary tracking-[0.3em] uppercase text-xs font-semibold">The Atelier</span>
            <p className="font-serif text-2xl md:text-3xl mt-4 mb-12 text-muted-foreground max-w-3xl mx-auto italic">
              Crafted exclusively with the world's most prestigious beauty houses to ensure a flawless, enduring finish.
            </p>
            <div className="flex flex-wrap justify-center gap-10 md:gap-16 items-center">
              {['Charlotte Tilbury', 'Dior Beauty', 'NARS', 'Estée Lauder', 'Huda Beauty', 'MAC', 'Bobbi Brown'].map((brand, i) => (
                <span key={i} className="text-sm uppercase tracking-widest font-sans font-light text-foreground/70 hover:text-primary transition-colors">
                  {brand}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Booking / Contact */}
      <section className="py-32 relative bg-secondary/10">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <FadeIn>
            <div className="champagne-glass p-12 md:p-24 text-center relative overflow-hidden bg-background">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <span className="text-primary tracking-[0.3em] uppercase text-xs font-semibold relative z-10">Inquiries</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-8 relative z-10">Reserve Your Date</h2>
              <p className="text-muted-foreground font-light mb-12 relative z-10">
                We accept a limited number of brides per season to ensure the highest level of artistry and attention.
              </p>

              <form className="relative z-10 space-y-8 text-left" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border-b border-muted-foreground/30 focus-within:border-primary transition-colors pb-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Name</label>
                    <input type="text" data-testid="input-name" className="w-full bg-transparent outline-none mt-2 font-sans font-light placeholder:text-muted-foreground/50" placeholder="Your name" />
                  </div>
                  <div className="border-b border-muted-foreground/30 focus-within:border-primary transition-colors pb-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Email Address</label>
                    <input type="email" data-testid="input-email" className="w-full bg-transparent outline-none mt-2 font-sans font-light placeholder:text-muted-foreground/50" placeholder="you@example.com" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border-b border-muted-foreground/30 focus-within:border-primary transition-colors pb-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Wedding Date</label>
                    <input type="text" data-testid="input-date" className="w-full bg-transparent outline-none mt-2 font-sans font-light placeholder:text-muted-foreground/50" placeholder="DD/MM/YYYY" />
                  </div>
                  <div className="border-b border-muted-foreground/30 focus-within:border-primary transition-colors pb-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Location</label>
                    <input type="text" data-testid="input-location" className="w-full bg-transparent outline-none mt-2 font-sans font-light placeholder:text-muted-foreground/50" placeholder="City, Venue" />
                  </div>
                </div>

                <div className="border-b border-muted-foreground/30 focus-within:border-primary transition-colors pb-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Event Details</label>
                  <textarea data-testid="input-details" rows={3} className="w-full bg-transparent outline-none mt-2 font-sans font-light resize-none placeholder:text-muted-foreground/50" placeholder="Tell us about your vision..."></textarea>
                </div>

                <div className="text-center pt-8">
                  <button type="submit" data-testid="button-submit-inquiry" className="bg-foreground text-background px-12 py-5 text-sm uppercase tracking-widest font-medium hover:bg-primary transition-colors duration-500">
                    Send Inquiry
                  </button>
                </div>
              </form>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4A3428] text-background/80 py-24 border-t border-[#B79272]/20">
        <div className="container mx-auto px-6 md:px-12 flex flex-col items-center text-center">
          <div className="font-serif text-4xl tracking-widest uppercase text-white mb-6">AG</div>
          <p className="font-serif italic text-xl mb-12 text-[#B79272]">Artistry designed for unforgettable memories.</p>
          
          <div className="flex gap-8 text-xs uppercase tracking-widest font-light mb-16">
            <a href="#" data-testid="link-instagram" className="hover:text-[#B79272] transition-colors">Instagram</a>
            <a href="#" data-testid="link-pinterest" className="hover:text-[#B79272] transition-colors">Pinterest</a>
            <a href="#" data-testid="link-contact" className="hover:text-[#B79272] transition-colors">Contact</a>
          </div>

          <div className="text-[10px] tracking-widest text-white/40 uppercase">
            &copy; {new Date().getFullYear()} AG Makeup Studio. All Rights Reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
