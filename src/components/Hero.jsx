// src/components/Hero.jsx
// Hero section with neon aesthetic, Lottie animation, and typewriter effect
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { MapPin, ArrowRight, Download, Mail, Github, Linkedin } from 'lucide-react';
import { useContent } from '../context/ContentContext.jsx';
import heroAnimation from '../assets/hero.json';

// Matrix rain effect component for easter egg
function MatrixRain({ active }) {
  if (!active) return null;

  const columns = 30;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコ';

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 matrix-color text-sm font-mono animate-matrix-fall"
          style={{
            left: `${(i / columns) * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j} style={{ opacity: 1 - j * 0.05 }}>
              {chars[Math.floor(Math.random() * chars.length)]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Typewriter effect hook
function useTypewriter(phrases, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const currentPhrase = phrases[phraseIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}

export default function Hero() {
  const { content } = useContent();
  const [matrixActive, setMatrixActive] = useState(false);
  const [keySequence, setKeySequence] = useState('');

  const displayText = useTypewriter(content.taglinePhrases || ['Creative Excellence'], 80, 40, 2500);

  // Easter egg: A + I triggers matrix rain
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      setKeySequence((prev) => {
        const next = (prev + key).slice(-2);
        if (next === 'AI') {
          setMatrixActive(true);
          setTimeout(() => setMatrixActive(false), 5000);
        }
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-6"
    >
      {/* Ambient background orbs */}
      <div className="orbs">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
      </div>

      {/* Matrix rain easter egg */}
      <MatrixRain active={matrixActive} />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 pill px-4 py-2 rounded-full text-muted"
            >
              <div className="w-1 h-6 rounded-full accent-bar" />
              <MapPin size={16} className="text-accent" />
              <span className="text-sm">{content.location || 'Los Angeles, CA'}</span>
            </motion.div>

            {/* Main headline with neon effect */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              >
                <span className="text-accent neon-text">{content.name || 'NeonForge'}</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-light text-muted"
              >
                {content.title || '3D Design Agency'}
              </motion.div>
            </div>

            {/* Typewriter tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="h-12 flex items-center"
            >
              <span className="text-xl md:text-2xl text-accent neon-text font-mono">
                {displayText}
                <span className="animate-pulse ml-1">|</span>
              </span>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={scrollToProjects}
                className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 group"
              >
                View Projects
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <a
                href={content.resumeUrl || '/resume/Abdallah_Salah_CV.pdf'}
                download
                className="btn-ghost px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3"
              >
                <Download size={20} />
                Download CV
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-4 pt-4"
            >
              <a
                href={`mailto:${content.email}`}
                className="social-card p-3 rounded-xl hover-animate"
                aria-label="Email"
              >
                <Mail size={22} className="icon-spark" />
              </a>
              <a
                href={content.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-card p-3 rounded-xl hover-animate"
                aria-label="GitHub"
              >
                <Github size={22} className="icon-spark" />
              </a>
              <a
                href={content.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-card p-3 rounded-xl hover-animate"
                aria-label="LinkedIn"
              >
                <Linkedin size={22} className="icon-spark" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right column: Lottie animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Soft glow behind the animation */}
            <div className="absolute inset-0 accent-glow rounded-full blur-3xl" />

            <div className="relative flex items-center justify-center">
              <Lottie
                animationData={heroAnimation}
                loop
                autoplay
                className="w-full h-auto max-w-lg mx-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-muted">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border border-current flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full accent-dot"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
