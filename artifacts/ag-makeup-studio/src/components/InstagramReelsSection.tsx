import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Calendar, ArrowRight, ImageOff } from 'lucide-react';

// Manually supplied reel cover images from local assets
// These ensure 100% stability and maintain the luxury aesthetic
import reel1Thumb from "@assets/gallery_1.png";
import reel2Thumb from "@assets/gallery_2.png";
import reel3Thumb from "@assets/gallery_3.png";
import reel4Thumb from "@assets/gallery_4.png";

// Reusable reels data array with REAL Instagram URLs mapped to local covers
const REELS_DATA = [
  {
    thumbnail: reel1Thumb,
    reelUrl: "https://www.instagram.com/reel/DXO5Qx3CgCB/"
  },
  {
    thumbnail: reel2Thumb,
    reelUrl: "https://www.instagram.com/reel/DXQq9BiiX3u/"
  },
  {
    thumbnail: reel3Thumb,
    reelUrl: "https://www.instagram.com/reel/DJt7CsgsvXk/"
  },
  {
    thumbnail: reel4Thumb,
    reelUrl: "https://www.instagram.com/reel/DW_TQpfihau/"
  }
];

// Custom Reels Icon (Simplified square with play button)
const ReelsIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
    <path d="m10 8 5 4-5 4V8z" fill="currentColor" />
    <path d="M3 10h18" />
    <path d="M8 3v7" />
    <path d="M16 3v7" />
  </svg>
);

interface ReelCardProps {
  thumbnail: string;
  reelUrl: string;
  index: number;
  onClick: () => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ thumbnail, index, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <motion.div
      onClick={onClick}
      className="flex-none w-[75vw] md:w-[calc(25%-30px)] aspect-[9/16] relative group rounded-[24px] overflow-hidden border border-[#B79272]/10 snap-center cursor-pointer bg-neutral-900 shadow-2xl"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 1.2, 
        delay: index * 0.1,
        ease: [0.19, 1, 0.22, 1]
      }}
      whileHover={{ 
        y: -12,
        transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] }
      }}
    >
      {/* Background Thumbnail with Smooth Scale */}
      <motion.div className="absolute inset-0 w-full h-full">
        {/* Loading State Overlay */}
        <AnimatePresence>
          {!isLoaded && !hasError && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-neutral-900 flex items-center justify-center"
            >
              <div className="w-8 h-8 border-2 border-[#B79272]/20 border-t-[#B79272] rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State Overlay */}
        {hasError && (
          <div className="absolute inset-0 z-10 bg-neutral-900 flex flex-col items-center justify-center p-6 text-center">
            <ImageOff className="text-[#B79272]/40 mb-3" size={32} strokeWidth={1} />
            <span className="text-[10px] tracking-widest text-white/30 uppercase">Image Unavailable</span>
          </div>
        )}

        <motion.img
          src={thumbnail}
          alt={`Bridal Reel Editorial ${index + 1}`}
          className={`w-full h-full object-cover will-change-transform transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading="lazy"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
        />
        {/* Editorial Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 group-hover:bg-black/40 transition-all duration-700" />
      </motion.div>

      {/* Top Right: Small Reels Icon */}
      <div className="absolute top-6 right-6 text-white/40 group-hover:text-white/90 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110">
        <ReelsIcon />
      </div>

      {/* Center: Elegant Glassmorphism Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="w-20 h-20 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 group-hover:bg-white/15 group-hover:border-white/20 group-hover:scale-110"
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/5">
            <Play className="text-white fill-white/10 group-hover:fill-white/30 transition-all duration-500 ml-1" size={24} strokeWidth={1.5} />
          </div>
        </motion.div>
      </div>

      {/* Bottom: Luxury Editorial Label */}
      <div className="absolute bottom-10 left-0 right-0 px-8 flex flex-col items-center pointer-events-none">
        <motion.div 
          className="w-8 h-[1px] bg-[#B79272] mb-6 opacity-30 group-hover:w-16 group-hover:opacity-100 transition-all duration-1000 ease-out" 
        />
        <span className="text-[10px] tracking-[0.6em] text-white/40 group-hover:text-white font-sans uppercase transition-all duration-500 ease-out">
          Watch on Instagram
        </span>
      </div>

      {/* Luxury Border Glow on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 pointer-events-none" 
        style={{ 
          boxShadow: 'inset 0 0 60px rgba(183,146,114,0.2), 0 0 40px rgba(183,146,114,0.1)',
          border: '1.5px solid rgba(183,146,114,0.4)'
        }} 
      />
    </motion.div>
  );
};

interface ReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  reelUrl: string;
}

const ReelModal: React.FC<ReelModalProps> = ({ isOpen, onClose, reelUrl }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleBookClick = () => {
    onClose();
    setTimeout(() => {
      const bookSection = document.getElementById('book');
      if (bookSection) {
        bookSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  const handleWatchReel = () => {
    window.open(reelUrl, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6 md:p-12"
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl bg-neutral-900/40 border border-[#B79272]/20 rounded-[32px] overflow-hidden p-8 md:p-16 text-center pointer-events-auto touch-auto"
          >
            {/* Close Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-[100] pointer-events-auto cursor-pointer p-2"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-center gap-4 mb-8"
              >
                <div className="h-px w-8 bg-[#B79272]/30" />
                <span className="font-sans text-[10px] tracking-[0.4em] text-[#B79272] uppercase">Anu Bride Experience</span>
                <div className="h-px w-8 bg-[#B79272]/30" />
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-serif text-3xl md:text-5xl text-white mb-8 leading-tight"
              >
                Your Bridal Journey <br/>
                <em className="text-[#B79272]/80 italic">Deserves More Than Inspiration.</em>
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-sans font-light text-white/60 text-base md:text-lg leading-relaxed mb-12 max-w-lg mx-auto"
              >
                Every unforgettable bridal transformation begins with a conversation. 
                Reserve your consultation before viewing our latest bridal stories.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6"
              >
                <button
                  onClick={handleBookClick}
                  className="w-full sm:w-auto px-10 py-5 bg-[#B79272] text-white font-sans text-[11px] uppercase tracking-[0.3em] rounded-full hover:bg-[#c9a98a] transition-all duration-500 shadow-xl shadow-[#B79272]/10 flex items-center justify-center gap-3 group"
                >
                  <Calendar size={14} />
                  Book My Bridal Consultation
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleWatchReel}
                  className="w-full sm:w-auto px-10 py-5 border border-white/10 text-white/70 font-sans text-[11px] uppercase tracking-[0.3em] rounded-full hover:bg-white/5 hover:text-white transition-all duration-500"
                >
                  Watch The Reel
                </button>
              </motion.div>
            </div>

            {/* Decorative background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(183,146,114,0.05)_0%,transparent_70%)] pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InstagramReelsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedReel, setSelectedReel] = useState<string | null>(null);

  // Detect touch device to disable mouse drag events which might interfere with native touch scrolling
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0
    );
  }, []);

  // Smooth wheel scroll support with scroll handoff
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isTouchDevice) return; // Only apply wheel logic to non-touch devices

    const onWheel = (e: WheelEvent) => {
      // Only handle horizontal scrolling if the user is scrolling vertically with wheel
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const isAtStart = el.scrollLeft <= 0;
        const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 1;

        // If we're at the start and trying to scroll up, or at the end and trying to scroll down,
        // let the default vertical scroll happen.
        if ((isAtStart && e.deltaY < 0) || (isAtEnd && e.deltaY > 0)) {
          return;
        }

        // Otherwise, intercept and scroll horizontally
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 2,
          behavior: 'smooth'
        });
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [isTouchDevice]);

  // Mouse Drag to Scroll (Desktop Only)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current || isTouchDevice) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    if (isTouchDevice) return;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current || isTouchDevice) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="relative w-full">
      <style>{`
        .luxury-scrollbar::-webkit-scrollbar {
          height: 3px;
        }
        .luxury-scrollbar::-webkit-scrollbar-track {
          background: rgba(183, 146, 114, 0.05);
          border-radius: 10px;
        }
        .luxury-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(183, 146, 114, 0.2);
          border-radius: 10px;
          transition: all 0.5s ease;
        }
        .luxury-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(183, 146, 114, 0.6);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Horizontal scrolling container */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex gap-6 md:gap-10 overflow-x-auto py-10 snap-x snap-mandatory luxury-scrollbar cursor-grab active:cursor-grabbing" 
        data-lenis-prevent
        style={{
          touchAction: 'pan-y',
          overscrollBehaviorX: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Extra padding for first/last cards to center on mobile if needed */}
        <div className="flex-none w-1 md:hidden" />
        
        {REELS_DATA.map((reel, i) => (
          <ReelCard 
            key={i} 
            index={i}
            thumbnail={reel.thumbnail} 
            reelUrl={reel.reelUrl} 
            onClick={() => setSelectedReel(reel.reelUrl)}
          />
        ))}
        
        <div className="flex-none w-1 md:hidden" />
      </div>

      {/* Center highlight mask effect (subtle) */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none z-10 hidden md:block" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none z-10 hidden md:block" />

      {/* Modal */}
      <ReelModal 
        isOpen={!!selectedReel} 
        onClose={() => setSelectedReel(null)} 
        reelUrl={selectedReel || ""} 
      />
    </div>
  );
};

export default InstagramReelsSection;
