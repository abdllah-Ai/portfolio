// src/components/Labs.jsx
// Labs/experiments section with media grid
import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Play } from 'lucide-react';
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

function LabCard({ lab }) {
  return (
    <motion.div
      variants={itemVariants}
      className="card rounded-2xl overflow-hidden group"
    >
      {/* Media */}
      <div className="aspect-video surface relative overflow-hidden">
        {lab.kind === 'video' ? (
          <div className="relative w-full h-full">
            <video
              src={lab.src}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              onMouseEnter={(e) => e.target.play()}
              onMouseLeave={(e) => e.target.pause()}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full btn-ghost p-0 justify-center group-hover:scale-110 transition-transform">
                <Play size={32} className="ml-1" />
              </div>
            </div>
          </div>
        ) : (
          <img
            src={lab.src}
            alt={lab.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}

        {/* Kind badge */}
        <div className="absolute top-4 right-4 pill px-3 py-1 rounded-full text-xs uppercase font-bold">
          {lab.kind}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2 group-hover:opacity-80 transition-opacity">
          {lab.title}
        </h3>

        {lab.note && (
          <p className="text-sm text-muted">
            {lab.note}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function Labs() {
  const { content } = useContent();
  const labs = content.labs || [];

  if (labs.length === 0) return null;

  return (
    <section id="labs" className="py-24 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/4 w-80 h-80 accent-blob rounded-full blur-3xl" />

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
            <FlaskConical size={16} className="text-accent" />
            <span className="text-sm font-medium">Experiments</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-accent neon-text">Creative Labs</span>
          </h2>

          <p className="text-lg text-muted max-w-2xl mx-auto">
            Explorations, prototypes, and experimental work
          </p>
        </motion.div>

        {/* Labs grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab, index) => (
            <LabCard key={index} lab={lab} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
