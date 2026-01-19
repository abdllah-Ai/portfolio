// src/components/About.jsx
// About section with icon blocks and profile photo
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Zap, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext.jsx';

const ICON_MAP = {
  Sparkles,
  Target,
  Zap,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  const { content } = useContent();
  const about = content.about || {};

  const headline = about.headline || 'We Craft Digital Experiences That Glow';
  const intro = about.intro || 'A cutting-edge 3D design agency specializing in breathtaking visuals.';
  const blocks = about.blocks || [
    { icon: 'Sparkles', title: 'Who We Are', text: 'A team of passionate 3D artists and designers.' },
    { icon: 'Target', title: 'What We Do', text: 'From product visualization to immersive environments.' },
    { icon: 'Zap', title: 'Our Process', text: 'Collaboration-first with iterative design.' },
  ];

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 accent-blob rounded-full blur-3xl" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Section header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 pill px-4 py-2 rounded-full mb-6 text-muted">
            <Sparkles size={16} />
            <span className="text-sm font-medium">About Us</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-accent neon-text">{headline}</span>
          </h2>

          <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto">
            {intro}
          </p>
        </motion.div>

        {/* Content blocks */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {blocks.map((block, index) => {
            const Icon = ICON_MAP[block.icon] || Sparkles;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card p-8 rounded-2xl group"
              >
                <div className="w-14 h-14 rounded-xl chip flex items-center justify-center mb-6">
                  <Icon size={28} className="text-accent" />
                </div>

                <h3 className="text-xl font-bold mb-3">
                  {block.title}
                </h3>

                <p className="text-muted leading-relaxed">
                  {block.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center">
          <button
            onClick={scrollToContact}
            className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center gap-3 group"
          >
            Let's Work Together
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
