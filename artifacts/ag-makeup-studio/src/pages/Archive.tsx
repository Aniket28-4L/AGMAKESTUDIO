import { useState, useEffect, memo, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

// Asset Imports - Images (30 images)
import img1 from "@assets/img1.jpg";
import img2 from "@assets/img2.jpg";
import img3 from "@assets/img3.jpg";
import img4 from "@assets/img4.jpg";
import img5 from "@assets/img5.jpg";
import img6 from "@assets/img6.jpg";
import img7 from "@assets/img7.jpg";
import img8 from "@assets/img8.jpg";
import img9 from "@assets/img9.jpg";
import img10 from "@assets/img10.jpg";
import img11 from "@assets/img11.jpg";
import img12 from "@assets/img12.jpg";
import img13 from "@assets/img13.jpg";
import img14 from "@assets/img14.jpg";
import img15 from "@assets/img15.jpg";
import img16 from "@assets/img16.jpg";
import img17 from "@assets/img17.jpg";
import img18 from "@assets/img18.jpg";
import img19 from "@assets/img19.jpg";
import img20 from "@assets/img20.jpg";
import img21 from "@assets/img21.jpg";
import img22 from "@assets/img22.jpg";
import img23 from "@assets/img23.jpg";
import img24 from "@assets/img24.jpg";
import img25 from "@assets/img25.jpg";
import img26 from "@assets/img26.jpg";
import img27 from "@assets/img27.jpg";
import img28 from "@assets/img28.jpg";
import img29 from "@assets/img29.jpg";
import img30 from "@assets/img30.jpg";

const IMAGES = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
  img21, img22, img23, img24, img25, img26, img27, img28, img29, img30
];

const Thumbnail = memo(({ src, index, onClick }: { src: string, index: number, onClick: (index: number) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer bg-neutral-100 shadow-sm"
      onClick={() => onClick(index)}
    >
      <img
        src={src}
        alt={`Bridal Look ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    </motion.div>
  );
});

export default function Archive() {
  const [, setLocation] = useLocation();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Scroll to top on mount - FIX ISSUE 3
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, []);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setSelectedIdx((prev) => (prev !== null ? (prev + 1) % IMAGES.length : null));
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedIdx((prev) => (prev !== null ? (prev - 1 + IMAGES.length) % IMAGES.length : null));
  }, []);

  const handleClose = useCallback(() => {
    setSelectedIdx(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIdx === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIdx, handleNext, handlePrev, handleClose]);

  // Scroll Lock
  useEffect(() => {
    if (selectedIdx !== null) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = originalStyle; };
    }
  }, [selectedIdx]);

  return (
    <div className="min-h-screen bg-[#fce4ec] relative">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 md:px-12 flex items-center justify-between bg-white/30 backdrop-blur-xl border-b border-white/10">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/40 text-primary font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-white/60 transition-all border border-white/20 shadow-sm"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Back to Studio</span>
          <span className="sm:hidden">Back</span>
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-serif text-xl md:text-2xl text-primary whitespace-nowrap tracking-tight">
          AG Bridal Archive
        </h1>
        <div className="w-24" />
      </header>

      {/* Main Grid Section */}
      <main className="pt-28 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-3 md:gap-6">
          {IMAGES.map((src, idx) => (
            <Thumbnail
              key={idx}
              index={idx}
              src={src}
              onClick={(index) => setSelectedIdx(index)}
            />
          ))}
        </div>
      </main>

      {/* NEW LIGHTBOX ARCHITECTURE - GUARANTEED CENTERING VIA PORTAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedIdx !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none touch-none"
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                width: '100vw', 
                height: '100vh',
                zIndex: 99999
              }}
              onClick={handleClose}
            >
              {/* 1. Close Button - Fixed in Viewport */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 z-[100001] p-3 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full"
              >
                <X size={32} strokeWidth={1.5} />
              </button>

              {/* 2. Navigation Arrows - Fixed in Viewport Sidebars */}
              <div className="absolute inset-y-0 left-0 w-20 md:w-32 flex items-center justify-center z-[100001] pointer-events-none">
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="p-5 text-white/30 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full pointer-events-auto"
                >
                  <ArrowLeft size={40} strokeWidth={1} />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 w-20 md:w-32 flex items-center justify-center z-[100001] pointer-events-none">
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="p-5 text-white/30 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full pointer-events-auto"
                >
                  <ArrowRight size={40} strokeWidth={1} />
                </button>
              </div>

              {/* 3. Centered Viewport Image Container */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 md:p-12 lg:p-20"
                style={{ width: '100vw', height: '100vh' }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedIdx}
                    initial={{ opacity: 0, x: 20, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 80) handlePrev();
                      else if (info.offset.x < -80) handleNext();
                    }}
                    className="relative w-full h-full flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
                  >
                    <img
                      src={IMAGES[selectedIdx]}
                      alt={`Bridal Look Detail ${selectedIdx + 1}`}
                      className="max-w-[90vw] max-h-[90vh] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                      style={{ 
                        display: 'block',
                        margin: 'auto'
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 4. Counter - Fixed at Bottom */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100001]">
                <div className="px-6 py-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
                  <span className="text-white/80 font-sans text-[12px] tracking-[0.5em] font-extralight uppercase">
                    {selectedIdx + 1} <span className="text-white/20 mx-3">/</span> {IMAGES.length}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
