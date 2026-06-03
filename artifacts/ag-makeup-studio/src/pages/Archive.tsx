import { useState, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { X, Volume2, VolumeX, ArrowLeft, ArrowRight } from "lucide-react";

// Asset Imports - Videos
import vid1 from "@assets/vid1.MP4";
import vid2 from "@assets/vid2.MP4";
import vid3 from "@assets/vid3.MOV";
import vid4 from "@assets/vid4.MOV";

// Asset Imports - Images (30 images)
import img2 from "@assets/img2.JPG";
import img3 from "@assets/img3.JPG";
import img4 from "@assets/img4.JPG";
import img5 from "@assets/img5.JPG";
import img6 from "@assets/img6.JPG";
import img7 from "@assets/img7.JPG";
import img8 from "@assets/img8.JPG";
import img9 from "@assets/img9.JPG";
import img10 from "@assets/img10.JPG";
import img11 from "@assets/img11.JPG";
import img12 from "@assets/img12.JPG";
import img13 from "@assets/img13.JPG";
import img14 from "@assets/img14.JPG";
import img15 from "@assets/img15.JPG";
import img16 from "@assets/img16.JPG";
import img17 from "@assets/img17.JPG";
import img18 from "@assets/img18.JPG";
import img19 from "@assets/img19.JPG";
import img20 from "@assets/img20.JPG";
import img21 from "@assets/img21.PNG";
import img22 from "@assets/img22.JPG";
import img23 from "@assets/img23.PNG";
import img24 from "@assets/img24.JPG";
import img25 from "@assets/img25.JPG";
import img26 from "@assets/img26.JPG";
import img27 from "@assets/img27.JPG";
import img28 from "@assets/img28.JPG";
import img29 from "@assets/img29.JPG";
import img30 from "@assets/img30.PNG";

const VIDEOS = [
  { id: 1, src: vid1, poster: "" },
  { id: 2, src: vid2, poster: "" },
  { id: 3, src: vid3, poster: "" },
  { id: 4, src: vid4, poster: "" },
];

const IMAGES = [
  img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
  img21, img22, img23, img24, img25, img26, img27, img28, img29, img30
];

const VideoItem = memo(({ video, onClick }: { video: any, onClick: () => void }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative aspect-video md:aspect-square overflow-hidden rounded-2xl cursor-pointer shadow-xl group"
      onClick={onClick}
    >
      <video
        src={video.src}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
    </motion.div>
  );
});

const ImageItem = memo(({ src, onClick }: { src: string, onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="break-inside-avoid mb-6 rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
      onClick={onClick}
    >
      <img
        src={src}
        alt="Bridal Archive"
        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </motion.div>
  );
});

export default function Archive() {
  const [, setLocation] = useLocation();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % IMAGES.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + IMAGES.length) % IMAGES.length);
    }
  };

  return (
    <div className="min-h-screen bg-[#fce4ec] selection:bg-primary/20">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 md:px-12 flex items-center justify-between backdrop-blur-md bg-white/10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 border border-white/30 text-primary font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-white/40 transition-all shadow-sm"
        >
          <ArrowLeft size={14} />
          Back to Studio
        </motion.button>

        <h1 className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl md:text-3xl tracking-tight text-primary">
          AG Bridal Archive
        </h1>
      </header>

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Video Hero Grid */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VIDEOS.map((video) => (
              <VideoItem
                key={video.id}
                video={video}
                onClick={() => {
                  setSelectedVideo(video);
                  setIsMuted(true);
                }}
              />
            ))}
          </div>
        </section>

        {/* Image Masonry Grid */}
        <section>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-6">
            {IMAGES.map((src, index) => (
              <ImageItem
                key={index}
                src={src}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Video Lightbox */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 p-4 md:p-10 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={selectedVideo.src}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Controls */}
              <div className="absolute top-6 right-6 flex items-center gap-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all backdrop-blur-md"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all backdrop-blur-md"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="absolute bottom-8 left-8 text-white/60 font-sans text-[10px] tracking-[0.3em] uppercase">
                Bridal Look Collection
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#fce4ec]/95 backdrop-blur-2xl p-4 md:p-10"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-8 right-8 z-[1010] p-4 text-primary hover:scale-110 transition-transform"
            >
              <X size={32} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                onClick={prevImage}
                className="absolute left-0 z-10 p-4 text-primary/50 hover:text-primary transition-colors hidden md:block"
              >
                <ArrowLeft size={48} strokeWidth={1} />
              </motion.button>

              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                src={IMAGES[selectedImageIndex]}
                alt="Archive Detail"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />

              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                onClick={nextImage}
                className="absolute right-0 z-10 p-4 text-primary/50 hover:text-primary transition-colors hidden md:block"
              >
                <ArrowRight size={48} strokeWidth={1} />
              </motion.button>
              
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-primary/30 font-sans text-[10px] tracking-[0.4em] uppercase py-4">
                {selectedImageIndex + 1} / {IMAGES.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
