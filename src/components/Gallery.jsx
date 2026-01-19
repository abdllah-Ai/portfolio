// src/components/Gallery.jsx
// Gallery section with image/Lottie grid and fullscreen modal
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { Image, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../context/ContentContext.jsx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

function GalleryItem({ item, onClick }) {
  const [lottieData, setLottieData] = useState(null);

  useEffect(() => {
    if (item.kind === 'lottie' && item.src) {
      if (typeof item.src === 'string') {
        fetch(item.src)
          .then((res) => res.json())
          .then(setLottieData)
          .catch(() => setLottieData(null));
      } else {
        setLottieData(item.src);
      }
    }
  }, [item]);

  return (
    <motion.div
      variants={itemVariants}
      onClick={onClick}
      className="card rounded-2xl overflow-hidden cursor-pointer group aspect-square"
    >
      <div className="w-full h-full relative">
        {item.kind === 'lottie' && lottieData ? (
          <Lottie
            animationData={lottieData}
            loop
            autoplay
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={item.src}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 media-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="overlay-text font-medium text-sm">{item.title}</span>
        </div>
      </div>
    </motion.div>
  );
}

function GalleryModal({ items, activeIndex, onClose, onNavigate }) {
  const item = items[activeIndex];
  const [lottieData, setLottieData] = useState(null);
  const closeRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (item?.kind === 'lottie' && item.src) {
      if (typeof item.src === 'string') {
        fetch(item.src)
          .then((res) => res.json())
          .then(setLottieData)
          .catch(() => setLottieData(null));
      } else {
        setLottieData(item.src);
      }
    } else {
      setLottieData(null);
    }
  }, [item]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(-1);
      if (e.key === 'ArrowRight') onNavigate(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onNavigate]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    return () => {
      const previous = previousFocusRef.current;
      if (previous && typeof previous.focus === 'function') {
        previous.focus();
      }
    };
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      closeRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [activeIndex]);

  if (!item) return null;
  const titleId = `gallery-title-${activeIndex}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 modal-overlay"
    >
      {/* Navigation buttons */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(-1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full btn-ghost overlay-button transition-colors z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full btn-ghost overlay-button transition-colors z-10"
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Close button */}
      <button
        ref={closeRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 p-2 rounded-full btn-ghost overlay-button transition-colors z-10"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {/* Content */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="card max-w-4xl max-h-[85vh] w-full p-6"
      >
        {item.kind === 'lottie' && lottieData ? (
          <Lottie
            animationData={lottieData}
            loop
            autoplay
            className="w-full h-full max-h-[80vh] object-contain"
          />
        ) : (
          <img
            src={item.src}
            alt={item.title}
            className="w-full h-full max-h-[80vh] object-contain rounded-xl"
          />
        )}

        {/* Caption */}
        <div className="text-center mt-4">
          <p id={titleId} className="font-medium text-lg">
            {item.title}
          </p>
          <p className="text-muted text-sm mt-1">
            {activeIndex + 1} / {items.length}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Gallery() {
  const { content } = useContent();
  const gallery = content.gallery || [];
  const [modalIndex, setModalIndex] = useState(null);

  if (gallery.length === 0) return null;

  const openModal = (index) => setModalIndex(index);
  const closeModal = () => setModalIndex(null);
  const navigate = (delta) => {
    if (modalIndex === null) return;
    const newIndex = (modalIndex + delta + gallery.length) % gallery.length;
    setModalIndex(newIndex);
  };

  return (
    <section id="gallery" className="py-24 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 right-0 w-80 h-80 accent-blob rounded-full blur-3xl" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Section header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 pill px-4 py-2 rounded-full mb-6 text-muted">
            <Image size={16} className="text-accent" />
            <span className="text-sm font-medium">Showcase</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-accent neon-text">Visual Gallery</span>
          </h2>

          <p className="text-lg text-muted max-w-2xl mx-auto">
            A collection of our visual work and creative explorations
          </p>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item, index) => (
            <GalleryItem
              key={index}
              item={item}
              onClick={() => openModal(index)}
            />
          ))}
        </div>
      </motion.div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {modalIndex !== null && (
          <GalleryModal
            items={gallery}
            activeIndex={modalIndex}
            onClose={closeModal}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
