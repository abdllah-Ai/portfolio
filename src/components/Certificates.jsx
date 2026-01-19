// src/components/Certificates.jsx
// Certificates section with horizontal scroll carousel
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../context/ContentContext.jsx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function CertificateCard({ cert }) {
  return (
    <motion.a
      href={cert.credentialUrl}
      target="_blank"
      rel="noopener noreferrer"
      variants={itemVariants}
      className="card p-6 rounded-2xl min-w-[320px] max-w-[320px] group flex-shrink-0"
    >
      {/* Logo */}
      <div className="w-16 h-16 rounded-xl surface flex items-center justify-center mb-4 overflow-hidden">
        {cert.logo ? (
          <img
            src={cert.logo}
            alt={cert.issuer}
            className="w-12 h-12 object-contain"
          />
        ) : (
          <Award size={28} className="text-accent" />
        )}
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold mb-1 group-hover:opacity-80 transition-opacity">
        {cert.title}
      </h3>

      <p className="text-sm text-muted mb-2">
        {cert.issuer} · {cert.year}
      </p>

      {cert.takeaway && (
        <p className="text-sm text-muted mb-4 line-clamp-2">
          {cert.takeaway}
        </p>
      )}

      <span className="inline-flex items-center gap-1 text-sm font-medium text-accent neon-text">
        <ExternalLink size={14} />
        View Credential
      </span>
    </motion.a>
  );
}

export default function Certificates() {
  const { content } = useContent();
  const certificates = content.certificates || [];
  const scrollRef = useRef(null);

  if (certificates.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="certificates" className="py-24 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-64 h-64 accent-blob rounded-full blur-3xl" />

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
            <Award size={16} className="text-accent" />
            <span className="text-sm font-medium">Credentials</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-accent neon-text">Certifications</span>
          </h2>

          <p className="text-lg text-muted max-w-2xl mx-auto">
            Professional credentials and achievements
          </p>
        </motion.div>

        {/* Carousel controls */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => scroll('left')}
            className="social-card p-3 rounded-xl transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="social-card p-3 rounded-xl transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {certificates.map((cert, index) => (
            <div key={index} className="snap-start">
              <CertificateCard cert={cert} />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
